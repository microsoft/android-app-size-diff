# Introduction

This repository contains an [Azure DevOps Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/tasks?view=azure-devops&tabs=yaml) and a [GitHub Workflow Action](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps). See below usage examples to start using this in your CI. 

These are the minimal checks we run on our own PRs for [SwiftKey](https://play.google.com/store/apps/details?id=com.touchtype.swiftkey), however we're happy to accept contributions. See [contributing section](#contributing) below if you would like to expand this action's features.

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
   
- In a GitHub Workflow

   ```yml
     - uses: microsoft/android-app-size-diff@v1
       name: Run APK size comparision
       with:
        baseAppPath: test/assets/test.apk
        targetAppPath: test/assets/test.apk
        summaryOutputPath: summary.md
   ```

## Usage API
The API to use the GitHub action or Azure DevOps task is similar

### Inputs

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

# Data Collection

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described in the repository. There are also some features in the software that may enable you and Microsoft to collect data from users of your applications. If you use these features, you must comply with applicable law, including providing appropriate notices to users of your applications together with a copy of Microsoft's privacy statement. Our privacy statement is located at https://go.microsoft.com/fwlink/?LinkID=824704. You can learn more about data collection and use in the help documentation and our privacy statement. Your use of the software operates as your consent to these practices.

To disable data collection when using this extension, set the `telemetryEnabled` input to `false`

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Setting up development

Starting by cloning the repository. If your changes are small, feel free to open a PR with changes and the CI will take care of testing that everything still works with your changes. For something more long term or local testing, read on.

### Installations
- Install all global dependencies
  ```shell
  npm install -g typescript
  npm install -g ts-node
  npm install -g mocha
  
  # Only if you are compiling the GitHub plugin
  npm install -g @zeit/ncc
  
  # Only if you are publishing to ADO. Not required for most scenarios
  npm install -g tfx-cli
  ```
- Install all project dependencies
  `npm install`   
  
### Running 

See `package.json` for full list of npm tasks. The below should be sufficient to get you started

- Build code `npm run build`
- Run ADO plugin locally `npm run adoTask`
  - See [ADO Custom Task docs](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#run-the-task) to understand what variables to set - basically all task inputs
- Run all tests `npm run test`
  - Likely a better way to test your changes
- Bundle all plugins `npm run bundle`

