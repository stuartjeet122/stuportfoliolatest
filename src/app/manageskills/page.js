'use client';
import SkillManager from '../components/manageskills';
import ParticlesComponent from '../components/particlebg';
import RequireAuth from '../components/authrequired';
export default function Manageskills(){
    return(
        <div>
            <ParticlesComponent />
            <RequireAuth>
<SkillManager />
</RequireAuth>
</div>
    );
}