const path = require('path');
const fs = require('fs');
const micromatch = require('micromatch');
const Modal = require('./utils/Modal');
const utils = require('./utils/utils');

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
    console.debug(this.report);
    return this.report;
  }

  iterator(structure = this.structure, currPath = this.rootPath) {
    if (utils.nodeExists(structure)) {
      const listOfChunksOfDefinedStructure = [...structure.root];
      const chunksThatExistInCWD = {};
      const existOfCurrentPathInCWD = fs.existsSync(currPath);
      if (!existOfCurrentPathInCWD) return;
      const chunkListInCWD = fs.readdirSync(currPath);

      listOfChunksOfDefinedStructure.forEach((Chunk) => {
        if (!utils.isChunkSpecific(Chunk)) {
          // if chunk is in regex form
          this.chunkIsRegex(structure, currPath, Chunk, chunkListInCWD, chunksThatExistInCWD);
        } else {
          const pathWithChunk = path.resolve(currPath, Chunk);
          chunksThatExistInCWD[Chunk] = true;
          this.processChunk(structure, pathWithChunk, Chunk, this.level, Chunk);
        }
      });
      // here find the chunks which is in cwd but is not defined
      if (existOfCurrentPathInCWD) {
        chunkListInCWD.forEach((ChunkInCWD) => {
          const pathOfChunk = path.resolve(currPath, ChunkInCWD);
          if (!utils.chunkIsDefinedInStructure(ChunkInCWD, chunksThatExistInCWD)) {
            // here chunks is not defined but exists
            this.chunksExists_NotDefinedInStructure = {
              ...this.chunksExists_NotDefinedInStructure,
              [pathOfChunk]: {
                level: this.level,
                Chunk: ChunkInCWD,
              },
            };
          }
        });
      }
    }
  }

  // todo : replace in iterator method after test
  chunkIsRegex(structure, currPath, Chunk, chunkListInCWD, chunkExistsInCWD) {
    const { match } = Chunk;
    const matchedChunksInCWD = micromatch(chunkListInCWD, match);
    const matchedChunksLen = matchedChunksInCWD.length;
    if (matchedChunksLen) {
      matchedChunksInCWD.forEach((matchedChunk) => {
        const matchedChunkPath = path.resolve(currPath, matchedChunk);
        chunkExistsInCWD[matchedChunk] = true;
        this.processChunk(structure, matchedChunkPath, matchedChunk, this.level, Chunk.exampleName);
      });
    } else {
      // no regex matched
      this.chunksNotExist_DefinedInStructure = {
        ...this.chunksNotExist_DefinedInStructure,
        [Chunk.exampleName]: {
          type: '*',
          level: this.level,
          Chunk: Chunk.match,
        },
      };
    }
  }

  processChunk(structure, pathOfChunk, Chunk, level, ChunkNameInStructure) {
    const chunkExistsInCWD = fs.existsSync(pathOfChunk); // eslint-disable-line
    if (utils.isChunkFolder(structure, ChunkNameInStructure)) {
      // do something if it is folder
      if (chunkExistsInCWD) {
        this.addExistedChunkToModal(pathOfChunk, 'Folder', level, ChunkNameInStructure);
      } else this.addNotExistedButDefinedChunkToModal(pathOfChunk, 'Folder', level, ChunkNameInStructure);
      this.level += 1;
      this.iterator(structure.childStruct[ChunkNameInStructure], pathOfChunk);
      this.level -= 1;
    } else if (chunkExistsInCWD) {
      this.addExistedChunkToModal(pathOfChunk, 'File', level, ChunkNameInStructure);
    } else {
      this.addNotExistedButDefinedChunkToModal(pathOfChunk, 'File', level, ChunkNameInStructure);
    }
  }

  addExistedChunkToModal(pathOfChunk, type, level, ChunkNameInStructure) {
    this.chunksFollowedStructure = {
      ...this.chunksFollowedStructure,
      [pathOfChunk]: {
        type,
        level,
        Chunk: ChunkNameInStructure,
      },
    };
  }

  addNotExistedButDefinedChunkToModal(pathOfChunk, type, level, ChunkNameInStructure) {
    this.chunksNotExist_DefinedInStructure = {
      ...this.chunksNotExist_DefinedInStructure,
      [pathOfChunk]: {
        type,
        level,
        Chunk: ChunkNameInStructure,
      },
    };
  }
}

module.exports = Process;
