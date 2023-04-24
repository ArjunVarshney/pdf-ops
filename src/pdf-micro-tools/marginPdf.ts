import { PDFDocument, PageSizes } from 'pdf-lib';

export const marginPdf = async (
  mainDoc: PDFDocument,
  [top, right, bottom, left]: [number, number, number, number],
): Promise<PDFDocument> => {
  // get pages of the mainDoc
  const pages = mainDoc.getPages();

  // define the multiplier
  const stdPaper = 'A4';
  const multiplier = PageSizes[stdPaper][0] / 210;

  // multiply the ratio multiplier witht he margins
  top *= multiplier;
  right *= multiplier;
  bottom *= multiplier;
  left *= multiplier;

  // traverse all the pages and add margin accordingly
  for (const page of pages) {
    const { width, height } = page.getSize();

    // add height and width to the page
    const newWidth = width + right + left;
    const newHeight = height + top + bottom;

    // set the size of the page
    page.setSize(newWidth, newHeight);

    // Shift the content to the right and bottom
    page.translateContent(left, bottom);
  }

  return mainDoc;
};
