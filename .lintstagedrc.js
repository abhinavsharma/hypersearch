module.exports = {
  "src/**/*.{ts,tsx}": [
    () => "tsc -p tsconfig.json --noEmit",
    "eslint src/**/*.ts* --fix"
  ]
}
