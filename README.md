# praxis-isncsci/ui

This project contains a collection of web components, icons, and styles that can be used to build interfaces to classify ISNCSCI exams.
A component in this library is a web application that serves as an example on how the components can be used to build a fully responsive app.
The requirements for this project come from [Figma](https://www.figma.com/file/82mMuohRV0zPWnZbZ5upup/isncsci-app?type=design&node-id=207-9677&mode=design&t=bsPp0V9VaKYOoAti-0).
This Figma file contains the design tokens used in the project
This project has GitHub actions that automatically publish the code to the following places:

- [Chromatic](https://www.chromatic.com/builds?appId=64f8d7c6e093108e99084a70) - Used for visual testing of the components. This service has a library of screen captures used to compare visual changes on every commit.
- [Storybook](https://64f8d7c6e093108e99084a70-lqlepbrspv.chromatic.com/?path=/docs/app-app--docs) - Has the library of components contained in this project. This instance of Storybook is built by Chromatic and shows the code on the main branch.
- [NPM package](https://www.npmjs.com/package/isncsci-ui) - The UI library is published to NPM so that developers can add it to their own projects.
- [Dev site](https://brave-meadow-05543dc10.4.azurestaticapps.net) - It gets updated on every commit to `main` as part of the continuous integration process. It is used for testing the sample web app built with the ui components in this repository.

## How to contribute

[Visit our dev docs for information on how to contribute to this project.](./dev-docs/README.md)
