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

- `dist_{is|sc}` - The distribution folder for production build.
- `build_{is|sc}` - The development build folder for HMR server.
- `public` - This folder's content is avalable in the extension calling `chrome.runtime.getUrl(path)`.
*Note: to access a public file, it must be listed under `manifest.json -> web_accessible_resources`*
- `releases` - Output of `make ship-{is|sc}`, these are zipped production ready packages.
- `src` - The actual source code of the extension. See sub-directory `README.md`-s for more details.
- `tasks` - The build configuration, scripts and custom HMR plugin.

## Development

*Note: The application is using a custom fork of [webpack-chrome-extension-reloader](https://www.npmjs.com/package/webpack-chrome-extension-reloader)
to make it compatible with [Webpack 5](https://webpack.js.org/concepts/). This module provides HMR functionality for rapid development.*

- `make dev`  - Prompts for which project to build.

Initially this will build the source code for the selected project and run the HMR server. Once, it's loaded, the related build folder can be loaded into the browser and the extension will auto-reload on every code change.

See [Tasks Readme](https://github.com/lumosbrowser/lumos-extension/blob/master/tasks/README.md) for more details on the build process.

### Integration

After the first time build, the extension must be loaded in the browser. This method differs between the browsers we currently support.

Chrome: [Extensions - Getting Started](https://developer.chrome.com/docs/extensions/mv2/getstarted/)

Firefox: [WebExtensions - Installing](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
*Note: this is not providing full support and has drawbacks such `Storage API` is unavailable. More robust solution WIP.*

Edge: [Sideload an extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading#:~:text=Open%20the%20edge%3A%2F%2Fextensions,browser%2C%20and%20then%20selecting%20Extensions.&text=On%20the%20extension%20management%20page,bottom%20left%20of%20the%20page.&text=When%20installing%20your%20extension%20for%20the%20first%20time%2C%20choose%20Load%20Unpacked.)

Safari: [Building a Safari App Extension](https://developer.apple.com/documentation/safariservices/safari_app_extensions/building_a_safari_app_extension)
- Prepare Safari to run unsigned extensions:
  1. Open Safari and choose Safari > Preferences.
  2. Select the Advanced tab, then select the “Show Develop menu in menu bar” checkbox.
  3. Choose Develop > Allow Unsigned Extensions. The Allow Unsigned Extensions setting is reset when a user quits Safari; you must set it again the next time Safari is launched.
  4. Select the Extensions tab. This tab shows the localized description, display name, and version number for the selected Safari App Extension. It also provides a more nuanced message about the permissions claimed by the extension.
  5. Find your new extension in the list on the left, and enable it by selecting the checkbox.
  6. Close Safari Preferences.
- Using Xcode 12 or higher:
  1. open the project ./Insight Extension/Insight Extension.xcodeproj.
  2. Make sure that your macOS app is selected in the Scheme menu next to the Run and Stop buttons in Xcode’s main toolbar.
  3. Click the Run button, or choose Product > Run (Command-R) to build and run your app.

## Architecture

See: [ARCHITECTURE.md](https://github.com/lumosbrowser/lumos-extension/blob/master/ARCHITECTURE.md)

## Deployment

- `make ship-{is|sc}` - This command will create a new production build and a **release package** in the `releases` folder. After the process,
the new package can be distibuted among extension stores.
