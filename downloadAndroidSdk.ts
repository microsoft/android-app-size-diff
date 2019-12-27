import download from 'download'
import * as shell from "shelljs";

const platform = process.argv[2];
const platforms: any = {
    'Darwin' : {
        'sdk-tools-url': 'https://dl.google.com/android/repository/sdk-tools-darwin-4333796.zip',
        'build-tools-url': 'https://dl.google.com/android/repository/build-tools_r28-macosx.zip'
    },
    'Linux' : {
        'sdk-tools-url': 'https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip',
        'build-tools-url': 'https://dl.google.com/android/repository/build-tools_r28-linux.zip'
    },
    'Windows_NT' : {
        'sdk-tools-url': 'https://dl.google.com/android/repository/sdk-tools-windows-4333796.zip',
        'build-tools-url': 'https://dl.google.com/android/repository/build-tools_r28-windows.zip'
    }
}

if (process.argv.length != 3) {
    throw "Need exactly one argument!"
}

if (!['Darwin', 'Linux', 'Windows_NT'].includes(platform)) {
    console.error("Invalid platform `" + platform + "`. Can only select one of Darwin/Linux/Windows_NT" );
    throw "Invalid platform selection!"
}

async function downloadAndExtract() {
    const destPath = 'dist/src/bin/' + platform + '/'
    const sdkToolsUrl = platforms[platform]['sdk-tools-url']
    const buildToolsUrl = platforms[platform]['build-tools-url']

    console.log('Downloading Android sdk tools for ' + platform + '..');
    await download(sdkToolsUrl, destPath, {'extract': true});

    console.log('Downloading Android build tools for ' + platform + '..');
    await download(buildToolsUrl, destPath + 'build-tools', {'extract': true});

    console.log('Moving build tools to correct path..');
    shell.mv(destPath + 'build-tools/android-9', destPath + 'build-tools/28.0.0');

    console.log('Removing unnecessary files..');
    const toolsPath = destPath + 'tools/';
    shell.rm('-rf', toolsPath + 'proguard');
    shell.rm('-rf', toolsPath + 'support');
    shell.rm('-rf', toolsPath + 'lib/monitor*');
    shell.rm('-rf', toolsPath + 'lib/x86*');
}

downloadAndExtract();
