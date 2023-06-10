import fs from 'fs';
import { pdfToImage } from '../pdf-micro-tools/pdfToImage';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import { resizePdf } from '../pdf-micro-tools/resizePdf';
import { fileType, range, resizeOptions } from '../types';
import sharp from 'sharp';
import PdfManipulator from '../PdfManipulator';

export default class PdfToImageConverter extends PdfManipulator {
  private imgDocs: Uint8Array[] = [];

  constructor() {
    super();
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

  // to render all the pages of the Given pdf to image
  async renderToImage(file: fileType, options?: resizeOptions) {
    try {
      let pdf;
      pdf = await this.readDoc(file);
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
      file: fileType;
      range: range;
      options?: resizeOptions;
    }[],
  ) {
    try {
      for (const part of orderList) {
        let pdf;
        pdf = await this.readDoc(part.file);

        const r = this.processOrder(part.range, pdf.getPageCount());
        const splitted = await splitPdf(pdf, r);

        for (const doc of splitted) {
          await this.renderToImage(doc, part.options);
        }
      }
    } catch (err) {
      throw new Error(`Error rendering the pdf: ${err}`);
    }
  }

  // To save the resultant pdf in the file system
  // @ts-ignore
  async save(dirpath: string, dirname: string, exportType: 'png' | 'jpg' = 'png', basename: string = 'img') {
    try {
      if (!(fs.existsSync(`${dirpath}/${dirname}`) && fs.lstatSync(`${dirpath}/${dirname}`).isDirectory())) {
        await fs.promises.mkdir(`${dirpath}/${dirname}`);
      }

      for (const [index, img] of this.imgDocs.entries()) {
        if (exportType === 'png')
          await fs.promises.writeFile(`${dirpath}/${dirname}/${basename}${index + 1}.${exportType}`, img);
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
