import { ref, remove, getDatabase } from 'firebase/database';
import { v2 as cloudinary } from 'cloudinary';
import { fetchProjectById } from './projectfirebase';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dlpzpiewm',
  api_key: '298997145115615',
  api_secret: 'VK7RZWrzoZNIf2kP2v8kEb6QqFk',
});

/**
 * Deletes PDF data from Firebase and Cloudinary.
 * @param {string} projectId - The ID of the project.
 * @param {string} pdfId - The ID of the PDF to delete.
 */
export async function deletePDFData(projectId, pdfId) {
  const database = getDatabase();

  // Fetch the PDF data from Firebase
  const projectData = await fetchProjectById(projectId);
  const pdfData = projectData.pdfs[pdfId];

  if (!pdfData) {
    throw new Error('PDF not found in project');
  }

  // Delete the PDF reference from Firebase
  const pdfRef = ref(database, `projects/${projectId}/pdfs/${pdfId}`);
  await remove(pdfRef);

  // Delete the PDF from Cloudinary using its public_id
  await cloudinary.uploader.destroy(pdfData.public_id, { resource_type: 'raw' });
}
