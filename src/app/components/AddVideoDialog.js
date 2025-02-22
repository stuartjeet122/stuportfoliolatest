import { useState, useEffect } from 'react';
import { addVideoToProject, updateVideoInProject } from './projectfirebase';
import { toast } from 'react-hot-toast';

const AddVideoModal = ({ open, onClose, projectId, mode, editVideoData, setRefresh }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // Pre-fill data if editing
  useEffect(() => {
    if (mode === 'edit' && editVideoData) {
      setVideoUrl(editVideoData.url);
      setVideoTitle(editVideoData.title);
    }
  }, [mode, editVideoData]);

  const handleAddClick = async () => {
    if (!videoUrl || !videoTitle) {
      toast.error('Please provide both a title and a video URL.');
      return;
    }

    try {
      const urlObject = new URL(videoUrl);
      const sanitizedUrl = `${urlObject.origin}${urlObject.pathname}`;

      if (mode === 'add') {
        const videoData = {
          id: Date.now().toString(),
          title: videoTitle,
          url: sanitizedUrl,
        };

        await addVideoToProject(projectId, videoData);
        toast.success('Video added successfully!');
      } else if (mode === 'edit') {
        await updateVideoInProject(projectId, editVideoData.id, sanitizedUrl); // Update the video
        toast.success('Video updated successfully!');
      }

      onClose();

      // Trigger a refresh after adding or editing the video
      if (setRefresh) {
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error('Error adding or updating video:', error);
      toast.error('Failed to process video. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-700">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold text-center text-white mb-4">{mode === 'edit' ? 'Edit Video' : 'Add Video'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            placeholder="Video Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <div className="flex mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {mode === 'edit' ? 'Update Video' : 'Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;
