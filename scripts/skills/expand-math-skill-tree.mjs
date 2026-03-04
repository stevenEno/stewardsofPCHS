import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), 'data/skills/high_school_skill_tree.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const math = data.subjects.find((s) => s.name === 'Mathematics');
if (!math) {
  throw new Error('Mathematics subject not found');
}

const baseNodes = math.nodes.slice(0, 12);
const baseEdges = math.edges.filter((e) => {
  const fromNum = Number(e.from.split('-')[1]);
  const toNum = Number(e.to.split('-')[1]);
  return fromNum <= 12 && toNum <= 12;
});

const courseDefs = [
  {
    level: 'Algebra I',
    color: '#93C5FD',
    resources: [
      'https://www.khanacademy.org/math/algebra',
      'https://www.corestandards.org/Math/Content/HSA/'
    ],
    topics: [
      'Multi-step linear inequalities',
      'Absolute value equations',
      'Literal equations and formulas',
      'Rate and unit analysis',
      'Direct variation models',
      'Inverse variation models',
      'Domain and range in context',
      'Piecewise function interpretation',
      'Recursive function rules',
      'Arithmetic sequence models',
      'Geometric sequence models',
      'Function transformations composition',
      'Function inverses introductory',
      'Graphing linear constraints',
      'Systems with three variables',
      'Linear modeling with residuals',
      'Correlation and causation basics',
      'Exponents and scientific notation',
      'Radical expressions simplification',
      'Rational exponents conversion',
      'Quadratic pattern recognition',
      'Completing the square process',
      'Complex numbers basics',
      'Quadratic inequalities',
      'Polynomial long division intro',
      'Synthetic division intro',
      'Remainder theorem applications',
      'Zeros and multiplicity analysis',
      'Factoring special products',
      'Factoring by grouping',
      'Modeling with quadratic regressions',
      'Compound inequalities on graphs',
      'Function notation fluency',
      'Interpret slope and intercepts',
      'Parallel and perpendicular lines',
      'Linear programming intro'
    ]
  },
  {
    level: 'Geometry',
    color: '#67E8F9',
    resources: [
      'https://www.khanacademy.org/math/geometry',
      'https://www.corestandards.org/Math/Content/HSG/'
    ],
    topics: [
      'Geometric definitions and postulates',
      'Inductive and deductive reasoning',
      'Two-column proof structure',
      'Triangle congruence criteria',
      'Parallel lines angle theorems',
      'Triangle inequality theorem',
      'Coordinate geometry proofs',
      'Midpoint and distance formulas',
      'Perimeter and area derivations',
      'Polygon interior angle sums',
      'Similarity transformations',
      'Triangle similarity criteria',
      'Right triangle trigonometry intro',
      'Pythagorean theorem applications',
      'Special right triangles',
      'Circles chords and arcs',
      'Central and inscribed angles',
      'Tangent secant relationships',
      'Circle equation in coordinate plane',
      'Arc length and sector area',
      'Three-dimensional solids volume',
      'Surface area optimization',
      'Cross sections of solids',
      'Transformations and symmetry',
      'Dilations on coordinate plane',
      'Vectors in geometry',
      'Geometric probability basics',
      'Conic sections introduction',
      'Parabola focus-directrix',
      'Ellipse properties',
      'Hyperbola properties',
      'Logical equivalence in proofs',
      'Locus and construction reasoning',
      'Coordinate transformations',
      'Geometric modeling projects',
      'Formal proof capstone'
    ]
  },
  {
    level: 'Algebra II',
    color: '#60A5FA',
    resources: [
      'https://www.khanacademy.org/math/algebra2',
      'https://www.corestandards.org/Math/Content/HSF/'
    ],
    topics: [
      'Polynomial arithmetic fluency',
      'Polynomial theorem applications',
      'Rational function graphing',
      'Asymptotes and end behavior',
      'Inverse variation with rational functions',
      'Exponential growth and decay',
      'Logarithm laws and change of base',
      'Exponential and logarithmic equations',
      'Composite and inverse functions',
      'Function operations review',
      'Quadratic systems solving',
      'Polynomial inequalities analysis',
      'Complex numbers operations',
      'Complex plane representation',
      'De Moivre theorem intro',
      'Binomial theorem basics',
      'Pascal triangle applications',
      'Sequence recursion and iteration',
      'Series notation and sigma',
      'Arithmetic series formulas',
      'Geometric series formulas',
      'Finite geometric sums',
      'Infinite geometric series intro',
      'Conic sections standard forms',
      'Parabola transformations advanced',
      'Ellipse and hyperbola graphs',
      'Systems with nonlinear equations',
      'Matrix notation basics',
      'Matrix operations and inverses',
      'Determinants and system solving',
      'Linear programming with constraints',
      'Piecewise and step functions',
      'Absolute value transformations',
      'Rational inequalities advanced',
      'Radical equations and extraneous roots',
      'Parametric equations intro',
      'Polar coordinates intro',
      'Trigonometric identities prep',
      'Regression models comparison',
      'Algebra II modeling capstone'
    ]
  },
  {
    level: 'Precalculus',
    color: '#818CF8',
    resources: [
      'https://www.khanacademy.org/math/precalculus',
      'https://www.openstax.org/details/books/precalculus-2e'
    ],
    topics: [
      'Function families synthesis',
      'Advanced transformation analysis',
      'Polynomial function behavior',
      'Rational function behavior',
      'Exponential logarithmic modeling',
      'Trigonometric unit circle fluency',
      'Graphing trigonometric functions',
      'Trigonometric identities verification',
      'Sum and difference identities',
      'Double-angle and half-angle identities',
      'Solving trigonometric equations',
      'Inverse trigonometric functions',
      'Law of sines applications',
      'Law of cosines applications',
      'Vectors and parametric equations',
      'Dot product and projections',
      'Polar coordinates and graphs',
      'Polar equations and symmetry',
      'Complex numbers in polar form',
      'Roots and powers in complex plane',
      'Conic sections analytic methods',
      'Sequences convergence intuition',
      'Series convergence intuition',
      'Binomial theorem extensions',
      'Partial fraction decomposition',
      'Recurrence relations basics',
      'Matrices and transformations',
      'Linear systems with matrices',
      'Determinants and geometry',
      'Eigenvalues introductory concept',
      'Modeling periodic phenomena',
      'Harmonic motion equations',
      'Numerical methods basics',
      'Difference quotients prep',
      'Average versus instantaneous rate',
      'Limits from graphs',
      'Limits from tables',
      'Continuity in context',
      'Precalculus problem solving workshop',
      'Precalculus capstone project'
    ]
  },
  {
    level: 'AP Calculus AB',
    color: '#7C3AED',
    resources: [
      'https://apcentral.collegeboard.org/courses/ap-calculus-ab',
      'https://www.khanacademy.org/math/ap-calculus-ab'
    ],
    topics: [
      'Formal limit notation',
      'Limit laws and algebra',
      'One-sided limits and continuity',
      'Intermediate value theorem',
      'Derivative definition from limits',
      'Derivative rules power product quotient',
      'Chain rule and composition',
      'Implicit differentiation',
      'Derivatives of trig functions',
      'Derivatives of inverse trig',
      'Derivatives of exponential functions',
      'Derivatives of logarithmic functions',
      'Higher-order derivatives',
      'Motion along a line',
      'Related rates setup',
      'Linearization and differentials',
      'Mean value theorem',
      'Increasing decreasing tests',
      'Concavity and second derivative test',
      'Optimization in context',
      'Antiderivative basics',
      'Riemann sums',
      'Fundamental theorem of calculus',
      'Definite integral properties',
      'Substitution method',
      'Area between curves',
      'Accumulation functions',
      'Differential equations slope fields',
      'Separable differential equations',
      'AP Calculus AB exam modeling'
    ]
  },
  {
    level: 'AP Statistics',
    color: '#059669',
    resources: [
      'https://apcentral.collegeboard.org/courses/ap-statistics',
      'https://www.khanacademy.org/math/statistics-probability'
    ],
    topics: [
      'Data collection methods',
      'Experimental design principles',
      'Sampling distributions',
      'Normal model and z-scores',
      'Central limit theorem intuition',
      'Confidence intervals for means',
      'Confidence intervals for proportions',
      'Hypothesis testing framework',
      'Type I and Type II error',
      'One-sample t-tests',
      'Two-sample t-tests',
      'Chi-square tests',
      'Linear regression inference',
      'Residual analysis',
      'Probability rules review',
      'Random variables and expected value',
      'Binomial and geometric models',
      'Simulation and randomization tests',
      'Permutation and combination models',
      'Conditional probability and Bayes',
      'Nonlinear regression overview',
      'Statistical ethics and bias',
      'Data visualization best practices',
      'Inference with technology',
      'AP Statistics free response practice',
      'AP Statistics exam synthesis'
    ]
  }
];

let idCounter = 13;
const appendedNodes = [];
const appendedEdges = [];
const anchors = {};

for (const course of courseDefs) {
  const startId = `math-${String(idCounter).padStart(3, '0')}`;
  let prevId = null;

  for (const topic of course.topics) {
    const nodeId = `math-${String(idCounter).padStart(3, '0')}`;
    appendedNodes.push({
      id: nodeId,
      name: topic,
      description: `Develop fluency with ${topic.toLowerCase()} through procedural practice, modeling, and explanation.`,
      level: course.level,
      color: course.color,
      resources: course.resources,
      crossLinks: []
    });

    if (prevId) {
      appendedEdges.push({ from: prevId, to: nodeId });
    }

    prevId = nodeId;
    idCounter += 1;
  }

  const endId = prevId;
  anchors[course.level] = { startId, endId };
}

appendedEdges.push({ from: 'math-006', to: anchors['Algebra I'].startId });
appendedEdges.push({ from: anchors['Algebra I'].endId, to: anchors['Geometry'].startId });
appendedEdges.push({ from: anchors['Geometry'].endId, to: anchors['Algebra II'].startId });
appendedEdges.push({ from: anchors['Algebra II'].endId, to: anchors['Precalculus'].startId });
appendedEdges.push({ from: anchors['Precalculus'].endId, to: anchors['AP Calculus AB'].startId });
appendedEdges.push({ from: 'math-009', to: anchors['AP Statistics'].startId });
appendedEdges.push({ from: anchors['Algebra II'].startId, to: anchors['AP Statistics'].startId });

appendedEdges.push({ from: 'math-008', to: 'math-123' });
appendedEdges.push({ from: 'math-085', to: 'math-131' });
appendedEdges.push({ from: 'math-097', to: 'math-146' });
appendedEdges.push({ from: 'math-112', to: 'math-173' });
appendedEdges.push({ from: 'math-135', to: 'math-181' });
appendedEdges.push({ from: 'math-171', to: 'math-205' });
appendedEdges.push({ from: 'math-188', to: 'math-214' });

math.nodes = [...baseNodes, ...appendedNodes];
math.edges = [...baseEdges, ...appendedEdges];
math.legend = {
  Bridge: '#E5E7EB',
  '9th Grade': '#BFDBFE',
  '10th Grade': '#93C5FD',
  '11th Grade': '#60A5FA',
  '12th Grade': '#2563EB',
  'AP Level': '#4C1D95',
  'Algebra I': '#93C5FD',
  Geometry: '#67E8F9',
  'Algebra II': '#60A5FA',
  Precalculus: '#818CF8',
  'AP Calculus AB': '#7C3AED',
  'AP Statistics': '#059669'
};

if (math.nodes.length !== 220) {
  throw new Error(`Expected 220 math nodes, got ${math.nodes.length}`);
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Updated mathematics subject to ${math.nodes.length} nodes and ${math.edges.length} edges.`);
