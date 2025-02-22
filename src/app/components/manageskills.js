import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "./skillfirebase";
import SkillCard from "./skillcard";
import SkillDialog from "./skilldialog";

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    proficiency: 0,
    type: "",
    icon: "",
    color: "",
    newType: "",
  });
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(null);

  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);
      try {
        const fetchedSkills = await fetchSkills();
        setSkills(fetchedSkills);
      } catch (error) {
        toast.error("Failed to fetch skills.");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormValues({
      name: "",
      proficiency: 0,
      type: "",
      icon: "",
      color: "",
      newType: "",
    });
    setSelectedSkillIndex(null);
    setIsEditMode(false);
  };

  const handleAddSkill = async (newSkill) => {
    try {
      const addedSkill = await addSkill(newSkill);
      setSkills((prevSkills) => [...prevSkills, addedSkill]);
      toast.success("Skill added successfully!");
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to add skill.");
    }
  };

  const handleEditSkill = async (updatedSkill) => {
    try {
      const skillToUpdate = skills[selectedSkillIndex];
      await updateSkill(skillToUpdate.id, updatedSkill);
      const updatedSkills = [...skills];
      updatedSkills[selectedSkillIndex] = updatedSkill;
      setSkills(updatedSkills);
      toast.success("Skill updated successfully!");
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to update skill.");
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
      toast.success("Skill deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete skill.");
    }
  };

  return (
    <Box className="p-4 min-h-screen bg-black bg-opacity-30 text-white">
      <Toaster />
      <Typography variant="h3" align="center" gutterBottom>
        Skill Manager
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          setOpenDialog(true);
          setIsEditMode(false);
        }}
        className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold rounded-lg py-3 text-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        Add New Skill
      </Button>
      {loading ? (
        <div className="flex justify-center items-center mt-8">
          <CircularProgress />
        </div>
      ) : (
        <List>
        {skills.length === 0 ? (
          <Typography variant="h6" color="white" align="center">
            No skills found!
          </Typography>
        ) : (
          skills.map((skill, index) => (
            <SkillCard
            key={skill.id || skill.name}
              skill={skill}
              onDelete={handleDeleteSkill}
              onEdit={() => {
                setSelectedSkillIndex(index);
                setFormValues(skill);
                setIsEditMode(true);
                setOpenDialog(true);
              }}
            />
          ))
        )}
      </List>
      
      )}
      <SkillDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSave={isEditMode ? handleEditSkill : handleAddSkill}
        formValues={formValues}
        setFormValues={setFormValues}
        isEditMode={isEditMode}
      />
    </Box>
  );
}
