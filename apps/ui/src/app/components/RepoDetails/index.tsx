import { useMutation } from '@apollo/client';
import { memo } from 'react';
import { REFRESH_RELEASES } from '../../actions/mutation';
import { GET_REPO_RELEASES } from '../../actions/query';
import { IRepo } from '../../interfaces/repo';
import { getDefaultContext } from '../../utils';
import ReleaseCard from '../ReleaseCard';

function RepoDetails({ info }: { info: IRepo }) {
  const [refreshReleases, { loading: refreshing }] = useMutation(
    REFRESH_RELEASES,
    {
      refetchQueries: [GET_REPO_RELEASES],
      ...getDefaultContext(),
    }
  );
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-6 bg-white pb-0">
        <h2 className="text-2xl font-bold text-black">{info.name}</h2>
        <p className="text-gray-400 mt-2">{info.description}</p>
      </div>
      <div className="p-6 pt-0">
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="text-xl font-light text-black-200">Recent Releases</h3>
          <button
            disabled={refreshing}
            onClick={async () => {
              await refreshReleases({
                variables: {
                  repoId: info.id,
                },
              });
            }}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
          >
            Refresh Releases
          </button>
        </div>

        <div className="h-[calc(100vh-320px)] overflow-y-auto overflow-x-hidden">
          <ReleaseCard repoId={info.id} url={info.url} />
        </div>
      </div>
    </div>
  );
}

export default memo(RepoDetails, (prev, next) => prev.info.id === next.info.id);
