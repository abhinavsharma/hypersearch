# Lumos Desktop Browser Extension 

Based on Chrome Extension TypeScript Starter


Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

* TypeScript (typed javascript)
* Webpack (transpiling ts to js)
* Jest (testing)

## Project Structure

* src/: TypeScript source files
* public/: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
git submodule update --init
cd lumos-shared-js
sudo npm link
cd ..
sudo npm link lumos-shared-js
```

## Import as Visual Studio Code project

...


## Dev: Build in watch mode

terminal

```
npm run watch
```

Run watch mode in Visual Studio Code.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Unit Tests
`npx jest` or `npm run test`

## Production: Build

```
npm run build
```
