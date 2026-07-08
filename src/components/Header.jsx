import { todayDate, isScheduled, dateKey, getEntry } from '../lib/habitLogic.js';
import { supabase } from '../supabaseClient.js';

export default function Header({ habits, entriesMap, user }) {
  const today = todayDate();
  const scheduledToday = habits.filter((h) => isScheduled(h, today));
  const doneToday = scheduledToday.filter((h) => getEntry(entriesMap, h.id, dateKey(today)).done);
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header>
      <div>
        <h1>
          The <span>Ledger</span>
        </h1>
        {user && (
          <div className="user-row">
            {user.user_metadata?.avatar_url && <img className="avatar" src={user.user_metadata.avatar_url} alt="" />}
            <span className="user-email">{user.email}</span>
            <button className="icon-btn" onClick={() => supabase.auth.signOut()}>
              sign out
            </button>
          </div>
        )}
      </div>
      <div className="today-summary">
        {dateStr}
        <br />
        <span className="count">
          {doneToday.length}/{scheduledToday.length}
        </span>{' '}
        done today
      </div>
    </header>
  );
}
