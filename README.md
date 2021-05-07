# Insight browser extension for desktop

Insight supercharges search with results from expert and community trusted sources for any field.

## Installation

Install dependencies:

- `~ cd lumos-extension`
- `~ npm install`

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

- `make dev`  - Prompts for which project to build.

Initially this will build the source code for the selected project and run the HMR server. Once, it's loaded, the related build folder can be loaded into the browser and the extension will auto-reload on every code change.

See [Tasks Readme](https://github.com/lumosbrowser/lumos-extension/blob/master/tasks/README.md) for more details on the build process.

#### Console Debugging

By default, we are using the JavaScript console to show debug messages, helping the development process to be trackable. It's strongly recommended to print every important message, regardless of it's nature. **Silent failures are forbidden** and would lead to unexpected behavior. A slight tradeoff of this practice, is that the console sometimes could get too verbose. To hide unwanted messages, (like known failures from `extractUrlProperties` for example) simply type `-<unwanted-phrase>` to the searchbar of the DevTools console. See the [demo video](https://share.getcloudapp.com/yAuDQQ6k) of how to achieve this.

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

See: [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Deployment

- `make ship-{is|sc}` - This command will create a new production build and a **release package** in the `releases` folder. After the process,
the new package can be distibuted among extension stores.

## Useful Tools

#### Storage Area Explorer - [Download](https://chrome.google.com/webstore/detail/storage-area-explorer/ocfjjjjhkpapocigimmppepjgfdecjkb?hl=en)

A Chrome extension for managing the local/sync storage of the browser. *Note: in order to access the extension's storage, you have to open the background page from the **Extensions** tab of Google Chrome. See [this preview video](https://share.getcloudapp.com/OAuPLDN2) for details on how to do that.*

#### VSCode Plugins

- **[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)** - Auto rename paired HTML/XML tag.

- **[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)** - Improve your code commenting by annotating with alert, informational, TODOs, and more!

- **[Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)** - A customizable extension for colorizing matching brackets.

- **[CodeMetrics](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-codemetrics)** - Computes complexity in TypeScript / JavaScript files.

- **[Document This](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis)** - Automatically generates detailed JSDoc comments in TypeScript and JavaScript files.

- **[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)** - Display import/require package size in the editor.

- **[Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)** - Markdown Preview Enhanced ported to vscode.

- **[Margin Colours](https://marketplace.visualstudio.com/items?itemName=chinchiheather.vscode-margin-colours)** - Display colour badge next to line numbers when any hex, rgb(a) or hsl(a) colours are written in a file.

- **[NPM Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)** - Visual Studio Code plugin that autocompletes npm modules in import statements.

- **[Sort](https://marketplace.visualstudio.com/items?itemName=henriiik.vscode-sort)** - Sort lines or words.
