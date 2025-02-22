'use client';

import { useEffect, useState } from 'react';
import ProjectDetails from './projectdetails';
import Videos from './manageprojectvideo';
import PDFViewer from './manageprojectpdf';
import ImageCarousel from './manageprojectcarouselimg';
import ParticlesComponent from './particlebg';
import CoverImage from './coverimagemanager';
import RequireAuth from './authrequired';
import { Box, Typography } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { fetchProjectById } from './projectfirebase';

export const dynamic = 'force-dynamic';

export default function ProjectDisplayContent() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  useEffect(() => {
    const loadProject = async () => {
      try {
        const fetchedProject = await fetchProjectById(id);
        setProject(fetchedProject);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <RequireAuth>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <ParticlesComponent />
        {project ? (
          <>
            <Box sx={{ my: 5, flexGrow: 1 }}>
              <ProjectDetails
                name={project.name}
                description={project.description}
                techStack={project.techStack}
                url={project.url}
              />
            </Box>
            <Box sx={{ my: 5, flexGrow: 1 }}>
              <CoverImage projectId={id} />
            </Box>
            <Box sx={{ my: 5, flexGrow: 1 }}>
              <Videos projectId={id} project={project} />
            </Box>
            <Box sx={{ my: 5, flexGrow: 1 }}>
              <PDFViewer pdfs={project.pdfs} projectId={id} />
            </Box>
            <Box sx={{ my: 5, flexGrow: 1 }}>
              <ImageCarousel projectId={id} images={project.projectimages} />
            </Box>
          </>
        ) : (
          <Typography variant="h5" align="center" sx={{ flexGrow: 1 }}>
            Project not found
          </Typography>
        )}
        <Toaster />
      </Box>
    </RequireAuth>
  );
}
