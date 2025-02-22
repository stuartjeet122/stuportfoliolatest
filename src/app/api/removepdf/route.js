import { NextResponse } from 'next/server';
import { deletePDFData } from '../../components/removepdfcloudinary'; // Adjust based on your structure

export async function POST(req) {
  try {
    const body = await req.json();
    const { projectId, pdfId } = body;

    if (!projectId || !pdfId) {
      return NextResponse.json({ error: 'Project ID and PDF ID are required' }, { status: 400 });
    }

    // Call the utility function to handle deletion
    await deletePDFData(projectId, pdfId);

    return NextResponse.json({ message: 'PDF deleted successfully', projectId, pdfId }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting PDF:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
