'use client';
import { Suspense } from 'react';
import ProjectDisplayContent from '../../components/ProjectDisplayContent';

export default function DisplayProjectsWrapper() {

  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <ProjectDisplayContent/>
    </Suspense>
  );
}
