declare module 'pdf-ops' {
  export class PdfMerger {
    constructor();
    clearDoc(): Promise<void>;
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
    rotate(file: string, degree: number): Promise<void>;
    rotateWithRange(orderList: { file: string; range: [number, number][]; degree: number }[]): Promise<void>;
    save(filepath: string): Promise<void>;
    getPdfBuffer(): Promise<Uint8Array[] | undefined>;
  }
}
