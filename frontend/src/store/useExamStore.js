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
      categories: [],
      activeTab: 'dashboard',
      transactions: [],
      rankings: [],
      announcement: null,
      announcements: [],
      notifications: [],
      searchQuery: '',

      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      login: async (email, password) => {
        try {
          const res = await API.post('/auth/login', { email, password });
          const { user, token } = res.data.data;
          
          localStorage.setItem('token', token);
          
          const userWithAvatar = {
            ...user,
            avatar: '/images/icon.png'
          };
          
          set({ user: userWithAvatar, token });
          return userWithAvatar;
        } catch (error) {
          const message = error.response?.data?.message || 'Login gagal. Silakan periksa kembali email dan password Anda.';
          throw new Error(message);
        }
      },

      loginWithGoogle: async (idToken) => {
        try {
          const res = await API.post('/auth/google-login', { idToken });
          const { user, token } = res.data.data;
          
          localStorage.setItem('token', token);
          
          const userWithAvatar = {
            ...user,
            avatar: user.avatar || '/images/icon.png'
          };
          
          set({ user: userWithAvatar, token });
          return userWithAvatar;
        } catch (error) {
          const message = error.response?.data?.message || 'Login via Google gagal.';
          throw new Error(message);
        }
      },

      register: async (name, email, password, phone_number) => {
        try {
          // 1. Post to register endpoint
          await API.post('/auth/register', { name, email, password, phone_number });
          
          // 2. Automatically log in the user upon successful registration
          const user = await get().login(email, password);
          return user;
        } catch (error) {
          const message = error.response?.data?.message || 'Registrasi gagal. Silakan periksa kembali data Anda.';
          throw new Error(message);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, packages: [], history: [], questions: [] });
      },

      updateEmail: async (newEmail) => {
        try {
          const res = await API.put('/user/email', { email: newEmail });
          const updatedUser = res.data.data;
          
          const userWithAvatar = {
            ...updatedUser,
            avatar: updatedUser.avatar || '/images/icon.png'
          };
          
          set({ user: userWithAvatar });
          return userWithAvatar;
        } catch (error) {
          const message = error.response?.data?.message || 'Gagal memperbarui email.';
          throw new Error(message);
        }
      },

      updateAvatar: async (avatarFile) => {
        try {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          
          const res = await API.put('/user/avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          const updatedUser = res.data.data;
          const userWithAvatar = {
            ...updatedUser,
            avatar: updatedUser.avatar || '/images/icon.png'
          };
          
          set({ user: userWithAvatar });
          return userWithAvatar;
        } catch (error) {
          const message = error.response?.data?.message || 'Gagal memperbarui foto profil.';
          throw new Error(message);
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      fetchTransactions: async () => {
        try {
          const res = await API.get('/transactions');
          set({ transactions: res.data.data || [] });
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      },

      fetchPackages: async () => {
        try {
          // Fetch transactions first to get purchase status
          await get().fetchTransactions();
          
          const res = await API.get('/tryouts');
          const data = res.data.data;
          const mapped = data.map((pkg) => {
            const isPurchased = (get().transactions || []).some(
              (t) => t.package === pkg.title && t.status === 'success' && t.email === get().user?.email
            );
            return {
              id: pkg.id,
              title: pkg.title,
              description: pkg.description || 'Simulasi lengkap TWK, TIU, dan TKP sesuai standar CAT BKN terbaru. Dilengkapi pembahasan lengkap.',
              duration: pkg.duration,
              totalQuestions: pkg.total_questions,
              status: (pkg.status === 'active' || isPurchased) ? 'Aktif' : 'Terkunci',
              attempts: 0,
              category: pkg.category || 'Tryout',
              imageUrl: pkg.image_url,
              originalPrice: pkg.original_price || 0,
              discountPercentage: pkg.discount_percentage || 0,
              price: pkg.price || 0
            };
          });
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

      fetchRankings: async (tryoutId) => {
        try {
          const res = await API.get(`/results/ranking?tryout_id=${tryoutId || 1}`);
          set({ rankings: res.data.data || [] });
        } catch (error) {
          console.error('Failed to fetch rankings:', error);
        }
      },

      fetchCategories: async () => {
        try {
          const res = await API.get('/categories');
          set({ categories: res.data.data || [] });
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },

      createCategory: async (name) => {
        try {
          const res = await API.post('/categories', { name });
          await get().fetchCategories();
          return res.data.data;
        } catch (error) {
          console.error('Failed to create category:', error);
          throw error;
        }
      },

      deleteCategory: async (id) => {
        try {
          await API.delete(`/categories/${id}`);
          await get().fetchCategories();
        } catch (error) {
          console.error('Failed to delete category:', error);
          throw error;
        }
      },

      syncCategoryQuestions: async (packageId, categoryName) => {
        try {
          // 1. Fetch questions currently mapped to this package
          const currentPkgQuestions = await get().getQuestionsForPackage(packageId);
          
          // 2. Filter out questions of this category
          const otherCategoryQuestionIds = currentPkgQuestions
            .filter(q => q.category?.name.toUpperCase() !== categoryName.toUpperCase())
            .map(q => q.id);
            
          // 3. Get all questions in the bank that belong to this category (using bank = package 1)
          const allBankQuestions = await get().fetchQuestions(1);
          const targetCategoryQuestionIds = allBankQuestions
            .filter(q => q.category.toUpperCase() === categoryName.toUpperCase())
            .map(q => q.id);
            
          // 4. Merge them
          const mergedQuestionIds = Array.from(new Set([...otherCategoryQuestionIds, ...targetCategoryQuestionIds]));
          
          // 5. Update package mapping
          await get().assignQuestionsToPackage(packageId, mergedQuestionIds);
          
          // 6. Also update tryout_id on questions in database for direct association
          await Promise.all(
            allBankQuestions
              .filter(q => q.category.toUpperCase() === categoryName.toUpperCase())
              .map(async (q) => {
                const catObj = get().categories.find(c => c.name.toUpperCase() === q.category.toUpperCase());
                const category_id = catObj ? catObj.id : 1;
                
                await API.put(`/questions/${q.id}`, {
                  tryout_id: packageId,
                  category_id,
                  question: q.question,
                  option_a: q.options.find(o => o.key === 'A')?.text || '',
                  option_b: q.options.find(o => o.key === 'B')?.text || '',
                  option_c: q.options.find(o => o.key === 'C')?.text || '',
                  option_d: q.options.find(o => o.key === 'D')?.text || '',
                  option_e: q.options.find(o => o.key === 'E')?.text || '',
                  correct_answer: q.correctAnswer ? q.correctAnswer.toLowerCase() : 'a',
                  option_weights: q.scores ? {
                    a: q.scores.A,
                    b: q.scores.B,
                    c: q.scores.C,
                    d: q.scores.D,
                    e: q.scores.E
                  } : null
                });
              })
          );
          
          // Refresh questions list for the bank and packages
          await get().fetchQuestions(1);
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to sync category questions with package:', error);
          throw error;
        }
      },

      fetchActiveAnnouncement: async () => {
        try {
          const res = await API.get('/announcements/active');
          set({ announcement: res.data.data });
        } catch (error) {
          console.error('Failed to fetch active announcement:', error);
        }
      },

      fetchAnnouncements: async () => {
        try {
          const res = await API.get('/announcements');
          set({ announcements: res.data.data || [] });
        } catch (error) {
          console.error('Failed to fetch announcements:', error);
        }
      },

      fetchNotifications: async () => {
        try {
          const res = await API.get('/announcements/notifications');
          set({ notifications: res.data.data || [] });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      },

      createAnnouncement: async (announcementData) => {
        try {
          await API.post('/announcements', announcementData);
          await get().fetchAnnouncements();
          await get().fetchActiveAnnouncement();
        } catch (error) {
          console.error('Failed to create announcement:', error);
          throw error;
        }
      },

      updateAnnouncement: async (id, announcementData) => {
        try {
          await API.put(`/announcements/${id}`, announcementData);
          await get().fetchAnnouncements();
          await get().fetchActiveAnnouncement();
        } catch (error) {
          console.error('Failed to update announcement:', error);
          throw error;
        }
      },

      deleteAnnouncement: async (id) => {
        try {
          await API.delete(`/announcements/${id}`);
          await get().fetchAnnouncements();
          await get().fetchActiveAnnouncement();
        } catch (error) {
          console.error('Failed to delete announcement:', error);
          throw error;
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

      assignQuestionsToPackage: async (packageId, questionIds) => {
        try {
          await API.post(`/packages/${packageId}/questions`, { question_ids: questionIds });
        } catch (error) {
          console.error('Failed to assign questions to package:', error);
          throw error;
        }
      },

      getQuestionsForPackage: async (packageId) => {
        try {
          const res = await API.get(`/packages/${packageId}/questions`);
          return res.data.data;
        } catch (error) {
          console.error('Failed to get questions for package:', error);
          throw error;
        }
      },

      submitExamAttempt: async (attemptId, answersMap) => {
        try {
          const questions = get().questions;
          let twk = 0;
          let tiu = 0;
          let tkp = 0;
          
          const answersList = questions.map((q) => {
            const selected = (answersMap[q.id] || '').toLowerCase().trim();
            const category = q.category ? q.category.toUpperCase() : 'TWK';
            
            let isCorrect = false;
            let score = 0;
            
            if (category === 'TKP') {
              if (q.scores) {
                score = q.scores[selected.toUpperCase()] || 0;
              } else {
                score = selected === (q.correctAnswer || '').toLowerCase() ? 5 : 0;
              }
              isCorrect = score === 5;
              tkp += score;
            } else {
              isCorrect = selected === (q.correctAnswer || '').toLowerCase();
              score = isCorrect ? 5 : 0;
              if (category === 'TWK') twk += score;
              if (category === 'TIU') tiu += score;
            }
            
            return {
              question_id: q.id,
              selected_option: selected || null,
              is_correct: isCorrect,
              score: score
            };
          });
          
          const totalScore = twk + tiu + tkp;
          const result = totalScore >= 10 ? 'LULUS' : 'TIDAK LULUS';
          
          const payload = {
            attempt_id: attemptId,
            package_id: 1, // Default to Tryout Akbar
            score: totalScore,
            twk,
            tiu,
            tkp,
            result,
            answers: answersList
          };
          
          const res = await API.post('/attempts', payload);
          return res.data.data;
        } catch (error) {
          console.error('Failed to submit exam attempt:', error);
          throw error;
        }
      },

      // Admin CRUD actions for questions
      addQuestion: async (newQuestion) => {
        try {
          const catObj = get().categories.find(c => c.name.toUpperCase() === newQuestion.category.toUpperCase());
          const category_id = catObj ? catObj.id : 1;

          const formatted = {
            tryout_id: newQuestion.tryout_id || 1, // Defaulting to Tryout 1 (Tryout Akbar CPNS 2026)
            category_id,
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
          await get().fetchQuestions(newQuestion.tryout_id || 1);
        } catch (error) {
          console.error('Failed to add question:', error);
          throw error;
        }
      },

      bulkAddQuestions: async (questionsList, tryoutId = 1) => {
        try {
          const formattedQuestions = questionsList.map((newQuestion) => {
            const catObj = get().categories.find(c => c.name.toUpperCase() === newQuestion.category.toUpperCase());
            const category_id = catObj ? catObj.id : 1;

            return {
              category_id,
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
          });

          await API.post('/questions/bulk', {
            tryout_id: tryoutId,
            questions: formattedQuestions
          });

          // Refresh question list once at the end
          await get().fetchQuestions(tryoutId);
        } catch (error) {
          console.error('Failed to bulk add questions:', error);
          throw error;
        }
      },

      deleteQuestion: async (id, tryoutId = 1) => {
        try {
          await API.delete(`/questions/${id}`);
          // Refresh question list
          await get().fetchQuestions(tryoutId);
        } catch (error) {
          console.error('Failed to delete question:', error);
          throw error;
        }
      },

      updateQuestion: async (updatedQuestion) => {
        try {
          const catObj = get().categories.find(c => c.name.toUpperCase() === updatedQuestion.category.toUpperCase());
          const category_id = catObj ? catObj.id : 1;
          const tryoutId = updatedQuestion.tryout_id || 1;

          const formatted = {
            tryout_id: tryoutId,
            category_id,
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
          await get().fetchQuestions(tryoutId);
        } catch (error) {
          console.error('Failed to update question:', error);
          throw error;
        }
      },

      createPackage: async (pkgData) => {
        try {
          const formatted = {
            title: pkgData.title,
            description: pkgData.description,
            duration: parseInt(pkgData.duration),
            status: pkgData.status === 'Aktif' ? 'active' : 'inactive',
            category: pkgData.category || 'Tryout',
            image_url: pkgData.imageUrl || null,
            original_price: pkgData.originalPrice ? parseInt(pkgData.originalPrice) : 0,
            discount_percentage: pkgData.discountPercentage ? parseInt(pkgData.discountPercentage) : 0,
            price: pkgData.price ? parseInt(pkgData.price) : 0
          };
          await API.post('/tryouts', formatted);
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to create package:', error);
          throw error;
        }
      },

      updatePackage: async (updatedPkg) => {
        try {
          const formatted = {
            title: updatedPkg.title,
            description: updatedPkg.description,
            duration: parseInt(updatedPkg.duration),
            status: updatedPkg.status === 'Aktif' ? 'active' : 'inactive',
            category: updatedPkg.category || 'Tryout',
            image_url: updatedPkg.imageUrl || null,
            original_price: updatedPkg.originalPrice ? parseInt(updatedPkg.originalPrice) : 0,
            discount_percentage: updatedPkg.discountPercentage ? parseInt(updatedPkg.discountPercentage) : 0,
            price: updatedPkg.price ? parseInt(updatedPkg.price) : 0
          };
          await API.put(`/tryouts/${updatedPkg.id}`, formatted);
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to update package:', error);
          throw error;
        }
      },

      deletePackage: async (id) => {
        try {
          await API.delete(`/tryouts/${id}`);
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to delete package:', error);
          throw error;
        }
      },

      createPendingTransaction: async (tryoutId, amount, proofImage) => {
        try {
          await API.post('/transactions', {
            tryout_id: tryoutId,
            amount: amount,
            proof_image: proofImage || null
          });
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to create transaction:', error);
          throw error;
        }
      },

      updateTransactionStatus: async (id, status) => {
        try {
          await API.put(`/transactions/${id}/status`, { status });
          await get().fetchTransactions();
          await get().fetchPackages();
        } catch (error) {
          console.error('Failed to update transaction status:', error);
        }
      }
    }),
    {
      name: 'cpns-tryout-storage',
      partialize: (state) => ({ user: state.user, token: state.token, transactions: state.transactions }),
    }
  )
);
