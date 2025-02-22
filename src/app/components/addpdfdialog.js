import { useState } from 'react';
import { toast } from 'react-hot-toast';

const AddPdfModal = ({ open, onClose, projectId, setRefresh }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddClick = async () => {
    if (!pdfTitle || !pdfFile) {
      toast.error('Please provide both a title and a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('title', pdfTitle);
    formData.append('projectId', projectId);

    setUploading(true);

    try {
      const response = await fetch('/api/uploadpdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('PDF added successfully!');
        onClose();
        setRefresh((prev) => !prev); // Refresh the PDF list
      } else {
        toast.error(data.error || 'Failed to add PDF. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to add PDF. Please try again.');
    } finally {
      setUploading(false);
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
        <h3 className="text-2xl font-semibold text-center text-white mb-4">Add PDF</h3>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            placeholder="PDF Title"
            value={pdfTitle}
            onChange={(e) => setPdfTitle(e.target.value)}
          />
          <input
            type="file"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
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
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPdfModal;
