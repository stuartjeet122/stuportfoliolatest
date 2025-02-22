'use client';
import React, { Suspense } from 'react';
import ProjectsSection from "../components/projects";
import ParticlesComponent from "../components/particlebg";

export default function Project() {
    return (
        <>
            <ParticlesComponent />
            <Suspense fallback={<div>Loading Projects...</div>}>
                <ProjectsSection displayCount={6} />
            </Suspense>
        </>
    );
}
