import { useLazyQuery } from '@apollo/client';
import { STORAGE_KEYS } from '@shared/constants';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { VERIFY_GITHUB_USER } from '../../actions/mutation';
import Loader from '../../components/Loader';

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  const [verifyUser, { data, error, loading }] = useLazyQuery(
    VERIFY_GITHUB_USER,
    {
      fetchPolicy: 'network-only',
    }
  );

  const loginChannel = useMemo(() => new BroadcastChannel('login'), []);

  useEffect(() => {
    if (code) {
      verifyUser({ variables: { code } });
    }
  }, [code, verifyUser]);

  useEffect(() => {
    if (data) {
      localStorage.setItem(STORAGE_KEYS.AUTH, data.verifyUser.jwtToken);
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: data.verifyUser.id,
          username: data.verifyUser.username,
        })
      );
      loginChannel.postMessage({ login: true });

      history.push('/home');
    }
  }, [data, history, loginChannel]);

  if (loading) {
    return (
      <>
        <Loader />
        <div>Redirecting...</div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-red-500">Something went wrong. Please try again</h1>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
