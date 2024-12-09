import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query GetRepos($userId: Float!) {
    repositories(userId: $userId) {
      id
      name
      url
      description
      seen
    }
  }
`;

export const GET_REPO_RELEASES = gql`
  query getReleases($repoId: Float!) {
    getReleases(repoId: $repoId) {
      releaseDate
      id
      repoId
      seen
      body
      version
      versionId
    }
  }
`;
