const exec = op.inTrigger("Exec"),
inArray1 = op.inArray("Letter Pos", null, 3),
outArray = op.outArray("Array out", null, 3),
inMaxLifetime = op.inValue("Lifetime", 10.0),
inRandomize = op.inBool("Randomize", false),
distanceArr = [];

var particles = [];
var speeds = [];

outArray.set(particles);

let showingError = false;

exec.onTriggered = update;

function update() {
let letterPos = inArray1.get();
distanceArr.length = 0;

if (!letterPos) {
    outArray.set(null);
    return;
}

if (distanceArr.length != letterPos.length) {
    distanceArr.length = letterPos.length;
}

let divisibleBy3 = distanceArr.length % 3 === 0;
distanceArr.length = Math.floor(letterPos.length / 3);

if (divisibleBy3 === false) {
    op.setUiError("arraytriple", "Arrays length not divisible by 3 !");
} else {
    op.setUiError("arraytriple", null);
}

if (particles.length != distanceArr.length) {
    particles.length = distanceArr.length;
    speeds.length = particles.length;

    for (var i = 0; i < particles.length; i++) {
        particles[i] = 1.1;
    }
}

if (inRandomize.get()) {
    for (let i = 0; i < distanceArr.length; i++) {
        particles[i] = -0.1;
        speeds[i] = Math.random() / 10 + 0.1;
        letterPos[i * 3 + 0] = Math.random() * 2 - 1;
        letterPos[i * 3 + 1] = Math.random() * 2 - 1;
        letterPos[i * 3 + 2] = Math.random() * 2 - 1;
    }
}

for (let i = 0; i < distanceArr.length; i++) {
    distanceArr[i] = 0.0;

    if (!inRandomize.get() && particles[i] == 0.0) {
        particles[i] = -0.1;
        speeds[i] = Math.random() / 10 + 0.1;
    }

    if (particles[i] < 0.0) {
        particles[i] -= speeds[i];
    }

    if (particles[i] < -inMaxLifetime.get() || particles[i] > 0.0) {
        particles[i] = 0.0;
    }
}

outArray.set(null);
outArray.set(particles);
}
