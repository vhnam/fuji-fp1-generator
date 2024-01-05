const kebabCase = require('lodash.kebabcase');
const trim = require('lodash.trim');

function format(property, value) {
  if ('photographs' === property) {
    return value.split(',').map((link) => trim(link));
  }

  return typeof value === 'string' ? trim(value) : value;
}

function serialize(data) {
  const sheet = data[0];
  const structure = sheet.data[0];

  const readableRecipes = [];
  const encodedStructure = {};

  structure.forEach((element) => {
    if (!!element) {
      encodedStructure[kebabCase(element)] = element;
    }
  });

  for (let index = 1; index < sheet.data.length - 1; index++) {
    const recipe = {};

    Object.keys(encodedStructure).forEach((property, attrIndex) => {
      recipe[property] = sheet.data[index][attrIndex]
        ? format(property, sheet.data[index][attrIndex])
        : null;
    });

    readableRecipes.push(recipe);
  }

  return {
    encodedStructure,
    readableRecipes,
  };
}

module.exports = {
  format,
  serialize,
};
