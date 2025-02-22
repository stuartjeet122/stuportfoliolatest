import React, { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { Typography, Button } from '@mui/material';

const PdfViewer = ({ pdfs }) => {
  const [selectedPdf, setSelectedPdf] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [scale] = useState(1.5); // Adjust this for zoom level

  const openPdf = useCallback((pdf) => {
    setSelectedPdf(pdf);
    setLoading(true);
    setLoadError(false);

    const loadingTask = pdfjsLib.getDocument(pdf);
    loadingTask.promise
      .then((loadedPdf) => {
        setNumPages(loadedPdf.numPages);
        setPdfDocument(loadedPdf);
        setLoading(false);
      })
      .catch((error) => {
        console.error("PDF loading error:", error);
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  const closeReport = () => {
    setSelectedPdf('');
    setPdfDocument(null);
    setNumPages(0);
  };

  const renderPage = useCallback((pageNum) => {
    if (!pdfDocument) return;

    pdfDocument.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = document.getElementById(`pdf-page-${pageNum}`);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport });
    });
  }, [pdfDocument, scale]);

  const disableRightClick = (event) => {
    event.preventDefault(); // Disable right-click
  };

  useEffect(() => {
    if (pdfDocument && numPages > 0) {
      for (let i = 1; i <= numPages; i++) {
        renderPage(i);
      }
    }
  }, [pdfDocument, numPages, renderPage]);

  useEffect(() => {
    return () => {
      setPdfDocument(null);
      setNumPages(0);
    };
  }, [selectedPdf]);

  // Disable right-click on the canvas
  useEffect(() => {
    if (selectedPdf) {
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        canvas.addEventListener('contextmenu', disableRightClick);
      });

      return () => {
        canvases.forEach(canvas => {
          canvas.removeEventListener('contextmenu', disableRightClick);
        });
      };
    }
  }, [selectedPdf]);

  if (!pdfs || pdfs.length === 0) return null;

  return (
    <div className="container mx-auto p-10 bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-lg shadow-xl text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {pdfs.map((pdf, index) => (
          <div
            key={index}
            className="p-5 bg-gray-800 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl cursor-pointer w-full max-w-xs"
            onClick={() => openPdf(pdf.secure_url)}
          >
            <Typography variant="h6" className="font-bold text-lg mb-2 text-gray-200">
              Report {index + 1}
            </Typography>
            <div className='flex justify-center'>
              <Button
                variant="contained"
                className="mt-4 bg-gradient-to-r from-green-500 to-green-700 py-2 px-4 font-bold text-lg transition-transform duration-200 hover:scale-105"
                style={{ color: '#fff' }}
              >
                View Report
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <div className="mt-10 bg-white rounded-lg p-5 max-w-screen-md w-full mx-auto overflow-y-auto shadow-lg" style={{ maxHeight: '90vh' }}>
          <div className="flex justify-between items-center">
            <Button
              variant="contained"
              className="bg-red-500 text-white"
              onClick={closeReport}
            >
              Close Report
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <Typography variant="body1" className="ml-2 text-black">Loading...</Typography>
            </div>
          ) : loadError ? (
            <Typography variant="body1" className="text-red-500">
              Failed to load PDF file. Please check the console for details.
            </Typography>
          ) : (
            <div>
              {Array.from({ length: numPages }, (_, index) => (
                <canvas
                  key={index + 1}
                  id={`pdf-page-${index + 1}`}
                  className="mb-4 rounded border border-gray-300 shadow-sm"
                  style={{ width: '100%' }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
