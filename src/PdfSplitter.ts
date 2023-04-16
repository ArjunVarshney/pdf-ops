import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { splitPdf } from './pdf-micro-tools/splitPdf';

export default class PdfSplitter {
  private pdfDocs: PDFDocument[];

  constructor() {
    this.pdfDocs = [];
  }

  // To clear and reintialize the pdfDocs to an empty array
  async clearDoc() {
    this.pdfDocs = [];
  }

  // To read the document from the file system and convert it into a PDFDocument object
  private async readDoc(filepath: string): Promise<PDFDocument> {
    try {
      const fileBuffer = await fs.promises.readFile(filepath);
      const file = await PDFDocument.load(fileBuffer);
      return file;
    } catch (err) {
      throw new Error(`Error reading file ${filepath}: ${err}`);
    }
  }

  // Getter for the pdfDocs array
  getDocs() {
    return this.pdfDocs;
  }

  // To split the pdf from the file system into single paged Pdfs
  async split(filepath: string) {
    try {
      const pdf = await this.readDoc(filepath);
      const rangeArr: [number, number][] = [];
      for (let i = 0; i < pdf.getPageIndices().length; i++) {
        rangeArr.push([i, i + 1]);
      }
      const splitted = await splitPdf(pdf, rangeArr);
      this.pdfDocs.push(...splitted);
    } catch (err) {
      throw new Error(`Error splitting ${filepath}: ${err}`);
    }
  }

  // To split the pdf from the file system based on the given range
  async splitWithRange(filepath: string, range: [number, number][]) {
    try {
      const pdf = await this.readDoc(filepath);
      const splitted = await splitPdf(pdf, range);
      this.pdfDocs.push(...splitted);
    } catch (err) {
      throw new Error(`Error splitting ${filepath}: ${err}`);
    }
  }

  // To save the resultant pdf in the file system
  async save(dirpath: string, dirname: string) {
    try {
      if (!(fs.existsSync(`${dirpath}/${dirname}`) && fs.lstatSync(`${dirpath}/${dirname}`).isDirectory())) {
        await fs.promises.mkdir(`${dirpath}/${dirname}`);
      }

      for (const [index, pdf] of this.pdfDocs.entries()) {
        const buffer = await pdf.save();
        await fs.promises.writeFile(`${dirpath}/${dirname}/split${index + 1}.pdf`, buffer);
      }
    } catch (err) {
      throw new Error(`Error saving files to directory ${dirpath}/${dirname}: ${err}`);
    }
  }

  // To return the buffer of the resultant pdf
  async getPdfBuffer() {
    try {
      const bufferArr = [];
      for (const pdf of this.pdfDocs) {
        const buffer = await pdf.save();
        bufferArr.push(buffer);
      }
      return bufferArr;
    } catch (err) {
      throw new Error(`Error generating buffer: ${err}`);
    }
  }
}
