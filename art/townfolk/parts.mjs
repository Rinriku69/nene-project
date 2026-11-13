import { FACES } from "./faces.mjs";
import { HAIR } from "./hair.mjs";
import { outfitFront, outfitSide } from "./outfits.mjs";

export { FACES, HAIR };
export { OUTFITS } from "./outfits.mjs";

export const FRAME = 48;

export const MARKERS = {
  s: "#ffcc99", t: "#e0a070", u: "#b07040",
  h: "#ff00ff", i: "#c000c0", j: "#800080",
  c: "#00ffff", d: "#00c0c0", e: "#008080",
};

export const FIXED = {
  K: "#3b1f2b",
  E: "#2b1b33",
  W: "#ffffff",
  B: "#f9a8d4",
  M: "#9d3b5b",
  O: "#7a4a5e",
  Q: "#5a3346",
  R: "#f472b6",
  T: "#93c5fd",
};

const HEAD = [
  ".....ssssssss.....",
  "...ssssssssssss...",
  "..ssssssssssssss..",
  ".ssssssssssssssss.",
  ...Array.from({ length: 9 }, () => "ssssssssssssssssss"),
  ".ssssssssssssssst.",
  "..tsssssssssssst..",
  "....tttttttttt....",
];

const legLeft = [".sss", ".sss", ".sss", ".sss", ".sss", ".sss", ".tss", ".tss", ".tss", "OOOO", "QQQQ"];
const legRight = ["sss.", "sss.", "sss.", "sss.", "sss.", "sss.", "sst.", "sst.", "sst.", "OOOO", "QQQQ"];
const legNear = [".sss", ".sss", ".sss", ".sss", ".sss", ".sss", ".sss", ".tss", ".tss", "OOOO", "QQQQ"];
const legFar = [".ttt", ".ttt", ".ttt", ".ttt", ".ttt", ".ttt", ".ttt", ".ttt", ".ttt", "QQQQ", "QQQQ"];

const part = (grid, x, y, outline = true) => ({ grid, x, y, outline });
const hairPart = (spec, u) => (spec ? [part(spec.rows, spec.x, spec.y + u)] : []);
const facePart = (grid, u) => (grid ? [part(grid, 15, 14 + u, false)] : []);

const WALK_FRONT = [
  { up: -1, l: -3, r: 0, al: 0, ar: -2 },
  { up: 0, l: 0, r: 0, al: 0, ar: 0 },
  { up: -1, l: 0, r: -3, al: -2, ar: 0 },
  { up: 0, l: 0, r: 0, al: 0, ar: 0 },
];

const WALK_SIDE = [
  { up: 0, near: [-4, 0], far: [4, 0], arm: 3 },
  { up: -1, near: [-1, 0], far: [2, -2], arm: 0 },
  { up: 0, near: [4, 0], far: [-4, 0], arm: -3 },
  { up: -1, near: [-2, -2], far: [1, 0], arm: 0 },
];

const IDLE = [{ up: 0 }, { up: 1 }];

function frontLayers(dir, pose, look) {
  const u = pose.up, style = HAIR[look.hair];
  return {
    hairback: hairPart(style.back && style.back[dir], u),
    body: [
      part(legLeft, 18, 31 + (pose.l || 0)),
      part(legRight, 26, 31 + (pose.r || 0)),
      part(HEAD, 15, 6 + u),
    ],
    face: dir === "down" ? facePart(FACES[look.face].down, u) : [],
    top: outfitFront(look.outfit, dir, pose, u),
    hair: hairPart(style[dir], u),
  };
}

function sideLayers(pose, look) {
  const u = pose.up, style = HAIR[look.hair], near = pose.near || [0, 0], far = pose.far || [0, 0];
  return {
    hairback: hairPart(style.back && style.back.left, u),
    body: [
      part(legFar, 21 + far[0], 31 + far[1]),
      part(legNear, 21 + near[0], 31 + near[1]),
      part(HEAD, 15, 6 + u),
    ],
    face: facePart(FACES[look.face].left, u),
    top: outfitSide(look.outfit, pose, u),
    hair: hairPart(style.left, u),
  };
}

export function rowsFor(look) {
  const style = HAIR[look.hair];
  const front = (dir, poses) => poses.map((p) => ({ layers: frontLayers(dir, p, look) }));
  const side = (poses, mirrored) => poses.map((p) => ({
    layers: sideLayers(p, look),
    mirrored,
    rightHair: mirrored && style.right ? hairPart(style.right, p.up) : null,
  }));
  return [
    { name: "walk_down", frames: front("down", WALK_FRONT) },
    { name: "walk_left", frames: side(WALK_SIDE, false) },
    { name: "walk_right", frames: side(WALK_SIDE, true) },
    { name: "walk_up", frames: front("up", WALK_FRONT) },
    { name: "idle_down", frames: front("down", IDLE) },
    { name: "idle_left", frames: side(IDLE, false) },
    { name: "idle_right", frames: side(IDLE, true) },
    { name: "idle_up", frames: front("up", IDLE) },
  ];
}

export const LAYERS = ["hairback", "body", "face", "top", "hair"];
