# Introduction

This repository contains an [Azure DevOps Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/tasks?view=azure-devops&tabs=yaml) and a [GitHub Workflow Action](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps). See below usage examples to start using this in your CI. 

This is currently in very early stages so, features offered are very limited. See [contributing section](#contributing) below if you would like to chip in some features. At this stage, this repo is more of a skeleton upon which we hope to add more functionality. Once this is in a good state, we can be on top of our app size changes and very likely make this repo public.

## Usage examples

- In a Azure DevOps Pipeline

   ```yml
    - task: android-app-size-diff-task@0
      inputs:
        baseAppPath: test/assets/test.apk
        targetAppPath: test/assets/test.apk
        summaryOutputPath: summary.md
      displayName: Run APK size comparision
   ```
   
- In a GitHub Workflow (only after this repo becomes public)

   ```yml
     - uses: microsoft/android-app-size-ci@v1
       name: Run APK size comparision
       with:
        baseAppPath: test/assets/test.apk
        targetAppPath: test/assets/test.apk
        summaryOutputPath: summary.md
   ```


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

When contributing, please be aware that **this repo will go public eventually**

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

