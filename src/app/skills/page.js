"use client";
import ParticlesComponent from "../components/particlebg";
import Skills from "../components/skills";

export default function SkillsPage() {
    return (
        <div className="mb-16 container mx-auto">
            <ParticlesComponent />
            <Skills loadMore={true} displayCount={6} showProgressBar={true} showSearchBar={true} />
        </div>
    );
}
