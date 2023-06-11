import { PDFDocument, degrees } from 'pdf-lib';

export const rotatePdf = async (mainDoc: PDFDocument, degree: number) => {
  try {
    const pages = mainDoc.getPages();
    for (const page of pages) {
      page.setRotation(degrees(page.getRotation().angle + degree));
    }
    return mainDoc;
  } catch (err) {
    throw new Error(`Error rotating PDF: ${err}`);
  }
};
