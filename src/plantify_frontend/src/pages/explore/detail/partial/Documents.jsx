import { AlertTriangle, FileText, Eye, Download } from 'lucide-react';
import { Alert, Button, Card } from '../../../../components/ui';

export default function Documents() {
  return (
    <Card className='max-w-2xl mt-8 bg-neutral-100'>
      <h2 className='text-xl font-semibold text-gray-900 font-ibm'>
        Official Documents
      </h2>

      <Alert
        type='warning'
        message={
          <>
            <span className='font-medium text-orange-600'>Important</span> <br />
            All documents are verified and audited. Access is provided for due
            diligence purposes.
          </>
        }
        className='mt-4'
        icon={<AlertTriangle className='text-orange-600 w-5 h-5 mt-0.5 shrink-0' />}
      />

      <div className='mt-6 space-y-4'>
        <Card>
          <div className='flex items-start gap-3 w-full'>
            <FileText className='w-6 h-6 text-gray-700 mt-1' />
            <div className='w-full'>
              <div className='flex justify-between w-full mb-2'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900'>
                    EcoFarm Solutions - Business Plan 2024-2027
                  </h3>
                  <p className='text-xs text-gray-500'>
                    45 pages · 2.4 MB · Last update: August 2024
                  </p>
                </div>
                <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium'>
                  Business Plan
                </span>
              </div>

              <hr />

              <div className='mt-2 flex gap-4 text-xs font-medium'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-1 text-purple-600 hover:underline p-0 h-auto'
                >
                  <Eye size={14} /> Preview
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-1 text-purple-600 hover:underline p-0 h-auto'
                >
                  <Download size={14} /> Download
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-start gap-3 w-full'>
            <FileText className='w-6 h-6 text-gray-700 mt-1' />
            <div className='w-full'>
              <div className='flex justify-between w-full mb-2'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900'>
                    Audited Financial Report Q2 2024
                  </h3>
                  <p className='text-xs text-gray-500'>
                    24 pages · 1.8 MB · Last update: July 2024
                  </p>
                </div>
                <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium'>
                  Financial Statements
                </span>
              </div>

              <hr />

              <div className='mt-2 flex gap-4 text-xs font-medium'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-1 text-purple-600 hover:underline p-0 h-auto'
                >
                  <Eye size={14} /> Preview
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-1 text-purple-600 hover:underline p-0 h-auto'
                >
                  <Download size={14} /> Download
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
