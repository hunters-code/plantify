'use client';

import { X, ArrowUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { analyzeStartup } from '@/lib/aiService';

import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'table';
  content: string;
  timestamp: Date;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
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
  onInvestClick,
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
      // Simulate AI response based on the question type
      if (messageText.toLowerCase().includes('valuation')) {
        // Add AI response with table for valuation questions
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Based on comparable EdTech startups over the past 3 years, the fair market valuation range for ${startupName} is between $2.2M – $2.8M.\n\nThe current valuation of $2.5M sits within this range, making it a reasonable entry point.`,
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
              ['Duolingo', '2020', '12x Revenue', 'EdTech'],
              ['Babbel', '2021', '10x Revenue', 'EdTech'],
              ['LingQ', '2022', '8x Revenue', 'EdTech'],
            ],
          },
        };

        setMessages(prev => [...prev, aiResponse, tableMessage]);
      } else {
        // For other questions, use the existing AI service
        if (startupData) {
          const analysis = await analyzeStartup(startupData as any);
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Based on my analysis of ${startupName}:\n\n**Overall Score: ${analysis.overallScore}/100**\n\n**Key Insights:**\n${analysis.summary}\n\n**Investment Recommendation:** ${analysis.investmentRecommendation.replace('_', ' ').toUpperCase()}\n\n**Risk Level:** ${analysis.riskLevel.toUpperCase()}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiResponse]);
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          'I apologize, but I encountered an error while analyzing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAnalysis = () => {
    handleSendMessage('What is a fair market valuation for this startup?');
  };

  if (!isOpen) return null;

  return (
    <div className='bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden h-full flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-2 p-4 border-b border-gray-200'>
        <div className='flex items-center gap-2 flex-1'>
          <div className='w-7 h-7 bg-green-500 rounded-full flex items-center justify-center'>
            <svg width='18' height='15' viewBox='0 0 18 15' fill='none'>
              <path
                d='M9 0L10.09 6.26L17 7L10.09 7.74L9 14L7.91 7.74L1 7L7.91 6.26L9 0Z'
                fill='white'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-serif text-gray-900'>{startupName}</h3>
        </div>
        <button
          onClick={onClose}
          className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <X size={24} className='text-gray-600' />
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 && (
          <div className='text-center text-gray-500 mt-8'>
            <p className='text-lg mb-2'>Ask anything about this startup</p>
            <p className='text-sm'>I&apos;ll analyze it for you using AI</p>
          </div>
        )}

        {messages.map((message: Message) => (
          <div key={message.id} className='space-y-4'>
            {message.type === 'user' && (
              <div className='flex justify-end'>
                <div className='bg-gray-100 rounded-2xl px-4 py-3 max-w-xs'>
                  <p className='text-sm font-medium text-gray-700'>
                    {message.content}
                  </p>
                </div>
              </div>
            )}

            {message.type === 'ai' && (
              <div className='flex justify-start'>
                <div className='bg-purple-500 rounded-2xl px-4 py-3 max-w-md'>
                  <p className='text-sm text-white whitespace-pre-line'>
                    {message.content}
                  </p>
                </div>
              </div>
            )}

            {message.type === 'table' && message.tableData && (
              <div className='flex justify-start'>
                <div className='border border-gray-200 rounded-2xl overflow-hidden max-w-md'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='bg-gray-200'>
                        {message.tableData.headers.map((header, index) => (
                          <th
                            key={index}
                            className='px-3 py-2 text-left font-medium text-gray-900'
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className='border-t border-gray-200'>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className='px-3 py-2 text-gray-900'
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
            <div className='bg-purple-500 rounded-2xl px-4 py-3'>
              <LoadingSpinner size='sm' />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-4 border-t border-gray-200 space-y-4'>
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <textarea
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInputText(e.target.value)
              }
              placeholder='Ask anything related to this startup and we will analyze it for you.

Or you can use the shortcut below.'
              className='w-full h-24 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button
            onClick={handleQuickAnalysis}
            disabled={isLoading}
            className='w-12 h-12 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shadow-lg'
          >
            <ArrowUp size={20} className='text-white' />
          </button>
        </div>

        {messages.length === 0 && (
          <div className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={handleQuickAnalysis}
                disabled={isLoading}
                className='bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 text-sm py-2 px-3 rounded-full border border-gray-200 transition-colors'
              >
                💰 Market Valuation
              </button>
              <button
                onClick={() =>
                  handleSendMessage(
                    'What are the main risks of investing in this startup?'
                  )
                }
                disabled={isLoading}
                className='bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 text-sm py-2 px-3 rounded-full border border-gray-200 transition-colors'
              >
                ⚠️ Investment Risks
              </button>
              <button
                onClick={() =>
                  handleSendMessage(
                    'How does this startup compare to competitors?'
                  )
                }
                disabled={isLoading}
                className='bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 text-sm py-2 px-3 rounded-full border border-gray-200 transition-colors'
              >
                📊 Competitive Analysis
              </button>
            </div>

            {onInvestClick && (
              <button
                onClick={onInvestClick}
                className='w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-lg flex items-center justify-center gap-2'
              >
                <span className='text-lg'>💎</span>
                Invest in {startupName}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
