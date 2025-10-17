import { AlertTriangle, FileText, ExternalLink, Globe } from 'lucide-react';

import { Alert, Card } from '../../../../components/ui';

export default function Documents({ startup }) {
  if (!startup) {
    return (
      <div className='max-w-2xl mt-8 bg-white p-4 rounded-lg'>
        <p className='text-gray-500'>Loading documents...</p>
      </div>
    );
  }

  const hasDocuments =
    startup.businessPlan?.length > 0 ||
    startup.legalDocuments?.length > 0 ||
    startup.financialProjections?.length > 0;

  const hasWebsite = startup.website && startup.website.trim() !== '';
  return (
    <Card className='max-w-2xl mt-8 bg-white'>
      <h2 className='text-xl font-semibold text-gray-900 font-ibm'>
        Documents & Resources
      </h2>

      <Alert
        type='warning'
        message={
          <>
            <span className='font-medium text-orange-600'>Important</span>{' '}
            <br />
            All documents are verified and audited. Access is provided for due
            diligence purposes.
          </>
        }
        className='mt-4'
        icon={
          <AlertTriangle className='text-orange-600 w-5 h-5 mt-0.5 shrink-0' />
        }
      />

      {/* Website Link */}
      {hasWebsite && (
        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-3'>
            Company Website
          </h3>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
            <div className='flex items-start gap-3 w-full'>
              <Globe className='w-6 h-6 text-blue-600 mt-1' />
              <div className='w-full'>
                <div className='flex justify-between w-full mb-2'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>
                      {startup.startupName} Official Website
                    </h3>
                    <p className='text-xs text-gray-500'>{startup.website}</p>
                  </div>
                  <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-blue-100 text-blue-700 text-xs px-2.5 py-1 font-medium'>
                    Website
                  </span>
                </div>
                <hr />
                <div className='mt-2 flex gap-4 text-xs font-medium'>
                  <a
                    href={startup.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-purple-600 hover:underline'
                  >
                    <ExternalLink size={14} /> Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className='mt-6 space-y-4'>
        {hasDocuments ? (
          <>
            {/* Business Plan */}
            {startup.businessPlan && startup.businessPlan.length > 0 && (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                <div className='flex items-start gap-3 w-full'>
                  <FileText className='w-6 h-6 text-gray-700 mt-1' />
                  <div className='w-full'>
                    <div className='flex justify-between w-full mb-2'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Business Plan - {startup.startupName}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          Business plan document
                        </p>
                      </div>
                      <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-green-100 text-green-700 text-xs px-2.5 py-1 font-medium'>
                        Business Plan
                      </span>
                    </div>
                    <hr />
                    <div className='mt-2'>
                      <p className='text-xs text-gray-600'>
                        {startup.businessPlan[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Documents */}
            {startup.legalDocuments && startup.legalDocuments.length > 0 && (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                <div className='flex items-start gap-3 w-full'>
                  <FileText className='w-6 h-6 text-gray-700 mt-1' />
                  <div className='w-full'>
                    <div className='flex justify-between w-full mb-2'>
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Legal Documents
                        </h3>
                        <p className='text-xs text-gray-500'>
                          Legal documentation and compliance
                        </p>
                      </div>
                      <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-red-100 text-red-700 text-xs px-2.5 py-1 font-medium'>
                        Legal
                      </span>
                    </div>
                    <hr />
                    <div className='mt-2'>
                      <p className='text-xs text-gray-600'>
                        {startup.legalDocuments[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Projections */}
            {startup.financialProjections &&
              startup.financialProjections.length > 0 && (
                <div className='flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-start gap-3 w-full'>
                    <FileText className='w-6 h-6 text-gray-700 mt-1' />
                    <div className='w-full'>
                      <div className='flex justify-between w-full mb-2'>
                        <div>
                          <h3 className='text-sm font-medium text-gray-900'>
                            Financial Projections
                          </h3>
                          <p className='text-xs text-gray-500'>
                            Financial forecasts and projections
                          </p>
                        </div>
                        <span className='h-fit mt-3 sm:mt-0 inline-flex rounded-lg bg-blue-100 text-blue-700 text-xs px-2.5 py-1 font-medium'>
                          Financial
                        </span>
                      </div>
                      <hr />
                      <div className='mt-2'>
                        <p className='text-xs text-gray-600'>
                          {startup.financialProjections[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className='text-center py-8'>
            <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>
              No documents available at this time.
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              Documents will be uploaded as they become available.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
