import { supabase } from '../supabaseClient.js';

export default function Login() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>
          The <span>Ledger</span>
        </h1>
        <p>A private, running record of your habits.</p>
        <button className="btn btn-primary btn-google" onClick={signIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
