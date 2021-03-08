# Source

This folder contains the actual source code of the extenison. It includes library functions (`lib`), utility functions (`utils`) and modules.

## Scripts

- `background.ts`  - Background handlers for the extension. This will run as a persistent script with event listeners and background functionality.
See [Manage events with background scripts](https://developer.chrome.com/docs/extensions/mv2/background_pages/) on the documentation for more information.

- `main.ts` - This script will be injected into the main page when the extension is enabled. This will take care of loading the sidebar and injecting the React application into the page.

- `block.ts` - Remove advertisments and add a dismissable overlay. Any content blocker logic should go here. This script will be injected to all frames.

- `frame.ts` - General logic injected to all frames.

## Modules

Modules are the backbone of the injected React application. These are separated by functionality and responsibility.

## Types

General type declarations live inside the `types` folder. Individual module declarations must be placed inside the same folder as its referenced module.

## Library functions

Single responsible function with complex logic. These function can be used anywhere providing the same functionality.

## Utilities

Commonly used helper function.