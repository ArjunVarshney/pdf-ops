import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { extendPdf } from './pdf-micro-tools/extendPdf';
import { splitPdf } from './pdf-micro-tools/splitPdf';
import { resizePdf } from './pdf-micro-tools/resizePdf';
import { resizeOptions } from './types';

export default class PdfResizer {
  private pdfDoc: PDFDocument | undefined;

  constructor() {
    this.clearDoc();
  }

  // To clear and reinitialize the pdfDoc
  async clearDoc() {
    this.pdfDoc = await PDFDocument.create();
  }

  // This ensure that pdfDoc is not undefined
  private async ensureDoc() {
    if (!this.pdfDoc) {
      await this.clearDoc();
    }
  }

  // Getter for the pdfDocs array
  getDocs() {
    return this.pdfDoc;
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

  // to resize all the pages of the Given pdf
  async resize(file: string | PDFDocument, options?: resizeOptions) {
    try {
      let pdf;
      if (typeof file === 'string') {
        pdf = await this.readDoc(file);
      } else {
        pdf = file;
      }

      await this.ensureDoc();
      if (!this.pdfDoc) return;

      pdf = await resizePdf(pdf, options);

      this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
    } catch (err) {
      throw new Error(`Error resizing the pdf: ${err}`);
    }
  }

  // Resize the pdf using a range specified by the user
  async resizeWithRange(
    orderList: {
      file: string | PDFDocument;
      range: [number, number][];
      options?: resizeOptions;
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
          await this.resize(doc, part.options);
        }
      }
    } catch (err) {
      throw new Error(`Error resizing the pdf: ${err}`);
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
