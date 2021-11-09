## Usage examples

- In a Azure DevOps Pipeline

   ```yml
    - task: android-app-size-diff@1
      inputs:
        baseAppPath: test/assets/test.apk
        targetAppPath: test/assets/test.apk
        summaryOutputPath: summary.md
      displayName: Run APK size comparision
   ```

## Inputs

- `baseAppPath`: Path to base apk. This is the app before changes
  - required: true
  - default: 'base.apk'
- `baseAppLabel`: Label to use for the base app in the report
  - required: false
  - default: 'Base APK'
- `targetAppPath`: Path to target apk. This is the app after changes
  - required: true
  - default: 'target.apk'
- `targetAppLabel`: Label to use for the base app in the report
  - required: false
  - default: 'Target APK'
- `summaryOutputPath`: Output file where comparision summary should be written to
  - required: true
  - default: 'summary.md'
- `metrics`: A comma seperated list of size metrics to include in the summary. Possible values are `apkSize`, `installSize`, `dexFiles`, `arscFile`, `nativeLibs`
  - required: false
  - default: 'apkSize, installSize, dexFiles, arscFile, nativeLibs'
- `thresholds`: A comma seperated list of thresholds for each of the metrics in bytes. If this is empty, no thresholding will apply. When this is not empty, the task will fail when any of the given thresholds are crossed
  - required: false
  - default: ''
- `telemetryEnabled`: Set to `false` to disable telemetry
  - required: false
  - default: 'true'
