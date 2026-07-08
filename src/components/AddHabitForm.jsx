import { useState } from 'react';
import { PALETTE, WEEKDAY_FULL } from '../lib/habitLogic.js';

export default function AddHabitForm({ onAddHabit }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [days, setDays] = useState([]);
  const [color, setColor] = useState(PALETTE[0]);

  const reset = () => {
    setName('');
    setFrequency('daily');
    setDays([]);
    setColor(PALETTE[0]);
    setOpen(false);
  };

  const toggleDay = (idx) => {
    setDays((prev) => (prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]));
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (frequency === 'custom' && days.length === 0) return;
    onAddHabit({
      name: trimmed,
      frequency,
      days: frequency === 'custom' ? [...days].sort() : [],
      color,
    });
    reset();
  };

  if (!open) {
    return (
      <button className="add-toggle" onClick={() => setOpen(true)}>
        + Add a habit to track
      </button>
    );
  }

  return (
    <div className="add-form open">
      <div className="field">
        <label>Name</label>
        <input
          type="text"
          value={name}
          maxLength={60}
          autoFocus
          placeholder="e.g. Morning run, Read 20 pages"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Frequency</label>
        <div className="freq-options">
          <div className={`chip ${frequency === 'daily' ? 'active' : ''}`} tabIndex={0} onClick={() => setFrequency('daily')}>
            Every day
          </div>
          <div className={`chip ${frequency === 'custom' ? 'active' : ''}`} tabIndex={0} onClick={() => setFrequency('custom')}>
            Custom days
          </div>
        </div>
      </div>
      {frequency === 'custom' && (
        <div className="field">
          <label>Which days</label>
          <div className="freq-options">
            {WEEKDAY_FULL.map((label, idx) => (
              <div key={idx} className={`chip ${days.includes(idx) ? 'active' : ''}`} tabIndex={0} onClick={() => toggleDay(idx)}>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="field">
        <label>Color</label>
        <div className="color-options">
          {PALETTE.map((c) => (
            <div
              key={c}
              className={`swatch ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              tabIndex={0}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Save habit
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          Cancel
        </button>
      </div>
    </div>
  );
}
