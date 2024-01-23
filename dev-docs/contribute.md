# Contribute

## Develop using VS Code Development Environment

### Pre-requisites

1. Docker desktop
2. Visual Studio Code
3. Visual Studio Code Dev Containers extension

### Create dev environment environment

1. Open a new instance of Visual Studio Code
2. Click on the Dev Container section (bottom left corner of the VS Code window)
3. Select the option `Clone Repository in container volume...`
4. Select this project to be cloned

Docker will use the file `.devcontainer/devcontainer.json` to setup the development environment.

## Setup GitHub codespace to review a Pull Request

### Pre-requisites

1. Log into GitHub
2. Navigate to the PR
3. At the top of the PR, click on the branch associated to it
4. Open the branch using a GitHub codespace

   <img alt="Menu with option to open branch in codespace" width="400" src="https://github.com/praxis-isncsci/ui/assets/1294355/4c006033-e2db-45ff-91c2-cc89a7d7ae76" />

5. Wait for the codespace to be created
6. Open a terminal
7. Run `npm install` to install all dependencies

### Storybook

8. Run `npm run storybook` to start the storybook server
9. Open the storybook server in a browser

   <img alt="Storybook server running" width="900" src="https://github.com/praxis-isncsci/ui/assets/1294355/b6ac26cb-8510-499e-b073-02e5997a0370" />

### Development build

10. Run `npm run build` to build the project
11. Run `npm run start` to start the development server
12. Open the development server in a browser

    <img alt="Development server running" width="900" src="https://github.com/praxis-isncsci/ui/assets/1294355/58718b50-edd9-4998-ae16-cfdf4827cbca" />

### Ionic

`npx storybook@latest init`
`npm install -g @ionic/cli@7.1.1`
