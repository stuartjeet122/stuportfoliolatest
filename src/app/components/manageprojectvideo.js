import { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { deleteVideoFromProject, fetchVideoByProjectId } from './projectfirebase';
import AddVideoModal from './AddVideoDialog';
import Image from 'next/image';

const Videos = ({ projectId, project }) => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [mode, setMode] = useState('add');
  const [editVideoData, setEditVideoData] = useState(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoData = await fetchVideoByProjectId(projectId);
        if (videoData) {
          setVideos(Object.values(videoData)); // Assuming the data is returned as an object
        } else {
          setError('No videos found for this project.');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchVideos(); // Fetch videos when the component loads or refresh state changes
    }
  }, [projectId, refresh]);

  const handleRemoveVideo = async (videoId) => {
    try {
      setLoading(true);
      await deleteVideoFromProject(projectId, videoId);
      toast.success(`Video ${videoId} removed successfully`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error('Failed to remove video');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = (videoId) => {
    const videoToEdit = videos.find((video) => video.id === videoId);
    if (videoToEdit) {
      setMode('edit'); // Set mode to 'edit'
      setEditVideoData(videoToEdit); // Set the video data to be edited
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className='bg-gray-900 bg-opacity-50 container mx-auto backdrop-blur-sm p-6'>
      <div className="my-5 text-center">
        <button
          onClick={() => {
            setMode('add');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add YouTube Video
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 text-white">
        {videos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No videos available</div>
        ) : (
          videos.map((video, index) => {
            let videoId;

            if (video.url && typeof video.url === 'string') {
              if (video.url.includes('youtu.be')) {
                videoId = video.url.split('youtu.be/')[1]?.split('?')[0];
              } else if (video.url.includes('youtube.com')) {
                videoId = video.url.split('v=')[1]?.split('&')[0];
              }
            }

            // If videoId is missing or invalid, skip rendering the video
            if (!videoId) {
              return null;
            }

            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <div key={video.id || index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative">
                <Image
                  src={thumbnailUrl}
                  alt={`Video ${video.id}`}
                  className="w-full h-64 object-cover rounded-t-lg"
                  width={1500}
                  height={1500}
                />
                <div className="p-2">
                  <h3 className="text-xl font-semibold text-center text-gray-100 truncate mb-4">{video.title}</h3>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleEditVideo(video.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    >
                      <FaEdit size={20} />
                      <span className="ml-2">Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveVideo(video.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center"
                    >
                      <FaTrash size={20} />
                      <span className="ml-2">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Video Modal */}
      <AddVideoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        mode={mode} // Pass the mode (add/edit)
        editVideoData={editVideoData} // Pass video data for editing
        setRefresh={setRefresh} // Pass setRefresh function for refreshing the video list
      />
    </div>
  );
};

export default Videos;
