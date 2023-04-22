import { createCanvas } from 'canvas';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

export const pdfToImage = async (mainDoc: PDFDocument): Promise<Uint8Array[] | undefined> => {
  try {
    // initialize image buffer list
    const imageBufferList: Uint8Array[] = [];

    // convert pdfDocument object to pdfjs object
    const pdfDoc = await pdfjsLib.getDocument(await mainDoc.save()).promise;

    // get the page count of the pdf
    const pageCount = pdfDoc.numPages;

    for (let i = 1; i <= pageCount; i++) {
      // get the page of the pdf
      const page = await pdfDoc.getPage(i);

      // get the viewport of the page
      const viewport = page.getViewport({ scale: 1.0 });

      // render a canvas with the viewport
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext('2d');
      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      // @ts-ignore
      await page.render(renderContext).promise;

      // push the rendered image to the imageBufferList
      imageBufferList.push(canvas.toBuffer('image/png'));
    }

    // return the image buffer List
    return imageBufferList;
  } catch (err) {
    throw new Error(`Error converting pdf to image: ${err}`);
  }
};
