import { PDFDocument } from 'pdf-lib';

export type resizeOptions = {
  size?:
    | [number, number]
    | '4A0'
    | '2A0'
    | 'A0'
    | 'A1'
    | 'A2'
    | 'A3'
    | 'A4'
    | 'A5'
    | 'A6'
    | 'A7'
    | 'A8'
    | 'A9'
    | 'A10'
    | 'B0'
    | 'B1'
    | 'B2'
    | 'B3'
    | 'B4'
    | 'B5'
    | 'B6'
    | 'B7'
    | 'B8'
    | 'B9'
    | 'B10'
    | 'C0'
    | 'C1'
    | 'C2'
    | 'C3'
    | 'C4'
    | 'C5'
    | 'C6'
    | 'C7'
    | 'C8'
    | 'C9'
    | 'C10'
    | 'RA0'
    | 'RA1'
    | 'RA2'
    | 'RA3'
    | 'RA4'
    | 'SRA0'
    | 'SRA1'
    | 'SRA2'
    | 'SRA3'
    | 'SRA4'
    | 'Executive'
    | 'Folio'
    | 'Legal'
    | 'Letter'
    | 'Tabloid';
  orientation?: 'portrait' | 'landscape';
  mode?: 'shrink-to-fit' | 'fit-to-page' | 'crop';
  position?:
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-right'
    | 'bottom-left'
    | 'center-left'
    | 'center-right'
    | 'center-top'
    | 'center-bottom';
  rest?: restType;
};

export type createOptions = resizeOptions & {
  opacity?: number;
  degrees?: number;
  margin?: [number, number, number, number];
};

type restType = 'include' | 'exclude' | undefined | null;

export type fileType = File | ArrayBuffer | PDFDocument | Uint8Array | Blob;

declare module 'pdf-ops' {
  class PdfManipulator {
    pdfDocs: PDFDocument | undefined;
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): PDFDocument;
    ensureDoc(): Promise<void>;
    processOrder(): Promise<[number, number]>;
    readDoc(): Promise<PDFDocument>;
    getPdfBuffer(): Promise<Uint8Array | Uint8Array[]>;
  }
  export class PdfMerger extends PdfManipulator {
    merge(files: fileType[]): Promise<void>;
    mergeWithRange(orderList: { filepath: fileType; range: [number, number][] }[]): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array>;
  }

  export class PdfSplitter extends PdfManipulator {
    constructor();
    clearDoc(): Promise<void>;
    getDocs(): any[];
    split(filepath: fileType): Promise<void>;
    splitWithRange(filepath: fileType, range: [number, number][]): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[]>;
  }

  export class PdfRotator extends PdfManipulator {
    rotate(file: fileType, degree: number): Promise<void>;
    rotateWithRange(
      orderList: { file: fileType; range: [number, number][]; degree: number; rest?: restType }[],
    ): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array>;
  }

  export class PdfResizer extends PdfManipulator {
    resize(file: fileType, options?: resizeOptions): Promise<void>;
    resizeWithRange(orderList: { file: fileType; range: [number, number][]; options?: resizeOptions }): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array>;
  }

  export class PdfMarginManipulator extends PdfManipulator {
    addMargin(file: fileType, margin: [number, number, number, number]): Promise<void>;
    addMarginWithRange(
      orderList: {
        file: fileType;
        range: [number, number][];
        margin: [number, number, number, number];
        rest?: restType;
      }[],
    ): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array>;
  }

  export class ImageToPdfConverter extends PdfManipulator {
    createPdf(files: (string | Uint8Array | File)[], options?: createOptions): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array>;
  }
}
