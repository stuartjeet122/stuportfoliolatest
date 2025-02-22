import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { Parallax } from "react-scroll-parallax";
import ContactPopup from "./contactmeform";
import Threejs from '../components/threejs';
import { Canvas } from '@react-three/fiber';

export default function Hero() {
    return (
        <div className="bg-gradient-to-b from-[#3c464d] to-[#141f37]">
            <div className="hero-container min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                    loading='lazy'
                        src="/heroimg.webp"
                        alt="Stuart Jeetoo"
                        fill
                        objectFit="cover"
                        objectPosition="bottom"
                        className="opacity-30 transform transition-transform hover:scale-150 duration-700"
                    />
                </div>

                {/* Hero Text */}
                <div className="z-10 text-center space-y-6 px-4 md:px-0">
                    <Parallax translateY={[-20, 20]}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-snug">
                            <span className="block">Hi, I&apos;m </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 animate-gradient-x">
                                Stuart Jeetoo
                            </span>
                        </h1>
                    </Parallax>

                    <Parallax translateY={[-10, 10]}>
                    <div className="text-xl md:text-3xl lg:text-4xl text-gray-300 font-light">
    <Typewriter
        words={[
            "Web Developer", 
            "Creative Coder", 
            "Backend Lover", 
            "Frontend Developer", 
            "Full Stack Developer", 
            "Software Engineering Graduate", 
            "Passionate Learner",
            "Tech Enthusiast"
        ]}
        loop={true}
        deleteSpeed={75}
        typeSpeed={110}
        delaySpeed={500}
        cursorBlinking
        cursorColor="white"
        cursor={true}
    />
</div>

                    </Parallax>

                    <Parallax translateY={[-15, 15]}>
                        <ContactPopup />
                    </Parallax>
                </div>
            </div>

            {/* About Section */}
            <Parallax scale={[0.80, 1]}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-black bg-opacity-40 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 lg:p-16 border border-white border-opacity-20">
                    {/* Left Section (Text Content) */}
                    <div className="rounded-2xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8 lg:py-16 text-white lg:col-span-2 space-y-6 md:space-y-8">
                        <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            About Me
                        </p>
                        <p className="leading-relaxed text-gray-300 text-lg md:text-xl lg:text-2xl font-light">
                            I am a web developer with a passion for crafting visually appealing and interactive websites. With a strong background in both frontend and backend technologies, I specialize in delivering seamless user experiences that are both functional and beautiful.
                        </p>
                    </div>

                    {/* Right Section (3D Model) */}
                    <div className="flex justify-center items-center lg:col-span-1">
                        <div className="w-full h-full max-w-xs md:max-w-sm lg:max-w-md rounded-2xl bg-[#212b3e] bg-opacity-20 p-4 shadow-lg border border-white border-opacity-30 transform hover:scale-105 transition-transform duration-300 ease-in-out backdrop-blur-md">
                            <Canvas>
                                <Threejs path="/models/portfolio.fbx" />
                            </Canvas>
                        </div>
                    </div>
                </div>
            </Parallax>
        </div>
    );
}
