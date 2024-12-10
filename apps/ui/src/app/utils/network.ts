import { STORAGE_KEYS } from '@shared/constants';

export const getDefaultContext = () => ({
  context: {
    headers: {
      token: localStorage.getItem(STORAGE_KEYS.AUTH),
    },
  },
});
