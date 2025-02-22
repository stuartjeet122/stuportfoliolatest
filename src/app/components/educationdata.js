import * as FaIcons from 'react-icons/fa'; // Import all FaIcons
import React from 'react'; // Import React for createElement
import { fetchEducationSorted } from './projectfirebase'; // Ensure this fetch function works correctly

export default async function EducationData() {
  try {
    const educationData = await fetchEducationSorted(); // Fetch data from Firebase

    // Format fetched data
    const formattedEducationData = educationData.map((education) => {
      const IconComponent = FaIcons[education.icon] || FaIcons.FaGraduationCap; // Default icon if not found

      return {
        institution: education.institution || 'Unknown Institution',
        degree: education.degree || 'Unknown Degree',
        description: education.description || 'No description available.',
        graduation: education.graduation || 'Graduation status not provided.',
        icon: React.createElement(IconComponent, { size: 40, className: "animate-bounce" }), // Create icon dynamically
        textColorDegree: education.degreeColor || 'text-gray-400',
        textColorInstitution: education.instituteColor || 'text-gray-300',
        order: education.order || 1,
        image: education.image?.secure_url || '',
      };
    });
    return formattedEducationData;
  } catch (error) {
    console.error('Error fetching education data:', error);
    throw error;
  }
}
