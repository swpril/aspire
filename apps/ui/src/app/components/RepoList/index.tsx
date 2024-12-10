import { useQuery } from '@apollo/client';
import { STORAGE_KEYS } from '@shared/constants';
import Fuse from 'fuse.js';
import { memo, useState } from 'react';
import { GET_REPOSITORIES } from '../../actions/query';
import { IRepo } from '../../interfaces/repo';
import { getDefaultContext } from '../../utils';
import Loader from '../Loader';

interface RepoListProps {
  onSelectRepo: (repo: IRepo) => void;
  selectedRepo: IRepo | null;
}

function RepoList({ onSelectRepo, selectedRepo }: RepoListProps) {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '');

  const { data, loading, refetch } = useQuery(GET_REPOSITORIES, {
    variables: {
      userId: user.id,
    },
    ...getDefaultContext(),
    onCompleted: (data) => {
      setRepos(data.repositories);
    },
    fetchPolicy: 'cache-and-network',
  });
  if (loading) {
    return <Loader />;
  }

  const fuse = new Fuse(repos, {
    keys: ['name', 'description'],
    useExtendedSearch: true,
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold bg-white">Repositories</h2>
        <button
          disabled={loading}
          onClick={() => refetch()}
          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          Refresh List
        </button>
      </div>
      <div className="px-4 py-3">
        <input
          className="flex-grow w-full px-1 py-1 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by repo name or description"
          value={search}
          onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            if (value.trim().length === 0) {
              setRepos(data?.repositories || []);
              return;
            }
            const items = fuse.search(value).map(({ item }) => item);
            setRepos(items);
          }}
        />
      </div>

      <div className="h-[calc(100vh-250px)] overflow-auto">
        {repos.length === 0 ? (
          <p className="p-4 text-gray-400">No repositories added yet.</p>
        ) : (
          <ul>
            {repos.map((repo: IRepo) => {
              return (
                <li
                  key={repo.name}
                  className={`relative mb-2 border rounded mx-4 mt-2`}
                >
                  {!repo.seen && (
                    <span className="animate-ping h-[8px] w-[8px] block rounded-full border border-orange-600 bg-orange-600 absolute top-[-2px] right-[-2px]"></span>
                  )}
                  <button
                    onClick={() => onSelectRepo(repo)}
                    className={`w-full rounded text-left px-4 py-3 hover:bg-blue-500 hover:text-white transition-colors active:text-white ${
                      selectedRepo && selectedRepo.id === repo.id
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : ''
                    }`}
                  >
                    <h3 className="font-medium">{repo.name}</h3>

                    <p
                      className={`text-sm  truncate hover:text-white ${
                        selectedRepo && selectedRepo.name === repo.name
                          ? 'text-white'
                          : ''
                      }`}
                    >
                      {repo.description}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default memo(
  RepoList,
  (prev, next) =>
    prev.onSelectRepo === next.onSelectRepo &&
    prev.selectedRepo?.id === next.selectedRepo?.id
);
