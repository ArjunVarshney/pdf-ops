import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { fileType, range } from './types';

export default class PdfManipulator {
  protected pdfDoc: PDFDocument | undefined;

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
  protected async ensureDoc() {
    if (!this.pdfDoc) {
      await this.clearDoc();
    }
  }

  protected processOrder(order: range, pageCount: number) {
    const finalOrder: [number, number][] = [];
    for (const pageRange of order) {
      // if a range is provided
      if (typeof pageRange === 'object') {
        // change the end and start to 0 or n
        if (pageRange[0] === 'end') {
          pageRange[0] = pageCount;
        } else if (pageRange[0] === 'start') {
          pageRange[0] = 1;
        }
        if (pageRange[1] === 'end') {
          pageRange[1] = pageCount;
        } else if (pageRange[1] === 'start') {
          pageRange[1] = 1;
        }

        // if the range of order is in reverse reverese the pages
        if (pageRange[0] > pageRange[1]) {
          for (let i = pageRange[0]; i >= pageRange[1]; i--) {
            finalOrder.push([i - 1, i]);
          }
        }
        // if the range of the page is in correct order
        else if (pageRange[0] < pageRange[1]) {
          finalOrder.push([pageRange[0] - 1, pageRange[1]]);
        }
        // if the first and last of the order are same then consider it as a single digit
        else {
          finalOrder.push([pageRange[0], pageRange[0] + 1]);
        }
      }
      // if a single number is provided
      else if (typeof pageRange === 'number') {
        finalOrder.push([pageRange - 1, pageRange]);
      }
    }
    return finalOrder;
  }

  protected createFileBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const buffer = reader.result;
        if (buffer && buffer instanceof ArrayBuffer) resolve(buffer);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // To read the pdf file from the file system and convert it to a PDFDocument object
  protected async readDoc(file: fileType): Promise<PDFDocument> {
    try {
      let fileBuffer: ArrayBuffer | Uint8Array;

      if (file instanceof PDFDocument) return file;

      if (typeof file === 'string') {
        fileBuffer = await fs.promises.readFile(file);
      } else if (file instanceof ArrayBuffer || file instanceof Uint8Array) {
        fileBuffer = file;
      } else if (file instanceof File) {
        fileBuffer = await this.createFileBuffer(file);
      } else {
        throw new Error(`Error reading file ${file}`);
      }

      const pdfdoc = await PDFDocument.load(fileBuffer);
      return pdfdoc;
    } catch (err) {
      throw new Error(`Error reading file ${file}: ${err}`);
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
