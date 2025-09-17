import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, DraftingCompass, ShieldCheck, CheckCircle } from 'lucide-react';

import { Layout } from '../../components';
import { useAuth } from '../../hooks/useAuth';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const [copied, setCopied] = useState(false);

  const formatPrincipal = principal => {
    if (!principal) return '';
    return principal.toString();
  };

  const copyToClipboard = async () => {
    if (principal) {
      try {
        await navigator.clipboard.writeText(principal.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const handleInvestorClick = () => {
    navigate('/register/investor');
  };

  const handleFounderClick = () => {
    navigate('/register/founder');
  };

  return (
    <Layout>
      <div className='flex flex-col items-center justify-center px-6 py-20'>
        <h1 className='text-2xl sm:text-[40px] text-center font-ibm'>
          Welcome to Plantify
        </h1>
        <p className='text-gray-600 text-sm mt-4 text-center'>
          You’re successfully connected! <br />
          Now choose how you’d like to participate in our ecosystem.
        </p>

        {/* Identity */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-700 mb-2'>Your Internet Identity:</p>
          <div
            className='inline-flex items-center justify-center gap-2 
              px-4 py-3 rounded-xl 
              border border-white/20 
              bg-yellow-500 text-white font-mono text-sm font-medium
              shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]
              cursor-pointer hover:bg-yellow-600 transition-colors'
            onClick={copyToClipboard}
          >
            [{formatPrincipal(principal)}]
            {copied ? (
              <CheckCircle size={16} className='text-green-200' />
            ) : (
              <Copy size={16} />
            )}
          </div>
        </div>
      </div>

      <div className='min-h-screen bg-purple-100/50 flex flex-col items-center justify-center px-6'>
        <h1 className='text-[40px] text-gray-900 mb-8 font-ibm'>
          Choose Your Role
        </h1>

        <div
          className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl 
                   rounded-3xl overflow-hidden p-8'
          style={{
            backgroundImage: 'url(/assets/images/house.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Investor Card */}
          <div className='bg-neutral-100 backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-md'>
            <div>
              <div className='bg-white shadow-xl rounded-2xl p-6'>
                <h2 className='text-lg font-bold text-gray-900 mb-4'>
                  Investor
                </h2>
                <ul className='space-y-3 text-gray-700 text-[16px]'>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Invest in promising startups using stable currencies.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Receive monthly profit shares from startup revenues.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Engage in community governance and voting.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Begin investing with as little as $50.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Diversify across multiple sectors and startups
                  </li>
                </ul>
              </div>

              <div className='p-6'>
                <h3 className='text-sm font-medium text-gray-800 font-ibm'>
                  Requirements
                </h3>
                <ul className='text-sm bg-orange-100 text-orange-600 mt-2 space-y-1 p-4 rounded-xl border border-orange-400'>
                  <li>Valid Internet Identity.</li>
                  <li>Minimum investment capital required.</li>
                  <li>Active participation in the community.</li>
                </ul>
                <button
                  onClick={handleInvestorClick}
                  className='mt-6 w-full flex items-center justify-center gap-[6px] 
              rounded-xl border border-white/20 
              bg-neutral-950 text-white font-medium 
              py-3 px-4 
              shadow-[0_2px_4px_rgba(0,0,0,0.16),0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset] 
              transition hover:bg-neutral-900 text-[16px]'
                >
                  <ShieldCheck size={16} /> Continue as Investor
                </button>
              </div>
            </div>
          </div>

          {/* Startup Founder Card */}
          <div className='bg-neutral-100 backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-md'>
            <div>
              <div className='bg-white shadow-xl rounded-2xl p-6'>
                <h2 className='text-lg font-bold text-gray-900 mb-4'>
                  Startup Founder
                </h2>
                <ul className='space-y-3 text-gray-700 text-[16px]'>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Secure funding from community investors.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Retain complete control over your business.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Foster a supportive community of investors.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Gain access to transparent, decentralized funding.
                  </li>
                  <li className='bg-gray-100 rounded-lg px-4 py-2'>
                    Commit to a 36-month term with profit sharing.
                  </li>
                </ul>
              </div>

              <div className='p-6'>
                <h3 className='text-sm font-medium text-gray-800 font-ibm'>
                  Requirements
                </h3>
                <ul className='text-sm bg-orange-100 text-orange-600 mt-2 space-y-1 p-4 rounded-xl border border-orange-400'>
                  <li>Legal business entity required.</li>
                  <li>At least 6 months of operational history.</li>
                  <li>Stable currency collateral for 12 months.</li>
                </ul>
                <button
                  onClick={handleFounderClick}
                  className='mt-6 w-full flex items-center justify-center gap-[6px] 
              rounded-xl border border-white/20 
              bg-purple-500 text-white font-medium 
              py-3 px-4 
              shadow-[0_2px_4px_rgba(0,0,0,0.16),0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset] 
              transition hover:bg-purple-600 text-[16px]'
                >
                  <DraftingCompass size={16} /> Continue as Founder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto py-12 px-4'>
        <h2 className='text-center text-[40px] font-ibm mb-8'>
          Quick Comparison
        </h2>

        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr>
                <th className='text-left py-8 px-4 font-medium text-gray-500'>
                  Aspect
                </th>
                <th className='py-8 px-4 font-medium text-gray-900 bg-purple-50'>
                  Investor
                </th>
                <th className='py-8 px-4 font-medium text-gray-900'>
                  Startup Founder
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr>
                <td className='py-8 px-4 text-gray-600'>Investment Required</td>
                <td className='py-8 px-4 bg-purple-50'>$50+ per startup</td>
                <td className='py-8 px-4'>Collateral required</td>
              </tr>
              <tr>
                <td className='py-8 px-4 text-gray-600'>Time Commitment</td>
                <td className='py-8 px-4 bg-purple-50'>
                  Monthly voting (~1hr)
                </td>
                <td className='py-8 px-4'>Daily operations</td>
              </tr>
              <tr>
                <td className='py-8 px-4 text-gray-600'>Risk Level</td>
                <td className='py-8 px-4 bg-purple-50'>Medium (diversified)</td>
                <td className='py-8 px-4'>High (business owner)</td>
              </tr>
              <tr>
                <td className='py-8 px-4 text-gray-600'>Potential Returns</td>
                <td className='py-8 px-4 bg-purple-50'>15-60% annually</td>
                <td className='py-8 px-4'>Unlimited potential</td>
              </tr>
              <tr>
                <td className='py-8 px-4 text-gray-600'>Active Management</td>
                <td className='py-8 px-4 bg-purple-50'>Passive income focus</td>
                <td className='py-8 px-4'>Full business control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
