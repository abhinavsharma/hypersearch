# Tasks

### Preword

The application is using [Webpack](https://webpack.js.org/concepts/) to build the source code. In this directory, there are build configurations and scripts providing the development and production processes.

There are two similar projects in this repository, which sources are identical, though `manifest.json` and icons are different.

#### Important
Code changes shouldn't differ between the two projects. If so, development flags must be used with the proper annotation to emphasise the difference.

### Scripts

To support both with the same workflow, we provide custom build tasks.

- `make dev` - Prompts for which project you want to work on.

- `ship-is` - Build the production version of **Insight** extension, then create a release and push to GitHub.

- `ship-sc` - Same as for **Insight**, but this creates a **SearchClub** release

Development configuration creates source-maps and loads the extension. Hot Module Replacement done by a custom background script which is only run when extension is installed via development mode. In production, we omit this functionality.

Production configuration omits source-maps and HMR server from the build. Also, this will run with `production` flag to minify and optimize the source code.