import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_REPO } from '../../actions/mutation';
import { GET_REPOSITORIES } from '../../actions/query';
import { GITHUB_REPO_URL_REGEX } from '@shared/constants';

export function RepoForm() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const [addRepo, { loading: isLoading }] = useMutation(ADD_REPO, {
    refetchQueries: [GET_REPOSITORIES],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await addRepo({
        variables: {
          url,
        },
      });

      setUrl('');
    } catch (errors: any) {
      setError(
        errors.message ??
          'Failed to fetch repository information. Please check the URL and try again.'
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter GitHub repository URL"
          required
          className="flex-grow px-4 py-2 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !GITHUB_REPO_URL_REGEX.test(url)}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Add Repo'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}
