
[![Issues](https://img.shields.io/github/issues/abhinavsharma/hypersearch)](https://github.com/abhinavsharma/hypersearch/issues)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/abhinavsharma/hyperweb/blob/master/LICENSE.txt)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/feojagelicdlhnmldaiplbppfbolnnag?label=Chrome)](https://chrome.google.com/webstore/detail/hypersearch/feojagelicdlhnmldaiplbppfbolnnag?hl=en&authuser=2)

*** 

<h1 align="center">
<sub>
<img  src="https://github.com/abhinavsharma/hypersearch/raw/main/public/logo128.png" height="38" width="38">
</sub>
Hypersearch
</h1>


<p align="center">
<!-- <a href="https://addons.mozilla.org/firefox/addon/ublock-origin/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get uBlock Origin for Firefox"></a>  -->
<a href="https://chrome.google.com/webstore/detail/ublock-origin/feojagelicdlhnmldaiplbppfbolnnag"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get uBlock Origin for Chromium"></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/hypersearch-desktop/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get Hypersearch for Firefox"></a> 
<!-- <a href="https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak"><img src="https://user-images.githubusercontent.com/585534/107280673-a5ece780-6a26-11eb-9cc7-9fa9f9f81180.png" alt="Get uBlock Origin for Microsoft Edge"></a>
<a href="https://addons.opera.com/extensions/details/ublock/"><img src="https://user-images.githubusercontent.com/585534/107280692-ac7b5f00-6a26-11eb-85c7-088926504452.png" alt="Get uBlock Origin for Opera"></a> -->
      <br><sub>Coming soon for Firefox and Opera. Microsoft Edge users can install from the Chrome store.</a></sub>
</p>

***

**Hypersearch enhances all major search engines (Google, DuckDuckGo, Amazon, etc.) with results from trusted sources in the sidebar and removing results from blocked sources**



***
* [Purpose & General Info](#philosophy)
* [Features](#features)
* [Installation](#installation)
* [License](#release-history)
* [Privacy Policy](PRI)
* [Development](#development)

## Philosophy and Principles

### **What's going wrong with search?**


We believe that finding high quality information on the open internet has become increasingly hard. [Many](https://news.ycombinator.com/item?id=20275865) [have](https://calpaterson.com/metadata.html) [noticed](https://twitter.com/mwseibel/status/1477701120319361026) this trend but a superior alternative remains elusive.

Search engines are mostly used for _head queries_, ([simple that many people often look up](https://trends.google.com/trends/trendingsearches/daily?geo=US)) but make most of their revenue on _tail queries_ ([complex research queries with high financial or life decision stakes](https://www.wordstream.com/blog/ws/2012/01/23/google-revenues)).

People build the habit of their default search engine based mostly on the head, and to be good at the head, you need lots of data on what people like clicking through to, thus making the market leader's position even stronger. 

But tail queries, often the most important queries users make, are declining in quality because

1. The organic results cannot be much better than the ads, otherwise too much revenue is lost.

2. [Publisher revenue is getting smaller relative to search engines'](https://themarkup.org/google-the-giant/2020/07/28/google-search-results-prioritize-google-products-over-competitors), so larger publishers often make more money by affiliate selling to expensive products (e.g. review sites) or by paywall-blocking content.

3. Large publishers win out in search results over authentic user generated content because people click on familiar brands and because they can spend more on SEO budgets.


### **How can search be improved?**

We don't think it's easy to make an alternative search engine that's much better, but we do think that there are **clever ways to use existing search engines to get to the best content.**


This is the underlying core philosophy behind Hypersearch.

### **Don't re-invent another search engine with the same incentives. Instead, augment search for power users**

 We do not try to replace your search engine, but instead augment your existing search engine with results from your trusted sources and block results from sites you don't trust.

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/L1uR5QED/0ea31f4e-a8ad-4c55-9e49-fc306b2fc174.jpg?v=8313d9300f936ae92b0d364b37d376ea" />

We provide often useful filters out of the box, e.g. Reddit, Hacker News, but you as the user are free to customize your filters to your liking.

### **BYO search engine**

We designed Hypersearch to be compatible with as many search engines as possible, with support out of the box for many major search engines.

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/GGulXR1D/a9c027e1-cd0d-4b95-971a-45c7c6e3c0f2.jpg?source=viewer&v=68d9ea56a06bc2cdeb0d55ba53a392eb" />

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/NQuNEr6n/1c81e1ad-c443-4722-aff7-161513451774.jpg?v=06a3ad8258735d57cf7a802ff4e68171" />



This includes vertical specific search engines like Amazon for shopping.

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/JruOlgkN/6956dab1-5a7c-42b2-b848-5bc64651fe31.jpg?v=5ed5abf306536c35f5efe6d7f5ac3b98" />

If we don't yet support a search engine you'd like to see, please [raise an issue](/abhinavsharma/hyperweb/issues).


### **Search is not just the links**

Search is ultimately about making decisions, and that doesn't just happen on a page with links. 

Hypersearch augments non-search pages with useful information like review vetting and price checks to help you make decisions better

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/DOu4WxN4/6aef86a1-07cf-44c9-ac17-b8f36b33c1fe.jpg?v=59419f40b56f940ecd72d749f7180243" />

### **Suggested filters but full customizability**

As we learnt how to filter search results well, we build certain popular filters into the extension by default, such as Reddit, Hacker News, domain-specific filters such as "Sources Doctors Read but the user is free to disable these default sources as well as create their own filters.

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/yAuKPbyw/83b4fc52-65a6-43f5-a34f-0ccaaf1a15a2.jpg?v=906453f78bd1d3c1861cae25594ec6cc" />


### **Create your own rules**

Hypersearch has the ability to create custom filters for any website.

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/rRu1J7Nr/1fcc1c71-f1c6-4f54-9980-a9204cab4cd5.jpg?source=viewer&v=58cbd88487de484c3cbe1154cf59ff87" />

The schema is based on our mobile app [Hyperweb](https://hyperweb.app) and filters made in one are usually (though not always) compatible with the other.




## Installation

Hypersearch is [currently available on the Chrome Web Store](https://img.shields.io/chrome-web-store/rating/feojagelicdlhnmldaiplbppfbolnnag?label=Chrome) for Chrome and Edge users. 

## License

[GPLv3](https://github.com/abhinavsharma/hyperweb/blob/master/LICENSE.txt).

## Privacy

Hypersearch does not collect any data by default.

[Privacy Policy](https://github.com/abhinavsharma/hyperweb/blob/master/PRIVACY.md).

## FAQs

**Hypersearch asks for access to all sites, how can I trust it?**

We've tried to maximize your trust by

- Never logging any data to servers, see our privacy policy.
- Open sourcing all the code
- You can always unzip the browser extension code and inspect it
- You can also inspect the network traffic generated by the extension.

If you have are any other questions or we can do more to assure you, you can [raise an issue](/abhinavsharma/hypersearch/issues).

**I see a lot of captchas when trying to use Google. What should I do?**

Usually, these go away after a few times of solving the CAPTCHAs. Loading a search result page followed by another similar one very quickly is an unusual pattern and Google finds it suspicious.

**How is Hypersearch funded?**

We make paid iOS apps [Hyperweb](https://hyperweb.app) and Insight Browser that bring in revenue. Hypersearch is a free and open source project we've built for the desktop community.
# Development Notes

Even though the project is open source, the current group of developers is small. If you'd like to help, feel free to reach out to me directly - abhinav@laso.ai

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

 ## [Chrome](https://developer.chrome.com/docs/extensions/mv2/getstarted/) __|__ [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing) __|__ [Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading#:~:text=Open%20the%20edge%3A%2F%2Fextensions,browser%2C%20and%20then%20selecting%20Extensions.&text=On%20the%20extension%20management%20page,bottom%20left%20of%20the%20page.&text=When%20installing%20your%20extension%20for%20the%20first%20time%2C%20choose%20Load%20Unpacked.)

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
