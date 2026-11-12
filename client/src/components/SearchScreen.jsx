import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { searchTasks } from '../api/tasksApi';
import SwipeableTaskItem from './SwipeableTaskItem';

export default function SearchScreen({
  onBack,
  onToggleStatus,
  onEdit,
  onDelete,
  onView,
  refreshSignal,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError('');
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchTasks(trimmed);
        if (!cancelled) {
          setResults(data.tasks || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Search failed');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, refreshSignal]);

  return (
    <div className="min-h-screen sm:min-h-[780px] bg-white flex flex-col px-5 pt-6 pb-8">
      {/* Back arrow */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Home"
        className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#111827] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Search Bar */}
      <div className="mt-4 flex items-center h-11 px-4 rounded-[8px] border border-[#E5E7EB] focus-within:border-[#4461F2] bg-white">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full text-[13.5px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
        <Search className="w-[18px] h-[18px] text-[#111827] shrink-0 ml-2" />
      </div>

      {/* Results */}
      <div className="mt-5 flex-1">
        {loading && (
          <p className="text-[13px] text-[#6B7280] py-6 text-center">Searching tasks...</p>
        )}

        {error && (
          <p className="text-[13px] text-[#EF4444] py-4 text-center">{error}</p>
        )}

        {!loading && !error && !query.trim() && (
          <p className="text-[13px] text-[#9CA3AF] py-10 text-center">
            Type keywords to search across your tasks.
          </p>
        )}

        {!loading && !error && query.trim() && results.length === 0 && (
          <p className="text-[13px] text-[#9CA3AF] py-10 text-center">
            No matching tasks found for &ldquo;{query.trim()}&rdquo;.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div>
            {results.map((task) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

