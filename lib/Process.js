const path = require('path');
const fs = require('fs');
const Modal = require('./utils/Modal');
const utils = require('./utils/utils');
const Chunks = require('./utils/Chunks');

/**
 *
 * read Chunks as files or folders
 */
class Process extends Modal {
  generateReport() {
    this.iterator();
    this.report = {
      positive: {
        number: Object.keys(this.chunksFollowedStructure).length,
        detailsOfChunks: this.chunksFollowedStructure,
      },
      negative: {
        number:
          Object.keys(this.chunksNotExist_DefinedInStructure).length,
        detailsOfChunks: this.chunksNotExist_DefinedInStructure,
      },
      neutral: {
        number:
          Object.keys(this.chunksExists_NotDefinedInStructure).length,
        detailsOfChunks: this.chunksExists_NotDefinedInStructure,
      },
    };
    return this.report;
  }

  iterator(structure = this.structure, currPath = this.rootPath) {
    if (utils.nodeExists(structure)) {
      const chunks = new Chunks(structure, currPath);
      if (!chunks.existanceOfcurrPath) return;

      chunks.listOfChunksInStructure.forEach((Chunk) => {
        if (!utils.isChunkSpecific(Chunk)) {
          // chunk is regex
          chunks.createRegexChunk(Chunk, this.level);
          this.chunkIsRegex(chunks);
        } else {
          // chunk is file or folder
          chunks.addChunkExistance(Chunk);
          chunks.createChunk(Chunk, this.level);
          this.processChunk(chunks);
        }
      });

      // here find chunks which is in cwd but not defined
      chunks.chunkListInCD.forEach((ChunkInCD) => {
        const pathOfChunk = path.resolve(currPath, ChunkInCD);
        if (!utils.chunkIsDefinedInStructure(ChunkInCD, chunks.chunksThatExistInCD)) {
          this.chunksExists_NotDefinedInStructure = {
            ...this.chunksExists_NotDefinedInStructure,
            [pathOfChunk]: {
              level: this.level,
              Chunk: ChunkInCD,
            },
          };
        }
      });
    }
  }

  chunkIsRegex(chunks) {
    if (chunks.regexMatchedChunksInCD.length) {
      // if any regex is matched
      chunks.regexMatchedChunksInCD.forEach((regexMatchedChunk) => {
        chunks.ChunkPath = path.resolve(chunks.currPath, regexMatchedChunk);
        chunks.ChunkExistInCD = fs.existsSync(chunks.ChunkPath);
        chunks.addChunkExistance(regexMatchedChunk);
        // process
        this.processChunk(chunks);
      });
    } else {
      // no regex matched
      this.chunksNotExist_DefinedInStructure = {
        ...this.chunksExists_NotDefinedInStructure,
        [chunks.ChunkNameInStructure]: {
          type: chunks.ChunkType,
          level: chunks.ChunkLevel,
          Chunk: chunks.Chunk.match,
        },
      };
    }
  }

  processChunk(chunks) {
    if (utils.isChunkFolder(chunks.structure, chunks.ChunkNameInStructure)) {
      // chunk is folder
      chunks.ChunkType = 'Folder';
      if (chunks.ChunkExistInCD) {
        this.addExistedChunkToModal(chunks);
      } else this.addNotExistedButDefinedChunkToModal(chunks);

      this.level += 1;
      this.iterator(chunks.structure.childStruct[chunks.ChunkNameInStructure], chunks.ChunkPath);
      this.level -= 1;
    } else if (chunks.ChunkExistInCD) {
      this.addExistedChunkToModal(chunks);
    } else this.addNotExistedButDefinedChunkToModal(chunks);
  }

  addExistedChunkToModal(chunks) {
    this.chunksFollowedStructure = {
      ...this.chunksFollowedStructure,
      [chunks.ChunkPath]: {
        type: chunks.ChunkType,
        level: chunks.ChunkLevel,
        Chunk: chunks.ChunkNameInStructure,
      },
    };
  }

  addNotExistedButDefinedChunkToModal(chunks) {
    this.chunksNotExist_DefinedInStructure = {
      ...this.chunksNotExist_DefinedInStructure,
      [chunks.ChunkPath]: {
        type: chunks.ChunkType,
        level: chunks.ChunkLevel,
        Chunk: chunks.ChunkNameInStructure,
      },
    };
  }
}

module.exports = Process;
