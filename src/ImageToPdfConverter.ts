import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { extendPdf } from './pdf-micro-tools/extendPdf';
import { imageToPdf } from './pdf-micro-tools/imageToPdf';
import { createOptions } from './types';
import { resizePdf } from './pdf-micro-tools/resizePdf';
import { marginPdf } from './pdf-micro-tools/marginPdf';

export default class ImageToPdfConverter {
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
  private async readDoc(file: string): Promise<Uint8Array> {
    try {
      const fileBuffer = await fs.promises.readFile(file);
      return fileBuffer;
    } catch (err) {
      throw new Error(`Error reading file ${file}: ${err}`);
    }
  }

  // To create pdf from the given array of objects
  async createPdf(files: string[] | Uint8Array[], options?: createOptions) {
    try {
      options = {
        size: 'do-not-change',
        orientation: 'portrait',
        mode: 'shrink-to-fit',
        position: 'center',
        opacity: 1,
        margin: [0, 0, 0, 0],
        ...options,
      };

      const imgs: Uint8Array[] = [];
      for (const file of files) {
        if (typeof file === 'string') {
          imgs.push(await this.readDoc(file));
        } else {
          imgs.push(file);
        }
      }

      let pdf = await imageToPdf(imgs);
      pdf = await resizePdf(pdf, options);
      if (options.margin) {
        pdf = await marginPdf(pdf, options.margin);
      }

      await this.ensureDoc();
      if (this.pdfDoc) {
        this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
      }
    } catch (err) {
      throw new Error(`Error converting to Pdf: ${err}`);
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
