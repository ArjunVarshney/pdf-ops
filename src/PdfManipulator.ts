import { PDFDocument } from 'pdf-lib';
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

  protected processOrder(order: range, pageCount: number, allowRev: boolean = true) {
    const finalOrder: [number, number][] = [];
    for (let pageRange of order) {
      // if a range is provided
      if (
        typeof pageRange === 'object' &&
        pageRange[0] === pageRange[1] &&
        pageRange[0] !== 'start' &&
        pageRange[0] !== 'end'
      ) {
        pageRange = pageRange[0];
      }
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
        if (pageRange[0] > pageRange[1] && allowRev && pageRange[0] <= pageCount) {
          for (let i = pageRange[0]; i >= pageRange[1]; i--) {
            finalOrder.push([i - 1, i]);
          }
        }
        // if the range of the page is in correct order
        else if (pageRange[0] < pageRange[1] && pageRange[1] <= pageCount) {
          finalOrder.push([pageRange[0] - 1, pageRange[1]]);
        }
        // if the first and last of the order are same then consider it as a single digit
        else if (pageRange[0] == pageRange[1] && pageRange[0] <= pageCount) {
          finalOrder.push([pageRange[0] - 1, pageRange[0]]);
        }
      }
      // if a single number is provided
      else if (typeof pageRange === 'number' && pageRange <= pageCount) {
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
  protected blobToUint8Array(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (!reader.result || typeof reader.result === 'string') return;
        const uint8Array = new Uint8Array(reader.result);
        resolve(uint8Array);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  // To read the pdf file from the file system and convert it to a PDFDocument object
  protected async readDoc(file: fileType): Promise<PDFDocument> {
    try {
      let fileBuffer: ArrayBuffer | Uint8Array;

      if (file instanceof PDFDocument) return file;

      if (file instanceof ArrayBuffer || file instanceof Uint8Array) {
        fileBuffer = file;
      } else if (file instanceof File) {
        fileBuffer = await this.createFileBuffer(file);
      } else if (file instanceof Blob) {
        fileBuffer = await this.blobToUint8Array(file);
      } else {
        throw new Error(`Error reading file ${file}`);
      }

      const pdfdoc = await PDFDocument.load(fileBuffer);
      return pdfdoc;
    } catch (err) {
      throw new Error(`Error reading file ${file}: ${err}`);
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
