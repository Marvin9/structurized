class Model {
  constructor(structure, path = null) {
    this.structure = structure;
    this.level = 0;
    this.rootPath = path || process.cwd();
    this.chunksFollowedStructure = {};
    this.chunksNotExist_DefinedInStructure = {};
    this.chunksExists_NotDefinedInStructure = {};
    this.report = {};
  }
}

module.exports = Model;
