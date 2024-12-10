import { useQuery } from '@apollo/client';
import { LogOut } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { VERIFY } from '../../actions/query';
import Loader from '../../components/Loader';
import RepoDetails from '../../components/RepoDetails';
import { RepoForm } from '../../components/RepoForm';
import RepoList from '../../components/RepoList';
import { IRepo } from '../../interfaces/repo';
import { getDefaultContext } from '../../utils';
import { STORAGE_KEYS } from '@shared/constants';

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<IRepo | null>(null);
  const handleSelectedRepo = useCallback(
    (repo: IRepo) => setSelectedRepo(repo),
    []
  );

  const history = useHistory();
  const token = localStorage.getItem(STORAGE_KEYS.AUTH);

  const { error, loading } = useQuery(VERIFY, {
    ...getDefaultContext(),
  });
  const logoutChannel = useMemo(() => new BroadcastChannel('logout'), []);

  useEffect(() => {
    if (error || !token) {
      history.push('../');
    }

    logoutChannel.onmessage = (event) => {
      if (event.data.logout) history.push('../');
    };
  }, [error, token, history, logoutChannel]);

  if (loading) {
    return <Loader />;
  }

  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '');
  return (
    <>
      <header className="flex items-center justify-end gap-4 p-4 shadow-sm">
        <h3>Welcome, {user.username}</h3>
        <button
          className="px-2 text-md flex items-center gap-2"
          onClick={() => {
            localStorage.clear();
            history.push('../');
            logoutChannel.postMessage({ logout: true });
          }}
        >
          <LogOut size={'20'} />
          Logout
        </button>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          GitHub Repository Tracker
        </h1>
        <div className="mb-8">
          <RepoForm />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <RepoList
              onSelectRepo={handleSelectedRepo}
              selectedRepo={selectedRepo}
            />
          </div>
          <div className="w-full md:w-2/3 border rounded p-4">
            {selectedRepo ? (
              <RepoDetails info={selectedRepo} />
            ) : (
              <div className="text-xl text-center">
                Select a repository to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
