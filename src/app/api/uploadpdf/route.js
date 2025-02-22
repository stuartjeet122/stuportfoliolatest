import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { addPDFToProject } from '../../components/projectfirebase';

cloudinary.config({
  cloud_name: 'dlpzpiewm',
  api_key: '298997145115615',
  api_secret: 'VK7RZWrzoZNIf2kP2v8kEb6QqFk',
});

export async function POST(request) {
  try {
    const data = await request.formData();
    
    // Extract fields
    const title = data.get('title');
    const projectId = data.get('projectId');
    const file = data.get('file');

    if (!file || !title || !projectId) {
      return NextResponse.json({ error: 'Missing title, file, or project ID' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload PDF to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', public_id: `project_${projectId}/${title}` }, 
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(buffer);
    });

    // Prepare PDF data for Firebase
    const pdfData = {
      title,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    // Add the PDF data to Firebase using the new function
    const updatedProject = await addPDFToProject(projectId, pdfData);

    // Return the response with projectId and title
    return NextResponse.json({ 
      projectId,
      title,
      filePath: uploadResult.secure_url,
      updatedProject 
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}