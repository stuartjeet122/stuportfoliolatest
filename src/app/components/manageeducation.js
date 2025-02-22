import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import EducationDialog from "./educationdialog";
import EducationCard from "./educationcard";
import {
  addEducationToProject,
  fetchEducationSorted,
  updateEducationInProject,
} from "./projectfirebase";

const ManageEducation = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    institution: "",
    degree: "",
    description: "",
    graduation: "",
    order: 1,
  });
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch education list on component mount
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const sortedEducation = await fetchEducationSorted();
        setEducationList(sortedEducation);
        console.log(sortedEducation); // Ensure it's fetching correctly
      } catch (error) {
        console.error("Error fetching education data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditMode(false);
    setFormValues({
      institution: "",
      degree: "",
      description: "",
      graduation: "",
      order: 1,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveEducation = async (newEducation) => {
    try {
      if (isEditMode) {
        await updateEducationInProject(formValues.id, newEducation);
        setEducationList((prevList) =>
          prevList.map((item) =>
            item.id === formValues.id ? { ...item, ...newEducation } : item
          )
        );
      } else {
        const educationId = await addEducationToProject(newEducation);
        setEducationList((prevList) => [...prevList, { ...newEducation, id: educationId }]);
      }
      setOpenDialog(false);
      // Refresh the education data after adding/updating
      await fetchEducationSorted();
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const handleEditEducation = (education) => {
    setFormValues(education);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleRemoveImageFromEducation = async (educationId) => {
    // Removing image functionality, after removal, refresh the list
    try {
      await fetchEducationSorted(); // Refresh the list after removing an image
    } catch (error) {
      console.error("Error fetching education data after removing image:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-center my-6">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '50px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: 'linear-gradient(90deg, #2a5298, #1e3c72)',
            },
          }}
        >
          Add Education
        </Button>
      </div>
  
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
          <Typography variant="h6" ml={2} color="white">
            Loading Education Data...
          </Typography>
        </Box>
      ) : (
        <div className="education-list">
          {educationList.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
              onEdit={() => handleEditEducation(education)}
              onRemoveImage={handleRemoveImageFromEducation} 
            />
          ))}
        </div>
      )}
  
      <EducationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveEducation}
        formValues={formValues}
        setFormValues={setFormValues}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default ManageEducation;
