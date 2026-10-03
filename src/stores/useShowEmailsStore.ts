import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY_SHOW_EMAILS } from '@/utils/constants';

interface ShowEmailsState {
  showEmails: boolean;
  setShowEmails: (showEmails: boolean) => void;
}

export const useShowEmailsStore = create<ShowEmailsState>()(
  persist(
    (set) => ({
      showEmails: false,
      setShowEmails: (showEmails) => set({ showEmails }),
    }),
    {
      name: STORAGE_KEY_SHOW_EMAILS,
    }
  )
);
