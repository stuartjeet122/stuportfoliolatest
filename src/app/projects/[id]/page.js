'use client';
import { useEffect, useState } from 'react';
import ProjectDetails from '../../components/projectdetails';
import Videos from '../../components/projectvideo';
import PDFViewer from '../../components/projectpdf';
import ImageCarousel from '../../components/projectimagecarousel';
import ParticlesComponent from '../../components/particlebg';
import { fetchProjectById } from '../../components/projectfirebase';

export default function DisplayProjects({ params }) {
  const { id } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await fetchProjectById(id);
  
        const formattedProject = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          techStack: projectData.techStack,
          // Convert the videos object into an array of video objects
          videos: projectData.videos ? Object.values(projectData.videos) : [],
          // Convert images and pdfs objects into arrays
          pdfs: projectData.pdfs ? Object.values(projectData.pdfs) : [],
          projectimages: projectData.images ? Object.values(projectData.images) : [],
          image: projectData.cover_image?.secure_url || '',
          url: projectData.url || '',
        };
        setProject(formattedProject);
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProject();
  }, [id]);
  
  if (loading) {
    return <p>Loading...</p>;
  }
  
  return (
    <div>
      {project ? (
        <>
          <ParticlesComponent />
          <div className="my-5">
            <ProjectDetails
              name={project.name}
              description={project.description}
              techStack={project.techStack}
              url={project.url}
            />
          </div>
          {project.videos && project.videos.length > 0 && (
            <div className="my-5">
              <Videos videos={project.videos} />
            </div>
          )}
          {project.pdfs && project.pdfs.length > 0 && (
            <div className="my-5 z-50">
              <PDFViewer pdfs={project.pdfs} />
            </div>
          )}
          {project.projectimages && project.projectimages.length > 0 && (
            <div className="my-5 z-10">
              <ImageCarousel images={project.projectimages} />
            </div>
          )}
        </>
      ) : (
        <p>Project not found</p>
      )}
    </div>
  );
}  