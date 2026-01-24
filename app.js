// -----------------------------
// 1️⃣ Location Name Generator
// -----------------------------
function generateLocationName(index, total) {
  if (index === total - 1) {
    return "Farbound Expanse";
  }

  const descriptors = [
    "Stonewake", "Quiet", "Sunfall", "Lowlight",
    "Ashen", "Still", "Bright", "Hollow",
    "Windmere", "Farrow"
  ];

  const features = [
    "Crossing", "Vale", "Ridge", "Reach",
    "Path", "Gate", "Hollow", "Fields"
  ];

  const d = descriptors[Math.floor(Math.random() * descriptors.length)];
  const f = features[Math.floor(Math.random() * features.length)];

  return `${d} ${f}`;
}

// -----------------------------
// 2️⃣ Milestone Generator
// -----------------------------
function generateMilestones(totalDistanceKm, milestoneCount) {
  if (milestoneCount < 2) {
    throw new Error("Need at least 2 milestones");
  }

  const milestones = [
    { name: "Windmere Plains", km: 0 },
    { name: "First Steps", km: 5 }
  ];

  const remainingDistance = totalDistanceKm - 5;
  const remainingMilestones = milestoneCount - 2;

  // Progressive weighting for later milestones
  const weights = [];
  let weightSum = 0;
  for (let i = 1; i <= remainingMilestones; i++) {
    const weight = i * i;
    weights.push(weight);
    weightSum += weight;
  }

  let accumulatedKm = 5;
  for (let i = 0; i < remainingMilestones; i++) {
    const portion = (weights[i] / weightSum) * remainingDistance;
    accumulatedKm += portion;

    milestones.push({
      name: generateLocationName(i, remainingMilestones),
      km: Math.round(accumulatedKm)
    });
  }

  // Ensure final milestone hits total distance exactly
  milestones[milestones.length - 1].km = totalDistanceKm;

  return milestones;
}

// -----------------------------
// 3️⃣ Persistence Helpers
// -----------------------------
function saveWorld(world) {
  localStorage.setItem("farboundWorld", JSON.stringify(world));
}

function loadWorld() {
  const saved = localStorage.getItem("farboundWorld");
  if (saved) return JSON.parse(saved);
  return null;
}

// -----------------------------
// 4️⃣ Render Milestones
// -----------------------------
function renderWorld() {
  const output = document.getElementById("output");
  output.innerHTML = world
    .map(m => m.reached ? `✅ ${m.name} – ${m.km} km` : `⬜ ${m.name} – ${m.km} km`)
    .join("<br>");
}

// -----------------------------
// 5️⃣ Manual Step Conversion
// -----------------------------
const STRIDE_LENGTH = 0.8; // meters
function stepsToKm(steps, strideLength = STRIDE_LENGTH) {
  return steps * strideLength / 1000;
}

// -----------------------------
// 6️⃣ Initialize World
// -----------------------------
let world = loadWorld();
if (!world) {
  world = generateMilestones(120, 10);
  saveWorld(world);
}

let totalDistance = 0;
const savedDistance = localStorage.getItem("farboundTotalDistance");
if (savedDistance) {
  totalDistance = parseFloat(savedDistance);

  // mark milestones reached
  for (let m of world) {
    if (totalDistance >= m.km) {
      m.reached = true;
    }
  }
}

// Initial render
renderWorld();
const totalDistanceEl = document.getElementById("totalDistance");
totalDistanceEl.textContent = totalDistance.toFixed(2);

// -----------------------------
// 7️⃣ Manual Step Input
// -----------------------------
const stepsInput = document.getElementById("stepsInput");
const addStepsBtn = document.getElementById("addStepsBtn");

addStepsBtn.addEventListener("click", () => {
  const steps = parseInt(stepsInput.value);
  if (isNaN(steps) || steps <= 0) {
    alert("Enter a valid number of steps");
    return;
  }

  const distance = stepsToKm(steps);
  totalDistance += distance;

  // mark milestones reached
  for (let m of world) {
    if (!m.reached && totalDistance >= m.km) {
      m.reached = true;
    }
  }

  // update display
  renderWorld();
  totalDistanceEl.textContent = totalDistance.toFixed(2);

  // save progress
  saveWorld(world);
  localStorage.setItem("farboundTotalDistance", totalDistance);

  // clear input
  stepsInput.value = "";
  stepsInput.value = "";
});
