import { Github } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

const redirectUri = 'http://localhost:4200/callback';

export default function LoginPage() {
  const clientId = import.meta.env.VITE_CLIENT_ID;

  const handleLogin = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };

  const history = useHistory();
  const loginChannel = useMemo(() => new BroadcastChannel('login'), []);

  useEffect(() => {
    loginChannel.onmessage = (event) => {
      if (event.data.login) {
        history.push('/home');
      }
    };
  }, [loginChannel, history]);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <button
              onClick={handleLogin}
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Github className="h-5 w-5 mr-2" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
