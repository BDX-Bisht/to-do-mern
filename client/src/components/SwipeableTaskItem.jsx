import { useRef, useState } from 'react';
import { Check, SquarePen, Trash2 } from 'lucide-react';
import { formatTime12h } from '../utils/dateUtils';

const PRIORITY_BADGE = {
  High: 'bg-[#FEE2E2] text-[#DC2626]',
  Medium: 'bg-[#FEF3C7] text-[#D97706]',
  Low: 'bg-[#E0F2FE] text-[#0284C7]',
};

const SWIPE_THRESHOLD = 48;
const REVEAL_WIDTH = 80;

export default function SwipeableTaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  showDateMeta = false,
}) {
  const isCompleted = task.status === 'Completed';
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(null);
  const baseOffsetRef = useRef(0);

  function handlePointerDown(e) {
    if (e.target.closest('button')) return;
    startXRef.current = e.clientX;
    baseOffsetRef.current = offsetX;
    setIsDragging(true);
  }

  function handlePointerMove(e) {
    if (!isDragging || startXRef.current === null) return;
    const delta = e.clientX - startXRef.current;
    const next = Math.min(0, Math.max(-REVEAL_WIDTH, baseOffsetRef.current + delta));
    setOffsetX(next);
  }

  function handlePointerEnd() {
    if (!isDragging) return;
    setIsDragging(false);
    startXRef.current = null;
    setOffsetX((prev) => (prev <= -SWIPE_THRESHOLD ? -REVEAL_WIDTH : 0));
  }

  const timeLabel = formatTime12h(task.dateTime);
  const dateLabel = showDateMeta
    ? new Date(task.dateTime).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="relative overflow-hidden border-b border-[#F1F3F7] select-none">
      {/* Swipe-revealed Delete button */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          type="button"
          onClick={() => {
            setOffsetX(0);
            onDelete(task._id);
          }}
          className="h-full w-20 bg-[#EF4444] hover:bg-[#DC2626] text-white text-[13px] font-medium flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      {/* Foreground Task Row */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 180ms ease-out',
        }}
        className="relative bg-white py-3.5 flex items-center justify-between gap-3 touch-pan-y"
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            aria-label={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
            className={`mt-0.5 w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              isCompleted
                ? 'border-[#4461F2] bg-[#EEF1FF] text-[#4461F2]'
                : 'border-[#6C82F6] bg-white hover:bg-[#F5F7FF]'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          <div
            onClick={() => {
              if (offsetX !== 0) {
                setOffsetX(0);
                return;
              }
              if (onView) onView(task);
            }}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <p
              className={`text-[14px] font-medium truncate ${
                isCompleted ? 'line-through text-[#6B7280]' : 'text-[#111827]'
              }`}
            >
              {task.title}
            </p>
            {(timeLabel || task.priority || dateLabel) && (
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#9CA3AF]">
                {dateLabel && <span>{dateLabel}</span>}
                {timeLabel && (
                  <span>
                    {timeLabel}
                    {task.endTime ? ` – ${formatTime12h(task.endTime)}` : ''}
                  </span>
                )}
                {task.priority && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      PRIORITY_BADGE[task.priority] || ''
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onDelete(task._id)}
              aria-label={`Delete ${task.title}`}
              className="p-1 text-[#B0B7C3] hover:text-[#EF4444] transition-colors cursor-pointer"
            >
              <Trash2 className="w-[17px] h-[17px]" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="p-1 text-[#B0B7C3] hover:text-[#4461F2] transition-colors cursor-pointer"
            >
              <SquarePen className="w-[17px] h-[17px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
