'use client';
import ProjectManager from '../components/projectmanager';
import ParticlesComponent from '../components/particlebg';
import RequireAuth from '../components/authrequired';
export default function Manageprojects() {
    return (
        <div>
            <ParticlesComponent />
            <RequireAuth>
            <ProjectManager />
            </RequireAuth>
        </div>
    );
}
