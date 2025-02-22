import { useState, useEffect } from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { deletePDFFromProject, fetchPDFsByProjectId } from './projectfirebase'; // Adjust API import as needed
import AddPdfModal from './addpdfdialog'; // Modal to add PDFs

const Pdfs = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fetch PDFs based on the projectId
  useEffect(() => {
    const fetchPdfs = async () => {
      setError(null); // Clear any previous errors
      try {
        setLoading(true);
        const pdfData = await fetchPDFsByProjectId(projectId);
        if (pdfData && Object.values(pdfData).length > 0) {
          setPdfs(Object.values(pdfData)); // Successfully fetched PDFs
        } else {
          setPdfs([]); // No PDFs available, but not an error
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setError('Failed to load PDFs'); // Set error only for fetch failures
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchPdfs();
  }, [projectId, refresh]);

  const handleRemovePdf = async (pdfId) => {
    if (!window.confirm('Are you sure you want to remove this PDF?')) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/removepdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, pdfId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove PDF');
      }
  
      const result = await response.json();
      toast.success(`PDF "${result.pdfId}" removed successfully`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error removing PDF:', error);
      toast.error('Failed to remove PDF');
    } finally {
      setLoading(false);
    }
  };
  

  // View PDF functionality - open in new tab
  const handleViewPdf = (pdf) => {
    if (pdf.secure_url) { 
      window.open(`${pdf.secure_url}?inline=true`, '_blank');
    } else {
      toast.error('No PDF URL available');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div> {/* Add appropriate loader */}
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className='bg-gray-900 bg-opacity-50 container mx-auto backdrop-blur-sm p-6'>
      <div className="my-5 text-center">
        <button
          onClick={() => {
            setIsModalOpen(true); // Open the add PDF modal
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 text-white">
        {pdfs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No PDFs available</div>
        ) : (
          pdfs.map((pdf, index) => (
            <div key={pdf.id || index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative">
              <div className="p-2">
                <h3 className="text-xl font-semibold text-center text-gray-100 truncate mb-4">{pdf.title}</h3>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleViewPdf(pdf)} // View PDF on click
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
                  >
                    <FaEye size={20} />
                    <span className="ml-2">View</span>
                  </button>
                  <button
                    onClick={() => handleRemovePdf(pdf.id)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center"
                  >
                    <FaTrash size={20} />
                    <span className="ml-2">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add PDF Modal */}
      <AddPdfModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        projectId={projectId}
        mode="add"
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Pdfs;
