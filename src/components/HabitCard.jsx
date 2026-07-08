import { useState } from 'react';
import { computeCurrentStreak, computeBestStreak, computeCompletion30 } from '../lib/habitLogic.js';
import TallyMark from './TallyMark.jsx';
import Calendar from './Calendar.jsx';

export default function HabitCard({ habit, entriesMap, onDeleteHabit, onToggleDay, onOpenNote }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentStreak = computeCurrentStreak(habit, entriesMap);
  const bestStreak = computeBestStreak(habit, entriesMap);
  const completion = computeCompletion30(habit, entriesMap);

  const navigate = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="habit-card">
      <div className="habit-head">
        <div className="habit-title-row">
          <span className="dot" style={{ background: habit.color }} />
          <span className="habit-name">{habit.name}</span>
        </div>
        {confirmDelete ? (
          <div className="confirm-row">
            delete this habit?
            <button className="icon-btn" onClick={() => onDeleteHabit(habit.id)}>
              yes
            </button>
            <button className="icon-btn" onClick={() => setConfirmDelete(false)}>
              no
            </button>
          </div>
        ) : (
          <button className="icon-btn" title="Delete habit" onClick={() => setConfirmDelete(true)}>
            delete
          </button>
        )}
      </div>

      <div className="stats-row">
        <div className="stat-block">
          <span className="stat-label">Streak</span>
          <TallyMark count={currentStreak} color={habit.color} />
        </div>
        <div className="stat-block">
          <span className="stat-label">Best</span>
          <span className="stat-value">{bestStreak}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">30-day</span>
          <span className="stat-value">{completion}%</span>
        </div>
      </div>

      <Calendar
        habit={habit}
        entriesMap={entriesMap}
        year={year}
        month={month}
        onNavigate={navigate}
        onToggleDay={onToggleDay}
        onOpenNote={onOpenNote}
      />
    </div>
  );
}
