# Insight browser extension for desktop

Insight supercharges search with results from expert and community trusted sources for any field.

## Installation

Add [lumos-shared-js](https://github.com/lumosbrowser/lumos-shared-js) to the `npm` global `link` namespace:

- `~ git clone https://github.com/lumosbrowser/lumos-shared-js.git` *Ask [Abhinav](https://github.com/abhinavsharma) for permission.*
- `~ cd lumos-shared-js`
- `$ npm link` *Note: it might not need `sudo`, it depends on the current platform.*

Install and link dependencies:

- `~ cd lumos-extension`
- `~ npm install`
- `~ npm link lumos-shared-js`

Alternatively, `make setup` is available executing the same commands as above. However, this will install `json-bump` as a global dependency to have `make ship` working properly.

## Structure

- `dist` - The distribution folder, both development and production build outputs into this folder.
- `public` - This folder's content is avalable in the extension calling `chrome.runtime.getUrl(path)`.
*Note: to access a public file, it must be listed under `manifest.json -> web_accessible_resources`*
- `releases` - Output of `make ship`, these are zipped production ready packages.
- `src` - The actual source code of the extension. See sub-directory `README.md`-s for more details.
- `webpack` - The build configuration and custom HMR plugin.

## Development

*Note: The application is using a custom fork of [webpack-chrome-extension-reloader](https://www.npmjs.com/package/webpack-chrome-extension-reloader)
to make it compatible with [Webpack 5](https://webpack.js.org/concepts/). This module provides HMR functionality for rapid development.*

- `make dev` - Initially this will build the source code and run the HMR server. Once, it's loaded, the `dist` folder can be loaded into the browser and
the extension will auto-reload on every code change.

### Integration

After the first time build, the extension must be loaded in the browser. This method differs between the browsers we currently support.

Chrome: [Extensions - Getting Started](https://developer.chrome.com/docs/extensions/mv2/getstarted/)

Firefox: [WebExtensions - Installing](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
*Note: this is not providing full support and has drawbacks such `Storage API` is unavailable. More robust solution WIP.*

Edge: [Sideload an extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading#:~:text=Open%20the%20edge%3A%2F%2Fextensions,browser%2C%20and%20then%20selecting%20Extensions.&text=On%20the%20extension%20management%20page,bottom%20left%20of%20the%20page.&text=When%20installing%20your%20extension%20for%20the%20first%20time%2C%20choose%20Load%20Unpacked.)

## Architecture

See: [ARCHITECTURE.md](https://github.com/lumosbrowser/lumos-extension/blob/master/ARCHITECTURE.md)

## Deployment

- `make ship` - This command will create a new production build and a **release package** in the `releases` folder. After the process,
the new package can be distibuted among extension stores.
