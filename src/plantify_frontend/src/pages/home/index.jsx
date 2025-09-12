import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/features/Hero";
import HowItWork from "../../components/features/HowItWork";
import SupportedSectors from "../../components/features/SupportedSectors";
import FeaturedStartups from "../../components/features/FeaturedStartups";
import WhyPlantify from "../../components/features/WhyPlantify";
import Footer from "../../components/layout/Footer";

export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-900">
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
