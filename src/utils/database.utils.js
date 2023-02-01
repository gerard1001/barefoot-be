module.exports = {
  getArray: (name) => () => JSON.parse(this.getDataValue(name) || '[]'),
  setArray: (name) => (value) => {
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        throw new Error(
          `This is not a stringified array, only arrays are allowed as ${name} field datatype.`
        );
      }
    }
    if (!Array.isArray(value)) {
      throw new Error(`Only arrays are allowed as ${name} field datatype`);
    }
    this.setDataValue(name, JSON.stringify(value));
  }
};
