setup:
	npm install -g json-bump
	npm install
	sudo npm link lumos-web
	sudo npm link lumos-shared-js
dev:
	npm run watch
ship:
	json-bump public/manifest.json --patch
	zip -r `date +'%Y-%m-%d-%H-%M'.zip` public/
	mv `date +'%Y-%m-%d-%H-%M'.zip` releases/