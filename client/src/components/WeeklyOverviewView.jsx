import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { formatWeekRange, getMondayOfWeek, toLocalDateKey } from '../utils/dateUtils';
import SwipeableTaskItem from './SwipeableTaskItem';

export default function WeeklyOverviewView({
  weeks,
  onBack,
  onSelectWeek,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  onAddTask,
}) {
  const currentMondayKey = toLocalDateKey(getMondayOfWeek(new Date()));
  const [expandedWeek, setExpandedWeek] = useState(
    weeks[0]?.weekStart || currentMondayKey
  );

  return (
    <div className="min-h-screen sm:min-h-[780px] bg-white flex flex-col px-5 pt-6 pb-24 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Home"
            className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-[#111827]">Weekly Overview</h1>
            <p className="text-[11.5px] text-[#6B7280]">Grouped Monday – Sunday</p>
          </div>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <div className="mt-5 space-y-3.5">
        {weeks.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#D1D5DB] p-8 text-center">
            <p className="text-[13.5px] text-[#6B7280]">No tasks scheduled yet.</p>
            <button
              type="button"
              onClick={onAddTask}
              className="mt-3 px-4 py-2 rounded-[6px] bg-[#4461F2] text-white text-[13px] font-medium cursor-pointer"
            >
              Add First Task
            </button>
          </div>
        ) : (
          weeks.map((week) => {
            const isExpanded = expandedWeek === week.weekStart;
            const isCurrentWeek = week.weekStart === currentMondayKey;
            const pct =
              week.totalCount > 0
                ? Math.round((week.completedCount / week.totalCount) * 100)
                : 0;

            return (
              <div
                key={week.weekStart}
                className="rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_2px_10px_rgba(17,24,39,0.03)]"
              >
                {/* Clickable Week Summary Card Header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedWeek(isExpanded ? null : week.weekStart)
                  }
                  className="w-full p-4 text-left hover:bg-[#FAFBFD] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[14px] font-semibold text-[#111827] truncate">
                        {formatWeekRange(week.weekStart, week.weekEnd)}
                      </span>
                      {isCurrentWeek && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EEF1FF] text-[#4461F2] text-[10.5px] font-medium shrink-0">
                          This Week
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
                    )}
                  </div>

                  {/* Open vs Completed counts */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-[8px] bg-[#EEF1FF] px-3 py-2 flex items-center justify-between">
                      <span className="text-[11.5px] text-[#374151]">Completed</span>
                      <span className="text-[15px] font-bold text-[#111827]">
                        {String(week.completedCount).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="rounded-[8px] bg-[#FFEBEB] px-3 py-2 flex items-center justify-between">
                      <span className="text-[11.5px] text-[#374151]">Open</span>
                      <span className="text-[15px] font-bold text-[#111827]">
                        {String(week.openCount).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-3 h-2 w-full bg-[#D9DDFB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#26388A] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>

                {/* Expanded Week Tasks */}
                {isExpanded && (
                  <div className="px-4 pb-3 border-t border-[#F1F3F7]">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[11.5px] font-medium text-[#6B7280]">
                        {week.tasks.length} {week.tasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectWeek(week.weekStart)}
                        className="text-[12px] font-medium text-[#4461F2] hover:underline cursor-pointer"
                      >
                        Open in Calendar
                      </button>
                    </div>
                    {week.tasks.length === 0 ? (
                      <p className="text-[12.5px] text-[#9CA3AF] py-3 text-center">
                        No tasks in this week.
                      </p>
                    ) : (
                      week.tasks.map((task) => (
                        <SwipeableTaskItem
                          key={task._id}
                          task={task}
                          onToggleStatus={onToggleStatus}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onView={onView}
                          showActions
                          showDateMeta
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating + button */}
      <button
        type="button"
        onClick={onAddTask}
        aria-label="Add Task"
        className="fixed sm:absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#4461F2] hover:bg-[#3551DF] text-white shadow-[0_10px_25px_rgba(68,97,242,0.42)] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
}

