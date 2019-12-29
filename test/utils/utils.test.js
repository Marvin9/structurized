const utils = require('../../lib/utils/utils');

describe('nodeExists function', () => {
  it('should return true if node exist', () => {
    const structure = {
      root: ['A', 'B', 'index.js'],
    };
    expect(utils.nodeExists(structure)).toBe(true);
  });
  it('should return  false if node don\'t exist', () => {
    const structure = {};
    expect(utils.nodeExists(structure)).toBe(false);
  });
});

describe('isChunkSpecific function', () => {
  // this function is use to check if file is exact or regular expression
  it('should return true if it is string', () => {
    expect(utils.isChunkSpecific('Folder')).toBe(true);
    expect(utils.isChunkSpecific('File.js')).toBe(true);
  });
  it('should return false if it is object', () => {
    const chunk = {
      match: '*-api-*',
      exampleName: 'first-api-folder',
    };
    expect(utils.isChunkSpecific(chunk)).toBe(false);
  });
});

describe('isChunkFolder function', () => {
  // folder should be defined in childStruct
  const structure = {
    root: ['A', 'B', 'index.js'],
    childStruct: {
      A: {
        root: ['abc.js'],
      },
    },
  };
  it('should return true if it is folder and further defined in structure', () => {
    expect(utils.isChunkFolder(structure, 'A')).toBe(true);
  });
  it('should return false if it is folder and not further defined', () => {
    expect(utils.isChunkFolder(structure, 'B')).toBe(false);
  });
  it('should return false if it is file', () => {
    expect(utils.isChunkFolder(structure, 'index.js')).toBe(false);
  });
});

describe('chunkIsDefinedInStructure', () => {
  const Chunk = 'path/to/chunk.js';
  const chunksExistsInCWD = {
    'path/to/chunk1.js': {},
    'path/to/chunk2.js': {},
    'path/to/chunk.js': {},
  };
  it('should return true if path of Chunk exist in structure', () => {
    expect(utils.chunkIsDefinedInStructure(Chunk, chunksExistsInCWD)).toBe(true);
  });
  it('should return false if path of Chunk don\'t exist in structure', () => {
    expect(utils.chunkIsDefinedInStructure('path/to/any.js', chunksExistsInCWD)).toBe(false);
  });
});
