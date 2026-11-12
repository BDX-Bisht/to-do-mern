import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTask,
  deleteTask,
  fetchWeeklySummary,
  updateTask,
} from './api/tasksApi';
import HomeScreen from './components/HomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import SearchScreen from './components/SearchScreen';
import TaskDetailModal from './components/TaskDetailModal';
import TaskModal from './components/TaskModal';
import WeeklyOverviewView from './components/WeeklyOverviewView';
import {
  fromLocalDateKey,
  getMondayOfWeek,
  toLocalDateKey,
} from './utils/dateUtils';

const ONBOARDING_STORAGE_KEY = 'todo_app_onboarding_seen';

export default function App() {
  const [screen, setScreen] = useState(() =>
    localStorage.getItem(ONBOARDING_STORAGE_KEY) ? 'home' : 'onboarding'
  );
  const [activeMonday, setActiveMonday] = useState(() => getMondayOfWeek(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toLocalDateKey(new Date())
  );

  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchRefreshSignal, setSearchRefreshSignal] = useState(0);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  const loadWeeks = useCallback(async () => {
    setError('');
    try {
      const data = await fetchWeeklySummary();
      setWeeks(data.weeks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeeks();
  }, [loadWeeks]);

  const activeMondayKey = toLocalDateKey(activeMonday);

  const activeWeekSummary = useMemo(
    () => weeks.find((w) => w.weekStart === activeMondayKey) || null,
    [weeks, activeMondayKey]
  );

  function handleGetStarted() {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
    setScreen('home');
  }

  function handleChangeWeek(nextMonday) {
    setActiveMonday(nextMonday);
    setSelectedDateKey(toLocalDateKey(nextMonday));
  }

  function handleSelectWeekFromOverview(weekStartStr) {
    const monday = fromLocalDateKey(weekStartStr);
    setActiveMonday(monday);
    setSelectedDateKey(weekStartStr);
    setScreen('home');
  }

  function openCreateModal() {
    setEditingTask(null);
    setTaskModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  async function handleSaveTask(payload) {
    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await createTask(payload);
    }
    const taskMonday = getMondayOfWeek(new Date(payload.dateTime));
    setActiveMonday(taskMonday);
    setSelectedDateKey(toLocalDateKey(payload.dateTime));
    await loadWeeks();
    setSearchRefreshSignal((n) => n + 1);
  }

  async function handleToggleStatus(task) {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    await updateTask(task._id, { status: nextStatus });
    if (viewingTask && viewingTask._id === task._id) {
      setViewingTask({ ...viewingTask, status: nextStatus });
    }
    await loadWeeks();
    setSearchRefreshSignal((n) => n + 1);
  }

  async function handleDeleteTask(taskId) {
    await deleteTask(taskId);
    if (viewingTask && viewingTask._id === taskId) {
      setViewingTask(null);
    }
    await loadWeeks();
    setSearchRefreshSignal((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-[#F3F5FA] sm:py-6 flex justify-center">
      <div className="w-full max-w-[430px] bg-white sm:rounded-[28px] sm:shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden relative">
        {screen === 'onboarding' && (
          <OnboardingScreen onGetStarted={handleGetStarted} />
        )}

        {screen === 'home' && (
          <HomeScreen
            activeMonday={activeMonday}
            onChangeWeek={handleChangeWeek}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
            activeWeekSummary={activeWeekSummary}
            loading={loading}
            error={error}
            onOpenSearch={() => setScreen('search')}
            onOpenWeeklyOverview={() => setScreen('weeks')}
            onOpenAddTask={openCreateModal}
            onToggleStatus={handleToggleStatus}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
            onViewTask={setViewingTask}
          />
        )}

        {screen === 'search' && (
          <SearchScreen
            onBack={() => setScreen('home')}
            onToggleStatus={handleToggleStatus}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onView={setViewingTask}
            refreshSignal={searchRefreshSignal}
          />
        )}

        {screen === 'weeks' && (
          <WeeklyOverviewView
            weeks={weeks}
            onBack={() => setScreen('home')}
            onSelectWeek={handleSelectWeekFromOverview}
            onToggleStatus={handleToggleStatus}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onView={setViewingTask}
            onAddTask={openCreateModal}
          />
        )}

        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onSubmit={handleSaveTask}
          initialTask={editingTask}
          defaultDateKey={selectedDateKey}
        />

        <TaskDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}

