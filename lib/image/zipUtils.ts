/**
 * Zero-dependency client-side ZIP archive generator.
 * Produces standard PKZIP 2.0 uncompressed archives directly from Blobs/Files in the browser.
 */

// CRC-32 table generator
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function calculateCRC32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileEntry {
  filename: string;
  data: Uint8Array | Blob;
}

export async function createZipArchive(files: ZipFileEntry[]): Promise<Blob> {
  const fileEntries: {
    filename: string;
    filenameBytes: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }[] = [];

  const localFileParts: Uint8Array[] = [];
  let currentOffset = 0;

  for (const file of files) {
    const dataBytes =
      file.data instanceof Uint8Array
        ? file.data
        : new Uint8Array(await file.data.arrayBuffer());

    const filenameBytes = new TextEncoder().encode(file.filename);
    const crc = calculateCRC32(dataBytes);

    // Local file header (30 bytes + filename)
    const header = new Uint8Array(30 + filenameBytes.length);
    const view = new DataView(header.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true);         // Version needed to extract (2.0)
    view.setUint16(6, 0, true);          // General purpose bit flag
    view.setUint16(8, 0, true);          // Compression method: 0 = Stored (no compression)
    view.setUint16(10, 0, true);         // File last modification time
    view.setUint16(12, 0, true);         // File last modification date
    view.setUint32(14, crc, true);       // CRC-32
    view.setUint32(18, dataBytes.length, true); // Compressed size
    view.setUint32(22, dataBytes.length, true); // Uncompressed size
    view.setUint16(26, filenameBytes.length, true); // Filename length
    view.setUint16(28, 0, true);         // Extra field length
    header.set(filenameBytes, 30);

    localFileParts.push(header);
    localFileParts.push(dataBytes);

    fileEntries.push({
      filename: file.filename,
      filenameBytes,
      data: dataBytes,
      crc,
      offset: currentOffset,
    });

    currentOffset += header.length + dataBytes.length;
  }

  // Central directory
  const centralDirParts: Uint8Array[] = [];
  let centralDirSize = 0;
  const centralDirStartOffset = currentOffset;

  for (const entry of fileEntries) {
    // Central directory file header (46 bytes + filename)
    const cdHeader = new Uint8Array(46 + entry.filenameBytes.length);
    const cdView = new DataView(cdHeader.buffer);

    cdView.setUint32(0, 0x02014b50, true); // Central file header signature
    cdView.setUint16(4, 20, true);         // Version made by (2.0)
    cdView.setUint16(6, 20, true);         // Version needed to extract (2.0)
    cdView.setUint16(8, 0, true);          // General purpose bit flag
    cdView.setUint16(10, 0, true);         // Compression method: 0 = Stored
    cdView.setUint16(12, 0, true);         // Mod time
    cdView.setUint16(14, 0, true);         // Mod date
    cdView.setUint32(16, entry.crc, true); // CRC-32
    cdView.setUint32(20, entry.data.length, true); // Compressed size
    cdView.setUint32(24, entry.data.length, true); // Uncompressed size
    cdView.setUint16(28, entry.filenameBytes.length, true); // Filename length
    cdView.setUint16(30, 0, true);         // Extra field length
    cdView.setUint16(32, 0, true);         // File comment length
    cdView.setUint16(34, 0, true);         // Disk number start
    cdView.setUint16(36, 0, true);         // Internal file attributes
    cdView.setUint32(38, 0, true);         // External file attributes
    cdView.setUint32(42, entry.offset, true); // Relative offset of local header
    cdHeader.set(entry.filenameBytes, 46);

    centralDirParts.push(cdHeader);
    centralDirSize += cdHeader.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdView.setUint16(4, 0, true);          // Number of this disk
  eocdView.setUint16(6, 0, true);          // Disk where central directory starts
  eocdView.setUint16(8, fileEntries.length, true);  // Number of central directory records on this disk
  eocdView.setUint16(10, fileEntries.length, true); // Total central directory records
  eocdView.setUint32(12, centralDirSize, true);     // Size of central directory
  eocdView.setUint32(16, centralDirStartOffset, true); // Offset of start of central directory
  eocdView.setUint16(20, 0, true);         // Comment length

  return new Blob([...localFileParts, ...centralDirParts, eocd], {
    type: 'application/zip',
  });
}
