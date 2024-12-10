import { gql } from '@apollo/client';

export const ADD_REPO = gql`
  mutation createRepo($url: String!, $userId: Float!) {
    createRepo(url: $url, userId: $userId)
  }
`;

export const MARK_SEEN = gql`
  mutation markSeen($repoVersionId: Float!, $userId: Float!) {
    markSeen(repoVersionId: $repoVersionId, userId: $userId)
  }
`;

export const REFRESH_RELEASES = gql`
  mutation refetchRelease($repoId: Float!) {
    refetchReleases(repoId: $repoId)
  }
`;

export const VERIFY_GITHUB_USER = gql`
  query verifyUser($code: String!) {
    verifyUser(code: $code) {
      jwtToken
      id
      username
    }
  }
`;
