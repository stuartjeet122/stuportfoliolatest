import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesComponent = () => {
  const particlesInit = async (main) => {
    // this loads the tsparticles package bundle
    await loadFull(main);
  };

  const particlesOptions = {
    fullScreen: {
      enable: true, // enable fullscreen mode
      zIndex: -1, // make sure it's rendered behind your content
    },
    background: {
      color: {
        value: "transparent", // Set to transparent to allow the image to show through
      },
    },
    particles: {
      number: {
        value: 100, // number of particles
        density: {
          enable: true,
          area: 800, // adjust based on screen size
        },
      },
      move: {
        enable: true,
        speed: 2, // adjust the speed for parallax effect
        parallax: {
          enable: true, // enable parallax
          smooth: 10, // adjust this value to control the intensity of the parallax
        },
      },
      size: {
        value: 3,
      },
      shape: {
        type: 'circle', // You can set different shapes (circle, square, etc.)
      },
      opacity: {
        value: 0.5,
      },
      color: {
        value: "#ffffff", // Particle color set to white for contrast
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse', // optional interactivity, repulse effect on hover
        },
      },
    },
  };

  return (
    <div style={{ position: 'fixed', zIndex: -100, width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
      <div
        style={{
          position: 'fixed', // Keep the background fixed
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: "url('/bg.jpg')", // Replace with your image URL
          backgroundSize: 'cover', // Cover the entire area
          backgroundPosition: 'center', // Center the image
          zIndex: -100, // Ensure it's behind the particles
        }}
      />
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    </div>
  );
};

export default ParticlesComponent;
