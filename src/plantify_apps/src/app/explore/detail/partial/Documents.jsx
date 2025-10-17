import { AlertTriangle, FileText, Eye, Copy } from 'lucide-react';
import PropTypes from 'prop-types';

import { Alert } from '@/components/ui';

export default function Documents({ startup }) {
  if (!startup) {
    return (
      <div className='max-w-2xl mt-8 bg-white p-4 rounded-lg'>
        <p className='text-gray-500'>Loading documents...</p>
      </div>
    );
  }

  const hasBusinessPlan =
    startup.businessPlan &&
    (typeof startup.businessPlan === 'string'
      ? startup.businessPlan.trim() !== ''
      : Object.keys(startup.businessPlan).length > 0);

  const hasLegalDocuments =
    startup.legalDocuments &&
    (typeof startup.legalDocuments === 'string'
      ? startup.legalDocuments.trim() !== ''
      : Object.keys(startup.legalDocuments).length > 0);

  const hasFinancialProjections =
    startup.financialProjections &&
    (typeof startup.financialProjections === 'string'
      ? startup.financialProjections.trim() !== ''
      : Object.keys(startup.financialProjections).length > 0);

  const hasDocuments =
    hasBusinessPlan || hasLegalDocuments || hasFinancialProjections;

  const hasWebsite =
    startup.website &&
    typeof startup.website === 'string' &&
    startup.website.trim() !== '';

  return (
    <div className='max-w-2xl mt-8 bg-neutral-100 p-4 rounded-[16px]'>
      <h2 className='text-xl font-semibold text-gray-900 font-ibm'>
        Documents & Resources
      </h2>

      <Alert
        type='warning'
        message={
          <>
            <span className='font-medium text-orange-600'>Important</span>
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
              <Copy className='w-6 h-6 mt-1' />
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
                <div className='border border-neutral-200' />
                <div className='mt-2 flex gap-4 text-xs font-medium'>
                  <a
                    href={startup.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-purple-600 hover:underline'
                  >
                    <Eye size={14} /> Preview
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
            {hasBusinessPlan && (
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
                    <div className='border border-neutral-200' />
                    <div className='mt-2 flex gap-4 text-xs font-medium'>
                      <a
                        href={
                          typeof startup.businessPlan === 'object'
                            ? startup.businessPlan.previewUrl ||
                              startup.businessPlan.downloadUrl
                            : startup.businessPlan
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-purple-600 hover:underline cursor-pointer'
                      >
                        <Eye size={14} /> Preview
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Documents */}
            {hasLegalDocuments && (
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
                    <div className='border border-neutral-200' />
                    <div className='mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-medium'>
                      {Array.isArray(startup.legalDocuments) ? (
                        startup.legalDocuments.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.previewUrl || doc.downloadUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1 text-purple-600 hover:underline cursor-pointer'
                          >
                            <Eye size={14} />{' '}
                            {doc.name || `Document ${index + 1}`}
                          </a>
                        ))
                      ) : (
                        <a
                          href={
                            typeof startup.legalDocuments === 'object'
                              ? startup.legalDocuments.previewUrl ||
                                startup.legalDocuments.downloadUrl
                              : startup.legalDocuments
                          }
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 text-purple-600 hover:underline cursor-pointer'
                        >
                          <Eye size={14} /> Preview
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Projections */}
            {hasFinancialProjections && (
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
                    <div className='border border-neutral-200' />
                    <div className='mt-2 flex gap-4 text-xs font-medium'>
                      <a
                        href={
                          typeof startup.financialProjections === 'object'
                            ? startup.financialProjections.previewUrl ||
                              startup.financialProjections.downloadUrl
                            : startup.financialProjections
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-purple-600 hover:underline cursor-pointer'
                      >
                        <Eye size={14} /> Preview
                      </a>
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
    </div>
  );
}

Documents.propTypes = {
  startup: PropTypes.shape({
    id: PropTypes.string,
    startupName: PropTypes.string,
    website: PropTypes.string,
    businessPlan: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    legalDocuments: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    financialProjections: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }),
};
