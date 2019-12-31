const path = require('path');
const Modal = require('./utils/Modal');
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
    if (typeof structure !== 'object') throw new Error(`Expected object but found ${typeof structure}.\n${structure}`);

    const chunks = new Chunks(structure, currPath);

    Object.keys(structure).forEach((definition) => {
      switch (Array.isArray(structure[definition])) {
        case true: {
          structure[definition].forEach((Chunk, index) => {
            chunks.createChunk(Chunk);

            switch (chunks.ChunkType) {
              case 'File EmptyFolder': {
                if (chunks.ChunkExistInCD) {
                  chunks.addChunkExistance(Chunk);
                  this.addExistedChunkToModal(chunks);
                } else this.addNotExistedButDefinedChunkToModal(chunks);
                break;
              }

              case 'Folder': {
                if (chunks.ChunkExistInCD) {
                  chunks.addChunkExistance(chunks.ChunkName);
                  this.addExistedChunkToModal(chunks);
                  this.level += 1;
                  this.iterator(structure[definition][index], chunks.ChunkPath);
                  this.level -= 1;
                } else this.addNotExistedButDefinedChunkToModal(chunks);
                break;
              }

              case 'Regex': {
                if (chunks.MatchedChunksList.length) {
                  chunks.MatchedChunksList.forEach((matchedChunk) => {
                    chunks.ChunkName = matchedChunk;
                    chunks.ChunkPath = path.resolve(currPath, matchedChunk);

                    chunks.addChunkExistance(matchedChunk);
                    this.addExistedChunkToModal(chunks);
                  });

                  if (Object.prototype.hasOwnProperty.call(Chunk.matcher, 'root')) {
                    this.iterator(Chunk.matcher, chunks.ChunkPath);
                  }
                } else {
                  chunks.ChunkName = Chunk.matcher.match;
                  chunks.ChunkPath = path.resolve(currPath, chunks.ChunkName);

                  this.addNotExistedButDefinedChunkToModal(chunks);
                }
                break;
              }
              default:
                break;
            }
          });

          chunks.chunksOfCD.forEach((chunkOfCD) => {
            if (!Object.prototype.hasOwnProperty.call(chunks.chunksExistInCD, chunkOfCD) && chunkOfCD !== 'structure.yml') {
              this.chunksExists_NotDefinedInStructure = {
                ...this.chunksExists_NotDefinedInStructure,
                [path.resolve(currPath, chunkOfCD)]: {
                  level: this.level,
                  Chunk: chunkOfCD,
                },
              };
            }
          });
          break;
        }
        default:
          break;
      }
    });
  }

  addExistedChunkToModal(chunks) {
    this.chunksFollowedStructure = {
      ...this.chunksFollowedStructure,
      [chunks.ChunkPath]: {
        type: chunks.ChunkType,
        level: chunks.ChunkLevel,
        Chunk: chunks.ChunkName,
      },
    };
  }

  addNotExistedButDefinedChunkToModal(chunks) {
    this.chunksNotExist_DefinedInStructure = {
      ...this.chunksNotExist_DefinedInStructure,
      [chunks.ChunkPath]: {
        type: chunks.ChunkType,
        level: chunks.ChunkLevel,
        Chunk: chunks.ChunkName,
      },
    };
  }
}

module.exports = Process;
