'use client';

import React, { useEffect, useState } from 'react';

import { Calendar, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';

import { MonthlyReportService } from '@/services/founders/MonthlyReportService';

type ReportStatus = 'Approved' | 'Draft' | 'Rejected' | 'Submitted';

type MonthlyReport = {
  id: string;
  month: number;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  profitSharingAmount: number;
  newInvestors: number;
  investorCount: number;
  status: ReportStatus;
  createdAt: number;
  updatedAt: number;
};

type MonthlyReportList = {
  totalProfitSharing: number;
  totalReports: number;
  totalProfit: number;
  totalExpenses: number;
  totalRevenue: number;
  reports: MonthlyReport[];
};

type Startup = {
  id: string;
  startupName: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  fundingGoal?: string;
  nftPrice?: string;
  companyType?: string;
  periodicProfitSharing?: string;
  useOfFunds?: string;
  financialProjections?: string[];
};

interface FinancialsProps {
  startup: Startup | null;
}

const Financials: React.FC<FinancialsProps> = ({ startup }) => {
  const [reportData, setReportData] = useState<MonthlyReportList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dummyData: MonthlyReportList = {
    totalProfitSharing: 120000,
    totalReports: 3,
    totalProfit: 155000,
    totalExpenses: 210000,
    totalRevenue: 365000,
    reports: [
      {
        id: '1',
        month: 7,
        year: 2025,
        revenue: 120000,
        expenses: 80000,
        profit: 40000,
        profitSharingAmount: 10000,
        newInvestors: 5,
        investorCount: 45,
        status: 'Approved',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        month: 8,
        year: 2025,
        revenue: 150000,
        expenses: 90000,
        profit: 60000,
        profitSharingAmount: 12000,
        newInvestors: 3,
        investorCount: 48,
        status: 'Approved',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '3',
        month: 9,
        year: 2025,
        revenue: 95000,
        expenses: 70000,
        profit: 25000,
        profitSharingAmount: 8000,
        newInvestors: 2,
        investorCount: 50,
        status: 'Submitted',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (!startup?.id) return;
      setLoading(true);

      try {
        const response = await MonthlyReportService.getMonthlyReportsByStartup(
          startup.id
        );
        if (response.success && response.reportList) {
          const convertedReports: MonthlyReportList = {
            ...response.reportList,
            totalProfitSharing: Number(response.reportList.totalProfitSharing),
            totalReports: Number(response.reportList.totalReports),
            totalProfit: Number(response.reportList.totalProfit),
            totalExpenses: Number(response.reportList.totalExpenses),
            totalRevenue: Number(response.reportList.totalRevenue),
            reports: response.reportList.reports.map(report => ({
              ...report,
              month: Number(report.month),
              year: Number(report.year),
              revenue: Number(report.revenue),
              expenses: Number(report.expenses),
              profit: Number(report.profit),
              profitSharingAmount: Number(report.profitSharingAmount),
              newInvestors: Number(report.newInvestors),
              investorCount: Number(report.investorCount),
              status: Object.keys(report.status)[0] as ReportStatus,
              createdAt: Number(report.createdAt),
              updatedAt: Number(report.updatedAt),
            })),
          };
          setReportData(convertedReports);
        } else {
          setReportData(dummyData);
        }
      } catch {
        setReportData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startup?.id]);

  if (!startup) {
    return <p className='text-gray-500'>Loading financial information...</p>;
  }

  const monthlyRevenue = parseFloat(startup.monthlyRevenue) || 0;
  const monthlyExpenses = parseFloat(startup.monthlyExpenses) || 0;
  const monthlyProfit = monthlyRevenue - monthlyExpenses;
  const profitMargin =
    monthlyRevenue > 0
      ? ((monthlyProfit / monthlyRevenue) * 100).toFixed(1)
      : '0';

  return (
    <div className='space-y-8'>
      {/* Financial Overview */}
      <div className='rounded-[16px] bg-neutral-100 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <h3 className='text-2xl font-semibold font-ibm'>
            Financial Overview
          </h3>
          <span className='flex items-center gap-2 text-xs text-blue-600 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg'>
            <DollarSign size={14} /> Current Data
          </span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-[16px] p-4'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Revenue</h4>
            <p className='text-2xl font-semibold text-green-600'>
              ${monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className='bg-white rounded-[16px] p-4'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Expenses</h4>
            <p className='text-2xl font-semibold text-red-600'>
              ${monthlyExpenses.toLocaleString()}
            </p>
          </div>
          <div className='bg-white rounded-[16px] p-4'>
            <h4 className='text-sm text-gray-500 mb-2'>Monthly Profit</h4>
            <p
              className={`text-2xl font-semibold ${
                monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${monthlyProfit.toLocaleString()}
            </p>
            {parseFloat(profitMargin) > 0 && (
              <p className='text-sm text-gray-500 mt-1'>
                {profitMargin}% margin
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Performance Details */}
      <div className='bg-neutral-100 rounded-[16px] p-4'>
        <h3 className='text-2xl font-semibold font-ibm mb-4'>
          Financial Performance Details
        </h3>

        {loading ? (
          <p className='text-gray-500'>Loading reports...</p>
        ) : reportData?.reports?.length ? (
          <div className='space-y-4'>
            {reportData.reports.map(record => {
              const profitMargin =
                record.revenue > 0
                  ? ((record.profit / record.revenue) * 100).toFixed(1)
                  : '0';

              return (
                <div
                  key={record.id}
                  className='bg-white border border-gray-200 shadow-sm rounded-[16px] p-4 flex flex-col'
                >
                  <div className='flex justify-between items-start gap-3 w-full'>
                    <div className='flex gap-2 items-center justify-center'>
                      <Calendar className='w-5 h-5 text-gray-500 mt-1' />
                      <h4 className='font-medium text-sm text-gray-800 mb-1'>
                        {`Month ${record.month}, ${record.year}`}
                      </h4>
                    </div>
                    <div className='mt-3 sm:mt-0 flex items-center gap-2 sm:items-end'>
                      <p className='text-sm text-gray-500'>
                        Profit:{' '}
                        <span className='font-semibold text-green-600'>
                          ${record.profit.toLocaleString()}
                        </span>
                      </p>
                      <div className='flex items-center gap-1 mt-1 bg-green-100 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full'>
                        <TrendingUp size={13} />
                        <span>{profitMargin}% profit margin</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className='text-gray-500 text-sm'>
            No financial reports available.
          </p>
        )}
      </div>

      {/* Investment Information */}
      <div className='bg-neutral-100 rounded-[16px] p-6'>
        <h3 className='text-2xl font-semibold font-ibm mb-4'>
          Investment Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white rounded-[16px] p-4'>
            <h4 className='text-sm font-medium mb-3'>Funding Details</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Funding Goal:</span>
                <span className='font-semibold'>
                  ${startup.fundingGoal?.toLocaleString() || '0'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>NFT Price:</span>
                <span className='font-semibold'>
                  ${startup.nftPrice?.toLocaleString() || '0'} ckUSDC
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Company Type:</span>
                <span className='font-semibold'>
                  {startup.companyType || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-[16px] p-4'>
            <h4 className='text-lg font-medium mb-3'>Profit Sharing</h4>
            <p className='text-sm text-gray-600'>
              {startup.periodicProfitSharing ||
                '• Profit sharing details will be available after funding'}
            </p>
          </div>
        </div>
      </div>

      {/* 🟢 Investor Profit Sharing Model Section */}
      <div className='bg-neutral-100 rounded-[16px] p-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-semibold font-ibm'>
            Investor Profit Sharing Model
          </h3>
          <div className='flex items-center gap-1 text-orange-600 bg-orange-50 border border-orange-200 text-xs px-3 py-1 rounded-full'>
            <CalendarDays size={14} />
            <span>Last 6 months</span>
          </div>
        </div>

        <div className='bg-white rounded-[16px] p-5 space-y-3'>
          <h4 className='text-lg font-medium'>How profit sharing works</h4>
          <ul className='text-sm text-gray-600 list-disc pl-5 space-y-1'>
            <li>70% of monthly net profit distributed to NFT holders</li>
            <li>30% retained by company for growth and operations</li>
            <li>Payments distributed on 1st of each month</li>
            <li>Profit sharing locked for 36 months</li>
            <li>Transparent reporting with monthly financial statements</li>
          </ul>
        </div>

        <div className='bg-white rounded-[16px] p-5 space-y-4'>
          <h4 className='text-lg font-medium'>Expected Monthly Distribution</h4>
          <div className='bg-neutral-50 rounded-[12px] p-4'>
            <p className='text-sm text-gray-500 mb-1'>
              Based on current performance:
            </p>
            <p className='text-3xl font-semibold'>
              $12{' '}
              <span className='text-sm text-gray-600 font-normal'>per NFT</span>
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              From latest month net profit of $6,700
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
