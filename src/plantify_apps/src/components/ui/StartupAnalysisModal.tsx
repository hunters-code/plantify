'use client';

import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
} from 'lucide-react';

import { StartupAnalysisResult } from '@/lib/aiService';

import Badge from './Badge';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface StartupAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: StartupAnalysisResult | null;
  startupName?: string;
}

export default function StartupAnalysisModal({
  isOpen,
  onClose,
  analysis,
  startupName,
}: StartupAnalysisModalProps) {
  if (!isOpen || !analysis) return null;

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'buy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'hold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'sell':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'strong_sell':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              AI Analysis Report
            </h2>
            {startupName && <p className='text-gray-600 mt-1'>{startupName}</p>}
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        <div className='p-6 space-y-8'>
          {/* Overall Score & Summary */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='md:col-span-2'>
              <h3 className='text-lg font-semibold mb-3'>Executive Summary</h3>
              <p className='text-gray-700 leading-relaxed'>
                {analysis.summary}
              </p>
            </div>
            <div className='space-y-4'>
              <div className='text-center'>
                <div
                  className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}
                >
                  {analysis.overallScore}
                </div>
                <div className='text-gray-500 text-sm'>Overall Score</div>
              </div>
              <div className='flex gap-2 justify-center'>
                <Badge
                  className={getRecommendationColor(
                    analysis.investmentRecommendation
                  )}
                >
                  {analysis.investmentRecommendation
                    .replace('_', ' ')
                    .toUpperCase()}
                </Badge>
                <Badge className={getRiskColor(analysis.riskLevel)}>
                  {analysis.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Key Metrics</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
              {Object.entries(analysis.keyMetrics).map(([key, value]) => (
                <div key={key} className='bg-gray-50 p-4 rounded-lg'>
                  <div className='text-sm text-gray-600 mb-2 capitalize'>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                    {value}
                  </div>
                  <ProgressBar
                    value={value}
                    className='mt-2'
                    color={
                      value >= 70
                        ? 'bg-green-500'
                        : value >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SWOT Analysis */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Strengths */}
            <div className='bg-green-50 p-6 rounded-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <TrendingUp className='text-green-600' size={20} />
                <h4 className='font-semibold text-green-800'>Strengths</h4>
              </div>
              <ul className='space-y-2'>
                {analysis.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className='text-green-700 text-sm flex items-start gap-2'
                  >
                    <span className='text-green-500 mt-1'>•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className='bg-red-50 p-6 rounded-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <TrendingDown className='text-red-600' size={20} />
                <h4 className='font-semibold text-red-800'>Weaknesses</h4>
              </div>
              <ul className='space-y-2'>
                {analysis.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className='text-red-700 text-sm flex items-start gap-2'
                  >
                    <span className='text-red-500 mt-1'>•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className='bg-blue-50 p-6 rounded-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <Target className='text-blue-600' size={20} />
                <h4 className='font-semibold text-blue-800'>Opportunities</h4>
              </div>
              <ul className='space-y-2'>
                {analysis.opportunities.map((opportunity, index) => (
                  <li
                    key={index}
                    className='text-blue-700 text-sm flex items-start gap-2'
                  >
                    <span className='text-blue-500 mt-1'>•</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className='bg-yellow-50 p-6 rounded-lg'>
              <div className='flex items-center gap-2 mb-4'>
                <AlertTriangle className='text-yellow-600' size={20} />
                <h4 className='font-semibold text-yellow-800'>Threats</h4>
              </div>
              <ul className='space-y-2'>
                {analysis.threats.map((threat, index) => (
                  <li
                    key={index}
                    className='text-yellow-700 text-sm flex items-start gap-2'
                  >
                    <span className='text-yellow-500 mt-1'>•</span>
                    {threat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end pt-4 border-t border-gray-200'>
            <Button onClick={onClose} variant='primary'>
              Close Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
