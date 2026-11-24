// Re-run after `npx cap add android`. Locks the game to portrait (idempotent).
const fs = require("fs");
const p = "android/app/src/main/AndroidManifest.xml";
let x = fs.readFileSync(p, "utf8");
if (!x.includes("android:screenOrientation")) {
  x = x.replace("<activity", '<activity\n            android:screenOrientation="portrait"');
  fs.writeFileSync(p, x);
  console.log("Portrait lock added.");
} else console.log("Portrait lock already present.");
