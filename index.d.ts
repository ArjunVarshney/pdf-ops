import { PDFDocument } from 'pdf-lib';

export type resizeOptions = {
  size:
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
};

export type createOptions = resizeOptions & {
  opacity?: number;
  degrees?: number;
  margin?: [number, number, number, number];
};

export type fileType = string | File | ArrayBuffer | PDFDocument | Uint8Array | Blob;

declare module 'pdf-ops' {
  export class PdfMerger {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any;
    merge(files: fileType[]): Promise<void>;
    mergeWithRange(orderList: { filepath: fileType; range: [number, number][] }[]): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array | undefined>;
  }

  export class PdfSplitter {
    constructor();
    clearDoc(): Promise<void>;
    getDocs(): any[];
    split(filepath: fileType): Promise<void>;
    splitWithRange(filepath: fileType, range: [number, number][]): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfRotator {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any;
    rotate(file: fileType, degree: number): Promise<void>;
    rotateWithRange(orderList: { file: fileType; range: [number, number][]; degree: number }[]): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfResizer {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any[];
    resize(file: fileType, options?: resizeOptions): Promise<void>;
    resizeWithRange(orderList: { file: fileType; range: [number, number][]; options?: resizeOptions }): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfMarginManipulator {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any[];
    addMargin(file: fileType, margin: [number, number, number, number]): Promise<void>;
    addMarginWithRange(
      orderList: {
        file: fileType;
        range: [number, number][];
        margin: [number, number, number, number];
      }[],
    ): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class ImageToPdfConverter {
    constructor();
    clearDoc(): Promise<void>;
    createPdf(files: (string | Uint8Array | File)[], options?: createOptions): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }
}
