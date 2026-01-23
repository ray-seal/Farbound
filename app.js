// Farbound Milestone Generator

function generateMilestones(totalDistanceKm, milestoneCount) {
    if (milestoneCount < 2) {
        throw new Error("Need at least 2 milestones");
    }

    if (totalDistanceKm <= 5) {
        throw new Error("Total distance must exceed 5km start point");
    }

    const milestones = [];

    // First milestone always fixed
    const START_DISTANCE = 5;
    milestones.push({
        name: "Windmere Plains",
        km: START_DISTANCE
    });

    const remainingDistance = totalDistanceKm - START_DISTANCE;
    const remainingMilestones = milestoneCount - 1;

    // Progressive weighting so later milestones travel farther
    const weights = [];
    let weightSum = 0;

    for (let i = 1; i <= remainingMilestones; i++) {
        const weight = i * i;
        weights.push(weight);
        weightSum += weight;
    }

    let accumulatedKm = START_DISTANCE;

    for (let i = 0; i < remainingMilestones; i++) {
        const portion = (weights[i] / weightSum) * remainingDistance;
        accumulatedKm += portion;

        milestones.push({
            name: generateLocationName(i, remainingMilestones),
            km: Math.round(accumulatedKm)
        });
    }

    // Ensure final milestone lands exactly on total distance
    milestones[milestones.length - 1].km = totalDistanceKm;

    return milestones;
}

function generateLocationName(index, total) {
    if (index === total - 1) {
        return "Farbound Expanse";
    }

    const descriptors = [
        "Stonewake",
        "Quiet",
        "Sunfall",
        "Lowlight",
        "Ashen",
        "Still",
        "Bright",
        "Hollow",
        "Windmere",
        "Farrow"
    ];

    const features = [
        "Crossing",
        "Vale",
        "Ridge",
        "Reach",
        "Path",
        "Gate",
        "Creek",
        "Fields"
    ];

    const d = descriptors[Math.floor(Math.random() * descriptors.length)];
    const f = features[Math.floor(Math.random() * features.length)];

    return `${d} ${f}`;
}

const world = generateMilestones(120, 10);

const output = document.getElementById("output");
output.textContent = world
    .map(m => `${m.name} - ${m.km}km`)
    .join("\n");