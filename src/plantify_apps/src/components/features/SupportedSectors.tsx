'use client';

import React from 'react';
import { BadgeDollarSign, Leaf } from 'lucide-react';
import Image from 'next/image';

interface SectorCardProps {
    image: string;
    title: string;
    roi: string;
    note: string;
}

interface SectorItem {
    title: string;
    roi: string;
    note: string;
    image: string;
}

export function SectorCard({ image, title, roi, note }: SectorCardProps) {
    return (
        <div className='relative overflow-hidden rounded-2xl shadow-md'>
            <Image
                src={image}
                alt={title}
                width={400}
                height={403}
                className='h-[403px] w-full object-cover'
            />

            <div className='absolute bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-xl bg-white p-4 shadow-md ring-1 ring-black/5'>
                <h3 className='font-ibm text-base font-semibold text-gray-900'>
                    {title}
                </h3>

                <div className='mt-2 flex items-center gap-2 text-sm text-gray-700'>
                    <BadgeDollarSign size={16} className='shrink-0 text-emerald-600' />
                    <span className='text-[13px] text-gray-700'>{roi}</span>
                </div>

                <div className='mt-1 flex items-center gap-2 text-sm text-gray-700'>
                    <Leaf size={16} className='shrink-0 text-emerald-600' />
                    <span className='text-[13px] text-gray-700'>{note}</span>
                </div>
            </div>
        </div>
    );
}

export default function SupportedSectors() {
    const items: SectorItem[] = [
        {
            title: 'Agriculture',
            roi: '15–25% Annual Returns',
            note: 'Organic farming, greenhouse',
            image: '/assets/images/supported.png',
        },
        {
            title: 'Livestock',
            roi: '20–30% Annual Returns',
            note: 'Poultry, cattle, aquaculture',
            image: '/assets/images/supported-2.png',
        },
        {
            title: 'F&B',
            roi: '20–35% Annual Returns',
            note: 'Restaurants, catering, food production',
            image: '/assets/images/supported-3.png',
        },
        {
            title: 'Retail',
            roi: '20–30% Annual Returns',
            note: 'Physical stores, e-commerce, distribution',
            image: '/assets/images/supported-4.png',
        },
        {
            title: 'Services',
            roi: '20–35% Annual Returns',
            note: 'Workshops, salons, coworking, couriers',
            image: '/assets/images/supported-5.png',
        },
        {
            title: 'Technology',
            roi: '40–60% Annual Returns',
            note: 'Apps, SaaS, digital services',
            image: '/assets/images/supported-6.png',
        },
    ];

    return (
        <section className='relative isolate py-16 sm:py-20'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
                <h2 className='text-center font-ibm text-2xl sm:text-3xl font-semibold text-gray-900'>
                    Supported Sectors
                </h2>

                <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {items.map((it) => (
                        <SectorCard key={it.title} {...it} />
                    ))}
                </div>
            </div>
        </section>
    );
}