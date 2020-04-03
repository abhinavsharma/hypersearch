setup:
	npm install -g json-bump
	npm install
	sudo npm link lumos-web
	sudo npm link lumos-shared-js
dev:
	npm run watch