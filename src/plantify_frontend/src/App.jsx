// import { plantify_backend } from "declarations/plantify_backend";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import HowItWork from "./components/HowItWork.jsx";
import SupportedSectors from "./components/SupportedSectors";
import FeaturedStartups, { StartupCard } from "./components/FeaturedStartups";
import WhyPlantify from "./components/WhyPlantify";
import Footer from "./components/Footer";

export default function App() {
  // const [greeting, setGreeting] = useState("");

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   const name = e.target.elements.name.value;
  //   plantify_backend.greet(name).then((g) => setGreeting(g));
  // }

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
