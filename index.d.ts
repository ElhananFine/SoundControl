const os = require("os");
const { promisify } = require("util");

class Darwin {
  private osascript: any;

  constructor() {
    this.osascript = require("node-osascript");
  }

  async setVolume(volume: number): Promise<number> {
    const executeAsync = promisify(this.osascript.execute);
    await executeAsync(`set volume output volume ${volume}`);
    return volume;
  }

  async getVolume(): Promise<number> {
    const executeAsync = promisify(this.osascript.execute);
    const vol = await executeAsync("output volume of (get volume settings)");
    return vol;
  }
}

class Linux {
  private exec: any; 

  constructor() {
    this.exec = require("child_process").exec;
  }

  async setVolume(volume: number): Promise<number> {
    const { stdout } = await promisify(this.exec)(`amixer sset 'Master' ${volume}%`);
    return volume;
  }

  async getVolume(): Promise<number> {
    const { stdout } = await promisify(this.exec)(`amixer get 'Master' | grep -oE "[0-9]+%"`);
    return parseInt(stdout.trim(), 10);
  }
}

class Windows {
  private exec: any;
  
  constructor() {
    this.exec = require("child_process").exec;
  }

  async setVolume(volume: number): Promise<number> {
    await promisify(this.exec)(`nircmd.exe setsysvolume ${volume}`);
    return volume;
  }

  async getVolume(): Promise<number> {
    const volume = await promisify(this.exec)("nircmd.exe changesysvolume -1");
    return parseInt(volume, 10);
  }
}

const systemType = os.type();

let operatingSystem: Darwin | Linux | Windows;

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
