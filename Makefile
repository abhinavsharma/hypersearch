setup:
	npm install -g json-bump
	npm install
	sudo npm link lumos-web
	sudo npm link lumos-shared-js
dev:
	npm run watch
ship:
	npm run build
	json-bump public/manifest.json --patch
	zip -r `date +'%Y-%m-%d-%H-%M'.zip` dist/
	mv `date +'%Y-%m-%d-%H-%M'.zip` releases/
	echo "Make sure to have set IN_DEBUG_MODE=false in lumos-shared-js/src/content/constants.ts"
	open releases