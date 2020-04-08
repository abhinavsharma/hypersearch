setup:
	npm install -g json-bump
	npm install
	sudo npm link lumos-web
	sudo npm link lumos-shared-js
dev:
	npm run watch
ship:
	json-bump public/manifest.json --patch
	sed -i '' -e "s/IN_DEBUG_MODE = true/IN_DEBUG_MODE = false/g" ../lumos-shared-js/src/content/constants.ts
	npm run build
	zip -r `date +'%Y-%m-%d-%H-%M'.zip` dist/
	mv `date +'%Y-%m-%d-%H-%M'.zip` releases/
	sed -i '' -e "s/IN_DEBUG_MODE = false/IN_DEBUG_MODE = true/g" ../lumos-shared-js/src/content/constants.ts
	open releases