const ProjectDetails = ({ name, description, techStack, url }) => {
  return (
    <div className="flex justify-center items-center mt-6">
      <div className="bg-black bg-opacity-55 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-5xl w-full transition-transform transform hover:scale-105">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 border-r border-gray-400">
            <h1 className="text-5xl font-extrabold text-white mb-2">{name}</h1>
            <h3 className="text-2xl text-gray-300 mb-1">Description:</h3>
            <p className="text-lg text-gray-200 leading-relaxed">{description}</p>
          </div>
          <div className="md:w-1/3">
            <h3 className="text-2xl text-gray-300 mb-1">Tech Stack:</h3>
            <div className="flex flex-wrap">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm mr-2 mb-2 transition-all hover:bg-gray-600"
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* Display URL only in dark mode */}
            {url && (
              <div className="mt-6">
                <h3 className="text-2xl text-gray-300 mb-1">Project URL:</h3>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-white text-lg text-center mt-2 font-semibold py-3 px-6 rounded-full shadow-xl bg-gradient-to-r from-blue-900 to-blue-950 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out transform hover:scale-110 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-800 dark:hover:from-indigo-700 dark:hover:to-indigo-900 dark:ring-4 dark:ring-indigo-500 dark:ring-opacity-40"
                >
                  Visit Project
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
