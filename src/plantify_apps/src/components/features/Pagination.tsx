'use client';

export default function Pagination() {
    return (
        <div className='flex items-center justify-center gap-2 mt-10 text-sm'>
            {/* Previous */}
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-neutral-100 shadow hover:bg-gray-100'>
                ‹
            </button>

            {/* Pages */}
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-purple-500 text-white font-medium shadow'>
                1
            </button>
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-neutral-100 hover:bg-gray-100 shadow'>
                2
            </button>
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-neutral-100 hover:bg-gray-100 shadow'>
                3
            </button>
            <span className='w-10 h-10 flex items-center justify-center text-gray-500'>
                …
            </span>
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-neutral-100 hover:bg-gray-100 shadow'>
                17
            </button>

            {/* Next */}
            <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-neutral-100 shadow hover:bg-gray-100'>
                ›
            </button>
        </div>
    );
}
