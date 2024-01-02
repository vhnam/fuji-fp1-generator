require("dotenv").config();

const kebabCase = require("lodash.kebabcase");
const { create } = require("xmlbuilder2");

const {
  parseDynamicRange,
  parseFilmSimulation,
  parseWhiteBalance,
  parseGrainEffect,
  parseExposureBias,
} = require("./parser");

function transformRecipeToObj(recipe) {
  const grainEffectValue = parseGrainEffect(recipe["grain-effect"]);
  const whiteBalance = parseWhiteBalance(recipe["white-balance"]);

  const obj = {
    ConversionProfile: {
      "@application": process.env.APP_NAME,
      "@version": process.env.APP_VERSION,
      PropertyGroup: {
        "@device": process.env.DEVICE_MODEL,
        "@version": process.env.DEVICE_VERSION,
        "@label": kebabCase(recipe.recipe),

        SerialNumber: process.env.DEVICE_SERIAL_NUMBER,
        TetherRAWConditonCode: process.env.DEVICE_VERSION,
        Editable: "TRUE",
        SourceFileName: null,
        Fileerror: "NONE",
        RotationAngle: 0,
        StructVer: process.env.STRUCT_VER,
        IOPCode: process.env.IOP_CODE,
        ShootingCondition: "OFF",
        FileType: "JPG",
        ImageSize: "L3x2",
        ImageQuality: "Fine",
        ExposureBias: parseExposureBias(recipe["exposure-compensation"]),
        DynamicRange: parseDynamicRange(recipe["dynamic-range"]),
        WideDRange: 0,
        FilmSimulation: parseFilmSimulation(recipe["film-simulation"]),
        BlackImageTone: 0,
        MonochromaticColor_RG: 0,
        GrainEffect: grainEffectValue.grainEffect?.toUpperCase(),
        GrainEffectSize: grainEffectValue.grainEffectSize,
        ChromeEffect: recipe["color-chrome-effect"]?.toUpperCase() ?? "OFF",
        ColorChromeBlue: recipe["color-chrome-effect-blue"],
        SmoothSkinEffect: null,
        WBShootCond: "OFF",
        WhiteBalance: whiteBalance,
        WBShiftR: parseInt(recipe["wb-shift-red"]),
        WBShiftB: parseInt(recipe["wb-shift-blue"]),
        WBColorTemp:
          "Temperature" === whiteBalance ? recipe["white-balance"] : "10000K",
        HighlightTone: parseInt(recipe["highlight"]),
        ShadowTone: parseInt(recipe["shadow"]),
        Color: recipe["color"] ? parseInt(recipe["color"]) : 0,
        Sharpness: parseInt(recipe["sharpening"]),
        NoisReduction: parseInt(recipe["noise-reduction"]),
        Clarity: recipe["clarity"] ? parseInt(recipe["clarity"]) : null,
        LensModulationOpt: "ON",
        ColorSpace: "sRGB",
        HDR: null,
        DigitalTeleConv: null,
      },
    },
  };

  Object.keys(obj.ConversionProfile.PropertyGroup).map((key) => {
    if (null === obj.ConversionProfile.PropertyGroup[key]) {
      obj.ConversionProfile.PropertyGroup[key] = "";
    }
  });

  return obj;
}

function generateFP1File(recipe) {
  const newObj = transformRecipeToObj(recipe);
  const doc = create(newObj);
  const xml = doc.end({ prettyPrint: true });

  return xml;
}

module.exports = {
  transformRecipeToObj,
  generateFP1File,
};
