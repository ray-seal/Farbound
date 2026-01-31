// -----------------------------
// 1️⃣ Journey Presets
// -----------------------------
const JOURNEYS = {
  "lands-end": {
    name: "Land's End to John O'Groats",
    distance: 1407,
    milestones: [
      { name: "Land's End", km: 0 },
      { name: "Bodmin Moor", km: 50 },
      { name: "Exeter", km: 150 },
      { name: "Bristol", km: 280 },
      { name: "Birmingham", km: 450 },
      { name: "Manchester", km: 600 },
      { name: "Lake District", km: 750 },
      { name: "Carlisle", km: 850 },
      { name: "Glasgow", km: 1000 },
      { name: "Fort William", km: 1150 },
      { name: "Inverness", km: 1280 },
      { name: "John O'Groats", km: 1407 }
    ]
  },
  "three-peaks": {
    name: "Three Peaks Challenge",
    distance: 737,
    milestones: [
      { name: "Fort William Start", km: 0 },
      { name: "Ben Nevis Summit", km: 10 },
      { name: "Glasgow", km: 150 },
      { name: "Lake District", km: 400 },
      { name: "Scafell Pike Summit", km: 420 },
      { name: "Manchester", km: 520 },
      { name: "Snowdonia", km: 690 },
      { name: "Snowdon Summit", km: 737 }
    ]
  },
  "hobbiton": {
    name: "Hobbiton to Mount Doom",
    distance: 1779,
    milestones: [
      { name: "Hobbiton", km: 0 },
      { name: "Green Dragon Inn", km: 5 },
      { name: "Bree", km: 200 },
      { name: "Weathertop", km: 350 },
      { name: "Rivendell", km: 500 },
      { name: "Moria", km: 700 },
      { name: "Lothlórien", km: 850 },
      { name: "Amon Hen", km: 1000 },
      { name: "Rohan", km: 1200 },
      { name: "Helm's Deep", km: 1350 },
      { name: "Isengard", km: 1450 },
      { name: "Minas Tirith", km: 1600 },
      { name: "Mordor Border", km: 1700 },
      { name: "Mount Doom", km: 1779 }
    ]
  }
};

// -----------------------------
// 2️⃣ Location Name Generator
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
// 3️⃣ Milestone Generator
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
// 4️⃣ Persistence Helpers
// -----------------------------
function saveWorld(world) {
  localStorage.setItem("farboundWorld", JSON.stringify(world));
}

function loadWorld() {
  const saved = localStorage.getItem("farboundWorld");
  if (saved) return JSON.parse(saved);
  return null;
}

function saveJourneyType(type) {
  localStorage.setItem("farboundJourneyType", type);
}

function loadJourneyType() {
  return localStorage.getItem("farboundJourneyType");
}

// -----------------------------
// 5️⃣ Render Milestones
// -----------------------------
function renderWorld() {
  const output = document.getElementById("output");
  output.innerHTML = world
    .map(m => m.reached ? `✅ ${m.name} – ${m.km} km` : `⬜ ${m.name} – ${m.km} km`)
    .join("<br>");
}

// -----------------------------
// 6️⃣ Manual Step Conversion
// -----------------------------
const STRIDE_LENGTH = 0.8; // meters
function stepsToKm(steps, strideLength = STRIDE_LENGTH) {
  return steps * strideLength / 1000;
}

// -----------------------------
// 7️⃣ Pedometer/Step Counter Integration
// -----------------------------
let pedometer = null;
let lastStepCount = 0;
let pedometerSupported = false;

async function initPedometer() {
  const statusEl = document.getElementById("pedometerStatus");
  
  // Check for Pedometer API (Android/some devices)
  if ('Pedometer' in window) {
    try {
      pedometer = new Pedometer();
      await pedometer.start();
      pedometerSupported = true;
      statusEl.textContent = "✅ Step tracking active";
      statusEl.style.color = "#2ecc71";
      
      // Poll for step updates
      setInterval(async () => {
        const steps = await pedometer.getSteps();
        updateStepsFromDevice(steps);
      }, 5000); // Check every 5 seconds
      
      return;
    } catch (err) {
      console.warn("Pedometer API failed:", err);
    }
  }
  
  // Check for Step Counter sensor (newer Android)
  if ('StepCounter' in window) {
    try {
      const sensor = new StepCounter({ frequency: 1 });
      sensor.addEventListener('reading', () => {
        updateStepsFromDevice(sensor.steps);
      });
      await sensor.start();
      pedometerSupported = true;
      statusEl.textContent = "✅ Step tracking active";
      statusEl.style.color = "#2ecc71";
      return;
    } catch (err) {
      console.warn("StepCounter API failed:", err);
    }
  }
  
  // Check for Web Activity API (limited support)
  if ('ActivityRecognition' in window) {
    try {
      const result = await navigator.permissions.query({ name: 'activity-recognition' });
      if (result.state === 'granted') {
        // Attempt to use Activity Recognition
        pedometerSupported = true;
        statusEl.textContent = "⚠️ Limited step tracking";
        statusEl.style.color = "#f39c12";
        return;
      }
    } catch (err) {
      console.warn("Activity Recognition failed:", err);
    }
  }
  
  // Fallback: no pedometer support
  statusEl.textContent = "⚠️ Automatic step tracking not available. Use manual entry.";
  statusEl.style.color = "#e74c3c";
  document.getElementById("manualEntry").classList.remove("hidden");
}

function updateStepsFromDevice(currentSteps) {
  // First time or reset detection
  if (lastStepCount === 0) {
    lastStepCount = currentSteps;
    return;
  }
  
  const newSteps = currentSteps - lastStepCount;
  if (newSteps > 0 && newSteps < 10000) { // Sanity check
    lastStepCount = currentSteps;
    
    const distance = stepsToKm(newSteps);
    totalDistance += distance;
    
    // Update step count display
    document.getElementById("stepCount").textContent = currentSteps.toLocaleString();
    
    // Check milestones
    for (let m of world) {
      if (!m.reached && totalDistance >= m.km) {
        m.reached = true;
        showArrival(m);
      }
    }
    
    // Update display
    renderWorld();
    renderMap();
    totalDistanceEl.textContent = totalDistance.toFixed(2);
    
    // Save progress
    saveWorld(world);
    localStorage.setItem("farboundTotalDistance", totalDistance);
  }
}

// -----------------------------
// 8️⃣ Initialize World
// -----------------------------
let world = null;
let totalDistance = 0;
let currentJourneyType = loadJourneyType();

// Check if we have an existing journey
if (currentJourneyType) {
  // Load existing journey
  document.getElementById("journeySelection").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");
  
  world = loadWorld();
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
  
  // Set journey title
  if (JOURNEYS[currentJourneyType]) {
    document.getElementById("journeyTitle").textContent = JOURNEYS[currentJourneyType].name;
  } else {
    document.getElementById("journeyTitle").textContent = "Custom Journey";
  }
  
  // Initial render
  renderWorld();
  const totalDistanceEl = document.getElementById("totalDistance");
  totalDistanceEl.textContent = totalDistance.toFixed(2);
  renderMap();
  
  // Initialize pedometer
  initPedometer();
} else {
  // Show journey selection
  document.getElementById("journeySelection").classList.remove("hidden");
  document.getElementById("mainApp").classList.add("hidden");
}

// -----------------------------
// 9️⃣ Journey Selection
// -----------------------------
document.querySelectorAll(".journey-card").forEach(card => {
  card.addEventListener("click", (e) => {
    const journeyType = card.dataset.journey;
    
    if (journeyType === "custom") {
      const customDist = parseInt(document.getElementById("customDistance").value);
      if (!customDist || customDist < 10 || customDist > 10000) {
        alert("Please enter a valid distance between 10 and 10000 km");
        return;
      }
      
      world = generateMilestones(customDist, Math.min(Math.floor(customDist / 100) + 2, 15));
      document.getElementById("journeyTitle").textContent = `Custom Journey (${customDist} km)`;
      saveJourneyType("custom");
    } else {
      const journey = JOURNEYS[journeyType];
      world = JSON.parse(JSON.stringify(journey.milestones)); // Deep copy
      document.getElementById("journeyTitle").textContent = journey.name;
      saveJourneyType(journeyType);
    }
    
    totalDistance = 0;
    saveWorld(world);
    localStorage.setItem("farboundTotalDistance", "0");
    
    // Switch to main app
    document.getElementById("journeySelection").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");
    
    renderWorld();
    const totalDistanceEl = document.getElementById("totalDistance");
    totalDistanceEl.textContent = "0.00";
    renderMap();
    
    // Initialize pedometer
    initPedometer();
  });
});

// -----------------------------
// 🔟 Helper Functions
// -----------------------------
function renderMap() {
  const progressEl = document.getElementById("progress");
  const milestonesEl = document.getElementById("milestones");

  const percent = Math.min(
    (totalDistance / world[world.length - 1].km) * 100,
    100
  );
  progressEl.style.width = percent + "%";

  milestonesEl.innerHTML = "";
  world.forEach(m => {
    const dot = document.createElement("div");
    dot.className = "milestone-dot" + (m.reached ? " reached" : "");
    dot.title = `${m.name} - ${m.km} km`;
    milestonesEl.appendChild(dot);
  });
}

function getArrivalText(name) {
  const lines = [
    `You have arrived at ${name}. The road rests here.`,
    `${name} rises quietly as you step in.`,
    `The journey brings you to ${name}, a place of calm.`,
    `You reach ${name}, where the world seems to pause.`,
    `${name} welcomes you, a haven on your path.`
  ];

  return lines[Math.floor(Math.random() * lines.length)];
}

function showArrival(milestone) {
  document.getElementById("arrivalTitle").textContent = milestone.name;
  document.getElementById("arrivalText").textContent = getArrivalText(milestone.name);
  document.getElementById("arrivalOverlay").classList.remove("hidden");
}

// -----------------------------
// 1️⃣1️⃣ Manual Step Input (Fallback)
// -----------------------------
const manualEntryToggle = document.getElementById("manualEntryToggle");
const manualEntryDiv = document.getElementById("manualEntry");

manualEntryToggle?.addEventListener("click", () => {
  manualEntryDiv.classList.toggle("hidden");
  manualEntryToggle.textContent = manualEntryDiv.classList.contains("hidden") 
    ? "Manual Entry" 
    : "Hide Manual Entry";
});

const stepsInput = document.getElementById("stepsInput");
const addStepsBtn = document.getElementById("addStepsBtn");

// Close arrival overlay
document.getElementById("closeArrival").addEventListener("click", () => {
  document.getElementById("arrivalOverlay").classList.add("hidden");
});

addStepsBtn?.addEventListener("click", () => {
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
      showArrival(m);
    }
  }

  // update display
  renderWorld();
  renderMap();
  const totalDistanceEl = document.getElementById("totalDistance");
  totalDistanceEl.textContent = totalDistance.toFixed(2);

  // save progress
  saveWorld(world);
  localStorage.setItem("farboundTotalDistance", totalDistance);

  // clear input
  stepsInput.value = "";
});

// Reset journey button
document.getElementById("resetJourney")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your journey? All progress will be lost.")) {
    localStorage.removeItem("farboundWorld");
    localStorage.removeItem("farboundTotalDistance");
    localStorage.removeItem("farboundJourneyType");
    location.reload();
  }
});