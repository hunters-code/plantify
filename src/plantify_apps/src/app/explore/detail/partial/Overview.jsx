import { TrendingUp } from 'lucide-react';

export default function Overview({ startup }) {
  if (!startup) {
    return (
      <div className='bg-white p-4 rounded-lg'>
        <p className='text-gray-500'>Loading startup information...</p>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-4'>
      {/* Company Overview */}
      <div className='bg-neutral-100 p-4 rounded-[16px]'>
        <h2 className='text-xl font-semibold font-ibm'>Company Overview</h2>
        <p className='text-gray-600 text-sm mt-2'>
          {startup.description || 'No company description available.'}
        </p>
        {startup.problemStatement && (
          <div className='mt-4'>
            <h3 className='text-lg font-medium font-ibm'>Problem Statement</h3>
            <p className='text-gray-600 text-sm mt-1'>
              {startup.problemStatement}
            </p>
          </div>
        )}
        {startup.solution && (
          <div className='mt-4'>
            <h3 className='text-lg font-medium font-ibm'>Solution</h3>
            <p className='text-gray-600 text-sm mt-1'>{startup.solution}</p>
          </div>
        )}
      </div>

      {/* Business Model */}
      <div className='bg-neutral-100 p-4 rounded-[16px]'>
        <h3 className='text-lg font-medium font-ibm'>Revenue Model</h3>
        <p className='text-gray-600 text-sm'>
          {startup.revenueModel || 'Revenue model information not available.'}
        </p>
        {startup.targetMarket && (
          <div className='mt-3'>
            <h4 className='text-md font-medium'>Target Market</h4>
            <p className='text-gray-600 text-sm mt-1'>{startup.targetMarket}</p>
          </div>
        )}
      </div>

      {/* Competitive Advantage */}
      <div className='bg-neutral-100 p-4 rounded-[16px]'>
        <h3 className='text-lg font-medium font-ibm'>Competitive Advantage</h3>
        {startup.competitiveAdvantage ? (
          <div className='mt-2'>
            <div className='flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm'>
              <span className='w-2 h-2 bg-green-500 rounded-full' />
              {startup.competitiveAdvantage}
            </div>
          </div>
        ) : (
          <p className='text-gray-500 text-sm mt-2'>
            No competitive advantage information available.
          </p>
        )}

        {startup.marketingStrategy && (
          <div className='mt-4'>
            <h4 className='text-md font-medium'>Marketing Strategy</h4>
            <p className='text-gray-600 text-sm mt-1'>
              {startup.marketingStrategy}
            </p>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className='bg-neutral-100 p-4 rounded-[16px]'>
        <h3 className='text-lg font-medium font-ibm'>Key Business Metrics</h3>
        <div className='grid grid-cols-2 gap-4 mt-3'>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <p className='text-sm text-gray-500'>Monthly Revenue</p>
            <p className='text-xl font-semibold font-ibm'>
              ${startup.monthlyRevenue || '0'}
            </p>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <p className='text-sm text-gray-500'>Monthly Expenses</p>
            <p className='text-xl font-semibold font-ibm'>
              ${startup.monthlyExpenses || '0'}
            </p>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <p className='text-sm text-gray-500'>Funding Goal</p>
            <p className='text-xl font-semibold font-ibm'>
              ${startup.fundingGoal || '0'}
            </p>
          </div>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <p className='text-sm text-gray-500'>Founded Year</p>
            <p className='text-xl font-semibold font-ibm'>
              {startup.foundedYear || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {(startup.useOfFunds || startup.operationalProcess) && (
        <div className='bg-neutral-100 p-4 rounded-[16px]'>
          <h3 className='text-lg font-medium font-ibm'>
            Additional Information
          </h3>
          <div className='space-y-4 mt-3'>
            {startup.useOfFunds && (
              <div className='bg-white rounded-lg p-4 shadow-sm'>
                <h4 className='font-medium'>Use of Funds</h4>
                <p className='text-sm text-gray-600 mt-1'>
                  {startup.useOfFunds}
                </p>
              </div>
            )}
            {startup.operationalProcess && (
              <div className='bg-white rounded-lg p-4 shadow-sm'>
                <h4 className='font-medium'>Operational Process</h4>
                <p className='text-sm text-gray-600 mt-1'>
                  {startup.operationalProcess}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
