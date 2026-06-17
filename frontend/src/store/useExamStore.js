import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../utils/api';

export const useExamStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      packages: [],
      history: [],
      questions: [],
      activeTab: 'dashboard',

      // Actions
      login: async (email, password) => {
        try {
          const res = await API.post('/auth/login', { email, password });
          const { user, token } = res.data.data;
          
          localStorage.setItem('token', token);
          
          // Generate an avatar initials
          const nameParts = user.name.split(' ');
          const avatar = nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : user.name.substring(0, 2).toUpperCase();

          const userWithAvatar = { ...user, avatar };

          set({ user: userWithAvatar, token });
          return userWithAvatar;
        } catch (error) {
          const message = error.response?.data?.message || 'Login gagal. Silakan periksa kembali email dan password Anda.';
          throw new Error(message);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, packages: [], history: [], questions: [] });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      fetchPackages: async () => {
        try {
          const res = await API.get('/tryouts');
          const data = res.data.data;
          const mapped = data.map((pkg) => ({
            id: pkg.id,
            title: pkg.title,
            description: pkg.description || 'Simulasi lengkap TWK, TIU, dan TKP sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.',
            duration: pkg.duration,
            totalQuestions: pkg.total_questions,
            status: pkg.status === 'active' ? 'Aktif' : 'Terkunci',
            attempts: 0
          }));
          set({ packages: mapped });
        } catch (error) {
          console.error('Failed to fetch packages:', error);
        }
      },

      fetchHistory: async () => {
        try {
          const res = await API.get('/results');
          const data = res.data.data;
          const mapped = data.map((h) => ({
            id: h.id,
            tryout_id: h.tryout_id,
            title: h.tryout?.title || 'Tryout CPNS',
            date: new Date(h.finished_at || h.started_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            score: h.score,
            result: h.result,
            twk: h.twk,
            tiu: h.tiu,
            tkp: h.tkp,
            correctCount: h.correctCount
          }));
          set({ history: mapped });
        } catch (error) {
          console.error('Failed to fetch history:', error);
        }
      },

      fetchQuestions: async (tryoutId) => {
        try {
          const res = await API.get(`/tryouts/${tryoutId}`);
          const data = res.data.data;
          
          const mapped = data.questions.map((q) => {
            const options = [
              { key: 'A', text: q.option_a },
              { key: 'B', text: q.option_b },
              { key: 'C', text: q.option_c },
              { key: 'D', text: q.option_d },
              { key: 'E', text: q.option_e }
            ];

            let scores = null;
            if (q.option_weights) {
              scores = {};
              const weights = typeof q.option_weights === 'string'
                ? JSON.parse(q.option_weights)
                : q.option_weights;
              Object.keys(weights).forEach(k => {
                scores[k.toUpperCase()] = weights[k];
              });
            }

            // Generate an explanation dynamically if not in database
            const generatedExplanation = `Pembahasan untuk soal ini: Kunci jawaban adalah opsi ${q.correct_answer ? q.correct_answer.toUpperCase() : 'A'}. Pahami materi tentang sub-topik ${q.category ? q.category.name : 'Tes Wawasan'} untuk memperdalam pemahaman Anda.`;

            return {
              id: q.id,
              category: q.category ? q.category.name.toUpperCase() : 'TWK',
              question: q.question,
              options,
              correctAnswer: q.correct_answer ? q.correct_answer.toUpperCase() : '',
              explanation: generatedExplanation,
              scores
            };
          });

          set({ questions: mapped });
          return mapped;
        } catch (error) {
          console.error('Failed to fetch questions:', error);
          throw error;
        }
      },

      startExamAttempt: async (tryoutId) => {
        try {
          const res = await API.post('/tryouts/start', { tryout_id: tryoutId });
          return res.data.data; // Returns attempt details
        } catch (error) {
          console.error('Failed to start attempt:', error);
          throw error;
        }
      },

      submitExamAttempt: async (attemptId, answersMap) => {
        try {
          const formattedAnswers = Object.keys(answersMap).map((qId) => ({
            question_id: parseInt(qId),
            selected_answer: answersMap[qId].toLowerCase()
          }));
          const res = await API.post('/tryouts/submit', {
            attempt_id: attemptId,
            answers: formattedAnswers
          });
          return res.data.data;
        } catch (error) {
          console.error('Failed to submit exam attempt:', error);
          throw error;
        }
      },

      // Admin CRUD actions for questions
      addQuestion: async (newQuestion) => {
        try {
          const formatted = {
            tryout_id: 1, // Defaulting to Tryout 1 (Tryout Akbar CPNS 2026)
            category_id: newQuestion.category === 'TWK' ? 1 : newQuestion.category === 'TIU' ? 2 : 3,
            question: newQuestion.question,
            option_a: newQuestion.options.find(o => o.key === 'A')?.text || '',
            option_b: newQuestion.options.find(o => o.key === 'B')?.text || '',
            option_c: newQuestion.options.find(o => o.key === 'C')?.text || '',
            option_d: newQuestion.options.find(o => o.key === 'D')?.text || '',
            option_e: newQuestion.options.find(o => o.key === 'E')?.text || '',
            correct_answer: newQuestion.correctAnswer ? newQuestion.correctAnswer.toLowerCase() : 'a',
            option_weights: newQuestion.scores ? {
              a: newQuestion.scores.A,
              b: newQuestion.scores.B,
              c: newQuestion.scores.C,
              d: newQuestion.scores.D,
              e: newQuestion.scores.E
            } : null
          };

          await API.post('/questions', formatted);
          // Refresh question list
          await get().fetchQuestions(1);
        } catch (error) {
          console.error('Failed to add question:', error);
          throw error;
        }
      },

      deleteQuestion: async (id) => {
        try {
          await API.delete(`/questions/${id}`);
          // Refresh question list
          await get().fetchQuestions(1);
        } catch (error) {
          console.error('Failed to delete question:', error);
          throw error;
        }
      },

      updateQuestion: async (updatedQuestion) => {
        try {
          const formatted = {
            tryout_id: 1, // Defaulting to Tryout 1
            category_id: updatedQuestion.category === 'TWK' ? 1 : updatedQuestion.category === 'TIU' ? 2 : 3,
            question: updatedQuestion.question,
            option_a: updatedQuestion.options.find(o => o.key === 'A')?.text || '',
            option_b: updatedQuestion.options.find(o => o.key === 'B')?.text || '',
            option_c: updatedQuestion.options.find(o => o.key === 'C')?.text || '',
            option_d: updatedQuestion.options.find(o => o.key === 'D')?.text || '',
            option_e: updatedQuestion.options.find(o => o.key === 'E')?.text || '',
            correct_answer: updatedQuestion.correctAnswer ? updatedQuestion.correctAnswer.toLowerCase() : 'a',
            option_weights: updatedQuestion.scores ? {
              a: updatedQuestion.scores.A,
              b: updatedQuestion.scores.B,
              c: updatedQuestion.scores.C,
              d: updatedQuestion.scores.D,
              e: updatedQuestion.scores.E
            } : null
          };

          await API.put(`/questions/${updatedQuestion.id}`, formatted);
          // Refresh question list
          await get().fetchQuestions(1);
        } catch (error) {
          console.error('Failed to update question:', error);
          throw error;
        }
      }
    }),
    {
      name: 'cpns-tryout-storage',
      partialize: (state) => ({ user: state.user, token: state.token }), // only persist auth
    }
  )
);
