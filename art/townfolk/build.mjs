import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./png.mjs";
import { FACES, FIXED, FRAME, HAIR, LAYERS, MARKERS, OUTFITS, rowsFor } from "./parts.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
const COLS = 4;
const ROW_COUNT = 8;
const SHEET_W = FRAME * COLS;
const SHEET_H = FRAME * ROW_COUNT;

const SKIN = {
  fair: ["#ffe0c8", "#f0b898", "#c88868"],
  warm: ["#f5d0b5", "#dca98a", "#b07f62"],
  tan: ["#c68642", "#a06a30", "#7a4e20"],
  deep: ["#8d5524", "#6e4019", "#4f2c10"],
};
const HAIR_COLOR = {
  brown: ["#5a3a22", "#432a18", "#2c1a0e"],
  blonde: ["#f4d35e", "#d4b040", "#a88820"],
  ink: ["#3b2a4a", "#2a1d36", "#1a1124"],
  pink: ["#f9a8d4", "#ec4899", "#be185d"],
  mint: ["#99f6e4", "#2dd4bf", "#0f766e"],
  ginger: ["#f97316", "#c2410c", "#7c2d12"],
};
const TOP_COLOR = {
  rose: ["#fbcfe8", "#f472b6", "#be185d"],
  sky: ["#93c5fd", "#3b82f6", "#1d4ed8"],
  lemon: ["#fde68a", "#f59e0b", "#b45309"],
  lilac: ["#ddd6fe", "#a78bfa", "#6d28d9"],
  leaf: ["#bbf7d0", "#4ade80", "#15803d"],
  cocoa: ["#e7d3c1", "#a47551", "#6b4226"],
};

const CHARACTERS = [
  { name: "mali", hair: "bob", outfit: "dress", face: "happy", skin: "fair", hairColor: "brown", top: "rose" },
  { name: "khaopan", hair: "ponytail", outfit: "uniform", face: "neutral", skin: "warm", hairColor: "ink", top: "lilac" },
  { name: "phupha", hair: "mohawk", outfit: "hoodie", face: "angry", skin: "tan", hairColor: "pink", top: "sky" },
  { name: "baitoey", hair: "twintails", outfit: "overalls", face: "surprised", skin: "fair", hairColor: "blonde", top: "leaf" },
  { name: "tawan", hair: "spiky", outfit: "tee", face: "happy", skin: "deep", hairColor: "ginger", top: "lemon" },
  { name: "mayom", hair: "long", outfit: "hoodie", face: "sleepy", skin: "warm", hairColor: "mint", top: "cocoa" },
];

const RAMP_KEYS = { skin: ["s", "t", "u"], hair: ["h", "i", "j"], top: ["c", "d", "e"] };
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const blank = (w, h) => Array.from({ length: h }, () => new Array(w).fill(null));

function checkGrid(grid, where) {
  const w = grid[0].length;
  grid.forEach((row, y) => {
    if (row.length !== w) throw new Error(`${where}: row ${y} is ${row.length} wide, expected ${w}`);
  });
}

function renderParts(parts, where) {
  const cells = blank(FRAME, FRAME);
  for (const { grid, x, y, outline } of parts) {
    checkGrid(grid, where);
    const filled = (gx, gy) => gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length && grid[gy][gx] !== ".";
    if (outline) {
      for (let gy = outline === "noTop" ? 0 : -1; gy <= grid.length; gy++) for (let gx = -1; gx <= grid[0].length; gx++) {
        if (filled(gx, gy)) continue;
        if (!(filled(gx - 1, gy) || filled(gx + 1, gy) || filled(gx, gy - 1) || filled(gx, gy + 1))) continue;
        const px = x + gx, py = y + gy;
        if (px >= 0 && px < FRAME && py >= 0 && py < FRAME) cells[py][px] = "K";
      }
    }
    grid.forEach((row, gy) => [...row].forEach((ch, gx) => {
      const px = x + gx, py = y + gy;
      if (ch !== "." && px >= 0 && px < FRAME && py >= 0 && py < FRAME) cells[py][px] = ch;
    }));
  }
  return cells;
}

const mirror = (cells) => cells.map((row) => [...row].reverse());

function renderFrame(frame, where) {
  const layers = {};
  for (const l of LAYERS) {
    const cells = renderParts(frame.layers[l], `${where} ${l}`);
    layers[l] = frame.mirrored ? mirror(cells) : cells;
  }
  if (frame.rightHair) layers.hair = renderParts(frame.rightHair, `${where} hair right`);
  return layers;
}

function buildLook(look) {
  const sheets = Object.fromEntries(LAYERS.map((l) => [l, blank(SHEET_W, SHEET_H)]));
  const tag = `${look.hair}/${look.outfit}/${look.face}`;
  rowsFor(look).forEach((row, r) => {
    row.frames.forEach((frame, c) => {
      const layers = renderFrame(frame, `${tag} ${row.name} ${c}`);
      for (const l of LAYERS) layers[l].forEach((line, y) => line.forEach((ch, x) => { sheets[l][r * FRAME + y][c * FRAME + x] = ch; }));
    });
  });
  return sheets;
}

function colorOf(ch, palette) {
  if (ch === null) return null;
  if (FIXED[ch]) return hex(FIXED[ch]);
  if (!palette) return hex(MARKERS[ch]);
  for (const [ramp, keys] of Object.entries(RAMP_KEYS)) {
    const idx = keys.indexOf(ch);
    if (idx >= 0) return hex(palette[ramp][idx]);
  }
  throw new Error(`no colour for ${ch}`);
}

function toRgba(layerCells, palette) {
  const buf = Buffer.alloc(SHEET_W * SHEET_H * 4);
  for (const cells of layerCells) {
    for (let y = 0; y < SHEET_H; y++) for (let x = 0; x < SHEET_W; x++) {
      const c = colorOf(cells[y][x], palette);
      if (!c) continue;
      const o = (y * SHEET_W + x) * 4;
      buf[o] = c[0]; buf[o + 1] = c[1]; buf[o + 2] = c[2]; buf[o + 3] = 255;
    }
  }
  return buf;
}

const isEmpty = (cells) => cells.every((row) => row.every((ch) => ch === null));

function crop(src, fx, fy) {
  const buf = Buffer.alloc(FRAME * FRAME * 4);
  for (let y = 0; y < FRAME; y++) {
    const from = ((fy * FRAME + y) * SHEET_W + fx * FRAME) * 4;
    src.copy(buf, y * FRAME * 4, from, from + FRAME * 4);
  }
  return buf;
}

function grid(frames, s, gap, bg) {
  const cols = frames[0].length, rows = frames.length, cell = FRAME * s;
  const W = cols * cell + (cols + 1) * gap, H = rows * cell + (rows + 1) * gap, buf = Buffer.alloc(W * H * 4, 255);
  frames.forEach((line, r) => line.forEach((f, c) => {
    const ox = gap + c * (cell + gap), oy = gap + r * (cell + gap);
    for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
      const i = (Math.floor(y / s) * FRAME + Math.floor(x / s)) * 4, o = ((oy + y) * W + ox + x) * 4;
      const a = f[i + 3] > 0;
      buf[o] = a ? f[i] : bg[0]; buf[o + 1] = a ? f[i + 1] : bg[1]; buf[o + 2] = a ? f[i + 2] : bg[2]; buf[o + 3] = 255;
    }
  }));
  return { buf, W, H };
}

rmSync(out, { recursive: true, force: true });
for (const dir of ["layers/hair", "layers/hairback", "layers/face", "layers/top", "composite"]) mkdirSync(join(out, dir), { recursive: true });

const base = { hair: "bob", outfit: "tee", face: "neutral" };
const save = (path, cells) => writeFileSync(join(out, "layers", path), encodePng(SHEET_W, SHEET_H, toRgba([cells], null)));
save("body.png", buildLook(base).body);
for (const hair of Object.keys(HAIR)) {
  const sheets = buildLook({ ...base, hair });
  save(`hair/${hair}.png`, sheets.hair);
  if (!isEmpty(sheets.hairback)) save(`hairback/${hair}.png`, sheets.hairback);
}
for (const face of Object.keys(FACES)) save(`face/${face}.png`, buildLook({ ...base, face }).face);
for (const outfit of OUTFITS) save(`top/${outfit}.png`, buildLook({ ...base, outfit }).top);

const paletteOf = (ch) => ({ skin: SKIN[ch.skin], hair: HAIR_COLOR[ch.hairColor], top: TOP_COLOR[ch.top] });
const composite = (ch) => toRgba(LAYERS.map((l) => buildLook(ch)[l]), paletteOf(ch));
const composites = CHARACTERS.map((ch) => {
  const rgba = composite(ch);
  writeFileSync(join(out, "composite", `${ch.name}.png`), encodePng(SHEET_W, SHEET_H, rgba));
  return rgba;
});

const bg = hex("#fdf2f8");
const write = (file, img) => writeFileSync(join(out, file), encodePng(img.W, img.H, img.buf));
write("preview_characters.png", grid(composites.map((rgba) => [4, 5, 6, 7].map((r) => crop(rgba, 0, r))), 4, 8, bg));

const mali = CHARACTERS[0];
const faceSheets = Object.keys(FACES).map((face) => composite({ ...mali, face }));
write("preview_faces.png", grid([4, 5].map((r) => faceSheets.map((rgba) => crop(rgba, 0, r))), 4, 8, bg));

const outfitSheets = OUTFITS.map((outfit) => composite({ ...CHARACTERS[1], outfit }));
write("preview_outfits.png", grid(outfitSheets.map((rgba) => [4, 5, 6, 7].map((r) => crop(rgba, 0, r))), 4, 8, bg));

write("preview_walk.png", grid([0, 1, 3].map((r) => [0, 1, 2, 3].map((c) => crop(composites[2], c, r))), 4, 8, bg));

const names = ["walk_down", "walk_left", "walk_right", "walk_up", "idle_down", "idle_left", "idle_right", "idle_up"];
const cell = (file, r, label) => {
  const walking = names[r].startsWith("walk");
  return `<div class="cell"><div class="box"><div class="sprite" style="background-image:url(${file});--row:${r};--n:${walking ? 4 : 2};--t:${walking ? "0.6s" : "1.2s"}"></div></div>${label}</div>`;
};
Object.keys(FACES).forEach((face, i) => writeFileSync(join(out, "composite", `face_${face}.png`), encodePng(SHEET_W, SHEET_H, faceSheets[i])));
const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Townfolk spike 48</title>
<style>
body { background: #fdf2f8; font-family: monospace; color: #9d174d; margin: 24px; }
h2 { margin: 24px 0 4px; }
.row { display: flex; gap: 12px; flex-wrap: wrap; }
.cell { text-align: center; font-size: 12px; }
.box { width: 144px; height: 144px; overflow: hidden; }
.sprite { width: 48px; height: 48px; transform: scale(3); transform-origin: top left; image-rendering: pixelated; animation: play var(--t) steps(var(--n)) infinite; background-position-y: calc(var(--row) * -48px); }
@keyframes play { from { background-position-x: 0; } to { background-position-x: calc(var(--n) * -48px); } }
</style></head><body>
${CHARACTERS.map((ch) => `<h2>${ch.name}: ${ch.hair}, ${ch.outfit}, ${ch.face}</h2><div class="row">${names.map((n, r) => cell(`composite/${ch.name}.png`, r, n)).join("")}</div>`).join("")}
<h2>faces (mali)</h2><div class="row">${Object.keys(FACES).map((f) => cell(`composite/face_${f}.png`, 4, f)).join("")}</div>
</body></html>`;
writeFileSync(join(out, "preview.html"), html);
console.log(`built ${Object.keys(HAIR).length} hairstyles, ${Object.keys(FACES).length} faces, ${OUTFITS.length} outfits, ${CHARACTERS.length} characters`);
