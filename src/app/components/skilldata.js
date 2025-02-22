import { fetchSkills } from "./skillfirebase";  
import * as FaIcons from "react-icons/fa";  

export default async function Getskilldata() {
  const fetchedSkills = await fetchSkills();
  
  const formattedSkills = fetchedSkills.map((skill) => {
    const IconComponent = FaIcons[skill.icon] || FaIcons.FaQuestionCircle;

    return {
      name: skill.name,
      icon: IconComponent, // Store the component itself, not the JSX element
      proficiency: parseInt(skill.proficiency, 10),
      type: skill.type,
      color: skill.color || "text-gray-500", // Default color if none provided
    };
  });
  return formattedSkills;
}
