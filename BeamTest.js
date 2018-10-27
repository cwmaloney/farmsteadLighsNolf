"use strict";

const { ArtNet } = require("./ArtNet.js");
const { Beam } = require("./config.js");

const standardColors = [
  Beam.Color.White,
  Beam.Color.Red,
  Beam.Color.Orange,
  Beam.Color.Yellow,
  Beam.Color.Green,
  Beam.Color.Blue,
  Beam.Color.Magenta,
  Beam.Color.Pink,
  Beam.Color.Lavender
  ];

const halloweenColors = [
  Beam.Color.White,
  Beam.Color.Red,
  Beam.Color.Orange,
  Beam.Color.Green,
  Beam.Color.Blue,
  Beam.Color.Magenta,
  ];
  
const testGobos = [
  Beam.Gobo.Off,
  Beam.Gobo.Dot3,
  Beam.Gobo.Dot6,
  Beam.Gobo.ThreePoints,
  Beam.Gobo.FourPoints,
  Beam.Gobo.Star13,
  Beam.Gobo.Star15,
  Beam.Gobo.VerticalBar,
  Beam.Gobo.HorizontalBar
];

const testStrobes = [
  Beam.Strobe.Off,
  Beam.Strobe.Slow,
  Beam.Strobe.Medium,
  Beam.Strobe.Fast
];
 
const testPrisms = [
  Beam.Prism.Off,
  Beam.Prism.On
];
 
const testPrismRotations = [
  Beam.PrismRotation.Off,
  Beam.PrismRotation.Slow,
  Beam.PrismRotation.Fast
];
  
const testTilts = [
  40,
  50,
  60,
  70,
  // 88,
  // 100
];
      
const artnet = new ArtNet();

const eastAddress = "10.7.84.55";
const westAddress = "10.7.84.56";

const beams = [
  { address: eastAddress, universe: 1, channel: (0 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: 1, channel: (1 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: 1, channel: (2 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: 1, channel: (3 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: 1, channel: (4 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: 1, channel: (5 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (0 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (1 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (2 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (3 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (4 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: 1, channel: (5 * Beam.ChannelsPerBeam)+1 }
]

const eastUniverseInfo = {
  "address": eastAddress,
  "universe": 1,
  "sourcePort": 6454,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": false,
  "refreshInterval": 1000
};

  const westUniverseInfo = {
    "address": westAddress,
    "universe": 1,
    "sourcePort": 6455,
    "sendOnlyChangeData": false,
    "sendSequenceNumbers": false,
    "refreshInterval": 1000
  };
  
artnet.configureUniverse(eastUniverseInfo);
artnet.configureUniverse(westUniverseInfo);

let channelData = [];

function setDefaultChannelData() {
  channelData[Beam.BeamChannel.ColorWheel] = Beam.Color.White
  channelData[Beam.BeamChannel.Strobe] = Beam.Strobe.Open;
  channelData[Beam.BeamChannel.Dimmer] = Beam.Dimmer.Off;
  channelData[Beam.BeamChannel.Gobo] = Beam.Gobo.Off;
  channelData[Beam.BeamChannel.Prism] = Beam.Prism.Off;
  channelData[Beam.BeamChannel.PrismRotation] = Beam.PrismRotation.Off;
  channelData[Beam.BeamChannel.EffectsMovement] = Beam.Unused;
  channelData[Beam.BeamChannel.Frost] = Beam.Frost.Off;
  channelData[Beam.BeamChannel.Focus] = 127;
  channelData[Beam.BeamChannel.Pan] = 0;
  channelData[Beam.BeamChannel.PanFine] = 0;
  channelData[Beam.BeamChannel.Tilt] = 45;
  channelData[Beam.BeamChannel.TiltFine] = 0;
  channelData[Beam.BeamChannel.Macro] = Beam.Unused;
  channelData[Beam.BeamChannel.Reset] = Beam.Reset.None;
  channelData[Beam.BeamChannel.Lamp] = Beam.Lamp.On;
}
setDefaultChannelData();

//  ====== Pan =====

let panStart = 0;
let panStop = 180;
let panInterval = 1;
let panValue = panStart;

function setPans(newPanStart = 0, newPanStop = 160, newPanInterval = 1) {
  panStart = newPanStart;
  panStop = newPanStop;
  panInterval = newPanInterval;
  panValue = panStart;
  channelData[Beam.BeamChannel.Pan] = panStart;
}

function nextPan() {
  let reset = false;
  panValue += panInterval;
  if (panValue >= panStop) {
    panValue = panStart;
    reset = true;
  }
  channelData[Beam.BeamChannel.Pan] = panValue;
  return reset;
}

//  ====== Tilt =====

let tiltStart = 40;
let tiltStop = 80;
let tiltInterval = 12;
let tiltIndex = tiltStart;

function setTilts(newTiltStart = 40, newTiltStop = 80, newTiltInterval = 10) {
  tiltStart = newTiltStart;
  tiltStop = newTiltStop;
  tiltInterval = newTiltInterval;
  tiltIndex = tiltStart;
  channelData[Beam.BeamChannel.Tilt] = tiltStart;
}

function nextTilt() {
  let reset = false;
  tiltIndex += tiltInterval;
  if (tiltIndex >= tiltStop) {
    tiltIndex = tiltStart;
    reset = true;
  }
  channelData[Beam.BeamChannel.Tilt] = tiltIndex;
  return reset;
}

//  ====== Color =====

let currentColors = standardColors;
let colorIndex = tiltStart;

function setColors(newcolors) {
  currentColors = newcolors;
  colorIndex = 0;
  channelData[Beam.BeamChannel.ColorWheel] = colorIndex;
}

function nextColor() {
  let reset = false;
  if (++colorIndex >= currentColors.length) {
    colorIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.ColorWheel] = currentColors[colorIndex];
  return reset;
}

// ===== scenes =====

let sceneIndex = 0;

function nextScene() {
  if (++sceneIndex > 0) sceneIndex = 0;

  setScene();
}

function setScene() {
  setDefaultChannelData();

  switch (sceneIndex)
  {
    case 0:
      setPans(0, 180, 2);
      setColors(halloweenColors);
      setTilts();
      break;

    // case 2:
    //   // gobo
    //   goboIndex = 1;
    //   channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
  
        //  setPans();
   
    //   break;
    // case 3:
    //   // prism and prism roatation
    //   prismIndex = 1;
    //   channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];

    //   prismRotationIndex = 0;
    //   channelData[Beam.BeamChannel.PrismRotation] = testPrismRotations[prismRotationIndex];
  
    //  setPans();
 
    //   break;
    // case 4:
    //   // strobe
    //   strobeIndex = 1;
    //   channelData[Beam.BeamChannel.Strob] = testStrobes[strobeIndex];

    //  setPans

    //   break;
  }

  sendChannelData();
}

function nextStep() {

  switch (sceneIndex)
  {
    case 0:
      if (nextPan()) {
        nextTilt();
        if (nextColor()) {
          nextScene()
        }
      }
      break;
    // case 1:
    //   if (nextPan()) {
    //     if (nextTilt()) {
    //       nextScene()
    //     }
    //   }
    //   break;
    // case 2:
    //   if (nextPan()) {
    //     if (nextGobo()) {
    //        nextScene()
    //     }
    //   }
    //   break;
    // case 3:
    //   if (nextPan()) {
    //     if (nextPrism()) {
    //       if (nextPrismRoation()) {
    //        nextScene()
    //       }
    //     }
    //   }
    //   break;
    // case 4:
    //   if (nextPan()) {
    //     if (nextStrobe()) {
    //         nextScene()
    //     }
    //   }
    //   break;
  }

  sendChannelData();
}
  
function sendChannelData()
{
  console.log("--- BeamTest::",
    " test=", sceneIndex,
    " c=", channelData[Beam.BeamChannel.ColorWheel],
    " p=", channelData[Beam.BeamChannel.Pan],
    " t=", channelData[Beam.BeamChannel.Tilt],
    " -- s=", channelData[Beam.BeamChannel.Strobe],
    " g=", channelData[Beam.BeamChannel.Gobo],
    " pz=", channelData[Beam.BeamChannel.Prism],
    " pr=", channelData[Beam.BeamChannel.PrismRotation],
    " l=", channelData[Beam.BeamChannel.Lamp]);

  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    artnet.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, channelData);
  }
  artnet.send(eastUniverseInfo.address, eastUniverseInfo.universe);
  artnet.send(westUniverseInfo.address, westUniverseInfo.universe);
}

for (let j = 0; j < process.argv.length; j++) {
  console.log(j + ':' + (process.argv[j]));

  if (process.argv[j] == "off") {
    setDefaultChannelData();
    channelData[Beam.BeamChannel.Lamp] = Beam.Lamp.Off;
    sendChannelData();
    process.exit(0);
  }
}

setScene();

let stepInterval = 20;

setInterval(nextStep, stepInterval);


// const beamTestData = [
//   { channel: 1, channelData: [
//     Beam.Color.Red, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 2, channelData: [
//     Beam.Color.White, Beam.Strobe.On, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.On, /*PrismRotation*/ 190, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 3, channelData: [
//     Beam.Color.Blue, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.FourPoints, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 4, channelData: [
//     Beam.Color.Green, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.On, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 5, channelData: [
//     Beam.Color.Purple, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 6, channelData: [
//     Beam.Color.Orange, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.Off ] }
// ];


// let goboIndex = 0;
// let strobeIndex = 0;
// let prismIndex = 0;
// let prismRotationIndex = 0;

// function nextGobo() {
//   let reset = false;
//   if (++goboIndex >= testGobos.length) {
//     goboIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
//   return reset;
// }

// function nextPrism() {
//   let reset = false;
//   if (++prismIndex >= testPrisms.length) {
//     prismIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];
//   return reset;
// }
// function nextPrismRoation() {
//   let reset = false;
//   if (++prismRotationIndex >= testPrismRotations.length) {
//     prismRotationIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.PrismRoation] = testPrismRotations[prismRotationIndex];
//   return reset;
// }

// function nextStrobe() {
//   let reset = false;
//   if (++strobeIndex >= testStrobes.length) {
//     strobeIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Strobe] = testStrobes[strobeIndex];
//   return reset;
// }
