import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { extendPdf } from './pdf-micro-tools/extendPdf';
import { marginPdf } from './pdf-micro-tools/marginPdf';
import { splitPdf } from './pdf-micro-tools/splitPdf';

export default class PdfMarginManipulator {
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

  // To add margin to the pdf
  async addMargin(file: string | PDFDocument, margin: [number, number, number, number]) {
    let pdf;
    if (typeof file === 'string') {
      pdf = await this.readDoc(file);
    } else {
      pdf = file;
    }

    pdf = await marginPdf(pdf, margin);

    await this.ensureDoc();
    if (this.pdfDoc) {
      try {
        this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
      } catch (err) {
        throw new Error(`Error mergin PDFs: ${err}`);
      }
    }
  }

  // To add the margin to the pdf with specified range
  async addMarginWithRange(
    orderList: {
      file: string | PDFDocument;
      range: [number, number][];
      margin: [number, number, number, number];
    }[],
  ) {
    try {
      for (const part of orderList) {
        let pdf;
        if (typeof part.file === 'string') {
          pdf = await this.readDoc(part.file);
        } else {
          pdf = part.file;
        }

        const splitted = await splitPdf(pdf, part.range);

        for (const doc of splitted) {
          await this.addMargin(doc, part.margin);
        }
      }
    } catch (err) {
      throw new Error(`Error adding margin to the PDF: ${err}`);
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
