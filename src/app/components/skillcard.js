import React from "react";
import { Delete } from "@mui/icons-material";
import * as Icons from "react-icons/fa"; // Import FontAwesome icons from react-icons

export default function SkillCard({ skill, onDelete, onEdit }) {
  const SkillIcon = Icons[skill.icon]; // Dynamically access the icon

  return (
    <div
      className="my-6 p-6 bg-black bg-opacity-20 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-transform cursor-pointer group"
      onClick={onEdit}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-black bg-opacity-20 rounded-full shadow-md">
            {SkillIcon ? (
              <SkillIcon className={`text-4xl ${skill.color}`} />
            ) : (
              <span className="text-gray-500 text-4xl">?</span> // Fallback if icon not found
            )}
          </div>
          <div>
            <h5 className="text-white text-xl font-bold group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </h5>
            <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
              Proficiency: <span className="font-medium">{skill.proficiency}%</span>
            </p>
            <p className="text-gray-400 text-sm">Type: {skill.type}</p>
          </div>
        </div>
        <button
          className="text-red-400 hover:text-red-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(skill.id);
          }}
        >
          <Delete />
        </button>
      </div>
    </div>
  );
}

export function SkillCardList({ skills, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {skills.map((skill) => (
        <div key={skill.id}>
          <SkillCard skill={skill} onDelete={onDelete} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
}
