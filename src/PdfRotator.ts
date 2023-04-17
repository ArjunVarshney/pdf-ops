import { PDFDocument, degrees } from 'pdf-lib';
import fs from 'fs';
import { extendPdf } from './pdf-micro-tools/extendPdf';
import { splitPdf } from './pdf-micro-tools/splitPdf';
import { rotatePdf } from './pdf-micro-tools/rotatePdf';

export default class PdfRotator {
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

  // To rotate the pdf(all pages)
  async rotate(file: string | PDFDocument, degree: number) {
    let pdf;
    if (typeof file === 'string') {
      pdf = await this.readDoc(file);
    } else {
      pdf = file;
    }

    pdf = await rotatePdf(pdf, degree);

    await this.ensureDoc();
    if (this.pdfDoc) {
      this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
    }
  }

  // To rotate the pdf with the specified range and angle
  async rotateWithRange(orderList: { file: string | PDFDocument; range: [number, number][]; degree: number }[]) {
    for (const part of orderList) {
      let pdf;
      if (typeof part.file === 'string') {
        pdf = await this.readDoc(part.file);
      } else {
        pdf = part.file;
      }

      const splitted = await splitPdf(pdf, part.range);

      for (const doc of splitted) {
        await this.rotate(doc, part.degree);
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
