import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { extendPdf } from './pdf-micro-tools/extendPdf';
import { splitPdf } from './pdf-micro-tools/splitPdf';

export default class PdfMerger {
  private pdfDoc: PDFDocument | undefined;

  constructor() {
    this.clearDoc();
  }

  // To clear and reinitialize the pdfDoc
  async clearDoc() {
    this.pdfDoc = await PDFDocument.create();
  }

  // getter for pdfDoc
  getDoc() {
    return this.pdfDoc;
  }

  // This ensure that pdfDoc is not undefined
  private async ensureDoc() {
    if (!this.pdfDoc) {
      await this.clearDoc();
    }
  }

  // To read the pdf file from the file system and convert it to a PDFDocument object
  private async readDoc(filepath: string): Promise<PDFDocument> {
    try {
      const fileBuffer = await fs.promises.readFile(filepath);
      const file = await PDFDocument.load(fileBuffer);
      return file;
    } catch (err) {
      throw new Error(`Error reading file ${filepath}: ${err}`);
    }
  }

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
  async mergeWithRange(orderList: { filepath: string; range: [number, number][] }[]) {
    const toBeMerged: PDFDocument[] = [];
    for (const part of orderList) {
      try {
        const pdf = await this.readDoc(part.filepath);
        const trimmed = await splitPdf(pdf, part.range);
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

  // To export the generated file as a pdf into the file system
  async save(filepath: string) {
    if (this.pdfDoc) {
      try {
        const pdfBuffer = await this.pdfDoc.save();
        await fs.promises.writeFile(filepath, pdfBuffer);
      } catch (err) {
        throw new Error(`Error saving PDF to ${filepath}: ${err}`);
      }
    }
  }

  // To return a buffer of the resultant pdf file
  async getPdfBuffer() {
    if (this.pdfDoc) {
      try {
        const pdfBuffer = await this.pdfDoc.save();
        return pdfBuffer;
      } catch (err) {
        throw new Error(`Error generating Buffer: ${err}`);
      }
    }
  }
}
