# ui

## Develop using VS Code Development Environment

### Pre-requisites

1. Docker desktop
2. Visual Studio Code
3. Visual Studio Code Dev Containers extension

### Create environment

1. Open a new instance of Visual Studio Code
2. Click on the Dev Container section (bottom left corner of the VS Code window)
3. Select the option `Clone Repository in container volume...`
4. Select this project to be cloned

Docker will use the file `.devcontainer/devcontainer.json` to setup the development environment.

### Ionic

`npx storybook@latest init`
`npm install -g @ionic/cli@7.1.1`
