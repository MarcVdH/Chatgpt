const exec = op.inTrigger("Exec"),
  inArray1 = op.inArray("Letter Pos", null, 3),
  outArray = op.outArray("Array out", null, 3),
  inMaxLifetime = op.inValue("Lifetime", 10.0),
  inRandomize = op.inBool("Randomize", false),
  inMaxDistance = op.inValue("Max Distance", 1.0),
  distanceArr = [];

var particles = [];
var speeds = [];

outArray.set(particles);

let showingError = false;

// Define centerX, centerY, and scale
const centerX = 0.5;
const centerY = 0.5;
const scale = 0.5;


exec.onTriggered = update;

function update() {
  let letterPos = inArray1.get();
  let numParticles = Math.floor(letterPos.length / 3);
  numParticles -= numParticles % 3; // Round down to nearest multiple of 3
  distanceArr.length = numParticles / 3;
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
    let dx = letterPos[i * 3 + 0] - centerX;
    let dy = letterPos[i * 3 + 1] - centerY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    distanceArr[i] = 0.0;

    if (!inRandomize.get() && particles[i] == 0.0) {
      particles[i] = -0.1;
      speeds[i] = Math.random() / 10 + 0.1;
    }

    let distance = Math.sqrt(Math.pow(letterPos[i * 3 + 0] - centerX, 2) + Math.pow(letterPos[i * 3 + 1] - centerY, 2) + Math.pow(letterPos[i * 3 + 2], 2));
    if (distance <= inMaxDistance.get()) {
          if (inMaxDistance.get() < 0.0) {
                if (particles[i] > -10) {
          particles[i] = Math.max(particles[i] - Math.abs(inMaxDistance.get()) / inMaxLifetime.get(), -10);
        }
            for (let i = 0; i < distanceArr.length; i++) {
    let dx = letterPos[i * 3 + 0] - centerX;
    let dy = letterPos[i * 3 + 1] - centerY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    distanceArr[i] = 0.0;

    if (!inRandomize.get() && particles[i] == 0.0) {
      particles[i] = -0.1;
      speeds[i] = Math.random() / 10 + 0.1;
    }
}
      } else if (particles[i] < 0.0) {
        particles[i] -= speeds[i];
      }

      if (particles[i] < -inMaxLifetime.get() || particles[i] > 0.0) {
        particles[i] = 0.0;
      }
    } else if (inMaxDistance.get() < 0.0) {
      particles[i] = 1.1;
    }

    if (dist < scale) {
      // Move particle towards square
      let factor = (scale - dist) / scale;
      letterPos[i * 3 + 0] += dx * factor * 0.1;
      letterPos[i * 3 + 1] += dy * factor * 0.1;
    } else {
      // Move particle towards origin
      letterPos[i * 3 + 0] -= letterPos[i * 3 + 0] * 0.05;
      letterPos[i * 3 + 1] -= letterPos[i * 3 + 1] * 0.05;
    }
  }

  outArray.set(null);
  outArray.set(particles);
}
