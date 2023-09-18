const os = require("os");

class Darwin {
  constructor() {
    this.osascript = require("node-osascript");
  }
  setVolume(volume) {
    // prettier-ignore
    return new Promise((res, rej) => this.osascript.execute(`set volume output volume ${volume}`, err => err ? rej() : res(volume)));
  }
  getVolume() {
    // prettier-ignore
    return new Promise((res, rej) => this.osascript.execute("output volume of (get volume settings)", (err, vol) => err ? rej(err) : res(vol)));
  }
}

class Linux {
  constructor() {
    this.exec = require("child_process").exec;
  }

  setVolume(volume) {
    // prettier-ignore
    return new Promise((res, rej) => this.exec(`amixer sset 'Master' ${volume}%`, err => err ? rej(err) : res(volume)));
  }
  getVolume() {
    // prettier-ignore
    return new Promise((res, rej) => this.exec(`amixer get 'Master' | grep -oE "[0-9]+%"`, (err, stdout) => err ? rej(err) : res(stdout.trim())))
  }
}

class Windows {
  constructor() {
    this.loudness = require("loudness");
  }

  setVolume(volume) {
    // prettier-ignore
    return new Promise((res, rej) => this.loudness.setVolume(volume, err => err ? rej(err) : res(volume)))
  }
  getVolume() {
    // prettier-ignore
    return new Promise((res, rej) => this.loudness.getVolume((err, volume) => err ? rej(err) : res(volume)));
  }
}

const systemType = os.type();

let operatingSystem;
switch (systemType) {
  case "Linux":
    operatingSystem = new Linux();
    break;
  case "Darwin":
    operatingSystem = new Darwin();
    break;
  case "Windows_NT":
    operatingSystem = new Windows();
    break;
  default:
    throw new Error(`Unsupported system type: ${systemType}`);
}

module.exports = { operatingSystem };
