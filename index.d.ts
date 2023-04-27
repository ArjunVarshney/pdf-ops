type resizeOptions = {
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

declare module 'pdf-ops' {
  export class PdfMerger {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any;
    merge(files: string[]): Promise<void>;
    mergeWithRange(orderList: { filepath: string; range: [number, number][] }[]): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array | undefined>;
  }

  export class PdfSplitter {
    constructor();
    clearDoc(): Promise<void>;
    getDocs(): any[];
    split(filepath: string): Promise<void>;
    splitWithRange(filepath: string, range: [number, number][]): Promise<void>;
    save(dirpath: string, dirname: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfRotator {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any;
    rotate(file: string, degree: number): Promise<void>;
    rotateWithRange(orderList: { file: string; range: [number, number][]; degree: number }[]): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfResizer {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any[];
    resize(file: string, options?: resizeOptions): Promise<void>;
    resizeWithRange(orderList: { file: string; range: [number, number][]; options?: resizeOptions }): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfToImageConverter {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): Uint8Array[];
    renderToImage(file: string, options?: resizeOptions): Promise<void>;
    renderToImageWithRange(orderList: {
      file: string;
      range: [number, number][];
      options?: resizeOptions;
    }): Promise<void>;
    save(dirpath: string, dirname: string): Promise<void>;
    getImageBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class PdfMarginManipulator {
    constructor();
    clearDoc(): Promise<void>;
    getDoc(): any[];
    addMargin(file: string, margin: [number, number, number, number]): Promise<void>;
    addMarginWithRange(
      orderList: {
        file: string;
        range: [number, number][];
        margin: [number, number, number, number];
      }[],
    ): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }

  export class ImageToPdfConverter {
    constructor();
    clearDoc(): Promise<void>;
    createPdf(files: string[] | Uint8Array[], options?: createOptions): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }
}
