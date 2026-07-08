import { WEEKDAY_LABELS, WEEKDAY_FULL, dateKey, todayDate, startOfDay, isScheduled, getEntry } from '../lib/habitLogic.js';

export default function Calendar({ habit, entriesMap, year, month, onNavigate, onToggleDay, onOpenNote }) {
  const monthDate = new Date(year, month, 1);
  const label = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const today = todayDate();
  const created = startOfDay(new Date(habit.created_at));

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`b${i}`} className="cal-cell blank" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const key = dateKey(cellDate);
    const scheduled = isScheduled(habit, cellDate);
    const isFuture = cellDate > today;
    const beforeCreated = cellDate < created;
    const entry = getEntry(entriesMap, habit.id, key);

    if (!scheduled || beforeCreated) {
      cells.push(
        <div key={key} className="cal-cell unscheduled">
          {day}
        </div>
      );
      continue;
    }
    if (isFuture) {
      cells.push(
        <div key={key} className="cal-cell future">
          {day}
        </div>
      );
      continue;
    }

    cells.push(
      <div
        key={key}
        className={`cal-cell ${entry.done ? 'done' : ''}`}
        style={entry.done ? { background: habit.color } : undefined}
        tabIndex={0}
        role="button"
        aria-label={`${WEEKDAY_FULL[cellDate.getDay()]} ${day}, ${entry.done ? 'done' : 'not done'}`}
        onClick={() => onToggleDay(habit, key, !entry.done, entry.note)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleDay(habit, key, !entry.done, entry.note);
          }
        }}
      >
        {day}
        <button
          className="note-btn"
          title="Add note"
          aria-label="Add note for this day"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNote(habit, key, cellDate, entry);
          }}
        >
          ✎
        </button>
        {entry.note && <span className="note-flag" />}
      </div>
    );
  }

  return (
    <div>
      <div className="cal-nav">
        <button aria-label="Previous month" onClick={() => onNavigate(-1)}>
          ‹
        </button>
        <span className="cal-month-label">{label}</span>
        <button
          aria-label="Next month"
          disabled={isCurrentMonth}
          style={{ opacity: isCurrentMonth ? 0.3 : 1, cursor: isCurrentMonth ? 'default' : 'pointer' }}
          onClick={() => !isCurrentMonth && onNavigate(1)}
        >
          ›
        </button>
      </div>
      <div className="cal-grid">
        {WEEKDAY_LABELS.map((l, i) => (
          <div key={i} className="cal-weekday">
            {l}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}
