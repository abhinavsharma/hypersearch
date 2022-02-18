# Insight Desktop

Insight supercharges search with results from expert and community trusted sources for any field.

### [Onboarding Documentation](https://coda.io/d/Onboarding_d-kosbxe-MK/Insight-Desktop-Onboarding_suk36#_lud9t)

> ##
> #### Technical Documentation
>
> __[Augmentation Specification](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Augmentations-Spec_suGx8#_luk97)__
>
> __[Auto Expand Criteria](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Desktop-Autoexpand-Criteria_suBc2#_lu-2V)__
>
> __[Application Architecture](docs/ARCHITECTURE.md)__
>
> __[Custom Search Engines (CSE)](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Custom-Search-Engines_suGZG#_luABT)__
>
> __[Logging Specification](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Desktop-Extension-Logging_sueRp#Events_tustj/r21)__
>
> __[Publications Concept](https://www.notion.so/lasoai/WebUrlAnswer-vs-WebUrl-vs-Publications-453a6d2bd8f24b2c8af3d48686ca9101)__
>
> __[Referral Redemption Concurrency](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Referral-redemption-concurrency_suHzX#_lu6WV)__
>
> __[Tab Sorting Criteria](https://coda.io/d/Technical-Documentation_dVTEz9ECa5H/Subtab-Sorting_su95m#_lutd5)__
>
> ##

# Project Structure

 `/src`
 Extension source compiled with [Webpack](https://www.npmjs.com/package/webpack) using [TypeScript](https://www.typescriptlang.org/)

 `/public`
 Public assets via [`chrome.runtime.getUrl()`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getURL)

 `/tasks`
 Package scripts and configuration

 `/releases`
 Distributable extension packages

# Modules

See __package.json__ for the project dependencies ([manual](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)).

### Onboarding

Introduction flow with license registration and privacy settings

### Sidebar

Main UI module injected to the browser tabs in an `iframe`

### Engines

Search Results Page (SERP) mutations (extract results URLs, reordering, gutter units and overlays)

### Storage

Asynchronous extension storage using `chrome.storage` API (local + sync)

# Development Workflow

### Install

 `~ make setup`
or
 `~ npm install --legacy-peer-deps`

> Note: `legacy-peer-deps` flag to allow __[react-typist^2.0.5](https://www.npmjs.com/package/react-typist)__

### Develop
`~ make dev`
or
`~ npm run watch`

### Build
`~ make prod`
or
`~ npm run build`

### Release
`~ make ship`

> Note: check the __[JQ installation page](https://stedolan.github.io/jq/download/)__ for your specific platform if needed

# Browser Integration

 ## [Chrome](https://developer.chrome.com/docs/extensions/mv2/getstarted/) __|__ [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing) __|__ [Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading#:~:text=Open%20the%20edge%3A%2F%2Fextensions,browser%2C%20and%20then%20selecting%20Extensions.&text=On%20the%20extension%20management%20page,bottom%20left%20of%20the%20page.&text=When%20installing%20your%20extension%20for%20the%20first%20time%2C%20choose%20Load%20Unpacked.) __|__ [Safari](https://developer.apple.com/documentation/safariservices/safari_app_extensions/building_a_safari_app_extension)

 ## Instructions
 __Prepare Safari to run unsigned extensions__

  __1.__ _Open Safari and choose Safari > Preferences._

 __2.__ _Select the Advanced tab, then select the “Show Develop menu in menu bar” checkbox._

 __3.__ _Choose Develop > Allow Unsigned Extensions. The Allow Unsigned Extensions setting is reset when a user quits Safari; you must set it again the next time Safari is launched._

 __4.__ _Select the Extensions tab. This tab shows the localized description, display name, and version number for the selected Safari App Extension. It also provides a more nuanced message about the permissions claimed by the extension._

 __5.__ _Find your new extension in the list on the left, and enable it by selecting the checkbox._

 __6.__ _Close Safari Preferences._

 __Using Xcode 12 or higher__

 __1.__ _Open the project `./Insight Extension/Insight Extension.xcodeproj.`_

 __2.__ _Make sure that your macOS app is selected in the Scheme menu next to the Run and Stop buttons in Xcode’s main toolbar._

 __3.__ _Click the Run button, or choose Product > Run (Command-R) to build and run your app._

# Suggested Tools

 ### __Storage Area Explorer__ - ___[Demo](https://share.getcloudapp.com/OAuPLDN2) / [Download](https://chrome.google.com/webstore/detail/storage-area-explorer/ocfjjjjhkpapocigimmppepjgfdecjkb?hl=en)___

 __[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)__ | ___Auto rename paired HTML/XML tag.___

 __[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)__ | ___Improve your code commenting by annotating with alert, informational, TODOs, and more!___

 __[Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)__ | ___A customizable extension for colorizing matching brackets.___

 __[CodeMetrics](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-codemetrics)__ | ___Computes complexity in TypeScript / JavaScript files.___

 __[Document This](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis)__ |  ___Automatically generates detailed JSDoc comments in TypeScript and JavaScript files.___

 __[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)__ | ___Display import/require package size in the editor.___

 __[Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)__ | ___Markdown Preview Enhanced ported to vscode.___

 __[Margin Colours](https://marketplace.visualstudio.com/items?itemName=chinchiheather.vscode-margin-colours)__ | ___Display colour badge next to line numbers when any hex, rgb(a) or hsl(a) colours are written in a file.___

 __[NPM Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)__ | ___Visual Studio Code plugin that autocompletes npm modules in import statements.___

 __[Sort](https://marketplace.visualstudio.com/items?itemName=henriiik.vscode-sort)__ | ___Sort lines or words.___

# [CHANGELOG](CHANGELOG.md)