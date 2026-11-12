import { useEffect, useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import {
  combineLocalDateAndTime,
  formatPrettyDate,
  toLocalDateKey,
  toLocalTimeValue,
} from '../utils/dateUtils';

const PRIORITIES = ['', 'Low', 'Medium', 'High'];

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  defaultDateKey,
}) {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState('');
  const [dateKey, setDateKey] = useState(defaultDateKey || toLocalDateKey(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDateKey(toLocalDateKey(initialTask.dateTime));
      setStartTime(toLocalTimeValue(initialTask.dateTime));
      setEndTime(initialTask.endTime || '');
      setPriority(initialTask.priority || '');
      setDescription(initialTask.description || '');
    } else {
      setTitle('');
      setDateKey(defaultDateKey || toLocalDateKey(new Date()));
      setStartTime('09:00');
      setEndTime('');
      setPriority('');
      setDescription('');
    }
    setError('');
  }, [isOpen, initialTask, defaultDateKey]);

  if (!isOpen) return null;

  async function handleFormSubmit(e) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required.');
      return;
    }
    if (!dateKey || !startTime) {
      setError('Date and start time are required.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        dateTime: combineLocalDateAndTime(dateKey, startTime),
        endTime: endTime.trim(),
        priority: priority || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save task.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[430px] bg-white rounded-t-[24px] sm:rounded-[20px] px-6 pt-6 pb-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-[#111827]">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#111827] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-[12px] font-medium text-[#6B7280] mb-1.5"
            >
              Task title <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Doing Homework"
              className="w-full h-11 px-3.5 rounded-[6px] border border-[#E5E7EB] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4461F2]"
            />
          </div>

          {/* Set Time: Start & Ends */}
          <div>
            <span className="block text-[12px] font-medium text-[#6B7280] mb-1.5">
              Set Time <span className="text-[#EF4444]">*</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative flex items-center h-11 px-3 rounded-[6px] border border-[#E5E7EB] focus-within:border-[#4461F2]">
                <Clock className="w-4 h-4 text-[#4B5563] mr-2 shrink-0" />
                <input
                  type="time"
                  aria-label="Start time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-[13.5px] text-[#111827] bg-transparent focus:outline-none"
                />
              </label>

              <label className="relative flex items-center h-11 px-3 rounded-[6px] border border-[#E5E7EB] focus-within:border-[#4461F2]">
                <Clock className="w-4 h-4 text-[#4B5563] mr-2 shrink-0" />
                <input
                  type="time"
                  aria-label="End time (optional)"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="Ends"
                  className="w-full text-[13.5px] text-[#111827] bg-transparent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Set Date */}
          <div>
            <label
              htmlFor="task-date"
              className="block text-[12px] font-medium text-[#6B7280] mb-1.5"
            >
              Set Date <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative flex items-center justify-between h-11 px-3.5 rounded-[6px] border border-[#E5E7EB] focus-within:border-[#4461F2]">
              <span className="text-[14px] text-[#111827]">
                {formatPrettyDate(dateKey) || 'Select Date'}
              </span>
              <Calendar className="w-4 h-4 text-[#4B5563] shrink-0" />
              <input
                id="task-date"
                type="date"
                value={dateKey}
                onChange={(e) => setDateKey(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>

          {/* Priority (Optional) */}
          <div>
            <span className="block text-[12px] font-medium text-[#6B7280] mb-1.5">
              Priority <span className="text-[#9CA3AF] font-normal">(optional)</span>
            </span>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((item) => {
                const active = priority === item;
                return (
                  <button
                    key={item || 'none'}
                    type="button"
                    onClick={() => setPriority(item)}
                    className={`h-9 rounded-[6px] text-[12.5px] font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#EEF1FF] border-[#4461F2] text-[#4461F2]'
                        : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                    }`}
                  >
                    {item || 'None'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-[12px] font-medium text-[#6B7280] mb-1.5"
            >
              Description <span className="text-[#9CA3AF] font-normal">(optional)</span>
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description"
              className="w-full px-3.5 py-2.5 rounded-[6px] border border-[#E5E7EB] text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4461F2] resize-none"
            />
          </div>

          {error && (
            <p className="text-[12.5px] text-[#EF4444] font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full h-12 rounded-[6px] bg-[#4461F2] hover:bg-[#3551DF] disabled:opacity-60 text-white text-[15px] font-medium transition-colors cursor-pointer"
          >
            {submitting
              ? 'Saving...'
              : isEditing
              ? 'Save changes'
              : 'Create task'}
          </button>
        </form>
      </div>
    </div>
  );
}

