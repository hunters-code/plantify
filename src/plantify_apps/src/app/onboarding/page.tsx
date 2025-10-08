'use client';

import { Copy, DraftingCompass, ShieldCheck, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import Layout from '@/components/layout/Layout';
import {
  Alert,
  Button,
  Card,
  LoadingSpinner,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { principal, isAuthenticated, isRegistered, userType, isLoading } =
    useAuth();

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && isRegistered && userType) {
      if (userType === 'founder') {
        router.push('/founder');
      } else if (userType === 'investor') {
        router.push('/investor');
      }
    }
  }, [isAuthenticated, isRegistered, userType, router]);

  const formatPrincipal = (principal: string | null) => {
    if (!principal) return 'Not available';
    return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
  };

  const copyToClipboard = async () => {
    if (!principal) return;

    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleInvestorClick = () => router.push('/register/investor');
  const handleFounderClick = () => router.push('/register/founder');

  if (isLoading) {
    return (
      <Layout>
        <div className='flex flex-col items-center justify-center min-h-screen px-6 py-20'>
          <LoadingSpinner size='xl' text='Checking your registration status...' />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  if (error) {
    return (
      <Layout>
        <div className='flex flex-col items-center justify-center min-h-screen px-6 py-20'>
          <Card className='max-w-md w-full'>
            <Alert type='error' title='Connection Error' message={error}>
              <div className='flex gap-3 mt-4'>
                <Button
                  onClick={() => setError(null)}
                  variant='secondary'
                  className='flex-1 bg-red-600 text-white hover:bg-red-700'
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => setError(null)}
                  variant='secondary'
                  className='flex-1'
                >
                  Continue Anyway
                </Button>
              </div>
            </Alert>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col items-center justify-center px-6 py-20'>
        <h1 className='text-2xl sm:text-[40px] text-center font-ibm'>
          Welcome to Plantify
        </h1>
        <p className='text-gray-600 text-sm mt-4 text-center'>
          You&apos;re successfully connected! <br />
          Now choose how you&apos;d like to participate in our ecosystem.
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
          <Card className='bg-neutral-100 backdrop-blur-md flex flex-col justify-between shadow-md'>
            <div>
              <Card className='bg-white shadow-xl p-6'>
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
              </Card>

              <div className='p-6'>
                <h3 className='text-sm font-medium text-gray-800 font-ibm'>
                  Requirements
                </h3>
                <ul className='text-sm bg-orange-100 text-orange-600 mt-2 space-y-1 p-4 rounded-xl border border-orange-400'>
                  <li>Valid Internet Identity.</li>
                  <li>Minimum investment capital required.</li>
                  <li>Active participation in the community.</li>
                </ul>
                <Button
                  onClick={handleInvestorClick}
                  variant='primary'
                  className='mt-6 w-full bg-neutral-950 hover:bg-neutral-900'
                >
                  <ShieldCheck size={16} /> Continue as Investor
                </Button>
              </div>
            </div>
          </Card>

          {/* Startup Founder Card */}
          <Card className='bg-neutral-100 backdrop-blur-md flex flex-col justify-between shadow-md'>
            <div>
              <Card className='bg-white shadow-xl p-6'>
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
              </Card>

              <div className='p-6'>
                <h3 className='text-sm font-medium text-gray-800 font-ibm'>
                  Requirements
                </h3>
                <ul className='text-sm bg-orange-100 text-orange-600 mt-2 space-y-1 p-4 rounded-xl border border-orange-400'>
                  <li>Legal business entity required.</li>
                  <li>At least 6 months of operational history.</li>
                  <li>Stable currency collateral for 12 months.</li>
                </ul>
                <Button
                  onClick={handleFounderClick}
                  variant='primary'
                  className='mt-6 w-full bg-purple-500 hover:bg-purple-600'
                >
                  <DraftingCompass size={16} /> Continue as Founder
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className='max-w-7xl mx-auto py-12 px-4'>
        <h2 className='text-center text-[40px] font-ibm mb-8'>
          Quick Comparison
        </h2>

        <Table striped hover>
          <TableHead>
            <TableRow>
              <TableHeader className='py-8'>
                Aspect
              </TableHeader>
              <TableHeader className='py-8 bg-purple-50 text-gray-900'>
                Investor
              </TableHeader>
              <TableHeader className='py-8 text-gray-900'>
                Startup Founder
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className='py-8'>Investment Required</TableCell>
              <TableCell className='py-8 bg-purple-50'>$50+ per startup</TableCell>
              <TableCell className='py-8'>Collateral required</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='py-8'>Time Commitment</TableCell>
              <TableCell className='py-8 bg-purple-50'>
                Monthly voting (~1hr)
              </TableCell>
              <TableCell className='py-8'>Daily operations</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='py-8'>Risk Level</TableCell>
              <TableCell className='py-8 bg-purple-50'>Medium (diversified)</TableCell>
              <TableCell className='py-8'>High (business owner)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='py-8'>Potential Returns</TableCell>
              <TableCell className='py-8 bg-purple-50'>15-60% annually</TableCell>
              <TableCell className='py-8'>Unlimited potential</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='py-8'>Active Management</TableCell>
              <TableCell className='py-8 bg-purple-50'>Passive income focus</TableCell>
              <TableCell className='py-8'>Full business control</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
