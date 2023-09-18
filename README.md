# SoundControl
A simple Node.js library for controlling/getting system audio volume (compatible with Windows, Linux, macOS).

# installation:
```bash
npm i musicsound
```

# Setup and Usage:
The library exposes a class called `operatingSystem`. This class contains two functions: `setVolume`, which takes a volume level as a parameter, and `getVolume`, which returns the current volume level. Both functions return promises, either resolving with the specified volume level or rejecting with an error if applicable. The library is designed to work seamlessly across different operating systems.

Example: 
```js
const { operatingSystem } = require("musicsound");
operatingSystem.getVolume().then(vol => console.log(vol)).catch(err => console.log(err))
operatingSystem.setVolume(50).then(vol => console.log(vol)).catch(err => console.log(err))
```
