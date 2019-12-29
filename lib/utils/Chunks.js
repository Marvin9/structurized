const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');

class Chunks {
  constructor(structure, currPath) {
    this.listOfChunksInStructure = [...structure.root];
    this.chunksThatExistInCD = {};
    this.existanceOfcurrPath = fs.existsSync(currPath);
    this.structure = structure;
    this.currPath = currPath;
    if (this.existanceOfcurrPath) this.chunkListInCD = fs.readdirSync(currPath);
    else this.chunkListInCD = [];
  }

  createChunk(Chunk, level) {
    this.Chunk = Chunk;
    this.ChunkPath = path.resolve(this.currPath, Chunk);
    this.ChunkExistInCD = fs.existsSync(this.ChunkPath);
    this.ChunkNameInStructure = Chunk;
    this.ChunkLevel = level;
  }

  createRegexChunk(Chunk, level) {
    this.Chunk = Chunk;
    this.ChunkType = '*';
    this.ChunkLevel = level;
    this.ChunkNameInStructure = Chunk.exampleName;
    this.regexMatchedChunksInCD = micromatch(this.chunkListInCD, Chunk.match);
    // ChunkPath & ChunkExistInCD are defined inside chunkIsRegex function, inside Process.js
  }

  addChunkExistance(Chunk) {
    this.chunksThatExistInCD[Chunk] = true;
  }
}

module.exports = Chunks;
