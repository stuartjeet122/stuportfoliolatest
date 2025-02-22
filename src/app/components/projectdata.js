import { fetchProjects } from './projectfirebase'; 

export default async function Projectsdata() {
  try {
    const projectData = await fetchProjects();
    
    // Format the fetched projects to match the expected format
    const formattedProjects = projectData.reduce((acc, project) => {
      acc[project.id] = { // Use project.id as the key for the project
        id: project.id,  // Set project ID as the id
        name: project.name,  // Set project ID as the name
        description: project.description,
        techStack: project.techStack,
        videos: project.videos || [],
        pdfs: project.pdfs || [],
        projectimages: project.projectimages || [],
        image: project.cover_image?.secure_url || '',
        url: project.url || '',
        status: project.status || "inactive"
      };
      return acc;
    }, {});
    return formattedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; // Rethrow the error if necessary
  }
}

