import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import * as FaIcons from "react-icons/fa"; // Import all FontAwesome icons

export default function EducationDialog({
  open,
  onClose,
  onSave,
  formValues,
  setFormValues,
  isEditMode,
}) {
  // Update form field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle icon selection
  const handleIconChange = (event, newValue) => {
    setFormValues((prev) => ({ ...prev, icon: newValue }));
  };

  // Handle color selection for Degree and Institute
  const handleColorChange = (field) => (event, newValue) => {
    setFormValues((prev) => ({ ...prev, [field]: newValue }));
  };

  // Validate and save form data
  const handleSave = () => {
    const { institution, degree, description, graduation, order, icon, degreeColor, instituteColor } = formValues;
    if (!institution.trim() || !degree.trim() || !description.trim()) return;
    onSave({ institution, degree, description, graduation, order, icon, degreeColor, instituteColor });
  };

  // Extract icon options and ensure valid filtering
  const iconOptions = Object.keys(FaIcons).filter((name) => name.startsWith("Fa"));

  const tailwindColors = [
    'text-red-500', 'text-red-600', 'text-red-700',
    'text-green-500', 'text-green-600', 'text-green-700',
    'text-blue-500', 'text-blue-600', 'text-blue-700',
    'text-yellow-500', 'text-yellow-600', 'text-yellow-700',
    'text-purple-500', 'text-purple-600', 'text-purple-700',
    'text-pink-500', 'text-pink-600', 'text-pink-700',
    'text-gray-500', 'text-gray-600', 'text-gray-700',
    'text-indigo-500', 'text-indigo-600', 'text-indigo-700',
    'text-teal-500', 'text-teal-600', 'text-teal-700',
    'text-orange-500', 'text-orange-600', 'text-orange-700',
    'text-cyan-500', 'text-cyan-600', 'text-cyan-700',
    'text-lime-500', 'text-lime-600', 'text-lime-700',
    'text-emerald-500', 'text-emerald-600', 'text-emerald-700',
    'text-fuchsia-500', 'text-fuchsia-600', 'text-fuchsia-700',
    'text-rose-500', 'text-rose-600', 'text-rose-700',
    'text-violet-500', 'text-violet-600', 'text-violet-700',
    'text-sky-500', 'text-sky-600', 'text-sky-700',
    'text-amber-500', 'text-amber-600', 'text-amber-700',
  ];

  return (
    <div className={`fixed inset-0 flex justify-center items-center z-50 ${open ? "block" : "hidden"}`}>
      <div className="bg-black bg-opacity-40 w-full h-full absolute" onClick={onClose}></div>
      <div className="relative w-96 max-h-[90vh] overflow-y-auto bg-black bg-opacity-30 rounded-lg p-8 backdrop-blur-lg shadow-lg border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl text-white mb-4 font-semibold">
          {isEditMode ? "Edit Education" : "Add Education"}
        </h2>

        <div className="space-y-6">
          {/* Text Fields */}
          {["institution", "degree", "description", "graduation", "order"].map((field) => (
            <div key={field}>
              <label className="text-white block mb-2 font-medium" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formValues[field] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          {/* Icon Dropdown */}
          <div>
            <label className="text-white block mb-2 font-medium">Select an Icon</label>
            <Autocomplete
              options={iconOptions}
              getOptionLabel={(option) => option.replace(/^Fa/, "")} // Remove "Fa" prefix for display
              value={formValues.icon || ""}
              onChange={handleIconChange}
              renderOption={(props, option) => {
                const IconComponent = FaIcons[option];
                return (
                  <li {...props} key={option} className="flex items-center space-x-3">
                    <IconComponent className="text-2xl text-gray-300" />
                    <span>{option.replace(/^Fa/, "")}</span>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search for an icon"
                  sx={{
                    input: { color: 'white' },
                    fieldset: { borderColor: 'gray' },
                  }}
                />
              )}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 8 }}
            />
          </div>

          {/* Degree Color Dropdown */}
          <div>
            <label className="text-white block mb-2 font-medium">Select Degree Text Color</label>
            <Autocomplete
              options={tailwindColors}
              getOptionLabel={(option) => option.replace('text-', '')} // Remove 'text-' prefix for display
              value={formValues.degreeColor || ""}
              onChange={handleColorChange("degreeColor")}
              renderOption={(props, option) => (
                <li {...props} key={option} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${option}`} style={{ border: "1px solid #fff" }}></div> {/* Color preview */}
                  <span>{option.replace('text-', '')}</span>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select Degree Color"
                  sx={{
                    input: { color: 'white' },
                    fieldset: { borderColor: 'gray' },
                  }}
                />
              )}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 8 }}
            />
            {/* Display Degree Color Preview */}
            {formValues.degreeColor && (
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${formValues.degreeColor}`} style={{ border: '1px solid white' }}></div>
                <span className="text-white">{formValues.degreeColor.replace('text-', '')}</span>
              </div>
            )}
          </div>

          {/* Institute Color Dropdown */}
          <div>
            <label className="text-white block mb-2 font-medium">Select Institute Text Color</label>
            <Autocomplete
              options={tailwindColors}
              getOptionLabel={(option) => option.replace('text-', '')} // Remove 'text-' prefix for display
              value={formValues.instituteColor || ""}
              onChange={handleColorChange("instituteColor")}
              renderOption={(props, option) => (
                <li {...props} key={option} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${option}`} style={{ border: "1px solid #fff" }}></div> {/* Color preview */}
                  <span>{option.replace('text-', '')}</span>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select Institute Color"
                  sx={{
                    input: { color: 'white' },
                    fieldset: { borderColor: 'gray' },
                  }}
                />
              )}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 8 }}
            />
            {/* Display Institute Color Preview */}
            {formValues.instituteColor && (
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${formValues.instituteColor}`} style={{ border: '1px solid white' }}></div>
                <span className="text-white">{formValues.instituteColor.replace('text-', '')}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
