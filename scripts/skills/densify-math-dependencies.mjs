import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), 'data/skills/high_school_skill_tree.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const math = data.subjects.find((s) => s.name === 'Mathematics');
if (!math) throw new Error('Mathematics subject not found');

const idNum = (id) => Number(String(id).split('-')[1]);
const idStr = (n) => `math-${String(n).padStart(3, '0')}`;
const hasNode = new Set(math.nodes.map((n) => n.id));
const edgeSet = new Set(math.edges.map((e) => `${e.from}->${e.to}`));

function addEdge(fromN, toN) {
  const from = idStr(fromN);
  const to = idStr(toN);
  if (!hasNode.has(from) || !hasNode.has(to)) return;
  if (fromN >= toN) return;
  edgeSet.add(`${from}->${to}`);
}

// Course ranges based on expanded generator.
const ranges = {
  base: [1, 12],
  algebra1: [13, 48],
  geometry: [49, 84],
  algebra2: [85, 124],
  precalc: [125, 164],
  calc: [165, 194],
  stats: [195, 220]
};

// Dense intra-course lattice edges.
for (const [name, [start, end]] of Object.entries(ranges)) {
  if (name === 'base') continue;
  for (let n = start; n <= end; n++) {
    addEdge(Math.max(start, n - 2), n);
    addEdge(Math.max(start, n - 4), n);
    addEdge(Math.max(start, n - 7), n);
    if ((n - start) % 5 === 0) addEdge(start, n);
    if ((n - start) % 6 === 0) addEdge(start + 1, n);
  }
}

// Algebra I -> Geometry cross dependencies.
for (let g = ranges.geometry[0]; g <= ranges.geometry[1]; g++) {
  addEdge(20 + ((g - ranges.geometry[0]) % 20), g);
  addEdge(30 + ((g - ranges.geometry[0]) % 12), g);
}

// Geometry + Algebra I -> Algebra II.
for (let a2 = ranges.algebra2[0]; a2 <= ranges.algebra2[1]; a2++) {
  addEdge(40 + ((a2 - ranges.algebra2[0]) % 8), a2);
  addEdge(60 + ((a2 - ranges.algebra2[0]) % 18), a2);
}

// Algebra II + Geometry trig anchors -> Precalc.
for (let p = ranges.precalc[0]; p <= ranges.precalc[1]; p++) {
  addEdge(95 + ((p - ranges.precalc[0]) % 20), p);
  addEdge(70 + ((p - ranges.precalc[0]) % 10), p);
  if ((p - ranges.precalc[0]) % 4 === 0) addEdge(84, p);
}

// Precalc + Algebra II -> Calculus.
for (let c = ranges.calc[0]; c <= ranges.calc[1]; c++) {
  addEdge(130 + ((c - ranges.calc[0]) % 20), c);
  addEdge(110 + ((c - ranges.calc[0]) % 14), c);
  if ((c - ranges.calc[0]) % 3 === 0) addEdge(164, c);
}

// Algebra + Stats fundamentals -> AP Stats.
for (let s = ranges.stats[0]; s <= ranges.stats[1]; s++) {
  addEdge(9, s);
  addEdge(10, s);
  addEdge(35 + ((s - ranges.stats[0]) % 10), s);
  addEdge(100 + ((s - ranges.stats[0]) % 20), s);
}

// Some global foundation dependencies to create layered fan-out.
for (let n = 49; n <= 220; n += 3) addEdge(3, n);
for (let n = 60; n <= 220; n += 4) addEdge(6, n);
for (let n = 90; n <= 220; n += 5) addEdge(8, n);

math.edges = [...edgeSet]
  .map((key) => {
    const [from, to] = key.split('->');
    return { from, to };
  })
  .sort((a, b) => {
    const af = idNum(a.from);
    const bf = idNum(b.from);
    if (af !== bf) return af - bf;
    return idNum(a.to) - idNum(b.to);
  });

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Mathematics edges densified: ${math.edges.length} total edges for ${math.nodes.length} nodes.`);
