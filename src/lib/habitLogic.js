export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAY_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const PALETTE = ['#6FA287', '#D4A94F', '#6B8CAE', '#C1666B', '#9B87C4', '#D4834F'];

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

export function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function sameDate(a, b) {
  return dateKey(a) === dateKey(b);
}

export function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function isScheduled(habit, date) {
  if (habit.frequency === 'daily') return true;
  return (habit.days || []).includes(date.getDay());
}

export function entryKey(habitId, key) {
  return `${habitId}:${key}`;
}

export function getEntry(entriesMap, habitId, key) {
  return entriesMap[entryKey(habitId, key)] || { done: false, note: '' };
}

export function computeCurrentStreak(habit, entriesMap) {
  const today = todayDate();
  const created = startOfDay(new Date(habit.created_at));
  let d = new Date(today);
  let streak = 0;
  while (d >= created) {
    if (isScheduled(habit, d)) {
      const e = getEntry(entriesMap, habit.id, dateKey(d));
      const isToday = sameDate(d, today);
      if (e.done) streak++;
      else if (!isToday) break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function computeBestStreak(habit, entriesMap) {
  const today = todayDate();
  const created = startOfDay(new Date(habit.created_at));
  let d = new Date(created);
  let run = 0,
    best = 0;
  while (d <= today) {
    if (isScheduled(habit, d)) {
      const e = getEntry(entriesMap, habit.id, dateKey(d));
      const isToday = sameDate(d, today);
      if (e.done) {
        run++;
        best = Math.max(best, run);
      } else if (!isToday) {
        run = 0;
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return best;
}

export function computeCompletion30(habit, entriesMap) {
  const today = todayDate();
  const created = startOfDay(new Date(habit.created_at));
  let start = new Date(today);
  start.setDate(start.getDate() - 29);
  if (start < created) start = created;
  let d = new Date(start);
  let scheduled = 0,
    done = 0;
  while (d <= today) {
    if (isScheduled(habit, d)) {
      scheduled++;
      if (getEntry(entriesMap, habit.id, dateKey(d)).done) done++;
    }
    d.setDate(d.getDate() + 1);
  }
  return scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
}
