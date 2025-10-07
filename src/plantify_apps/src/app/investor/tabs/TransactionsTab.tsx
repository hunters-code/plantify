import React from 'react';
import { Card, Badge } from '@/components/ui';

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
}

interface TransactionsTabProps {
  onBackToOverview?: () => void;
}

export default function TransactionsTab({ onBackToOverview }: TransactionsTabProps) {
  // Mock transaction data based on the design
  const transactionData: TransactionData = {
    totalInvested: 2450,
    totalReturns: 187,
    activeInvestments: 12,
    pendingWithdrawals: 0,
  };

  const recentTransactions: Transaction[] = [
    {
      id: 'TX-2024-001',
      type: 'investment',
      title: 'Investment in EcoFarms Solutions',
      description: 'NFT purchase',
      nftCount: 5,
      amount: -250.0,
      date: '12/20/2024',
      status: 'Completed',
    },
    {
      id: 'TX-2024-002',
      type: 'profit',
      title: 'Profit Sharing - SmartCafe Tech',
      description: 'Monthly returns',
      nftCount: 3,
      amount: 45.0,
      date: '12/20/2024',
      status: 'Completed',
    },
    {
      id: 'TX-2024-003',
      type: 'topup',
      title: 'Wallet Top-up',
      description: 'Added funds',
      amount: 500.0,
      currency: 'ckUSDC',
      date: '12/20/2024',
      status: 'Completed',
    },
    {
      id: 'TX-2024-004',
      type: 'fee',
      title: 'Platform Fee',
      description: 'Transaction fee',
      amount: -6.25,
      percentage: '2.5%',
      date: '12/20/2024',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-2">Total invested</p>
          <p className="text-2xl font-bold text-gray-900">
            ${transactionData.totalInvested.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-2">Total returns</p>
          <p className="text-2xl font-bold text-gray-900">
            ${transactionData.totalReturns}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-2">Active investments</p>
          <p className="text-2xl font-bold text-gray-900">
            {transactionData.activeInvestments}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-2">Pending withdrawals</p>
          <p className="text-2xl font-bold text-gray-900">
            ${transactionData.pendingWithdrawals}
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h3>

        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              {/* Transaction Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {transaction.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{transaction.date}</span>
                  <Badge variant="success" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
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
                  <p className="font-medium text-gray-900">
                    {transaction.nftCount && `${transaction.nftCount} NFTs`}
                    {transaction.currency && transaction.currency}
                    {transaction.percentage && transaction.percentage}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-medium text-gray-900">{transaction.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p
                    className={`font-bold text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {transaction.amount >= 0 ? '+' : ''}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
