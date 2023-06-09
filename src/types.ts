import { PDFDocument } from 'pdf-lib';

export type range = (number | [number | 'start' | 'end', number | 'start' | 'end'])[];

export type fileType = File | ArrayBuffer | PDFDocument | Uint8Array | Blob;

export type resizeOptions = {
  size?:
    | [number, number]
    | 'do-not-change'
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
  margin?: [number, number, number, number];
};
