import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userAgent: '',
  userId: '',
  networkAddress: '',
  users: [],

  setUserAgent: (userAgent) => set(() => ({ userAgent: userAgent })),
  setUserId: (userId) => set(() => ({ userId: userId })),
  setNetworkAddress: (networkAddress) =>
    set(() => ({ networkAddress: networkAddress })),
  setUsers: (users) => set(() => ({ users: users })),
}));
