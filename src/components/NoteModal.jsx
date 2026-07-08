import { useState, useEffect } from 'react';

export default function NoteModal({ context, onSave, onClose }) {
  const [done, setDone] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (context) {
      setDone(context.entry.done);
      setNote(context.entry.note || '');
    }
  }, [context]);

  if (!context) return null;

  const dateLabel = context.dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{context.habit.name}</h3>
        <div className="modal-date">{dateLabel}</div>
        <div className="modal-toggle-row">
          <input id="noteDone" type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
          <label htmlFor="noteDone">Mark as done</label>
        </div>
        <textarea placeholder="Add a note for this day…" value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
        <div className="form-actions">
          <button className="btn btn-primary" onClick={() => onSave(context.habit, context.key, done, note.trim())}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
