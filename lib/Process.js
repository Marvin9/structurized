const path = require('path');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const Modal = require('./utils/Modal');
const Chunks = require('./utils/Chunks');

const { log } = console;
const success = chalk.green;
const warn = chalk.cyan;
const error = chalk.red;
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
                  Process.print(Chunk, this.level, 'success');
                } else {
                  Process.print(Chunk, this.level, 'error');
                  this.addNotExistedButDefinedChunkToModal(chunks);
                }
                break;
              }

              case 'Folder': {
                if (chunks.ChunkExistInCD) {
                  chunks.addChunkExistance(chunks.ChunkName);
                  this.addExistedChunkToModal(chunks);
                  Process.print(chunks.ChunkName, this.level, 'success');
                  this.level += 1;
                  this.iterator(structure[definition][index], chunks.ChunkPath);
                  this.level -= 1;
                } else {
                  Process.print(chunks.ChunkName, this.level, 'error');
                  this.addNotExistedButDefinedChunkToModal(chunks);
                }
                break;
              }

              case 'Regex': {
                if (chunks.MatchedChunksList.length) {
                  chunks.MatchedChunksList.forEach((matchedChunk) => {
                    chunks.ChunkName = matchedChunk;
                    chunks.ChunkPath = path.resolve(currPath, matchedChunk);

                    chunks.addChunkExistance(matchedChunk);
                    Process.print(matchedChunk, this.level, 'success');
                    this.addExistedChunkToModal(chunks);
                  });

                  if (Object.prototype.hasOwnProperty.call(Chunk.matcher, 'root')) {
                    this.iterator(Chunk.matcher, chunks.ChunkPath);
                  }
                } else {
                  chunks.ChunkName = Chunk.matcher.match;
                  chunks.ChunkPath = path.resolve(currPath, chunks.ChunkName);

                  Process.print(chunks.ChunkName, this.level, 'error');
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
              Process.print(chunkOfCD, this.level, 'warning');
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

  static indentation(number) {
    let str = '';
    let tmp = number;
    while (tmp > 0) {
      str += '   ';
      tmp -= 1;
    }
    return str;
  }

  static print(Chunk, level, type) {
    const symbolAndPrintMethod = type === 'success' ? [logSymbols.success, success] : (type === 'warning' ? [logSymbols.warning, warn] : [logSymbols.error, error]); // eslint-disable-line
    log(`${Process.indentation(level)} ${symbolAndPrintMethod[0]} ${symbolAndPrintMethod[1](Chunk)}`);
  }
}

module.exports = Process;
