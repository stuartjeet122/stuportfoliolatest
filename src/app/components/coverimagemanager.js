import { useState, useEffect } from 'react';
import { FaEye, FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AddCoverImageModal from './addcoverimgdialog';
import Image from 'next/image';
import { fetchCoverImageByProjectId } from './projectfirebase'; // Adjust the import based on your file structure

const CoverImageManager = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // Refresh state for refetching image

  // Fetch cover image for a specific project
  useEffect(() => {
    const fetchCoverImage = async () => {
      setError(null);
      try {
        setLoading(true);
        const data = await fetchCoverImageByProjectId(projectId);
        if (data) {
          setCoverImage(data);
        } else {
          setCoverImage(null);
        }
      } catch (error) {
        console.error('Error fetching cover image:', error);
        setError('Failed to load cover image');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchCoverImage();
  }, [projectId, refresh]); // Refetch when projectId or refresh changes

  // Handle viewing the cover image
  const handleViewCoverImage = () => {
    if (coverImage?.secure_url) {
      window.open(`${coverImage.secure_url}?inline=true`, '_blank');
    } else {
      toast.error('No cover image available');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div> {/* Add your loading spinner component */}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-gray-900 bg-opacity-50 container mx-auto backdrop-blur-sm p-6">
      <div className="my-5 text-center">
        {!coverImage ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Cover Image
          </button>
        ) : (
          <div className="text-gray-500 text-center">
            Cover image already added. You can upload a new one to replace it.
          </div>
        )}
      </div>

      {coverImage ? (
        <div className="flex flex-col items-center space-y-4 relative group">
          {/* Image with hover effect */}
          <div className="relative w-full max-w-2xl">
            <Image
            loading='lazy'
              src={coverImage.secure_url}
              alt={coverImage.title || 'Cover Image'}
              width={600}
              height={400}
              layout="responsive"
              className="object-cover rounded-lg shadow-lg"
            />
            {/* Hover upload button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <FaUpload className="text-white text-4xl" />
            </button>
          </div>

          <button
            onClick={handleViewCoverImage}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaEye className="inline-block mr-2" />
            View Full Image
          </button>
        </div>
      ) : (
        <div className="text-gray-500 text-center">No cover image available</div>
      )}
<div style={{ position: 'relative', zIndex: 9999 }}>
  <AddCoverImageModal
    open={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    projectId={projectId}
    setRefresh={setRefresh} // Pass the refresh setter
  />
</div>

    </div>
  );
};

export default CoverImageManager;
