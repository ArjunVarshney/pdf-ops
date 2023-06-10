import fs from 'fs';
import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { imageToPdf } from '../pdf-micro-tools/imageToPdf';
import { createOptions } from '../types';
import { resizePdf } from '../pdf-micro-tools/resizePdf';
import { marginPdf } from '../pdf-micro-tools/marginPdf';
import PdfManipulator from '../PdfManipulator';

export default class ImageToPdfConverter extends PdfManipulator {
  // To read the pdf file from the file system and convert it to a PDFDocument object
  // @ts-ignore
  private async readDoc(file: string): Promise<Uint8Array> {
    try {
      const fileBuffer = await fs.promises.readFile(file);
      return fileBuffer;
    } catch (err) {
      throw new Error(`Error reading file ${file}: ${err}`);
    }
  }

  // To create pdf from the given array of objects
  async createPdf(files: (string | Uint8Array | File)[], options?: createOptions) {
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
        } else if (file instanceof File) {
          imgs.push(new Uint8Array(await this.createFileBuffer(file)));
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
}
