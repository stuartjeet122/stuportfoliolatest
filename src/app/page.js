'use client';
import ParticlesComponent from "./components/particlebg";
import Skills from "./components/skills";
import Hero from "./components/hero";
import { ParallaxProvider } from "react-scroll-parallax";
import ProjectsSection from "./components/projects";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EducationSection from './components/education';
import { Suspense } from "react";

export default function homepage(){
  return (
    <>
    <ParallaxProvider>
        <Hero />
      <ParticlesComponent />
    <div className="pt-6">
      <Skills displayCount={6}/>
    </div>
    <div className="mt-6 bg-black">
      <Suspense fallback={<div>Loading...</div>}>
      <ProjectsSection customBackground={'bg-gradient-to-b from-gray-900 to-gray-800'} viewMode="carousel" randomDisplay={true} displayCount={3}/>
      </Suspense>
    </div>
    <div className="z-50">
    <EducationSection/>
    </div>
    </ParallaxProvider>
    </>
  );
}