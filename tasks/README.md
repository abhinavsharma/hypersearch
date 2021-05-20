# Tasks

### Preword

The application is using [Webpack](https://webpack.js.org/concepts/) to build the source code. In this directory, there are build configurations and scripts providing the development and production processes.

### Scripts

- `make dev` - Prompts for which project you want to work on.

- `make ship` - Build the production version of **Insight** extension, then create a release and push to GitHub.

Development configuration creates source-maps and loads the extension. Hot Module Replacement done by a custom background script which is only run when extension is installed via development mode. In production, we omit this functionality.

Production configuration omits source-maps and HMR server from the build. Also, this will run with `production` flag to minify and optimize the source code.