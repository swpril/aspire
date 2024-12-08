import { useCallback, useState } from 'react';
import RepoDetails from '../../components/RepoDetails';
import { RepoForm } from '../../components/RepoForm';
import RepoList from '../../components/RepoList';
import { IRepo } from '../../interfaces/repo';

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<IRepo | null>(null);
  const handleSelectedRepo = useCallback(
    (repo: IRepo) => setSelectedRepo(repo),
    []
  );

  return (
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
        <div className="w-full md:w-2/3 border rounded">
          {selectedRepo ? (
            <RepoDetails info={selectedRepo} />
          ) : (
            <div className="text-xl text-center mt-8">
              Select a repository to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
