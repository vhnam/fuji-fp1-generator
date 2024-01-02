// You can't select DR200 if original ISO was below 400 nor DR400 if original ISO was below 800
function parseDynamicRange(dynamicRange) {
  // if (dynamicRange && dynamicRange.includes("DR")) {
  //   return dynamicRange.replace("DR", "");
  // }
  return "AUTO";
}

function parseFilmSimulation(filmSimulation) {
  switch (filmSimulation) {
    case "Acros+G":
      return "AcrosG";
    case "Acros+R":
      return "AcrosR";
    case "Acros+Y":
      return "AcrosYe";
    case "Classic Chrome":
      return "Classic";
    case "Classic Negative":
      return "ClassicNEGA";
    case "Eterna Bleach Bypass":
      return "BleachBypass";
    case "Monochrome":
      return "BW";
    case "Monochrome+G":
      return "BG";
    case "Monochrome+R":
      return "BR";
    case "Monochrome+Ye":
      return "BYe";
    case "PRO Neg. Std":
      return "NEGAStd";
    case "PRO Neg. Hi":
      return "NEGAhi";
    case "Nostalgic Neg.":
      return "NostalgicNEGA"; // TODO: Need to update if having X-T5
    default:
      return filmSimulation;
  }
}

function parseExposureBias(exposureBias) {
  const exposureBiasValues = exposureBias.split(" ");
  switch (exposureBiasValues[exposureBiasValues.length - 1]) {
    case "+3":
      return "P3P00";
    case "+2 2/3":
      return "P2P67";
    case "+2 1/3":
      return "P2P33";
    case "+2":
      return "P2P00";
    case "+1 2/3":
      return "P1P67";
    case "+1 2/3":
      return "P1P67";
    case "+1 1/3":
      return "P1P33";
    case "+2/3":
      return "P0P67";
    case "+1/3":
      return "P0P33";
    case "-1/3":
      return "M0P33";
    case "-2/3":
      return "M0P67";
    case "-1":
      return "M1P00";
    case "-1 1/3":
      return "M1P33";
    case "-1 2/3":
      return "M1P67";
    case "-2":
      return "M2P00";
    default:
      return "0";
  }
}

function parseWhiteBalance(whiteBalance) {
  switch (whiteBalance) {
    case "Auto":
      return "Auto";
    case "Auto White Priority":
      return "Auto_White";
    case "Daylight/Fine":
    case "Daylight":
    case "Custom Daylight":
      return "Daylight";
    case "Fluorescent 1":
      return "FLight1";
    case "Fluorescent 2":
      return "FLight2";
    case "Fluorescent 3":
      return "FLight3";
    case "Underwater":
      return "UWater";
    case "Shade":
      return "Shade";
    case "Incandescent":
      return "Incand";
    default:
      return "Temperature";
  }
}

function parseGrainEffect(grainEffect) {
  if (!!grainEffect) {
    const values = grainEffect.split(" ");
    return {
      grainEffect: values[0],
      grainEffectSize: values[1] ?? "SMALL",
    };
  }

  return {
    grainEffect: null,
    grainEffectSize: null,
  };
}

module.exports = {
  parseDynamicRange,
  parseExposureBias,
  parseFilmSimulation,
  parseGrainEffect,
  parseWhiteBalance,
};
