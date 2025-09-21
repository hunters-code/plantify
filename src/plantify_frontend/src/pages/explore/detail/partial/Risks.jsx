import { AlertTriangle } from 'lucide-react';
import { Alert, Card } from '../../../../components/ui';

export default function Risks() {
  return (
    <div className='max-w-3xl mt-8 space-y-8'>
      {/* Risk Assessment */}
      <Card className='bg-neutral-100'>
        <h2 className='text-lg font-semibold text-gray-900 font-ibm'>
          Risk Assessment
        </h2>

        <Alert
          type='warning'
          message='Moderate Risk'
          className='mt-4'
          icon={<AlertTriangle className='text-orange-600 w-5 h-5 shrink-0' />}
        />

        <div className='mt-6 space-y-5'>
          <Card>
            <h3 className='text-sm font-semibold text-black'>
              Weather Dependency
            </h3>
            <p className='text-sm text-gray-600 mt-0.5'>
              <span className='font-semibold text-black'>
                Mitigation Strategy:{' '}
              </span>
              <br />
              Controlled greenhouse environment and weather monitoring systems
            </p>
          </Card>
          <Card>
            <h3 className='text-sm font-semibold text-black'>
              Market Competition
            </h3>
            <p className='text-sm text-gray-600 mt-0.5'>
              <span className='font-semibold text-sm text-black'>
                Mitigation Strategy:{' '}
              </span>
              <br />
              Strong IP protection and established customer relationships
            </p>
          </Card>
        </div>
      </Card>

      {/* General Investment Risks */}
      <Card className='bg-neutral-100'>
        <h2 className='text-lg font-semibold text-gray-900 font-ibm'>
          General Investment Risks
        </h2>

        <Card className='mt-4'>
          <h3 className='text-sm font-medium text-gray-900'>
            Investment Risks Include:
          </h3>
          <ul className='mt-2 list-disc list-inside text-sm text-gray-700 space-y-1'>
            <li>36-month lock period – no early exit</li>
            <li>Returns depend on business performance</li>
            <li>No guaranteed profit sharing</li>
            <li>Potential loss of principal investment</li>
            <li>Market volatility impact</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}
