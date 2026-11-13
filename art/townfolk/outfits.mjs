const part = (grid, x, y, outline = true) => ({ grid, x, y, outline });
const fill = (ch, w, h) => Array.from({ length: h }, () => ch.repeat(w));

const ARM = {
  short: ["cc", "cc", "cc", "dd", "ss", "ss", "ss"],
  long: ["cc", "cc", "cc", "cc", "dd", "ss", "ss"],
  white: ["WW", "WW", "WW", "WW", "ss", "ss", "ss"],
};
const ARM_SIDE = {
  short: ["ddd", "ddd", "ddd", "ddd", "sss", "sss"],
  long: ["ddd", "ddd", "ddd", "ddd", "ddd", "sss"],
  white: ["WWW", "WWW", "WWW", "WWW", "sss", "sss"],
};

function arms(kind, pose, u) {
  return [
    part(ARM[kind], 15, 23 + u + (pose.al || 0)),
    part(ARM[kind], 31, 23 + u + (pose.ar || 0)),
  ];
}
const sideArm = (kind, pose, u) => part(ARM_SIDE[kind], 22 + (pose.arm || 0), 24 + u);

const shortsFront = (ch) => ["e", "e", "e"].map((_, r) => (r < 2 ? ch.repeat(12) : ch.repeat(5) + ".." + ch.repeat(5)));

function pantsFront(ch, pose, u) {
  return [
    part(shortsFront(ch), 18, 31 + u),
    part(fill(ch, 4, 5), 18, 34 + (pose.l || 0), "noTop"),
    part(fill(ch, 4, 5), 26, 34 + (pose.r || 0), "noTop"),
  ];
}

function pantsSide(ch, pose, u) {
  const near = pose.near || [0, 0], far = pose.far || [0, 0];
  return {
    far: part(fill(ch, 4, 5), 21 + far[0], 34 + far[1], "noTop"),
    hips: part(fill(ch, 8, 3), 20, 31 + u),
    near: part(fill(ch, 4, 5), 21 + near[0], 34 + near[1], "noTop"),
  };
}

const TORSO = {
  tee: {
    down: ["ccWWWccWWWcc", ...fill("c", 12, 4), "dccccccccccd", "dddddddddddd"],
    up: [...fill("c", 12, 5), "dccccccccccd", "dddddddddddd"],
    left: ["WWWccccc", ...fill("c", 8, 4), "dccccccd", "dddddddd"],
  },
  dress: {
    down: ["ccWWWccWWWcc", ...fill("c", 12, 4), "RRRRRRRRRRRR", "cccccccccccc"],
    up: [...fill("c", 12, 5), "RRRRRRRRRRRR", "cccccccccccc"],
    left: ["WWWccccc", ...fill("c", 8, 4), "RRRRRRRR", "cccccccc"],
  },
  hoodie: {
    down: ["dddddddddddd", "ccccWccWcccc", "ccccWccWcccc", "cccccccccccc", "ccddddddddcc", "ccdccccccdcc", "dddddddddddd"],
    up: ["cddddddddddc", "cddddddddddc", "ccddddddddcc", "cccddddddccc", "cccccccccccc", "dccccccccccd", "dddddddddddd"],
    left: ["ccccdddd", "ccccdddd", "cccccddd", "cccccccc", "cccccccc", "dccccccd", "dddddddd"],
  },
  overalls: {
    down: ["WWddWWWWddWW", "WWddWWWWddWW", "WWddddddddWW", "WWddddddddWW", "WWddddddddWW", "WWddddddddWW", "dddddddddddd"],
    up: ["WWddWWWWddWW", "WWddWWWWddWW", "WWWddWWddWWW", "WWWWddddWWWW", "WWWddddddWWW", "WWddddddddWW", "dddddddddddd"],
    left: ["ddddWWWW", "ddddWWWW", "dddddWWW", "ddddddWW", "dddddddd", "dddddddd", "dddddddd"],
  },
  uniform: {
    down: ["WWWWWRRWWWWW", "WWWWWRRWWWWW", "WWWWWRRWWWWW", "WWWWWRRWWWWW", ...fill("W", 12, 3)],
    up: fill("W", 12, 7),
    left: ["RWWWWWWW", "RWWWWWWW", "RWWWWWWW", ...fill("W", 8, 4)],
  },
};

const SKIRT = {
  dress: {
    front: ["..cccccccccccc..", ".cccccccccccccc.", ".cccccccccccccc.", "cccccccccccccccc", "dccccccccccccccd", "dddddddddddddddd"],
    frontX: 16,
    side: ["..cccccccc..", ".cccccccccc.", ".cccccccccc.", "cccccccccccc", "dccccccccccd", "dddddddddddd"],
    sideX: 18,
  },
  uniform: {
    front: ["cccccccccccccc", "cdccdccdccdccd", "cdccdccdccdccd", "dddddddddddddd"],
    frontX: 17,
    side: ["cccccccccc", "cdccdccdcc", "cdccdccdcc", "dddddddddd"],
    sideX: 19,
  },
};

const LOOK = {
  tee: { arm: "short", lower: { pants: false, shorts: "e" } },
  dress: { arm: "short", lower: { skirt: "dress" } },
  hoodie: { arm: "long", lower: { pants: "e" } },
  overalls: { arm: "white", lower: { pants: "d" } },
  uniform: { arm: "white", lower: { skirt: "uniform" } },
};

function lowerFront(look, pose, u) {
  const l = look.lower;
  if (l.skirt) return [part(SKIRT[l.skirt].front, SKIRT[l.skirt].frontX, 31 + u)];
  if (l.pants) return pantsFront(l.pants, pose, u);
  return [part(shortsFront(l.shorts), 18, 31 + u)];
}

export function outfitFront(name, dir, pose, u) {
  const look = LOOK[name];
  return [part(TORSO[name][dir], 18, 23 + u), ...lowerFront(look, pose, u), ...arms(look.arm, pose, u)];
}

export function outfitSide(name, pose, u) {
  const look = LOOK[name], l = look.lower, torso = part(TORSO[name].left, 20, 23 + u), arm = sideArm(look.arm, pose, u);
  if (l.skirt) return [torso, part(SKIRT[l.skirt].side, SKIRT[l.skirt].sideX, 31 + u), arm];
  if (l.pants) {
    const p = pantsSide(l.pants, pose, u);
    return [torso, p.far, p.hips, p.near, arm];
  }
  return [torso, part(fill(l.shorts, 8, 3), 20, 31 + u), arm];
}

export const OUTFITS = Object.keys(LOOK);
