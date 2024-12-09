import { useQuery } from '@apollo/client';
import { DEFAULT_USER_ID } from '@shared/constants';
import Fuse from 'fuse.js';
import { memo, useState } from 'react';
import { GET_REPOSITORIES } from '../../actions/query';
import { IRepo } from '../../interfaces/repo';
import Loader from '../Loader';

interface RepoListProps {
  onSelectRepo: (repo: IRepo) => void;
  selectedRepo: IRepo | null;
}

function RepoList({ onSelectRepo, selectedRepo }: RepoListProps) {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const [search, setSearch] = useState('');
  const { data, loading } = useQuery(GET_REPOSITORIES, {
    variables: {
      userId: DEFAULT_USER_ID,
    },
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
      <h2 className="text-xl font-semibold p-4 bg-white">Repositories</h2>
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
                <li key={repo.name} className={`relative mb-2`}>
                  {!repo.seen && (
                    <span className="animate-pulse h-[10px] w-[10px] block rounded-full border border-red-400 bg-red-400 absolute top-0 right-0"></span>
                  )}
                  <button
                    onClick={() => onSelectRepo(repo)}
                    className={`w-full rounded text-left px-4 py-3 hover:bg-blue-500 hover:text-white transition-colors active:text-white ${
                      selectedRepo && selectedRepo.name === repo.name
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
  (prev, next) => prev.onSelectRepo === next.onSelectRepo
);
