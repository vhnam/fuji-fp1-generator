const fs = require('fs');
const kebabCase = require('lodash.kebabcase');

const { generateFP1File } = require('./utils/fp1');
const { serialize } = require('./utils/fujix');

const DISTRIBUTION_FOLDER = './dist';
const DISTRIBUTION_FOLDER_DB = `${DISTRIBUTION_FOLDER}/db`;
const DISTRIBUTION_FOLDER_FP1 = `${DISTRIBUTION_FOLDER}/FP1`;

function getReadableRecipes(data) {
  const { encodedStructure, readableRecipes } = serialize(data);

  if (!fs.existsSync(DISTRIBUTION_FOLDER)) {
    [DISTRIBUTION_FOLDER_DB, DISTRIBUTION_FOLDER_FP1].forEach((dictionary) => {
      fs.mkdirSync(dictionary, { recursive: true });
    });
  }

  fs.writeFileSync(
    `${DISTRIBUTION_FOLDER_DB}/${process.env.OUTPUT_JSON_FILE_NAME}`,
    JSON.stringify({
      name: 'Fujifilm Simulation Recipes',
      structure: encodedStructure,
      data: readableRecipes,
    }),
    {
      flag: 'a',
      encoding: 'utf8',
    }
  );

  return readableRecipes;
}

function main() {
  fs.readFile(
    `./assets/${process.env.INPUT_JSON_FILE_NAME}`,
    'utf8',
    (error, data) => {
      if (error) {
        return console.error(error);
      }

      console.log('--- Starting ---');

      fs.rmSync(DISTRIBUTION_FOLDER, { recursive: true, force: true });

      const jsonData = JSON.parse(data);
      const readableRecipes = getReadableRecipes(jsonData);

      readableRecipes.forEach((recipe) => {
        try {
          const fp1Content = generateFP1File(recipe);
          fs.writeFileSync(
            `${DISTRIBUTION_FOLDER_FP1}/${kebabCase(recipe.recipe)}.FP1`,
            fp1Content,
            'utf8'
          );
        } catch (err) {
          console.error(
            `Cannot generate FP1 file for recipe: ${recipe.recipe}`
          );
        }
      });

      console.log('--- Completed ---');
    }
  );
}

main();
