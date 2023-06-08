import { PDFDocument } from 'pdf-lib';
import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import PdfManipulator from '../PdfManipulator';
import { range } from '../types';

export default class PdfMerger extends PdfManipulator {
  // To merge all the pages of all the pdfs into a single pdf
  async merge(files: string[] | PDFDocument[]) {
    const pdfFileList: PDFDocument[] = [];
    for (const file of files) {
      if (typeof file === 'string') {
        pdfFileList.push(await this.readDoc(file));
      } else {
        pdfFileList.push(file);
      }
    }
    await this.ensureDoc();
    if (this.pdfDoc) {
      try {
        this.pdfDoc = await extendPdf(this.pdfDoc, pdfFileList);
      } catch (err) {
        throw new Error(`Error merging PDFs: ${err}`);
      }
    }
  }

  // to merge the pdfs with range specified for the pages of the Pdf into one pdf
  async mergeWithRange(orderList: { filepath: string; range: range }[]) {
    const toBeMerged: PDFDocument[] = [];
    for (const part of orderList) {
      try {
        const pdf = await this.readDoc(part.filepath);
        const r = this.processOrder(part.range, pdf.getPageCount());
        const trimmed = await splitPdf(pdf, r);
        toBeMerged.push(...trimmed);
      } catch (err) {
        throw new Error(`Error splitting pdf ${part.filepath}: ${err}`);
      }
    }
    if (this.pdfDoc) {
      try {
        this.pdfDoc = await extendPdf(this.pdfDoc, toBeMerged);
      } catch (err) {
        throw new Error(`Error mergin splitted PDFs: ${err}`);
      }
    }
  }
}
