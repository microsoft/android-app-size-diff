import fs from 'fs'

const bumpMetric = process.argv[2];
const supportedBumps = ["major", "minor", "patch"]

const nodePackagJsonPath = 'package.json';
const adoExtensionJsonPath = 'ado-extension.json';
const adoTaskJsonPath = 'ado-task.json';

if (process.argv.length != 3) {
    throw "Need exactly one argument!"
}

if (!supportedBumps.includes(bumpMetric)) {
    console.error("Cannot bump `" + bumpMetric + "`. Can only bump one of " + supportedBumps.join("/"))
    throw "Invalid bump requested!"
}

var nodePackageJson = JSON.parse(fs.readFileSync(nodePackagJsonPath,'utf8'));
var adoExtensionJson = JSON.parse(fs.readFileSync(adoExtensionJsonPath,'utf8'));
var adoTaskJson = JSON.parse(fs.readFileSync(adoTaskJsonPath,'utf8'));

const versions = nodePackageJson['version'].split(".");
var major = Number(versions[0]);
var minor = Number(versions[1]);
var patch = Number(versions[2]);

if (bumpMetric == 'major') {
    major += 1;
    minor = 0;
    patch = 0;
} else if (bumpMetric == 'minor') {
    minor += 1;
    patch = 0;
} else {
    patch += 1;
}

const newVersion = major + "." + minor + "." + patch;

// Update each jsons
nodePackageJson['version'] = newVersion;
adoExtensionJson['version'] = newVersion;
adoTaskJson['version']['Major'] = major;
adoTaskJson['version']['Minor'] = minor;
adoTaskJson['version']['Patch'] = patch;

fs.writeFileSync(nodePackagJsonPath, JSON.stringify(nodePackageJson, null, 4));
fs.writeFileSync(adoExtensionJsonPath, JSON.stringify(adoExtensionJson, null, 4));
fs.writeFileSync(adoTaskJsonPath, JSON.stringify(adoTaskJson, null, 4));

console.log("New version is: " + newVersion);
