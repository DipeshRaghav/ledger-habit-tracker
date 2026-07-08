import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient.js';
import { entryKey, getEntry } from './lib/habitLogic.js';
import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import AddHabitForm from './components/AddHabitForm.jsx';
import HabitCard from './components/HabitCard.jsx';
import NoteModal from './components/NoteModal.jsx';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [habits, setHabits] = useState([]);
  const [entriesMap, setEntriesMap] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [noteContext, setNoteContext] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    const [{ data: habitRows, error: habitErr }, { data: entryRows, error: entryErr }] = await Promise.all([
      supabase.from('habits').select('*').order('inserted_at', { ascending: true }),
      supabase.from('entries').select('*'),
    ]);
    if (habitErr) console.error(habitErr);
    if (entryErr) console.error(entryErr);

    setHabits(habitRows || []);
    const map = {};
    (entryRows || []).forEach((row) => {
      map[entryKey(row.habit_id, row.entry_date)] = { done: row.done, note: row.note || '' };
    });
    setEntriesMap(map);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (session) loadData();
    else {
      setHabits([]);
      setEntriesMap({});
    }
  }, [session, loadData]);

  const handleAddHabit = async (habitData) => {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        name: habitData.name,
        frequency: habitData.frequency,
        days: habitData.days,
        color: habitData.color,
      })
      .select()
      .single();
    if (error) {
      console.error(error);
      return;
    }
    setHabits((prev) => [...prev, data]);
  };

  const handleDeleteHabit = async (habitId) => {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (error) {
      console.error(error);
      return;
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setEntriesMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(habitId + ':')) delete next[k];
      });
      return next;
    });
  };

  const upsertEntry = async (habit, key, done, note) => {
    // Optimistic update
    setEntriesMap((prev) => ({ ...prev, [entryKey(habit.id, key)]: { done, note } }));

    const { error } = await supabase
      .from('entries')
      .upsert({ habit_id: habit.id, entry_date: key, done, note }, { onConflict: 'habit_id,entry_date' });

    if (error) {
      console.error(error);
      loadData(); // reconcile with server state on failure
    }
  };

  const handleToggleDay = (habit, key, newDone, existingNote) => {
    upsertEntry(habit, key, newDone, existingNote || '');
  };

  const handleOpenNote = (habit, key, dateObj, entry) => {
    setNoteContext({ habit, key, dateObj, entry });
  };

  const handleSaveNote = async (habit, key, done, note) => {
    await upsertEntry(habit, key, done, note);
    setNoteContext(null);
  };

  if (session === undefined) {
    return <div className="loading-screen">Loading…</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="wrap">
      <Header habits={habits} entriesMap={entriesMap} user={session.user} />
      <AddHabitForm onAddHabit={handleAddHabit} />

      {loadingData && habits.length === 0 ? (
        <div className="empty-state">Loading your ledger…</div>
      ) : habits.length === 0 ? (
        <div className="empty-state">Nothing logged yet. Add a habit above to start your ledger.</div>
      ) : (
        <div>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              entriesMap={entriesMap}
              onDeleteHabit={handleDeleteHabit}
              onToggleDay={handleToggleDay}
              onOpenNote={handleOpenNote}
            />
          ))}
        </div>
      )}

      <NoteModal context={noteContext} onSave={handleSaveNote} onClose={() => setNoteContext(null)} />
    </div>
  );
}
