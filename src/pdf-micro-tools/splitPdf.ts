import { PDFDocument } from 'pdf-lib';

function ensureRange(pdf: PDFDocument, range: [number, number][]): [number, number][] {
  const pdfLen = pdf.getPageCount();
  const modifiedRange: [number, number][] = [];
  for (const [start, end] of range) {
    if (start >= end) {
      continue;
    }
    if (start >= pdfLen) {
      continue;
    } else if (end > pdfLen) {
      modifiedRange.push([start, pdfLen]);
    } else {
      modifiedRange.push([start, end]);
    }
  }
  return modifiedRange;
}

export const splitPdf = async (mainDoc: PDFDocument, rangeList: [number, number][]): Promise<PDFDocument[]> => {
  try {
    const splitted = [];
    const modifiedRange = ensureRange(mainDoc, rangeList);
    for (const range of modifiedRange) {
      // create a new pdf to push into the array of splitted pdfs
      const resPdf = await PDFDocument.create();

      // create an array of pages needed to be copied from the mainDoc
      const x = range[0];
      const y = range[1] - 1;
      const arr = Array.from({ length: y - x + 1 }, (_, i) => i + x);

      // copy the pages from the mainDoc
      const pages = await resPdf.copyPages(mainDoc, arr);

      // add all the copied pages into the resPdf
      pages.forEach(async (page) => {
        resPdf.addPage(page);
      });

      // push the resPdf into the splitted array
      splitted.push(resPdf);
    }

    // return the array of splitted pdfs
    return splitted;
  } catch (err) {
    throw new Error(`Error splitting PDF: ${err}`);
  }
};
