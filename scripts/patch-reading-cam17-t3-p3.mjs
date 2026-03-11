import { readFileSync, writeFileSync } from "fs";
import { p3 } from "./cam17-test3-content.mjs";
const path = new URL("../lib/reading-data.ts", import.meta.url);
let s = readFileSync(path, "utf8");
const marker = 'title: "Building the Skyline: The Birth and Growth of Manhattan\'s Skyscrapers",\n        content:\n          ';
const idx = s.indexOf(marker);
if (idx < 0)
    throw new Error("marker not found");
const start = idx + marker.length;
const end = s.indexOf('",\n        questionsText: "",\n      }\n    ],\n  "cambridge-17|test-4"', start);
if (end < 0)
    throw new Error("end not found");
s = s.slice(0, start) + JSON.stringify(p3) + s.slice(end);
writeFileSync(path, s);
