import React from "react";
import { IconButton, Card, CardContent, Typography, Box, Button, createTheme, ThemeProvider } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Link from "next/link";

export default function ProjectCard({ project, onDelete, onEdit }) {
    const darkTheme = createTheme({
      palette: {
        mode: "dark",
      },
    });

  // Function to determine the status color class
  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-500"; // Green for Completed
      case "inactive":
        return "text-red-500"; // Red for Inactive
      case "ongoing":
        return "text-yellow-500"; // Yellow for Ongoing
      default:
        return "text-gray-500"; // Default gray for unknown statuses
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card className="bg-black bg-opacity-40 border border-gray-700 rounded-lg shadow-lg mb-4">
        <CardContent>
          <Box className="flex flex-wrap items-center justify-between">
            <Typography variant="h5" className="text-white font-bold text-base sm:text-lg">
              {project.name}
            </Typography>
            <Box className="flex items-center mt-2 sm:mt-0">
              <IconButton onClick={onEdit} className="text-blue-400 text-sm sm:text-base">
                <Edit />
              </IconButton>
              <IconButton onClick={onDelete} className="text-red-400 text-sm sm:text-base">
                <Delete />
              </IconButton>
            </Box>
          </Box>
          <Typography className="text-gray-300 mt-2 text-sm sm:text-base">
            {project.description}
          </Typography>
          <Typography className="text-gray-400 text-sm mt-1 sm:text-base">
            Tech Stack: {project.techStack.join(", ")}
          </Typography>
          <Typography className="text-sm text-gray-500 mt-2 sm:text-base">
            <span className="font-semibold text-gray-700">URL: </span>
            <a href={project.url} className="text-blue-500 hover:text-blue-700 hover:underline">
              {project.url}
            </a>
          </Typography>
          {/* Display the status with dynamic color */}
          <Typography className={`text-sm font-medium mt-2 sm:text-base ${getStatusColorClass(project.status)}`}>
            Status: {project.status || "N/A"}
          </Typography>
          <Box className="mt-4 flex justify-end">
            <Link prefetch={true} href={`/manageprojects/project?id=${project.id}`} passHref>
              <Button variant="contained" color="primary" className="bg-blue-500 text-sm sm:text-base">
                Open
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}