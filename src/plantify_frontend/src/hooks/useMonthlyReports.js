import { useState, useEffect } from 'react';
import { backendService } from '../lib/backend';

export function useMonthlyReports(startupId) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startupId) {
      setReports([]);
      setLoading(false);
      return;
    }

    const fetchMonthlyReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, we'll create mock data structure
        // In the future, this would call a backend method like:
        // const reports = await backendService.getMonthlyReports(startupId);
        
        // Mock data structure for monthly reports
        const mockReports = [
          {
            id: '1',
            startupId: startupId,
            month: 'December',
            year: 2024,
            status: 'submitted',
            submittedAt: new Date('2024-12-31'),
            dueDate: new Date('2025-01-10'),
            financialData: {
              monthlyRevenue: 15000,
              netProfit: 5000,
              monthlyExpenses: 10000,
              cashFlow: 5000,
              varianceFromProjection: 10
            },
            operationalData: {
              keyAchievements: 'Launched new product feature, onboarded 50 new customers',
              milestonesReached: 'Reached 1000 active users milestone',
              challengesFaced: 'Supply chain delays affected delivery times',
              solutionsImplemented: 'Partnered with local suppliers to reduce delivery time'
            },
            marketData: {
              competitiveLandscape: 'New competitor entered market with similar offering',
              marketChanges: 'Increased demand for sustainable products',
              customerFeedback: 'Positive feedback on new features, requests for mobile app',
              demandShifts: 'Shift towards eco-friendly products observed'
            },
            forwardLooking: {
              nextMonthPlans: 'Launch mobile app beta, expand to 3 new cities',
              expectedChallenges: 'Seasonal demand fluctuations',
              resourceNeeds: 'Additional developers for mobile app development',
              growthProjections: 'Expect 25% growth in user base'
            },
            communication: {
              investorMessages: 'Strong month with positive growth metrics',
              communityUpdates: 'New feature launch announcement',
              partnershipNews: 'Partnership with major retailer announced',
              teamChanges: 'Hired 2 new developers'
            }
          },
          {
            id: '2',
            startupId: startupId,
            month: 'November',
            year: 2024,
            status: 'submitted',
            submittedAt: new Date('2024-11-30'),
            dueDate: new Date('2024-12-10'),
            financialData: {
              monthlyRevenue: 12000,
              netProfit: 3000,
              monthlyExpenses: 9000,
              cashFlow: 3000,
              varianceFromProjection: -5
            },
            operationalData: {
              keyAchievements: 'Improved customer satisfaction scores',
              milestonesReached: 'Reached 500 active users',
              challengesFaced: 'Technical issues with payment processing',
              solutionsImplemented: 'Implemented new payment gateway'
            },
            marketData: {
              competitiveLandscape: 'Stable competitive environment',
              marketChanges: 'Steady market growth',
              customerFeedback: 'Good feedback on user interface',
              demandShifts: 'Consistent demand patterns'
            },
            forwardLooking: {
              nextMonthPlans: 'Focus on product improvements',
              expectedChallenges: 'Holiday season impact',
              resourceNeeds: 'Customer support staff',
              growthProjections: 'Moderate growth expected'
            },
            communication: {
              investorMessages: 'Steady progress with room for improvement',
              communityUpdates: 'Product update announcements',
              partnershipNews: 'No new partnerships',
              teamChanges: 'No team changes'
            }
          }
        ];

        setReports(mockReports);
      } catch (error) {
        console.error('Error fetching monthly reports:', error);
        setError(error.message || 'Failed to fetch monthly reports');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReports();
  }, [startupId]);

  const submitReport = async (reportData) => {
    try {
      // Mock submission - in real implementation, this would call backend
      const newReport = {
        id: Date.now().toString(),
        startupId: startupId,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        status: 'submitted',
        submittedAt: new Date(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        ...reportData
      };

      setReports(prev => [newReport, ...prev]);
      return { success: true, report: newReport };
    } catch (error) {
      console.error('Error submitting report:', error);
      return { success: false, error: error.message };
    }
  };

  const saveDraft = async (reportData) => {
    try {
      // Mock draft save - in real implementation, this would call backend
      const draftReport = {
        id: Date.now().toString(),
        startupId: startupId,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        status: 'draft',
        submittedAt: new Date(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        ...reportData
      };

      setReports(prev => [draftReport, ...prev]);
      return { success: true, report: draftReport };
    } catch (error) {
      console.error('Error saving draft:', error);
      return { success: false, error: error.message };
    }
  };

  return { reports, loading, error, submitReport, saveDraft };
}
