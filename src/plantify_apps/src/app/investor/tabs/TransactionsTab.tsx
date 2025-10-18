import React, { useEffect, useState } from 'react';

import { AlertCircle } from 'lucide-react';

import { Card, Badge, LoadingSpinner, Button } from '@/components/ui';
import type {
  NFTPurchaseHistory,
  NFTPurchaseInfo,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { InvestorService } from '@/services/investors/InvestorService';

interface TransactionData {
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  pendingWithdrawals: number;
}

type TransactionType = 'investment' | 'profit' | 'topup' | 'fee';

interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  nftCount?: number;
  amount: number;
  date: string;
  status: string;
  currency?: string;
  percentage?: string;
  timestamp?: bigint;
}

interface TransactionsTabProps {
  onBackToOverview?: () => void;
}

export default function TransactionsTab({
  onBackToOverview,
}: TransactionsTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [transactionData, setTransactionData] = useState<TransactionData>({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    pendingWithdrawals: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const investor = await InvestorService.getInvestorByPrincipal();

      if (!investor) {
        setError('Investor not found. Please register as an investor.');
        setLoading(false);
        return;
      }

      const result = await InvestorService.getInvestorPurchaseHistory(
        investor.id
      );

      if (!result.success || !result.history) {
        setError(result.error || 'Failed to load transaction history');
        setLoading(false);
        return;
      }

      const transformedData = transformPurchaseHistory(result.history);

      setTransactionData(transformedData.summary);
      setTransactions(transformedData.transactions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('An unexpected error occurred while loading transactions');
      setLoading(false);
    }
  };
  const transformPurchaseHistory = (history: NFTPurchaseHistory) => {
    let totalInvested = 0;
    const startupSet = new Set<string>();
    const transactionList: Transaction[] = [];

    history.purchases.forEach((purchase: NFTPurchaseInfo) => {
      const amount = Number(purchase.amount);
      totalInvested += amount;
      startupSet.add(purchase.startupId);

      transactionList.push({
        id: purchase.id,
        type: 'investment',
        title: `Investment in Startup ${purchase.startupId.slice(0, 8)}...`,
        description: 'NFT purchase',
        nftCount: 1,
        amount: -amount,
        date: formatDate(purchase.timestamp),
        status: 'Completed',
        timestamp: purchase.timestamp,
      });
    });

    const monthlyReturnRate = 0.05;
    const totalReturns = Math.floor(totalInvested * monthlyReturnRate * 3);
    const activeInvestments = startupSet.size;
    transactionList.sort((a, b) => {
      const timeA = a.timestamp ? Number(a.timestamp) : 0;
      const timeB = b.timestamp ? Number(b.timestamp) : 0;
      return timeB - timeA;
    });

    const profitTransactions = generateExampleProfitTransactions(
      Array.from(startupSet),
      totalReturns
    );

    return {
      summary: {
        totalInvested,
        totalReturns,
        activeInvestments,
        pendingWithdrawals: 0,
      },
      transactions: [...profitTransactions, ...transactionList].sort((a, b) => {
        const timeA = a.timestamp ? Number(a.timestamp) : 0;
        const timeB = b.timestamp ? Number(b.timestamp) : 0;
        return timeB - timeA;
      }),
    };
  };

  const generateExampleProfitTransactions = (
    startupIds: string[],
    totalReturns: number
  ): Transaction[] => {
    if (startupIds.length === 0 || totalReturns === 0) return [];

    const profitPerStartup = totalReturns / startupIds.length;
    const now = Date.now();

    return startupIds.slice(0, 3).map((startupId, index) => ({
      id: `PROFIT-${Date.now()}-${index}`,
      type: 'profit' as TransactionType,
      title: `Profit Sharing - Startup ${startupId.slice(0, 8)}...`,
      description: 'Monthly returns',
      amount: Math.floor(profitPerStartup),
      date: formatDate(
        BigInt((now - index * 30 * 24 * 60 * 60 * 1000) * 1000000)
      ),
      status: 'Completed',
      timestamp: BigInt((now - index * 30 * 24 * 60 * 60 * 1000) * 1000000),
    }));
  };

  const formatDate = (timestamp: bigint): string => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    } catch (err) {
      return 'N/A';
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <LoadingSpinner className='mx-auto mb-4' />
          <p className='text-gray-600'>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='p-8'>
        <div className='text-center flex flex-col items-center justify-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Error Loading Transactions
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button variant='primary' onClick={fetchTransactionData}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Transaction History
        </h2>
      </div>

      {/* Summary Stats */}
      <div className='grid grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-4'>
        <Card className='p-4'>
          <p className='text-sm text-gray-600 mb-2'>Total invested</p>
          <p className='text-2xl font-bold text-gray-900'>
            ${transactionData.totalInvested.toLocaleString()}
          </p>
        </Card>

        <Card className='p-4'>
          <p className='text-sm text-gray-600 mb-2'>Total returns</p>
          <p className='text-2xl font-bold text-gray-900'>
            ${transactionData.totalReturns.toLocaleString()}
          </p>
        </Card>

        <Card className='p-4'>
          <p className='text-sm text-gray-600 mb-2'>Active investments</p>
          <p className='text-2xl font-bold text-gray-900'>
            {transactionData.activeInvestments}
          </p>
        </Card>

        <Card className='p-4'>
          <p className='text-sm text-gray-600 mb-2'>Pending withdrawals</p>
          <p className='text-2xl font-bold text-gray-900'>
            ${transactionData.pendingWithdrawals}
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className='bg-neutral-100 rounded-[16px] p-4'>
        <h3 className='text-xl font-semibold text-gray-900 mb-6'>
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className='p-8 bg-neutral-100 rounded-[16px]'>
            <div className='text-center'>
              <p className='text-gray-600'>No transactions found</p>
            </div>
          </div>
        ) : (
          <div className='space-y-4 bg-neutral-100 p-4 rounded-[16px]'>
            {transactions.map(transaction => (
              <div
                key={transaction.id}
                className='bg-white rounded-[16px] border border-gray-200 p-6'
              >
                <div className='flex items-center justify-between mb-4'>
                  <h4 className='text-lg font-semibold text-gray-900'>
                    {transaction.title}
                  </h4>
                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                    <span>{transaction.date}</span>
                    <Badge variant='success' className='text-xs'>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
                <div className='bg-neutral-100 rounded-[16px] p-4'>
                  {/* Transaction Header */}

                  {/* Transaction Details Grid */}
                  <div className='grid grid-cols-3 gap-8'>
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>
                        {transaction.type === 'investment'
                          ? 'NFT purchase'
                          : transaction.type === 'profit'
                            ? 'Monthly returns'
                            : transaction.type === 'topup'
                              ? 'Added funds'
                              : transaction.type === 'fee'
                                ? 'Transaction fee'
                                : transaction.description}
                      </p>
                      <p className='font-medium text-gray-900 text-sm'>
                        {transaction.nftCount &&
                          `${transaction.nftCount} NFT${transaction.nftCount > 1 ? 's' : ''}`}
                        {transaction.currency && transaction.currency}
                        {transaction.percentage && transaction.percentage}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-600 mb-1'>
                        Transaction ID
                      </p>
                      <p className='font-medium text-gray-900 truncate text-sm'>
                        {transaction.id.length > 20
                          ? `${transaction.id.slice(0, 20)}...`
                          : transaction.id}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Total</p>
                      <p
                        className={`font-bold text-lg ${
                          transaction.amount >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.amount >= 0 ? '+' : ''}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
