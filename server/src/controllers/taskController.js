import Task from '../models/Task.js';
import {
  getUtcRangeForLocalDate,
  getUtcRangeForLocalWeek,
  getWeekBoundsForDate,
  parseTzOffset,
} from '../utils/weekUtils.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitizePriority(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return value;
}

function buildTaskPayload(body, { isPartial = false } = {}) {
  const payload = {};

  if (!isPartial || body.title !== undefined) {
    payload.title = typeof body.title === 'string' ? body.title.trim() : body.title;
  }
  if (!isPartial || body.description !== undefined) {
    payload.description = typeof body.description === 'string' ? body.description.trim() : '';
  }
  if (!isPartial || body.dateTime !== undefined) {
    const parsedDate = new Date(body.dateTime);
    if (Number.isNaN(parsedDate.getTime())) {
      const error = new Error('Valid dateTime is required');
      error.statusCode = 400;
      throw error;
    }
    payload.dateTime = parsedDate;
  }
  if (!isPartial || body.endTime !== undefined) {
    payload.endTime = typeof body.endTime === 'string' ? body.endTime.trim() : '';
  }
  if (!isPartial || body.priority !== undefined) {
    payload.priority = sanitizePriority(body.priority);
  }
  if (body.status !== undefined) {
    payload.status = body.status;
  }

  return payload;
}

/**
 * GET /api/tasks/weeks
 * Returns tasks grouped into Monday-Sunday weeks with open and completed counts.
 */
export async function getWeeklySummary(req, res, next) {
  try {
    const tzOffset = parseTzOffset(req.query.tzOffset);
    const tasks = await Task.find().sort({ dateTime: 1, createdAt: 1 }).lean();

    const weekMap = new Map();
    for (const task of tasks) {
      const { weekStart, weekEnd } = getWeekBoundsForDate(new Date(task.dateTime), tzOffset);
      if (!weekMap.has(weekStart)) {
        weekMap.set(weekStart, {
          weekStart,
          weekEnd,
          openCount: 0,
          completedCount: 0,
          totalCount: 0,
          tasks: [],
        });
      }

      const bucket = weekMap.get(weekStart);
      if (task.status === 'Completed') {
        bucket.completedCount += 1;
      } else {
        bucket.openCount += 1;
      }
      bucket.totalCount += 1;
      bucket.tasks.push(task);
    }

    const weeks = Array.from(weekMap.values()).sort((a, b) =>
      a.weekStart.localeCompare(b.weekStart)
    );

    res.json({ weeks });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks
 * Lists tasks, optionally filtered by weekStart, specific date, status, priority, or keyword.
 */
export async function getTasks(req, res, next) {
  try {
    const tzOffset = parseTzOffset(req.query.tzOffset);
    const filter = {};

    if (req.query.date) {
      const range = getUtcRangeForLocalDate(req.query.date, tzOffset);
      if (!range) {
        return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD.' });
      }
      filter.dateTime = { $gte: range.startUtc, $lte: range.endUtc };
    } else if (req.query.weekStart) {
      const range = getUtcRangeForLocalWeek(req.query.weekStart, tzOffset);
      if (!range) {
        return res.status(400).json({ message: 'Invalid weekStart format. Expected YYYY-MM-DD.' });
      }
      filter.dateTime = { $gte: range.startUtc, $lte: range.endUtc };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.q && req.query.q.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filter).sort({ dateTime: 1, createdAt: 1 }).lean();
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/search?q=keyword
 * Case-insensitive keyword search matching title or description.
 */
export async function searchTasks(req, res, next) {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      return res.json({ tasks: [] });
    }

    const regex = new RegExp(escapeRegex(query), 'i');
    const tasks = await Task.find({
      $or: [{ title: regex }, { description: regex }],
    })
      .sort({ dateTime: 1, createdAt: 1 })
      .lean();

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 */
export async function createTask(req, res, next) {
  try {
    const payload = buildTaskPayload(req.body);
    const task = await Task.create(payload);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/tasks/:id
 * Updates task fields or toggles status.
 */
export async function updateTask(req, res, next) {
  try {
    const payload = buildTaskPayload(req.body, { isPartial: true });

    const updateOps = { $set: {} };
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'priority' && value === undefined) {
        updateOps.$unset = { priority: 1 };
      } else {
        updateOps.$set[key] = value;
      }
    }

    if (Object.keys(updateOps.$set).length === 0) {
      delete updateOps.$set;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updateOps, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 * Permanently removes a task.
 */
export async function deleteTask(req, res, next) {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted', id: deleted._id });
  } catch (err) {
    next(err);
  }
}

