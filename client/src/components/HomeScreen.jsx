import { CheckSquare, ChevronLeft, ChevronRight, Plus, Search, SquareX } from 'lucide-react';
import {
  formatWeekRange,
  getWeekDays,
  shiftWeek,
  toLocalDateKey,
} from '../utils/dateUtils';
import SwipeableTaskItem from './SwipeableTaskItem';

export default function HomeScreen({
  activeMonday,
  onChangeWeek,
  selectedDateKey,
  onSelectDate,
  activeWeekSummary,
  loading,
  error,
  onOpenSearch,
  onOpenWeeklyOverview,
  onOpenAddTask,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onViewTask,
}) {
  const weekDays = getWeekDays(activeMonday);
  const weekStartKey = toLocalDateKey(activeMonday);
  const weekEndKey = weekDays[6].dateKey;
  const todayKey = toLocalDateKey(new Date());

  const weekTasks = activeWeekSummary?.tasks || [];
  const completedCount = activeWeekSummary?.completedCount || 0;
  const pendingCount = activeWeekSummary?.openCount || 0;
  const totalCount = completedCount + pendingCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks for the selected day in the Monday-Sunday strip
  const selectedDayTasks = weekTasks.filter(
    (task) => toLocalDateKey(task.dateTime) === selectedDateKey
  );

  // Track which days in the active week have tasks
  const daysWithTasks = new Set(weekTasks.map((t) => toLocalDateKey(t.dateTime)));

  const selectedDayObj = weekDays.find((d) => d.dateKey === selectedDateKey);
  const listHeading =
    selectedDateKey === todayKey
      ? 'Tasks Today'
      : `Tasks · ${selectedDayObj ? `${selectedDayObj.dayShort} ${selectedDayObj.dayNum}` : selectedDateKey}`;

  return (
    <div className="min-h-screen sm:min-h-[780px] bg-white flex flex-col px-5 pt-6 pb-24 relative">
      {/* Search Trigger Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="w-full h-11 px-4 rounded-[8px] border border-[#E5E7EB] bg-white flex items-center justify-between text-left hover:border-[#C7D2FE] transition-colors cursor-pointer"
      >
        <span className="text-[13px] text-[#9CA3AF]">Search for a task</span>
        <Search className="w-[18px] h-[18px] text-[#111827]" />
      </button>

      {/* Week Navigation Header */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChangeWeek(shiftWeek(activeMonday, -1))}
          aria-label="Previous week"
          className="p-1.5 rounded-full hover:bg-gray-100 text-[#6B7280] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onOpenWeeklyOverview}
          className="text-[12px] font-medium text-[#6B7280] hover:text-[#4461F2] transition-colors cursor-pointer"
        >
          {formatWeekRange(weekStartKey, weekEndKey)}
        </button>
        <button
          type="button"
          onClick={() => onChangeWeek(shiftWeek(activeMonday, 1))}
          aria-label="Next week"
          className="p-1.5 rounded-full hover:bg-gray-100 text-[#6B7280] cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Monday–Sunday Calendar Strip */}
      <div className="mt-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isSelected = day.dateKey === selectedDateKey;
          const hasTasks = daysWithTasks.has(day.dateKey);
          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelectDate(day.dateKey)}
              className={`py-2.5 rounded-[4px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#4461F2] text-white shadow-sm'
                  : 'bg-transparent text-[#9CA3AF] hover:bg-[#F5F7FF]'
              }`}
            >
              <span
                className={`text-[11px] font-normal ${
                  isSelected ? 'text-white/90' : 'text-[#9CA3AF]'
                }`}
              >
                {day.dayShort}
              </span>
              <span
                className={`mt-0.5 text-[14px] font-medium ${
                  isSelected ? 'text-white' : 'text-[#6B7280]'
                }`}
              >
                {day.dayNum}
              </span>
              <span
                className={`mt-1 w-1 h-1 rounded-full ${
                  isSelected
                    ? 'bg-white'
                    : hasTasks
                    ? 'bg-[#4461F2]/50'
                    : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Weekly Summary Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={onOpenWeeklyOverview}
          className="rounded-[6px] bg-[#EEF1FF] px-3.5 py-3.5 text-left hover:brightness-[0.98] transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-[4px] bg-[#C7D2FE] text-[#3B55E6] flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4" />
            </span>
            <span className="text-[12.5px] font-medium text-[#1F2937]">
              Task Complete
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5 pl-8">
            <span className="text-[22px] font-bold text-[#111827] leading-none">
              {String(completedCount).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-[#6B7280]">This Week</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenWeeklyOverview}
          className="rounded-[6px] bg-[#FFEBEB] px-3.5 py-3.5 text-left hover:brightness-[0.98] transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-[4px] bg-[#FCA5A5]/60 text-[#DC2626] flex items-center justify-center shrink-0">
              <SquareX className="w-4 h-4" />
            </span>
            <span className="text-[12.5px] font-medium text-[#1F2937]">
              Task Pending
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5 pl-8">
            <span className="text-[22px] font-bold text-[#111827] leading-none">
              {String(pendingCount).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-[#6B7280]">This Week</span>
          </div>
        </button>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            Weekly Progress
          </h2>
          <span className="text-[11.5px] font-medium text-[#6B7280]">
            {progressPct}%
          </span>
        </div>
        <div className="mt-2.5 h-4 w-full bg-[#D9DDFB] rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-[#26388A] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tasks Today / Selected Day List */}
      <div className="mt-6 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            {listHeading}
          </h2>
          <button
            type="button"
            onClick={onOpenWeeklyOverview}
            className="text-[12.5px] font-medium text-[#4461F2] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {loading && (
          <p className="text-[13px] text-[#6B7280] py-8 text-center">
            Loading tasks...
          </p>
        )}

        {error && !loading && (
          <p className="text-[13px] text-[#EF4444] py-6 text-center">{error}</p>
        )}

        {!loading && !error && selectedDayTasks.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[13px] text-[#9CA3AF]">
              No tasks scheduled for this day.
            </p>
            <button
              type="button"
              onClick={onOpenAddTask}
              className="mt-2.5 text-[12.5px] font-medium text-[#4461F2] hover:underline cursor-pointer"
            >
              + Add a task
            </button>
          </div>
        )}

        {!loading && !error && selectedDayTasks.length > 0 && (
          <div>
            {selectedDayTasks.map((task) => (
              <SwipeableTaskItem
                key={task._id}
                task={task}
                onToggleStatus={onToggleStatus}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onView={onViewTask}
                showActions
              />
            ))}
          </div>
        )}
      </div>

      {/* Centered Bottom Floating Action Button */}
      <button
        type="button"
        onClick={onOpenAddTask}
        aria-label="Add Task"
        className="fixed sm:absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#4461F2] hover:bg-[#3551DF] text-white shadow-[0_10px_25px_rgba(68,97,242,0.42)] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
}

