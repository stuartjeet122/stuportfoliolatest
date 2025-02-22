import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  FormControl,
  Autocomplete,
} from "@mui/material";
import * as FaIcons from "react-icons/fa";

// Icon list
const iconList = Object.entries(FaIcons).map(([key, Icon]) => ({
  name: key,
  component: <Icon />,
}));

// Expanded Tailwind color palette
const tailwindColors = [
  "text-red-500",
  "text-red-400",
  "text-red-300",
  "text-blue-500",
  "text-blue-400",
  "text-blue-300",
  "text-green-500",
  "text-green-400",
  "text-green-300",
  "text-yellow-500",
  "text-yellow-400",
  "text-yellow-300",
  "text-purple-500",
  "text-purple-400",
  "text-purple-300",
  "text-pink-500",
  "text-pink-400",
  "text-pink-300",
  "text-gray-500",
  "text-gray-400",
  "text-gray-300",
  "text-indigo-500",
  "text-indigo-400",
  "text-indigo-300",
  "text-teal-500",
  "text-teal-400",
  "text-teal-300",
  "text-cyan-500",
  "text-cyan-400",
  "text-cyan-300",
  "text-orange-500",
  "text-orange-400",
  "text-orange-300",
  "text-emerald-500",
  "text-emerald-400",
  "text-emerald-300",
  "text-lime-500",
  "text-lime-400",
  "text-lime-300",
  "text-amber-500",
  "text-amber-400",
  "text-amber-300",
  "text-rose-500",
  "text-rose-400",
  "text-rose-300",
  "text-sky-500",
  "text-sky-400",
  "text-sky-300",
];

export default function SkillDialog({
  open,
  onClose,
  onSave,
  formValues,
  setFormValues,
  isEditMode,
}) {
  const [isNewType, setIsNewType] = useState(false);

  // Existing types list
  const existingTypes = ["Frontend", "Backend", "UI/UX"];
  const options = ["New Type", ...existingTypes];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { name, proficiency, type, icon, color, newType } = formValues;
    const finalType = isNewType ? newType : type;

    if (
      !name.trim() ||
      !finalType.trim() ||
      !icon.trim() ||
      !color.trim() ||
      proficiency < 0 ||
      proficiency > 100
    ) {
      return;
    }

    onSave({ name, proficiency, type: finalType, icon, color });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditMode ? "Edit Skill" : "Add Skill"}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              label="Skill Name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="Proficiency"
              type="number"
              name="proficiency"
              value={formValues.proficiency}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <Autocomplete
                value={formValues.type}
                onChange={(e, newValue) => {
                  setFormValues((prev) => ({ ...prev, type: newValue }));
                  setIsNewType(newValue === "New Type");
                }}
                options={options}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
            </FormControl>
          </Grid>
          {isNewType && (
            <Grid item>
              <TextField
                label="Enter New Type"
                name="newType"
                value={formValues.newType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          )}
          <Grid item>
            <FormControl fullWidth>
              <Autocomplete
                options={iconList}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props; // Extract 'key'
                  return (
                    <li key={key} {...restProps}>
                      {option.component} {option.name}
                    </li>
                  );
                }}
                onChange={(e, newValue) =>
                  setFormValues((prev) => ({ ...prev, icon: newValue?.name }))
                }
                renderInput={(params) => <TextField {...params} label="Icon" />}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <Autocomplete
                options={tailwindColors}
                value={formValues.color}
                onChange={(e, newValue) =>
                  setFormValues((prev) => ({ ...prev, color: newValue }))
                }
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps} className={option}>
                      {option}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField {...params} label="Color" />}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {isEditMode ? "Save Changes" : "Add Skill"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
