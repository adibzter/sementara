import { create } from 'zustand';

export const usePageStore = create((set) => ({
  page: '',

  setPage: (page) => set(() => ({ page: page })),
}));
