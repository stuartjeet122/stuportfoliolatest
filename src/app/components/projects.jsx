import { motion } from 'framer-motion';
import Image from 'next/image';
import Slider from 'react-slick';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import projectdata from '../components/projectdata';
import { useSearchParams } from 'next/navigation';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '60px',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export default function ProjectsSection({
  viewMode = '',
  randomDisplay = false,
  displayCount = 6,
  customBackground,
}) {
  const searchParams = useSearchParams();
  const skillFilter = searchParams.get('skill');

  const [projectsObject, setProjectsObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await projectdata();
        setProjectsObject(projectData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredProjects = useMemo(() => {
    let projectsArray = Object.keys(projectsObject).map((key) => ({
      id: key,
      ...projectsObject[key],
    }));

    if (randomDisplay) {
      projectsArray = projectsArray.sort(() => 0.5 - Math.random());
    }

    return projectsArray.filter((project) => {
      const matchesSearchTerm =
        filterBy === 'name'
          ? project.name.toLowerCase().includes(searchTerm.toLowerCase())
          : project.techStack.some((tech) =>
              tech.toLowerCase().includes(searchTerm.toLowerCase())
            );

      const matchesSkillFilter = skillFilter
        ? project.techStack.some(
            (tech) => tech.toLowerCase() === skillFilter.toLowerCase()
          )
        : true;

      // 
      const isActive = project.status !== 'Inactive';

      return matchesSearchTerm && matchesSkillFilter && isActive;
    });
  }, [projectsObject, randomDisplay, searchTerm, filterBy, skillFilter]);

  const totalPages = Math.ceil(filteredProjects.length / displayCount);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * displayCount,
    currentPage * displayCount
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const backgroundClass = customBackground
    ? customBackground
    : 'bg-gray-900 border border-gray-700 rounded-lg shadow-lg';

  return (
    <section
      id="projects"
      className={`py-10 ${backgroundClass} transition duration-500`}
      style={{
        background: customBackground || 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(15px)',
      }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-5 text-white uppercase">
          {skillFilter ? skillFilter : 'All'} Projects
        </h2>

        {viewMode !== 'carousel' && (
          <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-72 lg:w-96">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-gray-700 transition-all duration-300 ease-in-out"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 ease-in-out"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="name">Search by Name</option>
                <option value="techStack">Search by Tech Stack</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <>
            {currentProjects.length === 0 ? (
              <p className="text-red-500 text-3xl text-center font-extrabold">
                No projects added yet. Will add soon!
              </p>
            ) : viewMode === 'carousel' ? (
              <Slider {...settings}>
                {currentProjects.map((project) => (
                  <div key={project.id} className="p-2">
                    <motion.div
                      className="carousel-item flex-col bg-gray-800 p-6 rounded-lg shadow-lg transition-shadow duration-300 transform hover:scale-105 hover:shadow-2xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative w-full h-40 md:h-48 lg:h-56 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                        <Image
                          src={project.image || '/placeholder.jpg'}
                          alt={project.name || 'Project Image'}
                          width={1000}
                          height={1000}
                          className="object-contain w-full h-full transition-transform duration-300 transform hover:scale-105 p-4"
                          priority
                        />
                        <div className="absolute bottom-4 left-4 text-white font-semibold bg-black bg-opacity-50 rounded px-3 py-1 text-sm md:text-lg">
                          {project.name || 'Project Name'}
                        </div>
                      </div>

                      <p className="text-gray-400 mb-4">
                        Tech Stack: {project.techStack.join(', ')}
                      </p>
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-6">
                          {project.status && (
                            <span
                              className={`badge badge-lg ${
                                project.status === 'completed'
                                  ? 'badge-success'
                                  : project.status === 'ongoing'
                                  ? 'badge-info'
                                  : 'badge-neutral'
                              }`}
                            >
                              {project.status.charAt(0).toUpperCase() +
                                project.status.slice(1)}
                            </span>
                          )}
                        </div>

                        <div className="w-full sm:w-auto">
                          <Link
                            prefetch={true}
                            href={`/projects/${project.id}`}
                            className="btn btn-wide btn-primary btn-block sm:btn-normal sm:w-auto shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                          >
                            View Project
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg transition-shadow duration-300 transform hover:scale-105 hover:shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full h-40 overflow-hidden rounded-lg">
                      <Image
                        src={project.image || '/placeholder.jpg'}
                        alt={project.name}
                        className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
                        layout="fill"
                        priority
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Tech Stack: {project.techStack.join(', ')}
                    </p>

                    <div className="text-white flex flex-col items-center justify-center p-4">
                      {project.status && (
                        <div className="mb-6">
                          <span
                            className={`badge badge-lg ${
                              project.status === 'completed'
                                ? 'badge-success'
                                : project.status === 'ongoing'
                                ? 'badge-info'
                                : 'badge-neutral'
                            }`}
                          >
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </span>
                        </div>
                      )}

                      <div className="w-full sm:w-auto">
                        <Link
                          prefetch={true}
                          href={`/projects/${project.id}`}
                          className="btn btn-wide btn-primary btn-block sm:btn-normal sm:w-auto shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {viewMode !== 'carousel' && (
          <div className="mt-8">
            <div className="pagination flex justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn ${
                    currentPage === index + 1 ? 'btn-teal' : 'btn-secondary'
                  } bg-gray-700 text-white hover:bg-teal-600`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'carousel' && (
          <div className="mt-4">
            <Link
              href="/project"
              className="btn btn-teal text-white bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
