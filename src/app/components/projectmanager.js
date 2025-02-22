import React, { useState, useEffect } from "react";
import { Box, Typography, Button, List } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import ProjectDialog from "./projectdialog";
import ProjectCard from "./projectcard";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
} from "./projectfirebase";

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    techStack: [],
    videos: "",
    pdfs: "",
    projectimages: "",
    image: "",
    url: "",
    status: "Completed", // Default status
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        toast.error("Failed to fetch projects!");
      }
    };
    fetchData();
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormValues({
      name: "",
      description: "",
      techStack: [],
      videos: "",
      pdfs: "",
      projectimages: "",
      image: "",
      url: "",
      status: "Completed", // Reset to default status
    });
    setSelectedProjectId(null);
    setIsEditMode(false);
  };

  const handleAddProject = async (newProject) => {
    try {
      const addedProject = await addProject(newProject);
      setProjects((prev) => [...prev, addedProject]);
      toast.success("Project added successfully!");
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to add project!");
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      await updateProject(selectedProjectId, updatedProject);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProjectId ? { id: selectedProjectId, ...updatedProject } : project
        )
      );
      toast.success("Project updated successfully!");
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to update project!");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project!");
    }
  };

  return (
    <Box className="p-4 min-h-screen bg-black bg-opacity-30 text-white">
      <Toaster />
      <Typography variant="h3" align="center" gutterBottom>
        Project Manager
      </Typography>
      <div className="flex justify-center space-x-6 px-6 mb-6">
        <button
          onClick={() => {
            setOpenDialog(true);
            setIsEditMode(false);
          }}
          className="btn bg-opacity-60 bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold rounded-lg py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-500 ease-out"
        >
          Add New Project
        </button>
      </div>
      <List>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={() => handleDeleteProject(project.id)}
            onEdit={() => {
              setSelectedProjectId(project.id);
              setFormValues(project);
              setIsEditMode(true);
              setOpenDialog(true);
            }}
          />
        ))}
      </List>
      <ProjectDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSave={isEditMode ? handleEditProject : handleAddProject}
        formValues={formValues}
        setFormValues={setFormValues}
        isEditMode={isEditMode}
      />
    </Box>
  );
}
