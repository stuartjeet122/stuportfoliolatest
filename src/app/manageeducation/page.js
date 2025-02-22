'use client';
import Educationmanager from '../components/manageeducation';
import ParticlesComponent from '../components/particlebg';
import RequireAuth from '../components/authrequired';
import { Toaster } from 'react-hot-toast';

export default function Manageprojects() {
    return (
        <div>
            <ParticlesComponent />
            <RequireAuth>
                <Educationmanager />
                <Toaster />
            </RequireAuth>
        </div>
    );
}
