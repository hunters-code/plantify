'use client';

import { useState, useRef, useEffect } from 'react';

import { X, ArrowUp, TrendingUp, Target } from 'lucide-react';

import { analyzeStartup, StartupAnalysisResult } from '@/lib/aiService';

import LoadingSpinner from './LoadingSpinner';

import { Button } from '.';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'table' | 'analysis';
  content: string;
  timestamp: Date;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  analysisData?: StartupAnalysisResult;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  startupData?: {
    id: string;
    startupName: string;
    description: string;
    sector: string;
    location?: string;
    fundingGoal?: string;
    nftPrice?: string;
    periodicProfitSharing?: string;
    monthlyRevenue?: string;
    teamMembers?: { name: string; role: string }[];
    [key: string]: unknown;
  };
  startupName?: string;
  onInvestClick?: () => void;
}

export default function ChatInterface({
  isOpen,
  onClose,
  startupData,
  startupName,
  onInvestClick: _onInvestClick,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const lowerMessage = messageText.toLowerCase();

      if (
        lowerMessage.includes('analyze') ||
        lowerMessage.includes('analysis') ||
        lowerMessage.includes('full')
      ) {
        if (!startupData) {
          throw new Error('Startup data not available');
        }

        const analysis = await analyzeStartup({
          id: startupData.id,
          startupName: startupData.startupName,
          description: startupData.description,
          sector: startupData.sector,
          location: startupData.location || 'Not specified',
          teamMembers: startupData.teamMembers,
          monthlyRevenue: startupData.monthlyRevenue,
          fundingGoal: startupData.fundingGoal || '0',
          nftPrice: startupData.nftPrice || '0',
          periodicProfitSharing: startupData.periodicProfitSharing || '0',
        });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'analysis',
          content: `Here's a comprehensive analysis of ${startupName}:`,
          timestamp: new Date(),
          analysisData: analysis,
        };

        setMessages(prev => [...prev, aiResponse]);
      } else if (
        lowerMessage.includes('valuation') ||
        lowerMessage.includes('value')
      ) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Based on comparable ${startupData?.sector} startups, the fair market valuation range for ${startupName} is estimated between $${(Number(startupData?.fundingGoal) * 0.8).toLocaleString()} – $${(Number(startupData?.fundingGoal) * 1.2).toLocaleString()}.`,
          timestamp: new Date(),
        };

        const tableMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'table',
          content: '',
          timestamp: new Date(),
          tableData: {
            headers: ['Company', 'Deal Year', 'Valuation Multiple', 'Sector'],
            rows: [
              [
                'Comparable A',
                '2023',
                '12x Revenue',
                startupData?.sector || 'Tech',
              ],
              [
                'Comparable B',
                '2024',
                '10x Revenue',
                startupData?.sector || 'Tech',
              ],
              [
                'Comparable C',
                '2024',
                '8x Revenue',
                startupData?.sector || 'Tech',
              ],
            ],
          },
        };

        setMessages(prev => [...prev, aiResponse, tableMessage]);
      } else if (lowerMessage.includes('risk')) {
        if (!startupData) {
          throw new Error('Startup data not available');
        }

        const analysis = await analyzeStartup({
          id: startupData.id,
          startupName: startupData.startupName,
          description: startupData.description,
          sector: startupData.sector,
          location: startupData.location || 'Not specified',
          teamMembers: startupData.teamMembers,
          monthlyRevenue: startupData.monthlyRevenue,
          fundingGoal: startupData.fundingGoal || '0',
          nftPrice: startupData.nftPrice || '0',
          periodicProfitSharing: startupData.periodicProfitSharing || '0',
        });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `**Risk Assessment for ${startupName}**\n\nRisk Level: ${analysis.riskLevel.toUpperCase()}\n\n**Key Threats:**\n${analysis.threats.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n**Mitigation Opportunities:**\n${analysis.opportunities
            .slice(0, 2)
            .map((o, i) => `${i + 1}. ${o}`)
            .join('\n')}`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } else if (
        lowerMessage.includes('invest') ||
        lowerMessage.includes('recommendation')
      ) {
        if (!startupData) {
          throw new Error('Startup data not available');
        }

        const analysis = await analyzeStartup({
          id: startupData.id,
          startupName: startupData.startupName,
          description: startupData.description,
          sector: startupData.sector,
          location: startupData.location || 'Not specified',
          teamMembers: startupData.teamMembers,
          monthlyRevenue: startupData.monthlyRevenue,
          fundingGoal: startupData.fundingGoal || '0',
          nftPrice: startupData.nftPrice || '0',
          periodicProfitSharing: startupData.periodicProfitSharing || '0',
        });

        const recommendationText = {
          strong_buy:
            '🟢 STRONG BUY - Excellent opportunity with high potential',
          buy: '🟢 BUY - Good investment opportunity',
          hold: '🟡 HOLD - Monitor for better entry point',
          sell: '🔴 SELL - Consider alternatives',
          strong_sell: '🔴 STRONG SELL - High risk, avoid investment',
        };

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `**Investment Recommendation**\n\n${recommendationText[analysis.investmentRecommendation]}\n\n**Overall Score:** ${analysis.overallScore}/100\n\n${analysis.summary}\n\n**Key Strengths:**\n${analysis.strengths
            .slice(0, 3)
            .map((s, i) => `${i + 1}. ${s}`)
            .join('\n')}`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I can help you analyze ${startupName}. Try asking me about:\n\n• Full startup analysis\n• Market valuation\n• Risk assessment\n• Investment recommendation\n\nWhat would you like to know?`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Sorry, I encountered an error while analyzing your request. ${error instanceof Error ? error.message : 'Please try again.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex justify-end bg-black/20 backdrop-blur-sm'>
      <div className='w-full sm:w-[450px] md:w-[500px] h-screen bg-white shadow-2xl border-l border-gray-200 flex flex-col rounded-none relative animate-slide-in-right'>
        {/* Header */}
        <div className='flex items-center gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'>
          <div className='flex items-center gap-2 flex-1'>
            <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md'>
              <svg width='18' height='15' viewBox='0 0 18 15' fill='none'>
                <path
                  d='M9 0L10.09 6.26L17 7L10.09 7.74L9 14L7.91 7.74L1 7L7.91 6.26L9 0Z'
                  fill='white'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900'>{startupName}</h3>
              <p className='text-xs text-gray-600'>AI Investment Advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/80 rounded-lg transition-colors'
          >
            <X size={20} className='text-gray-600' />
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-white'>
          {messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full text-center text-gray-500'>
              <div className='w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4'>
                <TrendingUp size={32} className='text-purple-600' />
              </div>
              <p className='text-lg font-semibold mb-2'>
                AI Investment Analysis
              </p>
              <p className='text-sm text-gray-400'>
                Ask me anything about this startup
              </p>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className='space-y-2'>
              {message.type === 'user' && (
                <div className='flex justify-end'>
                  <div className='bg-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs'>
                    <p className='text-sm text-black whitespace-pre-line'>
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {message.type === 'ai' && (
                <div className='flex justify-start'>
                  <div className='bg-purple-500 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md shadow-sm'>
                    <p className='text-sm text-white whitespace-pre-line'>
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {message.type === 'analysis' && message.analysisData && (
                <div className='flex justify-start'>
                  <div className='bg-purple-500 border border-gray-200 rounded-2xl p-4 max-w-md shadow-sm space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-bold text-white'>Analysis Report</h4>
                      <div className='flex items-center gap-1'>
                        <span className='text-2xl font-bold text-white'>
                          {message.analysisData.overallScore}
                        </span>
                        <span className='text-sm text-white'>/100</span>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 p-2 bg-white rounded-lg'>
                        <Target className='text-purple-600' size={16} />
                        <span className='text-xs font-medium text-gray-700'>
                          {message.analysisData.investmentRecommendation
                            .replace('_', ' ')
                            .toUpperCase()}
                        </span>
                      </div>

                      <div className='flex items-center gap-2 p-2 bg-white rounded-lg'>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            message.analysisData.riskLevel === 'low'
                              ? 'bg-green-500'
                              : message.analysisData.riskLevel === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        />
                        <span className='text-xs text-gray-700'>
                          Risk Level:{' '}
                          <span className='font-medium capitalize'>
                            {message.analysisData.riskLevel}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                      {Object.entries(message.analysisData.keyMetrics).map(
                        ([key, value]) => (
                          <div key={key} className='bg-white rounded-lg p-2'>
                            <p className='text-xs text-gray-500 capitalize'>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className='text-lg font-bold text-purple-600'>
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div className='pt-2 border-t border-gray-200'>
                      <p className='text-xs text-white/80'>
                        {message.analysisData.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'table' && message.tableData && (
                <div className='flex justify-start'>
                  <div className='border border-gray-200 rounded-2xl overflow-hidden max-w-md shadow-sm bg-white'>
                    <table className='w-full text-xs'>
                      <thead>
                        <tr className='bg-gray-100'>
                          {message.tableData.headers.map((header, index) => (
                            <th
                              key={index}
                              className='px-3 py-2 text-left font-semibold text-gray-900'
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {message.tableData.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className='border-t border-gray-100'
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className='px-3 py-2 text-gray-700'
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start'>
              <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm'>
                <LoadingSpinner size='sm' />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='p-4 border-t border-gray-200 bg-white'>
          {/* Suggestion Buttons */}
          {messages.length === 0 && (
            <div className='mb-3 flex flex-wrap gap-2'>
              <button
                onClick={() =>
                  handleSendMessage('Give me a full startup analysis')
                }
                disabled={isLoading}
                className='px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50'
              >
                📊 Full Analysis
              </button>
              <button
                onClick={() =>
                  handleSendMessage('What are the investment risks?')
                }
                disabled={isLoading}
                className='px-3 py-2 text-xs bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50'
              >
                ⚠️ Risk Assessment
              </button>
              <button
                onClick={() =>
                  handleSendMessage('What is the market valuation?')
                }
                disabled={isLoading}
                className='px-3 py-2 text-xs bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50'
              >
                💰 Valuation
              </button>
              <button
                onClick={() =>
                  handleSendMessage('Should I invest in this startup?')
                }
                disabled={isLoading}
                className='px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50'
              >
                🎯 Investment Recommendation
              </button>
            </div>
          )}

          <div className='relative flex items-end border border-gray-200 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent'>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder='Ask anything related to this startup and we will analyze it for you.'
              className='flex-1 h-20 p-3 pr-14 bg-transparent resize-none focus:outline-none text-sm'
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className='absolute right-2 top-2'>
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                variant='primary'
                className='w-10 h-10 !p-0 !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ArrowUp size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
