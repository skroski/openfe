import * as zlib from 'zlib';

export interface ZipEntry {
  filename: string;
  data: Buffer | string;
}

export class SimpleZip {
  private entries: ZipEntry[] = [];

  addFile(filename: string, content: Buffer | string): void {
    this.entries.push({ filename, data: content });
  }

  // Pre-computed CRC32 table
  private static crcTable: number[] = (() => {
    const table: number[] = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c;
    }
    return table;
  })();

  private static crc32(buf: Buffer): number {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ SimpleZip.crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  build(): Buffer {
    const localHeaders: Buffer[] = [];
    const centralHeaders: Buffer[] = [];
    let offset = 0;

    for (const entry of this.entries) {
      const rawBuf = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, 'utf-8');
      const compressed = zlib.deflateRawSync(rawBuf);
      const crc = SimpleZip.crc32(rawBuf);
      const nameBuf = Buffer.from(entry.filename, 'utf-8');

      // Local Header: 30 bytes + nameBuf.length
      const local = Buffer.alloc(30 + nameBuf.length);
      local.writeUInt32LE(0x04034b50, 0); // signature
      local.writeUInt16LE(20, 4); // version needed (2.0)
      local.writeUInt16LE(0, 6); // general flags
      local.writeUInt16LE(8, 8); // compression method (8 = deflate)
      local.writeUInt16LE(0, 10); // file time
      local.writeUInt16LE(0, 12); // file date
      local.writeUInt32LE(crc, 14); // crc-32
      local.writeUInt32LE(compressed.length, 18); // compressed size
      local.writeUInt32LE(rawBuf.length, 22); // uncompressed size
      local.writeUInt16LE(nameBuf.length, 26); // filename length
      local.writeUInt16LE(0, 28); // extra field length
      nameBuf.copy(local, 30);

      // Central Directory Header: 46 bytes + nameBuf.length
      const central = Buffer.alloc(46 + nameBuf.length);
      central.writeUInt32LE(0x02014b50, 0); // central signature
      central.writeUInt16LE(20, 4); // version made by
      central.writeUInt16LE(20, 6); // version needed
      central.writeUInt16LE(0, 8); // flags
      central.writeUInt16LE(8, 10); // compression method
      central.writeUInt16LE(0, 12); // time
      central.writeUInt16LE(0, 14); // date
      central.writeUInt32LE(crc, 16); // crc-32
      central.writeUInt32LE(compressed.length, 20); // compressed size
      central.writeUInt32LE(rawBuf.length, 24); // uncompressed size
      central.writeUInt16LE(nameBuf.length, 28); // filename length
      central.writeUInt16LE(0, 30); // extra field length
      central.writeUInt16LE(0, 32); // file comment length
      central.writeUInt16LE(0, 34); // disk number start
      central.writeUInt16LE(0, 36); // internal attributes
      central.writeUInt32LE(0, 38); // external attributes
      central.writeUInt32LE(offset, 42); // relative offset of local header
      nameBuf.copy(central, 46);

      localHeaders.push(local, compressed);
      centralHeaders.push(central);

      offset += local.length + compressed.length;
    }

    const centralStart = offset;
    const centralTotalSize = centralHeaders.reduce((acc, h) => acc + h.length, 0);

    // End of Central Directory Record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
    eocd.writeUInt16LE(0, 4); // disk number
    eocd.writeUInt16LE(0, 6); // start disk
    eocd.writeUInt16LE(this.entries.length, 8); // records on disk
    eocd.writeUInt16LE(this.entries.length, 10); // total records
    eocd.writeUInt32LE(centralTotalSize, 12); // size of central directory
    eocd.writeUInt32LE(centralStart, 16); // offset of central directory
    eocd.writeUInt16LE(0, 20); // comment length

    return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  }
}

