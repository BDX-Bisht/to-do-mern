import { Calendar, CheckCircle2, Clock, Flag, SquarePen, Trash2, X } from 'lucide-react';
import { formatPrettyDate, formatTime12h } from '../utils/dateUtils';

export default function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!task) return null;
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[430px] bg-white rounded-t-[24px] sm:rounded-[20px] px-6 pt-6 pb-7 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                isCompleted
                  ? 'bg-[#EEF1FF] text-[#4461F2]'
                  : 'bg-[#FFEBEB] text-[#E11D48]'
              }`}
            >
              {task.status}
            </span>
            <h3 className="mt-2 text-[18px] font-semibold text-[#111827]">
              {task.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task details"
            className="p-1 text-[#6B7280] hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 text-[13.5px] text-[#4B5563]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4461F2]" />
            <span>{formatPrettyDate(task.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4461F2]" />
            <span>
              {formatTime12h(task.dateTime)}
              {task.endTime ? ` – ${formatTime12h(task.endTime)}` : ''}
            </span>
          </div>
          {task.priority && (
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#4461F2]" />
              <span>Priority: {task.priority}</span>
            </div>
          )}
        </div>

        <div className="mt-4 p-3.5 rounded-[8px] bg-[#F8FAFC] border border-[#E5E7EB]">
          <p className="text-[11.5px] font-medium text-[#6B7280] mb-1">Description</p>
          <p className="text-[13.5px] text-[#1F2937] whitespace-pre-wrap">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            className="h-10 rounded-[6px] bg-[#EEF1FF] hover:bg-[#E0E6FF] text-[#4461F2] text-[12.5px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Reopen' : 'Complete'}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(task);
            }}
            className="h-10 rounded-[6px] border border-[#E5E7EB] hover:bg-gray-50 text-[#111827] text-[12.5px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(task._id);
            }}
            className="h-10 rounded-[6px] bg-[#FFEBEB] hover:bg-[#FFD9D9] text-[#DC2626] text-[12.5px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

