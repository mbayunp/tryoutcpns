import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_QUESTIONS } from '../data/mockQuestions';

export const useExamStore = create(
  persist(
    (set) => ({
      user: {
        name: 'Wildan KKN',
        email: 'peserta.cpns@gmail.com',
        avatar: 'CP',
        role: 'user'
      },
      packages: [
        { id: 1, title: 'TRY OUT CPNS PAKET 1 (SKD INTEGRASI)', totalQuestions: 30, duration: 90, status: 'Aktif', attempts: 0 },
        { id: 2, title: 'TRY OUT CPNS PAKET 2 (PREMIUM KISI-KISI)', totalQuestions: 30, duration: 90, status: 'Terkunci', attempts: 0 },
        { id: 3, title: 'TRY OUT CPNS PAKET 3 (FR SKD TERUPDATE)', totalQuestions: 30, duration: 90, status: 'Terkunci', attempts: 0 },
        { id: 4, title: 'TRY OUT AKBAR SKD NASIONAL 2026', totalQuestions: 30, duration: 90, status: 'Terkunci', attempts: 0 },
        { id: 5, title: 'TRY OUT SKD MINI TEST KECERDASAN', totalQuestions: 30, duration: 90, status: 'Terkunci', attempts: 0 }
      ],
      history: [
        { date: '12 Juni 2026', title: 'Try Out Simulasi Mandiri', score: 420, result: 'LULUS', twk: 110, tiu: 120, tkp: 190, correctCount: 23 },
        { date: '08 Juni 2026', title: 'Try Out Mini Pemantapan', score: 395, result: 'TIDAK LULUS', twk: 95, tiu: 110, tkp: 190, correctCount: 21 }
      ],
      questions: MOCK_QUESTIONS,
      activeTab: 'dashboard',

      // Actions
      login: (email) => {
        const isAdmin = email.toLowerCase() === 'admin@cpnstryout.id';
        set({
          user: {
            name: isAdmin ? 'Administrator CPNS' : 'Wildan KKN',
            email: email,
            avatar: isAdmin ? 'AD' : 'CP',
            role: isAdmin ? 'admin' : 'user'
          }
        });
      },

      logout: () => set({ user: null }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addAttempt: (attempt) => set((state) => ({
        history: [attempt, ...state.history]
      })),

      incrementPackageAttempts: (pkgId) => set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg.id === pkgId ? { ...pkg, attempts: pkg.attempts + 1 } : pkg
        )
      })),

      unlockPackage: (pkgId) => set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg.id === pkgId ? { ...pkg, status: 'Aktif' } : pkg
        )
      })),

      // Admin actions
      addQuestion: (newQuestion) => set((state) => {
        const nextId = state.questions.length > 0
          ? Math.max(...state.questions.map(q => q.id)) + 1
          : 1;
        return {
          questions: [...state.questions, { ...newQuestion, id: nextId }]
        };
      }),

      deleteQuestion: (id) => set((state) => ({
        questions: state.questions.filter((q) => q.id !== id)
      })),

      updateQuestion: (updatedQuestion) => set((state) => ({
        questions: state.questions.map((q) => q.id === updatedQuestion.id ? updatedQuestion : q)
      }))
    }),
    {
      name: 'cpns-tryout-storage',
    }
  )
);
