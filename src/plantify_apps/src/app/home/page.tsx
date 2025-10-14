// import { useState } from 'react';
import FeaturedStartups from '@/components/features/FeaturedStartups';
import Hero from '@/components/features/Hero';
import HowItWork from '@/components/features/HowItWork';
import SupportedSectors from '@/components/features/SupportedSectors';
import WhyPlantify from '@/components/features/WhyPlantify';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className='bg-white text-gray-900'>
      <Navbar />
      <Hero />
      <HowItWork />
      <SupportedSectors />
      <FeaturedStartups />
      <WhyPlantify />
      <Footer />
    </div>
  );
}
