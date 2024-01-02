const fs = require("fs");
const kebabCase = require("lodash.kebabcase");
const trim = require("lodash.trim");

const { generateFP1File } = require("./utils/fp1");

function format(property, value) {
  if ("photographs" === property) {
    return value.split(",").map((link) => trim(link));
  }

  return typeof value === "string" ? trim(value) : value;
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

  if (!fs.existsSync("./out")) {
    fs.mkdirSync("./out");
  }

  fs.writeFileSync(
    `./out/${process.env.OUTPUT_JSON_FILE_NAME}`,
    JSON.stringify({
      name: "Fujifilm Simulation Recipes",
      structure: encodedStructure,
      data: readableRecipes,
    }),
    {
      flag: "a",
      encoding: "utf8",
    }
  );

  return readableRecipes;
}

function main() {
  fs.readFile(
    `./assets/${process.env.INPUT_JSON_FILE_NAME}`,
    "utf8",
    (error, data) => {
      if (error) {
        return console.error(error);
      }

      const jsonData = JSON.parse(data);
      const readableRecipes = serialize(jsonData);

      readableRecipes.forEach((recipe) => {
        const fp1Content = generateFP1File(recipe);
        fs.writeFileSync(
          `./out/${kebabCase(recipe.recipe)}.FP1`,
          fp1Content,
          "utf8"
        );
      });
    }
  );
}

main();
