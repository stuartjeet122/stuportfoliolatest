import { getDatabase, ref, push, update, remove, get, child } from "firebase/database";
import { db } from "../firebase";

const database = getDatabase();

export const fetchSkills = async () => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, "skills"));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map((id) => ({ id, ...data[id] }));
  } else {
    return [];
  }
};

export const addSkill = async (skill) => {
  const skillRef = ref(database, "skills");
  const newSkillRef = await push(skillRef, skill);
  return { id: newSkillRef.key, ...skill };
};

export const updateSkill = async (id, updatedSkill) => {
    try {
      const skillRef = ref(database, `skills/${id}`);
      
      await update(skillRef, updatedSkill);
    } catch (error) {
      console.error("Error updating skill:", error);
      throw error;
    }
  };
  

export const deleteSkill = async (id) => {
  const skillRef = ref(database, `skills/${id}`);
  await remove(skillRef);
};
