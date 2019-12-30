import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '../../src/', 'ado-index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('baseAppPath', 'test/assets/test.apk');
tmr.setInput('targetAppPath', 'test/assets/test.apk');
tmr.setInput('summaryOutputPath', 'dist/test/testReport.md');

tmr.run();
