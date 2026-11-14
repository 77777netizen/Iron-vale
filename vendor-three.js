// Downloads three.js r128 into www/ so the game works offline, and points index.html at it.
const fs = require("fs"), https = require("https"), path = require("path");
const url = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
const out = path.join(__dirname, "..", "www", "three.min.js");
https.get(url, (r) => {
  if (r.statusCode !== 200) { console.error("HTTP " + r.statusCode); process.exit(1); }
  r.pipe(fs.createWriteStream(out)).on("finish", () => {
    const p = path.join(__dirname, "..", "www", "index.html");
    let h = fs.readFileSync(p, "utf8").replace(url, "three.min.js");
    fs.writeFileSync(p, h); console.log("saved", out, "and updated index.html");
  });
});
