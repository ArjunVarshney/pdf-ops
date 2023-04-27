import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { pdfToImage } from './pdf-micro-tools/pdfToImage';
import { splitPdf } from './pdf-micro-tools/splitPdf';
import { resizePdf } from './pdf-micro-tools/resizePdf';
import { resizeOptions } from './types';
import sharp from 'sharp';

export default class PdfToImageConverter {
  private imgDocs: Uint8Array[] = [];
  constructor() {
    this.clearDoc();
  }

  // To clear and reinitialize the pdfDoc
  async clearDoc() {
    this.imgDocs = [];
  }

  // Getter for the pdfDocs array
  getDocs() {
    return this.imgDocs;
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

  // to render all the pages of the Given pdf to image
  async renderToImage(file: string | PDFDocument, options?: resizeOptions) {
    try {
      let pdf;
      if (typeof file === 'string') {
        pdf = await this.readDoc(file);
      } else {
        pdf = file;
      }

      const finalOptions: resizeOptions = {
        size: 'do-not-change',
        orientation: 'portrait',
        ...options,
      };

      pdf = await resizePdf(pdf, finalOptions);
      const images = await pdfToImage(pdf);
      if (!images) return;
      this.imgDocs.push(...images);
    } catch (err) {
      throw new Error(`Error rendering the pdf: ${err}`);
    }
  }

  // Resize the pdf using a range specified by the user
  async renderToImageWithRange(
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
          await this.renderToImage(doc, part.options);
        }
      }
    } catch (err) {
      throw new Error(`Error rendering the pdf: ${err}`);
    }
  }

  // To save the resultant pdf in the file system
  async save(dirpath: string, dirname: string, exportType: 'png' | 'jpg' = 'png') {
    try {
      if (!(fs.existsSync(`${dirpath}/${dirname}`) && fs.lstatSync(`${dirpath}/${dirname}`).isDirectory())) {
        await fs.promises.mkdir(`${dirpath}/${dirname}`);
      }

      for (const [index, img] of this.imgDocs.entries()) {
        if (exportType === 'png')
          await fs.promises.writeFile(`${dirpath}/${dirname}/img${index + 1}.${exportType}`, img);
        else
          await fs.promises.writeFile(
            `${dirpath}/${dirname}/img${index + 1}.${exportType}`,
            await sharp(img).jpeg().toBuffer(),
          );
      }
    } catch (err) {
      throw new Error(`Error saving files to directory ${dirpath}/${dirname}: ${err}`);
    }
  }

  // To return the list of Uint8Array of all the images
  getImageBuffer() {
    try {
      const bufferList = [];
      for (const image of this.imgDocs) {
        bufferList.push(new Uint8Array(image));
      }

      return bufferList;
    } catch (err) {
      throw new Error(`Error returning bufffer: ${err}`);
    }
  }
}
