const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');

class Chunks {
  constructor(structure, currPath) {
    this.structure = structure;
    this.rootPath = currPath;
    this.chunksOfCD = fs.existsSync(currPath) ? fs.readdirSync(currPath) : [];
    this.chunksExistInCD = {};
  }

  createChunk(Chunk) {
    if (typeof Chunk === 'string') {
      this.ChunkName = Chunk;
      this.ChunkPath = path.resolve(this.rootPath, Chunk);
      this.ChunkType = 'File EmptyFolder';
      this.ChunkExistInCD = fs.existsSync(this.ChunkPath);
    } else if (Object.prototype.hasOwnProperty.call(Chunk, 'matcher')) {
      this.ChunkType = 'Regex';
      if (Chunk.matcher === null) throw new Error(`${JSON.stringify(Chunk)} matcher should be an object structure & match should be inside matcher.`);
      if (typeof Chunk.matcher.match !== 'string') throw new Error('Current version only supports string for micromatch.');
      this.MatchedChunksList = micromatch(this.chunksOfCD, Chunk.matcher.match);
    } else {
      this.ChunkName = Object.keys(Chunk)[0]; // eslint-disable-line
      this.ChunkType = 'Folder';
      this.ChunkPath = path.resolve(this.rootPath, this.ChunkName);
      this.ChunkExistInCD = fs.existsSync(this.ChunkPath);
    }
  }

  addChunkExistance(Chunk) {
    this.chunksExistInCD[Chunk] = true;
  }
}

module.exports = Chunks;
