import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Getskilldata from '../components/skilldata';

export default function Skills({ displayCount = 3, showProgressBar = false, loadMore = false, showSearchBar = false }) {
    const [skillsData, setSkillsData] = useState([]);
    const [visibleSkills, setVisibleSkills] = useState(displayCount);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [loading, setLoading] = useState(true);  // State to manage loading status

    // Fetch skills data once the component is mounted
    useEffect(() => {
        const fetchSkillsData = async () => {
            setLoading(true);  // Set loading to true before fetching data
            const fetchedData = await Getskilldata();
            setSkillsData(fetchedData);
            setLoading(false);  // Set loading to false once data is fetched
        };
        fetchSkillsData();
    }, []);

    const uniqueTypes = [...new Set(skillsData.map(skill => skill.type))];

    const filteredSkills = skillsData.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || skill.type === selectedType;
        return matchesSearch && matchesType;
    });

    const handleLoadMore = () => {
        setVisibleSkills(prev => Math.min(prev + 3, filteredSkills.length));
    };

    return (
        <div 
            className="container mx-auto mt-10 p-8 rounded-lg" 
            style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backgroundImage: 'linear-gradient(to right, rgba(75, 85, 99, 0.3), rgba(31, 41, 55, 0.3))',
            }}
        >
            <h1 className="text-5xl font-extrabold text-white text-center mb-8 drop-shadow-lg">Skills</h1>
            
            <div className="flex justify-center mb-8">
                <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)} 
                    className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="All">All</option>
                    {uniqueTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Search Bar */}
            {showSearchBar && (
                <div className="flex justify-center mb-8">
                    <input 
                        type="text" 
                        placeholder="Search by skill name..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full md:w-2/3 lg:w-1/2 p-4 rounded-full bg-gray-800 text-white placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300"
                    />
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="text-white text-xl mr-4">Loading Skills...</div>
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-teal-500 border-gray-200"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSkills.slice(0, visibleSkills).map((skill) => {
                        const { proficiency, name, icon: IconComponent, color } = skill;  // Destructure the color as well

                        return (
                            <div key={name} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-md">
                                <div className="mb-4 transition-transform transform hover:rotate-12 text-8xl">
                                    <IconComponent className={color} />  {/* Apply the color dynamically */}
                                </div>
                                <h2 className="text-xl font-semibold text-white text-center mb-2">{name}</h2>
                                {showProgressBar && (
                                    <div className="mt-4 w-full">
                                        <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                style={{
                                                    width: `${proficiency}%`,
                                                    backgroundColor: '#4ade80',
                                                    height: '100%',
                                                }}
                                                className="absolute top-0 left-0 h-full rounded-full"
                                            ></div>
                                        </div>
                                        <div className="text-sm text-white text-center mt-1">{proficiency}%</div>
                                    </div>
                                )}
                                <Link prefetch={true} href={`/project?skill=${name.toLowerCase()}`}>
                                    <p className="text-teal-400 mt-4 cursor-pointer underline hover:text-teal-200">
                                        View Project
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {loadMore && visibleSkills < filteredSkills.length && (
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={handleLoadMore} 
                        className="bg-gradient-to-r from-teal-500 to-green-400 hover:from-green-400 hover:to-teal-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Load More
                    </button>
                </div>
            )}

            {visibleSkills < filteredSkills.length && !showSearchBar && (
                <div className="flex justify-center mt-8">
                    <Link prefetch={true} href="/skills">
                        <button className="relative inline-flex items-center justify-center p-4 text-lg font-bold text-white transition-all duration-300 bg-gray-800 rounded-full shadow-lg group overflow-hidden hover:bg-opacity-80">
                            <span className="absolute w-0 h-0 transition-all duration-300 bg-blue-950 rounded-full group-hover:w-48 group-hover:h-48"></span>
                            <span className="absolute w-0 h-0 transition-all duration-300 bg-teal-500 rounded-full group-hover:w-48 group-hover:h-48 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"></span>
                            <span className="relative z-10">View All Skills</span>
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
