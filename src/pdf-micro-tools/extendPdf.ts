import { PDFDocument } from 'pdf-lib';

export const extendPdf = async (mainDoc: PDFDocument, pdfList: PDFDocument[]): Promise<PDFDocument> => {
  try {
    // if the pdfList is empty then return the original file
    if (pdfList.length === 0) {
      return mainDoc;
    }

    for (const pdf of pdfList) {
      // copy all the pages of the pdf
      const pages = await mainDoc.copyPages(pdf, pdf.getPageIndices());

      // add all the pages of the pdfs into the main doc
      pages.forEach(async (page) => {
        mainDoc.addPage(page);
      });
    }

    // return the mainDoc
    return mainDoc;
  } catch (err) {
    throw new Error(`Error extending PDF: ${err}`);
  }
};
