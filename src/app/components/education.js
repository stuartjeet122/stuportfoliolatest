import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import EducationData from './educationdata';
import Image from 'next/image';

const EducationSection = ({ backgroundTransparent = false }) => {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Modal state

  // Default values for timeline styling
  const defaultValues = {
    defaultDate: 'Ongoing',
    textSizeDegree: 'lg',
    textSizeInstitution: 'md',
    textColorDescription: 'text-white',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await EducationData();
        if (data && data.length > 0) {
          setEducationData(data);
        } else {
          console.log('No education data available.');
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close modal handler
  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="text-center text-white">
        <p className="text-3xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${backgroundTransparent ? 'bg-black bg-opacity-30 backdrop-blur-sm' : 'bg-gradient-to-b from-gray-800 via-gray-900 to-black'} text-white`}>
      <p className="text-center underline font-extrabold text-5xl mb-7 pt-7 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Experience
      </p>
      <section className="relative py-10 text-white overflow-hidden min-h-[500px]">
        <VerticalTimeline lineColor="#4a4a4a" className="relative z-20">
          {educationData.length === 0 ? (
            <p className="text-center text-xl text-gray-400">No Education Data Available</p>
          ) : (
            educationData.map((edu, index) => (
              <VerticalTimelineElement
              visible={true}
                key={index}
                date={edu.graduation || defaultValues.defaultDate}
                icon={edu.icon}
                iconStyle={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                contentStyle={{
                  background: "rgba(50, 50, 70, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(2px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  padding: "20px",
                  color: "#fff",
                }}
                className="transition-transform transform hover:scale-105 hover:shadow-2xl relative z-20 rounded-lg p-7 mb-6 shadow-lg"
              >
                <h3 className={`text-${defaultValues.textSizeDegree} font-extrabold ${edu.textColorDegree || 'text-yellow-400'} transition duration-300 hover:text-white`}>
                  {edu.degree || 'Degree Not Available'}
                </h3>
                <h4 className={`text-${defaultValues.textSizeInstitution} ${edu.textColorInstitution || 'text-gray-300'} font-semibold mb-4`}>
                  {edu.institution || 'Institution Not Available'}
                </h4>
                <p className={`text-sm ${defaultValues.textColorDescription}`}>
                  {edu.description || 'No Description Available'}
                </p>
                {edu.image && (
                  <div className='flex justify-center mt-8'>
                    <Image 
                      src={edu.image} 
                      width={2500} 
                      height={2500} 
                      loading='lazy'
                      alt={`${edu.institution} image`} 
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(edu.image)} // Open modal
                    />
                  </div>
                )}
                <div className="mt-4 border-t border-gray-500 opacity-30"></div>
              </VerticalTimelineElement>
            ))
          )}
        </VerticalTimeline>
      </section>

      {/* Modal for Image Popup */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-screen-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <Image 
            loading='lazy'
              src={selectedImage} 
              width={800} 
              height={800} 
              alt="Education Image" 
              className="rounded-lg w-full h-auto"
            />
            <button className="absolute top-3 right-3 text-white text-2xl font-bold" onClick={closeModal}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
