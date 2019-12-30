import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', function () {
    let taskJsonPath = path.join(__dirname, '../../src/', 'task.json');

    before(() => {

    });

    after(() => {

    });

    it('should succeed with simple inputs', function(done: MochaDone) {
        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, taskJsonPath);

        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('apkSize') >= 0, true, "should contain size info");
        done();
    });
    
});

