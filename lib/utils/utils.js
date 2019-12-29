function nodeExists(structure) {
  return !!(structure && structure.root);
}

function isChunkSpecific(Chunk) {
  return typeof Chunk !== 'object';
}

function isChunkFolder(structure, Chunk) {
  return !!(structure.childStruct && structure.childStruct[Chunk]);
}

function chunkIsDefinedInStructure(Chunk, chunksThatExistsInCWD) {
  return Object.prototype.hasOwnProperty.call(chunksThatExistsInCWD, Chunk);
}

module.exports = {
  nodeExists,
  isChunkSpecific,
  isChunkFolder,
  chunkIsDefinedInStructure,
};
