import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box } from "@chakra-ui/react";
import StaticMuralStrip from "./MuralStrip"; // SVG version, used for reduced-motion / no-WebGL

// Animated, toon-shaded 3D version of MuralStrip (three.js, no extra libraries).
//
// - Cel shading (3-step ramp) + inverted-hull ink outlines, so it matches the SVG style.
// - Procedural animation: fish swish their tails and turn around, the crab scuttles and
//   snaps its claws, the whale glides and spouts, the shark patrols, the octopus pulses
//   with wavy tentacles, seaweed sways, bubbles rise, everything blinks.
// - Sea floor + waves stay plain CSS behind a transparent canvas.
// - Only renders while on screen. Falls back to <StaticMuralStrip/> when the user prefers
//   reduced motion or WebGL is unavailable.

const INK = "#0B2F2F";
const TEAL = "#0E8C86";
const DEEP = "#0B4F4C";
const LEAF = "#35B3A7";
const CORAL = "#FF6B4A";
const YELLOW = "#FFC857";
const MIST = "#D8F0EC";
const WHITE = "#FFFFFF";
const BLUE = "#5DB7CC";
const PURPLE = "#B48AD6";
const SAND = "#E3F4F1";
const SKY = "#F5FBFB";

// ---------------------------------------------------------------- sea floor (CSS)
const waveTile = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='14' viewBox='0 0 72 14'><path d='M0 7Q18 -2 36 7T72 7' fill='none' stroke='${TEAL}' stroke-width='3'/></svg>`
)}")`;

const Floor = () => (
  <Box position="absolute" left={0} right={0} bottom={0} h="22%" bg={SAND}>
    <Box
      position="absolute" left={0} right={0} top="-7px" h="14px"
      backgroundImage={waveTile} backgroundRepeat="repeat-x" backgroundSize="72px 14px"
    />
    <Box
      position="absolute" left={0} right={0} top="45%" h="14px"
      backgroundImage={waveTile} backgroundRepeat="repeat-x" backgroundSize="72px 14px" backgroundPosition="36px 0"
    />
  </Box>
);

// ---------------------------------------------------------------- toon toolkit
let G = null;
const geos = () => {
  if (!G) {
    G = {
      sphere: new THREE.SphereGeometry(1, 28, 18),
      cone: new THREE.ConeGeometry(1, 2, 24, 1),
      cyl: new THREE.CylinderGeometry(1, 1, 2, 24, 1),
      belly: new THREE.SphereGeometry(1, 28, 8, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4),
      smile: new THREE.TorusGeometry(1, 0.1, 8, 24, Math.PI),
      ring: new THREE.TorusGeometry(1, 0.12, 8, 28),
      disc: new THREE.CircleGeometry(1, 24),
    };
  }
  return G;
};

let RAMP = null;
const ramp = () => {
  if (!RAMP) {
    RAMP = new THREE.DataTexture(
      new Uint8Array([90, 90, 90, 255, 166, 166, 166, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat
    );
    RAMP.minFilter = THREE.NearestFilter;
    RAMP.magFilter = THREE.NearestFilter;
    RAMP.generateMipmaps = false;
    RAMP.needsUpdate = true;
  }
  return RAMP;
};

const toons = new Map();
const toon = (color) => {
  if (!toons.has(color)) toons.set(color, new THREE.MeshToonMaterial({ color, gradientMap: ramp() }));
  return toons.get(color);
};

// Ink outline = same geometry, slightly bigger, back faces only. `extrude` pushes the
// vertices along their normals instead (used for the smooth tubes).
const hulls = new Map();
const hullMat = (extrude = 0) => {
  if (!hulls.has(extrude)) {
    const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
    m.userData.extrude = extrude;
    if (extrude) {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace(
          "#include <begin_vertex>",
          `vec3 transformed = position + normalize(normal) * ${extrude.toFixed(3)};`
        );
      };
      m.customProgramCacheKey = () => `hull${extrude}`;
    }
    hulls.set(extrude, m);
  }
  return hulls.get(extrude);
};

const LINE = 0.09;

// A shaded blob plus its outline. Scale is additive for the outline so the ink
// line has the same thickness on every axis.
function part(parent, geo, color, o = {}) {
  const s = Array.isArray(o.s) ? o.s : [o.s ?? 1, o.s ?? 1, o.s ?? 1];
  const line = o.line ?? LINE;
  const g = new THREE.Group();
  if (o.p) g.position.set(o.p[0], o.p[1], o.p[2]);
  if (o.r) g.rotation.set(o.r[0], o.r[1], o.r[2]);
  const m = new THREE.Mesh(geo, toon(color));
  m.scale.set(s[0], s[1], s[2]);
  g.add(m);
  if (line) {
    const h = new THREE.Mesh(geo, hullMat());
    h.scale.set(s[0] + line, s[1] + line, s[2] + line);
    g.add(h);
  }
  parent.add(g);
  return g;
}

function eyeBall(parent, p, r, look) {
  const e = new THREE.Group();
  e.position.set(p[0], p[1], p[2]);
  parent.add(e);
  part(e, geos().sphere, WHITE, { s: r, line: r * 0.2 });
  part(e, geos().sphere, INK, { p: look.map((v) => v * r * 0.82), s: r * 0.5, line: 0 });
  return e;
}

const blink = (eyes, t) => {
  const s = t % 4.6 > 4.45 ? 0.12 : 1;
  eyes.forEach((e) => { e.scale.y = s; });
};

// Tapered, animated tube (tentacles, seaweed) with a smooth ink outline.
const _t = new THREE.Vector3();
const _n = new THREE.Vector3();
const _b = new THREE.Vector3();
const _ref = new THREE.Vector3(0, 0, 1);

function makeTube(color, N = 14, M = 10, extrude = 0.05) {
  const count = (N + 1) * (M + 1);
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const idx = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j;
      const b = a + M + 1;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  geo.setIndex(idx);
  geo.userData.own = true;
  const group = new THREE.Group();
  const body = new THREE.Mesh(geo, toon(color));
  const hull = new THREE.Mesh(geo, hullMat(extrude));
  body.frustumCulled = false;
  hull.frustumCulled = false;
  group.add(body, hull);
  group.shape = (pts, radii) => {
    for (let i = 0; i <= N; i++) {
      const p = pts[i];
      _t.subVectors(pts[Math.min(N, i + 1)], pts[Math.max(0, i - 1)]).normalize();
      _n.crossVectors(_ref, _t);
      if (_n.lengthSq() < 1e-4) _n.set(1, 0, 0);
      _n.normalize();
      _b.crossVectors(_t, _n);
      for (let j = 0; j <= M; j++) {
        const th = (j / M) * Math.PI * 2;
        const c = Math.cos(th);
        const s = Math.sin(th);
        const k = (i * (M + 1) + j) * 3;
        const nx = _n.x * c + _b.x * s;
        const ny = _n.y * c + _b.y * s;
        const nz = _n.z * c + _b.z * s;
        nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
        pos[k] = p.x + nx * radii[i];
        pos[k + 1] = p.y + ny * radii[i];
        pos[k + 2] = p.z + nz * radii[i];
      }
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate = true;
  };
  return group;
}

const makePts = (n) => Array.from({ length: n }, () => new THREE.Vector3());

// ---------------------------------------------------------------- motion helper
// Patrols left/right on a sine path, turns around smoothly, bobs and pitches a little.
// Every creature keeps a slight 3/4 turn toward the camera so tails read in 3D.
function swim(root, rig, c, t, dt, ctx, bob = 0.25) {
  const a = t * c.speed + c.ph;
  const vel = Math.cos(a);
  root.position.set(
    c.x * ctx.xs + Math.sin(a) * c.range * ctx.rs,
    c.y + Math.sin(t * 0.9 + c.ph * 2.1) * bob,
    c.z
  );
  const target = vel >= 0 ? -0.28 : Math.PI + 0.28;
  c.yaw += (target - c.yaw) * Math.min(1, dt * 3.2);
  root.rotation.y = c.yaw;
  rig.rotation.z = vel * 0.06 + Math.sin(t * 0.9 + c.ph * 2.1 + 1.3) * 0.05;
  return Math.abs(vel);
}

const setup = (c) => {
  const root = new THREE.Group();
  const rig = new THREE.Group();
  root.scale.setScalar(c.s);
  root.add(rig);
  return [root, rig];
};

// ---------------------------------------------------------------- creatures
function makeFish(c) {
  const g = geos();
  const col = c.color ?? CORAL;
  const fin = col === YELLOW ? CORAL : YELLOW;
  const [root, rig] = setup(c);
  part(rig, g.sphere, col, { s: [1, 0.66, 0.5] });
  part(rig, g.cyl, WHITE, { p: [0.12, 0, 0], r: [0, 0, Math.PI / 2], s: [0.68, 0.1, 0.52], line: 0 });
  part(rig, g.cyl, WHITE, { p: [-0.36, 0, 0], r: [0, 0, Math.PI / 2], s: [0.63, 0.06, 0.47], line: 0 });
  const tail = new THREE.Group();
  tail.position.x = -0.92;
  rig.add(tail);
  part(tail, g.cone, fin, { p: [-0.42, 0, 0], r: [0, 0, -Math.PI / 2], s: [0.55, 0.42, 0.1] });
  part(rig, g.cone, fin, { p: [-0.1, 0.62, 0], r: [0, 0, 0.55], s: [0.28, 0.36, 0.09] });
  const pec = [1, -1].map((sd) => {
    const pv = new THREE.Group();
    pv.position.set(0.15, -0.22, 0.42 * sd);
    rig.add(pv);
    part(pv, g.sphere, fin, { p: [-0.22, 0, 0], s: [0.3, 0.1, 0.14], line: 0.06 });
    return pv;
  });
  const eyes = [1, -1].map((sd) => eyeBall(rig, [0.6, 0.16, 0.4 * sd], 0.2, [0.35, 0, 0.9 * sd]));
  return {
    root,
    tick(t, dt, ctx) {
      const v = swim(root, rig, c, t, dt, ctx);
      const w = t * 8 + c.ph;
      tail.rotation.y = Math.sin(w) * (0.35 + 0.25 * v);
      rig.rotation.y = -Math.sin(w) * 0.07;
      const flap = 0.3 + Math.sin(t * 5 + c.ph) * 0.3;
      pec[0].rotation.y = flap;
      pec[1].rotation.y = -flap;
      blink(eyes, t + c.ph * 3);
    },
  };
}

function makeCrab(c) {
  const g = geos();
  const [root, rig] = setup(c);
  part(rig, g.sphere, CORAL, { s: [1.15, 0.62, 0.85] });
  part(rig, g.smile, INK, { p: [0, -0.12, 0.84], r: [0, 0, Math.PI], s: [0.3, 0.3, 0.3], line: 0 });
  const eyes = [-1, 1].map((sd) => {
    const e = new THREE.Group();
    e.position.set(0.42 * sd, 0.5, 0.4);
    rig.add(e);
    part(e, g.cyl, CORAL, { p: [0, 0.2, 0], s: [0.07, 0.3, 0.07], line: 0.05 });
    return { e, ball: eyeBall(e, [0, 0.55, 0.05], 0.24, [0, 0, 1]) };
  });
  const legs = [];
  const claws = [];
  [-1, 1].forEach((sd) => {
    [-0.38, 0, 0.38].forEach((z, i) => {
      const P = new THREE.Group();
      P.position.set(0.85 * sd, -0.15, z);
      rig.add(P);
      part(P, g.sphere, CORAL, { p: [0.5 * sd, 0, 0], s: [0.5, 0.1, 0.1], line: 0.06 });
      const K = new THREE.Group();
      K.position.set(1.0 * sd, 0, 0);
      P.add(K);
      part(K, g.sphere, CORAL, { p: [0.4 * sd, 0, 0], s: [0.4, 0.09, 0.09], line: 0.06 });
      legs.push({ P, K, sd, i });
    });
    const A = new THREE.Group();
    A.position.set(0.95 * sd, 0.1, 0.25);
    rig.add(A);
    part(A, g.sphere, CORAL, { p: [0.3 * sd, 0.25, 0], r: [0, 0, (sd * Math.PI) / 4], s: [0.5, 0.16, 0.16], line: 0.07 });
    part(A, g.sphere, CORAL, { p: [0.62 * sd, 0.55, 0], s: [0.42, 0.36, 0.3], line: 0.08 });
    const F = [1, -1].map(() => {
      const f = new THREE.Group();
      f.position.set(0.62 * sd, 0.8, 0);
      A.add(f);
      part(f, g.cone, CORAL, { p: [0, 0.4, 0], s: [0.14, 0.42, 0.1], line: 0.06 });
      return f;
    });
    claws.push({ A, F, sd });
  });
  return {
    root,
    tick(t, dt, ctx) {
      const a = t * c.speed + c.ph;
      const vel = Math.cos(a);
      const v = Math.abs(vel);
      root.position.set(
        c.x * ctx.xs + Math.sin(a) * c.range * ctx.rs,
        c.y + Math.abs(Math.sin(t * 11)) * 0.06 * v,
        c.z
      );
      rig.rotation.y = vel * 0.25;
      rig.rotation.z = Math.sin(t * 11) * 0.025 * v;
      legs.forEach(({ P, K, sd, i }) => {
        const w = Math.sin(t * 11 + i * 2.1 + (sd > 0 ? 0 : Math.PI));
        P.rotation.z = -0.35 * sd + w * 0.14 * v;
        K.rotation.z = -1.05 * sd + w * 0.2 * v;
      });
      claws.forEach(({ A, F }, k) => {
        const open = 0.12 + 0.42 * Math.pow(Math.max(0, Math.sin(t * 1.7 + k * 1.9 + c.ph)), 8);
        F[0].rotation.z = open;
        F[1].rotation.z = -open;
        A.rotation.z = Math.sin(t * 1.3 + k) * 0.08;
      });
      eyes.forEach(({ e }, k) => { e.rotation.z = Math.sin(t * 1.5 + k) * 0.08; });
      blink(eyes.map((x) => x.ball), t + c.ph * 3);
    },
  };
}

function makeWhale(c) {
  const g = geos();
  const [root, rig] = setup(c);
  part(rig, g.sphere, BLUE, { s: [2.05, 1.3, 1.25] });
  part(rig, g.belly, MIST, { s: [2.07, 1.32, 1.27], line: 0 });
  const stock = new THREE.Group();
  stock.position.set(-1.85, -0.05, 0);
  rig.add(stock);
  part(stock, g.sphere, BLUE, { p: [-0.65, 0, 0], s: [0.95, 0.55, 0.5] });
  const fluke = new THREE.Group();
  fluke.position.set(-1.45, 0, 0);
  stock.add(fluke);
  part(fluke, g.sphere, BLUE, { p: [-0.12, 0.5, 0], r: [0, 0, 0.55], s: [0.2, 0.62, 0.11] });
  part(fluke, g.sphere, BLUE, { p: [0.12, 0.5, 0], r: [0, 0, -0.5], s: [0.2, 0.62, 0.11] });
  const flip = [1, -1].map((sd) => {
    const f = new THREE.Group();
    f.position.set(0.4, -0.75, 0.88 * sd);
    rig.add(f);
    part(f, g.sphere, "#3E9CB5", { p: [-0.45, -0.12, 0], r: [0, 0, -0.35], s: [0.62, 0.17, 0.3] });
    return f;
  });
  const eyes = [1, -1].map((sd) => eyeBall(rig, [1.5, 0.4, 0.78 * sd], 0.26, [0.5, 0, 0.85 * sd]));
  const drops = Array.from({ length: 9 }, () => {
    const d = part(rig, g.sphere, "#BDEFF0", { s: 0.13, line: 0.04 });
    d.visible = false;
    return d;
  });
  return {
    root,
    tick(t, dt, ctx) {
      const v = swim(root, rig, c, t, dt, ctx, 0.35);
      const w = t * 2.2 + c.ph;
      stock.rotation.z = -0.45 + Math.sin(w) * 0.15;
      fluke.rotation.z = 0.7 + Math.sin(w - 1) * 0.28;
      flip[0].rotation.y = 0.2 + Math.sin(t * 1.6) * 0.15;
      flip[1].rotation.y = -(0.2 + Math.sin(t * 1.6) * 0.15);
      blink(eyes, t + c.ph * 2);
      const u = (t + c.ph * 2) % 7;
      drops.forEach((d, k) => {
        const q = (u - k * 0.06) / 1.5;
        d.visible = q > 0 && q < 1;
        if (d.visible) {
          d.position.set(0.2 + (k - 4) * 0.2 * q, 1.25 + 4.8 * q * (1 - q), 0);
          d.scale.setScalar(Math.sin(Math.PI * q) * (0.8 + (k % 3) * 0.25));
        }
      });
      return v;
    },
  };
}

function makeShark(c) {
  const g = geos();
  const GREY = "#8DB4C4";
  const FIN = "#6FA3B5";
  const [root, rig] = setup(c);
  part(rig, g.sphere, GREY, { s: [2.3, 0.8, 0.72] });
  part(rig, g.belly, WHITE, { s: [2.32, 0.82, 0.74], line: 0 });
  part(rig, g.cone, FIN, { p: [-0.15, 0.95, 0], r: [0, 0, 0.5], s: [0.5, 0.8, 0.08] });
  [1, -1].forEach((sd) => {
    part(rig, g.cone, FIN, { p: [0.45, -0.7, 0.3 * sd], r: [0, 0, 2.3], s: [0.24, 0.62, 0.07] });
  });
  const stock = new THREE.Group();
  stock.position.set(-2.05, 0, 0);
  rig.add(stock);
  part(stock, g.sphere, GREY, { p: [-0.55, 0, 0], s: [0.8, 0.36, 0.32] });
  const caud = new THREE.Group();
  caud.position.set(-1.25, 0, 0);
  stock.add(caud);
  part(caud, g.cone, GREY, { p: [-0.12, 0.62, 0], r: [0, 0, 0.45], s: [0.26, 0.92, 0.08] });
  part(caud, g.cone, GREY, { p: [-0.1, -0.4, 0], r: [0, 0, Math.PI - 0.5], s: [0.2, 0.58, 0.07] });
  const eyes = [1, -1].map((sd) => eyeBall(rig, [1.75, 0.2, 0.45 * sd], 0.14, [0.4, 0, 0.9 * sd]));
  [0.55, 0.7, 0.85].forEach((x) => {
    const z = 0.72 * Math.sqrt(1 - (x / 2.3) ** 2) - 0.005;
    [1, -1].forEach((sd) => part(rig, g.sphere, INK, { p: [x, 0, z * sd], r: [0, 0, 0.25], s: [0.025, 0.26, 0.03], line: 0 }));
  });
  return {
    root,
    tick(t, dt, ctx) {
      swim(root, rig, c, t, dt, ctx, 0.3);
      const w = t * 3 + c.ph;
      stock.rotation.y = Math.sin(w) * 0.3;
      stock.rotation.z = Math.sin(w + 1) * 0.05;
      caud.rotation.y = Math.sin(w - 0.9) * 0.35;
      blink(eyes, t + c.ph * 2);
    },
  };
}

const TENTACLES = 6;

function makeOctopus(c) {
  const g = geos();
  const [root, rig] = setup(c);
  const head = new THREE.Group();
  head.position.y = 0.6;
  rig.add(head);
  part(head, g.sphere, PURPLE, { s: [1.1, 1.25, 1.0] });
  part(head, g.sphere, "#CDB0E6", { p: [-0.3, 0.95, 0.56], s: [0.2, 0.15, 0.12], line: 0 });
  part(head, g.sphere, "#CDB0E6", { p: [0.25, 0.75, 0.68], s: [0.13, 0.1, 0.1], line: 0 });
  [-1, 1].forEach((sd) => part(head, g.sphere, "#E58BB0", { p: [0.72 * sd, -0.22, 0.66], s: [0.2, 0.13, 0.05], line: 0 }));
  part(head, g.smile, INK, { p: [0, -0.5, 0.93], r: [0, 0, Math.PI], s: [0.3, 0.3, 0.3], line: 0 });
  const eyes = [-1, 1].map((sd) => eyeBall(head, [0.42 * sd, 0, 0.92], 0.33, [0, 0, 1]));
  const N = 14;
  const pts = makePts(N + 1);
  const rad = Array.from({ length: N + 1 }, (_, i) => 0.34 * Math.pow(1 - i / N, 0.8) + 0.06);
  const tubes = Array.from({ length: TENTACLES }, (_, k) => {
    const phi = (k * Math.PI * 2) / TENTACLES + Math.PI / 6;
    const tube = makeTube(PURPLE, N, 10, 0.06);
    rig.add(tube);
    return { tube, k, dx: Math.cos(phi), dz: Math.sin(phi) };
  });
  return {
    root,
    tick(t, dt, ctx) {
      const pulse = Math.sin(t * 1.6 + c.ph);
      root.position.set(
        c.x * ctx.xs + Math.sin(t * c.speed + c.ph) * c.range * ctx.rs,
        c.y + Math.sin(t * 0.8 + c.ph) * 0.35 + pulse * 0.18,
        c.z
      );
      rig.rotation.y = Math.sin(t * 0.45 + c.ph) * 0.45;
      head.scale.set(1 + pulse * 0.04, 1 - pulse * 0.05, 1 + pulse * 0.04);
      const spread = 0.85 + 0.22 * pulse;
      tubes.forEach(({ tube, k, dx, dz }) => {
        const bx = dx * 0.55;
        const bz = dz * 0.45;
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          pts[i].set(
            bx + dx * spread * u * 1.1 + Math.sin(t * 1.7 - u * 5 + k * 1.3) * 0.28 * u - dx * 0.55 * u * u * u,
            -0.3 - 2.4 * u + 0.45 * u * u * u,
            bz + dz * spread * u * 0.9 + Math.sin(t * 1.4 - u * 4 + k * 2.1) * 0.22 * u
          );
        }
        tube.shape(pts, rad);
      });
      blink(eyes, t + c.ph * 2);
    },
  };
}

function makeStar(c) {
  const g = geos();
  const root = new THREE.Group();
  root.scale.setScalar(c.s);
  const arms = [];
  for (let k = 0; k < 5; k++) {
    const a = new THREE.Group();
    a.rotation.z = (k * Math.PI * 2) / 5;
    root.add(a);
    part(a, g.cone, YELLOW, { p: [0, 0.62, 0], s: [0.4, 0.78, 0.26], line: 0.08 });
    arms.push(a);
  }
  part(root, g.sphere, YELLOW, { s: [0.66, 0.66, 0.4], line: 0 });
  [-1, 1].forEach((sd) => part(root, g.sphere, INK, { p: [0.2 * sd, 0.1, 0.375], s: 0.06, line: 0 }));
  part(root, g.smile, INK, { p: [0, -0.12, 0.39], r: [0, 0, Math.PI], s: [0.13, 0.13, 0.13], line: 0 });
  return {
    root,
    tick(t, dt, ctx) {
      root.position.set(c.x * ctx.xs, c.y, c.z);
      root.rotation.z = Math.sin(t * 0.6 + c.ph) * 0.1;
      arms.forEach((a, k) => { a.scale.y = 1 + 0.08 * Math.sin(t * 1.4 + k * 1.2); });
    },
  };
}

const bubbleMats = {};
function makeBubbles(c) {
  const g = geos();
  const root = new THREE.Group();
  if (!bubbleMats.ring) {
    bubbleMats.ring = new THREE.MeshBasicMaterial({ color: TEAL });
    bubbleMats.fill = new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.5, depthWrite: false });
  }
  const items = Array.from({ length: 6 }, (_, i) => {
    const b = new THREE.Group();
    b.add(new THREE.Mesh(g.disc, bubbleMats.fill), new THREE.Mesh(g.ring, bubbleMats.ring));
    root.add(b);
    return b;
  });
  return {
    root,
    tick(t, dt, ctx) {
      items.forEach((b, i) => {
        const P = 6 + i * 0.9;
        const u = ((t + i * 1.1) / P) % 1;
        const r = (0.11 + (i % 3) * 0.05) * c.s * Math.min(1, u * 8);
        b.position.set(c.x * ctx.xs + Math.sin(t * 1.8 + i) * 0.22 + ((i % 3) - 1) * 0.35, -3 + u * 7.6, c.z - 0.5);
        b.scale.setScalar(Math.max(r, 0.0001));
        b.quaternion.copy(ctx.camera.quaternion);
      });
    },
  };
}

function makeSeaweed(c) {
  const root = new THREE.Group();
  root.scale.setScalar(c.s);
  const N = 12;
  const pts = makePts(N + 1);
  const rad = Array.from({ length: N + 1 }, (_, i) => 0.26 * (1 - i / N) + 0.04);
  const blades = [
    [0, 0, 3.4, DEEP, 0],
    [0.5, 0.25, 2.6, TEAL, 1.7],
    [-0.5, -0.25, 1.9, LEAF, 3.1],
  ].map(([bx, bz, L, col, ph]) => {
    const tube = makeTube(col, N, 8, 0.05);
    root.add(tube);
    return { tube, bx, bz, L, ph };
  });
  return {
    root,
    tick(t, dt, ctx) {
      root.position.set(c.x * ctx.xs, c.y, c.z);
      blades.forEach(({ tube, bx, bz, L, ph }) => {
        for (let i = 0; i <= N; i++) {
          const u = i / N;
          pts[i].set(
            bx + Math.sin(t * 1.1 + ph + u * 2.4) * 0.42 * u + bx * 0.5 * u * u,
            u * L,
            bz + Math.sin(t * 0.8 + ph * 1.3 + u * 2) * 0.15 * u
          );
        }
        tube.shape(pts, rad);
      });
    },
  };
}

// ---------------------------------------------------------------- layouts
// Positions come from the SVG layouts (same design, now in 3D). The world is 10 units
// tall; the sea floor starts at y = -2.8 (22% of the strip).
const toD = (x, y) => [(x - 550) / 28, (140 - y) / 28];
const toM = (x, y) => [(x - 195) * 0.04, (145 - y) / 29];

const F = (x, y, s, color = CORAL, flip = false) => ["fish", x, y, s, { color, flip }];
const B = (x, y, s = 1) => ["bubbles", x, y, s];

const CASTS = {
  reef: {
    d: [["whale", 230, 114, 1.05], B(410, 160), F(510, 92, 1.25), F(640, 148, 1, YELLOW, true), ["crab", 860, 196, 1.05], F(990, 95, 0.8, BLUE, true)],
    m: [["whale", 130, 100, 0.8], F(305, 85, 0.9, YELLOW), F(105, 178, 0.8), ["crab", 255, 196, 0.8], B(345, 150, 0.7)],
  },
  crab: {
    d: [F(170, 110, 1.2, YELLOW), B(330, 150), ["crab", 545, 192, 1.25], ["star", 760, 238, 1.3], F(930, 105, 1.15, CORAL, true)],
    m: [F(95, 85, 0.85, YELLOW), F(300, 105, 0.8, CORAL, true), B(60, 170, 0.7), ["crab", 195, 192, 1], ["star", 318, 240, 0.9]],
  },
  school: {
    d: [F(200, 115, 1.3), F(345, 165, 1, YELLOW), F(500, 80, 1.15, BLUE), F(650, 145, 1.35), F(820, 95, 1, YELLOW), F(945, 168, 1.2, PURPLE), B(760, 200)],
    m: [F(95, 70, 1), F(245, 95, 0.85, YELLOW), F(150, 150, 0.95, BLUE), F(290, 180, 0.8, PURPLE), F(90, 198, 0.7, YELLOW), B(350, 110, 0.6)],
  },
  shark: {
    d: [F(230, 150, 0.9, YELLOW), B(330, 190), ["shark", 545, 112, 1.05], F(740, 100, 0.95), F(880, 160, 0.8, YELLOW), ["star", 700, 238, 1.2]],
    m: [["shark", 175, 105, 0.85], F(300, 110, 0.7), F(95, 190, 0.65, YELLOW), B(60, 150, 0.6), ["star", 300, 240, 0.9]],
  },
  octo: {
    d: [["octo", 300, 112, 1], B(460, 80), ["star", 520, 240, 1.3], F(600, 100, 1.1, YELLOW, true), F(720, 170, 0.8), ["whale", 890, 125, 0.9]],
    m: [["octo", 110, 115, 0.8], F(270, 95, 0.85, YELLOW, true), ["whale", 265, 190, 0.65], ["star", 190, 240, 1], B(350, 150, 0.6)],
  },
  whale: {
    d: [F(200, 150, 1.1), B(340, 120), ["whale", 560, 120, 1.1], ["octo", 905, 120, 0.95], F(1030, 60, 0.8, YELLOW, true)],
    m: [F(62, 100, 0.72), ["whale", 195, 120, 0.85], F(330, 75, 0.6, YELLOW, true), ["octo", 305, 195, 0.55], B(55, 185, 0.6)],
  },
};

const WEEDS = { d: [[95, 264, 1], [1010, 268, 0.85]], m: [[26, 264, 0.6], [366, 268, 0.5]] };
const MAKE = { fish: makeFish, crab: makeCrab, whale: makeWhale, shark: makeShark, octo: makeOctopus, star: makeStar, bubbles: makeBubbles };
// [roam range (world units), speed (rad/s)]
const DEF = { fish: [2.4, 0.3], whale: [3.2, 0.12], shark: [4.4, 0.17], crab: [2, 0.34], octo: [1.4, 0.22], star: [0, 0], bubbles: [0, 0] };
const Z = [0, -1.2, 1, -0.5, 0.7, -1.6];

function buildWorld(variant, narrow) {
  const to = narrow ? toM : toD;
  const set = CASTS[variant] || CASTS.reef;
  const world = new THREE.Group();
  const creatures = [];
  const add = (cr) => { world.add(cr.root); creatures.push(cr); };
  (narrow ? WEEDS.m : WEEDS.d).forEach(([x, y, s], i) => {
    const [wx, wy] = to(x, y);
    add(makeSeaweed({ x: wx, y: wy, z: -1.5, s: s * 1.05, ph: i }));
  });
  (narrow ? set.m : set.d).forEach(([type, x, y, s, o = {}], i) => {
    const [wx, wy] = to(x, y);
    const [range, speed] = DEF[type];
    const c = {
      x: wx, y: wy, z: Z[i % Z.length], s, range,
      speed: speed * (0.85 + ((i * 37) % 30) / 100),
      ph: o.flip ? Math.PI : i * 0.9,
      ...o,
    };
    if (variant === "school" && type === "fish") { c.speed = 0.38; c.ph = i * 0.2; c.range = 3.4; }
    if (type === "crab") { c.y = -3.35 + 1.3 * s; c.z = 0.6; }
    c.yaw = Math.cos(c.ph) >= 0 ? -0.28 : Math.PI + 0.28;
    add(MAKE[type](c));
  });
  return { world, creatures };
}

// ---------------------------------------------------------------- engine
const FOV = 24;
const WORLD_H = 10;
const DIST = WORLD_H / 2 / Math.tan((FOV / 2) * (Math.PI / 180));

function createEngine(canvas, wrap, variant) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  if (!("outputColorSpace" in renderer)) renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 100);
  camera.position.set(0, 0, DIST);

  // Lights changed units in three r155 (physically based); keep the same look on both.
  const k = parseInt(THREE.REVISION, 10) >= 155 ? Math.PI : 1;
  scene.add(new THREE.AmbientLight(0xffffff, 0.45 * k));
  const sun = new THREE.DirectionalLight(0xffffff, 0.55 * k);
  sun.position.set(-6, 9, 12);
  scene.add(sun);

  const ctx = { W: 30, xs: 1, rs: 1, narrow: null, camera };
  let built = null;
  let raf = 0;
  let last = 0;

  const freeWorld = () => {
    if (!built) return;
    scene.remove(built.world);
    built.world.traverse((o) => { if (o.geometry && o.geometry.userData.own) o.geometry.dispose(); });
    built = null;
  };

  const resize = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    ctx.W = WORLD_H * camera.aspect;
    const narrow = w < 768;
    ctx.xs = narrow ? ctx.W / 15.6 : Math.min(ctx.W, 39.3) / 39.3;
    ctx.rs = narrow ? 0.6 : 1;
    if (narrow !== ctx.narrow) {
      ctx.narrow = narrow;
      freeWorld();
      built = buildWorld(variant, narrow);
      scene.add(built.world);
    }
    draw(last);
  };

  const draw = (t) => {
    if (!built) return;
    camera.position.x = Math.sin(t * 0.17) * 0.5;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const dt = 0.016;
    built.creatures.forEach((cr) => cr.tick(t, dt, ctx));
    renderer.render(scene, camera);
  };

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const t = now / 1000;
    const dt = Math.min(0.05, t - last);
    last = t;
    if (!built) return;
    camera.position.x = Math.sin(t * 0.17) * 0.5;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    built.creatures.forEach((cr) => cr.tick(t, dt, ctx));
    renderer.render(scene, camera);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  return {
    play() { if (!raf) raf = requestAnimationFrame(frame); },
    pause() { cancelAnimationFrame(raf); raf = 0; },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      freeWorld();
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
    },
  };
}

// ---------------------------------------------------------------- component
const MuralStrip3D = ({ variant = "reef" }) => {
  const hostRef = useRef(null);
  const wrapRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (fallback) return undefined;
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap || !host) return undefined;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return undefined;
    }
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;display:block";
    host.appendChild(canvas);
    let engine;
    try {
      engine = createEngine(canvas, wrap, variant);
    } catch (e) {
      canvas.remove();
      setFallback(true);
      return undefined;
    }
    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([en]) => (en.isIntersecting ? engine.play() : engine.pause()), { rootMargin: "120px" });
      io.observe(wrap);
    } else {
      engine.play();
    }
    return () => {
      if (io) io.disconnect();
      engine.dispose();
      canvas.remove();
    };
  }, [variant, fallback]);

  if (fallback) return <StaticMuralStrip variant={variant} />;

  return (
    <Box
      ref={wrapRef}
      aria-hidden="true"
      position="relative"
      bg={SKY}
      h={{ base: "260px", sm: "270px", md: "280px" }}
      my={{ base: 0, md: "-2px" }}
      pointerEvents="none"
      zIndex={1}
      overflow="hidden"
      borderTop="1px solid rgba(11,47,47,0.08)"
      borderBottom="1px solid rgba(11,47,47,0.08)"
    >
      <Floor />
      <Box ref={hostRef} position="absolute" left={0} top={0} right={0} bottom={0} />
    </Box>
  );
};

export default MuralStrip3D;