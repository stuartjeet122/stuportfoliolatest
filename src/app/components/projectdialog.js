import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Chip,
  ThemeProvider,
  createTheme,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { fetchSkills } from "./skillfirebase";

export default function ProjectDialog({
  open,
  onClose,
  onSave,
  formValues,
  setFormValues,
  isEditMode,
}) {
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      setLoadingSkills(true);
      try {
        const fetchedSkills = await fetchSkills();
        setSkills(fetchedSkills.map((skill) => skill.name)); // Assuming skill has a `name` field
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingSkills(false);
      }
    };
    loadSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechStackChange = (event, value) => {
    setFormValues((prev) => ({ ...prev, techStack: value }));
  };

  const handleDeleteTechStack = (tech) => {
    setFormValues((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((item) => item !== tech),
    }));
  };

  const handleSave = () => {
    const { name, description, techStack, url, status } = formValues;

    if (!name.trim() || !description.trim()) return;

    onSave({
      name,
      description,
      techStack,
      url,
      status, // Make sure this is included in the save
    });
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{isEditMode ? "Edit Project" : "Add Project"}</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                label="Project Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Autocomplete
                multiple
                options={skills}
                getOptionLabel={(option) => option}
                value={formValues.techStack || []}
                onChange={handleTechStackChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tech Stack"
                    placeholder="Select skills"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingSkills ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      onDelete={() => handleDeleteTechStack(option)}
                      {...getTagProps({ index })}
                      color="primary"
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formValues.status || "Completed"} // Default to "Completed" if no value
                  onChange={handleChange} // Update status on change
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                label="Project URL (Optional)"
                name="url"
                value={formValues.url || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEditMode ? "Save Changes" : "Add Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
