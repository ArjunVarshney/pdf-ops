import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import PdfManipulator from '../PdfManipulator';
import { range } from '../types';

export default class PdfSplitter extends PdfManipulator {
  private pdfDocs: PDFDocument[];

  constructor() {
    super();
    this.pdfDocs = [];
  }

  // To clear and reintialize the pdfDocs to an empty array
  async clearDoc() {
    this.pdfDocs = [];
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
  async splitWithRange(filepath: string, ranges: range) {
    try {
      const pdf = await this.readDoc(filepath);
      const r = this.processOrder(ranges, pdf.getPageCount());
      const splitted = await splitPdf(pdf, r);
      this.pdfDocs.push(...splitted);
    } catch (err) {
      throw new Error(`Error splitting ${filepath}: ${err}`);
    }
  }

  // To save the resultant pdf in the file system
  // @ts-ignore
  async save(dirpath: string, dirname: string, basename: string = 'split') {
    try {
      if (!(fs.existsSync(`${dirpath}/${dirname}`) && fs.lstatSync(`${dirpath}/${dirname}`).isDirectory())) {
        await fs.promises.mkdir(`${dirpath}/${dirname}`);
      }
      for (const [index, pdf] of this.pdfDocs.entries()) {
        const buffer = await pdf.save();
        await fs.promises.writeFile(`${dirpath}/${dirname}/${basename}${index + 1}.pdf`, buffer);
      }
    } catch (err) {
      throw new Error(`Error saving files to directory ${dirpath}/${dirname}: ${err}`);
    }
  }

  // To return the buffer of the resultant pdfBuffer
  // @ts-ignore
  async getPdfBuffer(): Promise<Uint8Array[]> {
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
