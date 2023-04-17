# Pdf-Ops

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Features](#features)
- [Usage Example](#usage-examples)
  - [Split Pdfs](#split-pdfs)
    - [Split PDF into single paged PDFs](#split-pdf-into-single-paged-pdfs)
    - [Split PDF with range specification](#split-pdf-with-range-specification)
    - [Split multiple PDFs with a single object](#split-multiple-pdfs-with-a-single-object)
    - [Merge Splitted PDfs into a sigle PDF](#merge-splitted-pdfs-into-a-sigle-pdf)
    - [Get array of buffer of the resultant PDFs](#get-array-of-buffer-of-the-resultant-pdfs)
  - [Merge Pdfs](#merge-pdfs)
    - [Merge multiple PDFs (all pages of all PDFs) into a single PDF](#merge-multiple-pdfs-all-pages-of-all-pdfs-into-a-single-pdf)
    - [Merge multiple PDFs with range specification](#merge-multiple-pdfs-with-range-specification)
    - [Merge multiple PDFs multiple times with a single object](#merge-multiple-pdfs-multiple-times-with-a-single-object)
    - [Get buffer of the resultant merged PDF](#get-buffer-of-the-resultant-pdf)
  - [Rotate Pdfs](#rotate-pdf)
    - Rotate all pages of a PDF
    - Rotate pages of different PDFs with range specification
    - Merge multiple rotated pdf with single object
    - Get buffer of the resultant rotated PDF

## Description

This node js package is able to merge or split pdfs as desired and is able to save the resultant pdf as a new file or return a file Buffer.

## Installation

`npm install --save pdf-ops`

## Features

- Split PDFs
- Merge PDFs

## Usage Examples

> **Note** - All the pdf files in these examples are not kept directly inside of the root folder but in a folder named "test_files" inside the root folder

### Split Pdfs

#### **Split PDF into single paged PDFs**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Split the desired pdf
  await splitter.split('test_files/pdf1.pdf');

  // Save the folder carrying all the pdfs
  // The first parameter is the path of the directory in which it will get stored
  // The second parameter is the name of the folder
  await splitter.save('./test_files', 'split');
})();
```

For [pdf1](/example-files/pdf1.pdf) the folder formed will be [split](/example-files/split/) inside the directory "test_files"

#### **Split PDF with range specification**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Split the desired pdf into desired parts
  await splitter.splitWithRange('test_files/pdf2.pdf', [
    [0, 1],
    [1, 3],
    [3, 6],
  ]);

  // Save the folder carrying all the pdfs
  // The first parameter is the path of the directory in which it will get stored
  // The second parameter is the name of the folder
  await splitter.save('./test_files', 'splitWithRange');
})();
```

For [pdf2](/example-files/pdf2.pdf) the folder formed will be [splitWithRange](/example-files/splitWithRange/) inside the directory "test_files"

#### **Split multiple PDFs with a single object**

- You can keep on adding more and more pdf files in the same object, when you will save the pdfs, all of them will be in the same folder, in the order in which they were splitted

- Saving the file does not clear out the existing object, as you populate more and more pdfs in the same object they will keep on getting accumulated.

- For clearing all the pdfs stored in the object you can use `splitter.clearDoc()` to reinitialize a new empty PdfSplitter object

- Let us put all the above into a expample for explanation

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Splitting pdf1 into two pdfs
  await splitter.splitWithRange('test_files/pdf1.pdf', [
    [0, 3],
    [3, 6],
  ]);

  // Splitting pdf2 into single paged pdfs
  // The splitted pdf1 and pdf2 are now in the same object
  await splitter.split('test_files/pdf2.pdf');

  // Saving the pdfs in the folder named split1
  await splitter.save('./test_files', 'split1');

  // Splitting pdf4 into 3 parts and putting it into same object
  await splitter.splitWithRange('test_files/pdf4.pdf', [
    [0, 2],
    [2, 4],
    [4, 6],
  ]);

  // Saving the pdfs in the folder named split2
  await splitter.save('./test_files', 'split2');

  // Clearing all the pdfs in the splitter object to empty it
  await splitter.clearDoc();

  // Splitting pdf3 in reverse order
  await splitter.splitWithRange('test_files/pdf3.pdf', [
    [5, 6],
    [4, 5],
    [3, 4],
    [2, 3],
    [1, 2],
    [0, 1],
  ]);

  // Saving the pdfs in the folder named split3
  await splitter.save('./test_files', 'split3');
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [split1](/example-files/split1/), [split2](/example-files/split2/), and [split3](/example-files/split3/) will look like this.

#### **Merge Splitted PDfs into a sigle PDF**

```js
import { PdfMerger, PdfSplitter } from 'pdf-ops';

(async () => {
  const splitter = new PdfSplitter();
  await splitter.splitWithRange('test_files/pdf1.pdf', [[0, 3]]);
  await splitter.split('test_files/pdf2.pdf');
  await splitter.splitWithRange('test_files/pdf1.pdf', [[3, 6]]);

  // To merge the pdfs in the splitter
  // Make an object of PdfMerger
  const merger = new PdfMerger();

  // Pass the docs of splitter into merger
  await merger.merge(splitter.getDocs());

  // save the merged pdf
  await merger.save('test_files/split-merged.pdf');
})();
```

- If [pdf1](/example-files/pdf1.pdf), and [pdf2](/example-files/pdf2.pdf) look like this.
- Then [split-merged.pdf](/example-files/split-merged.pdf) will look like this.

#### **Get array of buffer of the resultant PDFs**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await splitter.getPdfBuffer()` and it will return you the array of buffers of all the splitted pdfs

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  const splitter = new PdfSplitter();

  // Split the desired pdfs
  await splitter.splitWithRange('test_files/pdf1.pdf', [[0, 3]]);
  await splitter.split('test_files/pdf2.pdf');
  await splitter.splitWithRange('test_files/pdf1.pdf', [[3, 6]]);

  // Get pdf buffer
  const bufferList = await splitter.getPdfBuffer();

  console.log(bufferList);
})();
```

### Merge Pdfs

#### **Merge multiple PDFs (all pages of all PDFs) into a single PDF**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // Give the paths of all the pdfs inside an array
  await merger.merge(['test_files/pdf1.pdf', 'test_files/pdf2.pdf', 'test_files/pdf3.pdf']);

  // Save the resultant file on the desired location
  await merger.save('test_files/merged.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf) will generate [merged.pdf](/example-files/merged.pdf)

#### **Merge multiple PDFs with range specification**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // Specify the filepath with the range
  // The range works just like array indexing
  // [start, end] start page is included and end page is excluded
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf4.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf1.pdf',
      range: [[0, 2]],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [[2, 4]],
    },
    {
      filepath: 'test_files/pdf3.pdf',
      range: [[4, 6]],
    },
  ]);

  // Save the resultant file on the desired path
  await merger.save('test_files/mergedWithRange.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) will generate [mergedWithRange.pdf](/example-files/mergedWithRange.pdf)

#### **Merge multiple PDFs multiple times with a single object**

- You can keep on adding more and more pdfs in the same object and save whenever you want.

- Saving the pdf file does not clear the object and if you add new pages into it, they will succeed the pages already present in the object

- For clearing the object you can use `merger.clearDoc()`. This will remove all the pages from the object

- Let's put all the above into one example for explanation

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // first merging some pages of pdf1 and pdf2
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf1.pdf',
      range: [[0, 2]],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [[4, 6]],
    },
  ]);

  // merging all the pages of pdf4 into the already populated object
  await merger.merge(['test_files/pdf4.pdf']);

  // saving it as merge1.pdf
  await merger.save('test_files/merge1.pdf');

  // merging some pages of pdf3 into the already populated object
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf3.pdf',
      range: [[1, 4]],
    },
  ]);

  // saving it as merge2.pdf
  await merger.save('test_files/merge2.pdf');

  // clearing all the pages from the object
  await merger.clearDoc();

  // merging first and last page of pdf1, pdf2, pdf3, pdf4
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf1.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf3.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf4.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
  ]);
  // saving it as merge3.pdf
  await merger.save('test_files/merge3.pdf');
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [merge1](/example-files/merge1.pdf), [merge2](/example-files/merge2.pdf), and [merge3](/example-files/merge3.pdf) will look like this.

#### **Get buffer of the resultant PDF**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await merger.getPdfBuffer()` and it will return you the buffer of the merged pdf

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  const merger = new PdfMerger();

  // Merge the desired pdfs
  await merger.mergeWithRange([
    { filepath: 'test_files/pdf1.pdf', range: [[0, 2]] },
    { filepath: 'test_files/pdf2.pdf', range: [[4, 6]] },
  ]);
  await merger.merge(['test_files/pdf4.pdf']);

  // Get the buffer of the merged pdfs
  const buffer = await merger.getPdfBuffer();

  console.log(buffer);
})();
```

### Rotate Pdfs

#### **Rotate all pages of a PDF**

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // rotate the desired pdf
  // the angle should be a multiple of 90
  await rotator.rotate('test_files/pdf1.pdf', 90);

  // Save the rotated Pdf
  await rotator.save('test_files/rotated.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf) will generate [rotated.pdf](/example-files/rotated.pdf)

#### **Rotate pages of different PDFs with range specification**

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // Give an array of objects which contains
  // file, range, degree
  // as given in the example
  await rotator.rotateWithRange([
    {
      // give the filepath inside the file field
      file: 'test_files/pdf1.pdf',
      // range is a list of range of pages
      // the range is specified as [start, end]
      // start page is included and end page is excluded
      range: [
        [0, 2],
        [4, 6],
      ],
      // degree should be a multiple of 90
      degree: 90,
    },
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [4, 5],
      ],
      degree: -90,
    },
    {
      file: 'test_files/pdf3.pdf',
      range: [
        [4, 6],
        [0, 2],
      ],
      degree: 180,
    },
  ]);

  // Save the rotated Pdf
  await rotator.save('test_files/rotatedWithRange.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf) will generate [rotatedWithRange.pdf](/example-files/rotatedWithRange.pdf)

#### **Merge multiple rotated pdf with single object**

- The rotated pdfs rotated with a single object will be automatically merged in order in which they were rotated

- The object will not be cleared after saving the file, therefore the pdfs will keep on getting merged into the previously rotated pdf files

- For clearing the pages in the object use `await rotator.clearDoc()`

- Lets put all this into an example for explanation

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // rotating pdf1 90 degrees
  await rotator.rotate('test_files/pdf1.pdf', 90);

  // rotating some pages of pdf3 180 degrees and merging into previous pdf
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf3.pdf',
      range: [[1, 5]],
      degree: 180,
    },
  ]);

  // saving the resultant pdf file as rotated1.pdf
  await rotator.save('test_files/rotated1.pdf');

  // rotating some pages and merging pdf2 and rotating it -90 degrees
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
      degree: -90,
    },
  ]);

  // saving the resultant file as rotated2.pdf
  await rotator.save('test_files/rotated2.pdf');

  // clearing all the pages of the object
  await rotator.clearDoc();

  // rotating pdf4 by 0 degrees
  await rotator.rotate('test_files/pdf4.pdf', 0);

  // saving the resultant file as rotated3.pdf
  await rotator.save('test_files/rotated3.pdf');
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [rotated1.pdf](/example-files/rotated1.pdf), [rotated2.pdf](/example-files/rotated2.pdf), and [rotated3.pdf](/example-files/rotated3.pdf) will look like this

#### **Get buffer of the resultant rotated PDF**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await rotator.getPdfBuffer()` and it will return you the buffer of the resultant pdf

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  const rotator = new PdfRotator();

  // Rotate the pdfs as desired
  await rotator.rotate('test_files/pdf1.pdf', 90);
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf3.pdf',
      range: [[1, 5]],
      degree: 180,
    },
  ]);
  await rotator.rotate('test_files/pdf4.pdf', 0);

  // To the the buffer of the resultant pdf
  const buffer = await rotator.getPdfBuffer();

  console.log(buffer);
})();
```