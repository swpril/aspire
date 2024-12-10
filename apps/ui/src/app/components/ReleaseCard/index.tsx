import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import Markdown from 'react-markdown';
import { MARK_SEEN } from '../../actions/mutation';
import { GET_REPO_RELEASES } from '../../actions/query';
import { IRepoVersion } from '../../interfaces/repo';
import { getDefaultContext } from '../../utils';
import Loader from '../Loader';
import { Eye } from 'lucide-react';
import { STORAGE_KEYS } from '@shared/constants';

const ReleaseCard: React.FC<{ repoId: number; url: string }> = ({
  repoId,
  url,
}) => {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '');
  const { data, loading, refetch } = useQuery(GET_REPO_RELEASES, {
    variables: {
      repoId,
      userId: user.id,
    },
    ...getDefaultContext(),
  });

  const [markSeen, { loading: isLoading }] = useMutation(MARK_SEEN, {
    ...getDefaultContext(),
  });

  if (loading) {
    return <Loader />;
  }

  if (data.getReleases.length === 0) {
    return <p className="text-gray-400">No releases found.</p>;
  }

  return (
    <ul className="space-y-6">
      {data.getReleases.map((release: IRepoVersion) => {
        const date = new Date(+release.releaseDate).toLocaleDateString();
        return (
          <li
            key={release.version}
            className={`flex items-center justify-between border rounded p-2 pb-4 ${
              release.seen ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="w-full">
              <div className={`flex items-center justify-between`}>
                <a
                  href={`${url}/releases/tag/${release.version}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {release.version}
                </a>
                {release.seen ? (
                  <span className="flex justify-center items-center gap-2 px-4 cursor-not-allowed text-green-400 rounded border border-green-400">
                    <Eye size={20} /> Seen
                  </span>
                ) : (
                  <button
                    disabled={isLoading}
                    onClick={async () => {
                      await markSeen({
                        variables: {
                          userId: user.id,
                          repoVersionId: release.id,
                        },
                      });
                      await refetch();
                    }}
                    className="flex justify-center items-center gap-2 px-4 cursor-pointer text-red-400 border border-red-400 rounded"
                  >
                    <Eye size={20} /> Mark Seen
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-400 mt-1">{date}</p>
              <Markdown className={'prose'}>{release.body}</Markdown>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ReleaseCard;
