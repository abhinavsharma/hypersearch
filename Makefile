setup:
	npm install -g json-bump
	npm install
	sudo npm link lumos-shared-js
dev:
	npm run watch
ship-is:
	json-bump public/is.manifest.json --patch
	sed -i '' -e "s/IN_DEBUG_MODE = true/IN_DEBUG_MODE = false/g" ../lumos-shared-js/src/content/constants.ts
	npm run build
	zip -r `date +'INSIGHT-%Y-%m-%d-%H-%M'.zip` dist_is/
	mv `date +'INSIGHT-%Y-%m-%d-%H-%M'.zip` releases/
	sed -i '' -e "s/IN_DEBUG_MODE = false/IN_DEBUG_MODE = true/g" ../lumos-shared-js/src/content/constants.ts
	git add releases/*
	git commit -am 'version bump - insight' --no-verify
	git push origin master --no-verify
	open releases
ship-sc:
	json-bump public/sc.manifest.json --patch
	sed -i '' -e "s/IN_DEBUG_MODE = true/IN_DEBUG_MODE = false/g" ../lumos-shared-js/src/content/constants.ts
	npm run build
	zip -r `date +'SEARCHCLUB-%Y-%m-%d-%H-%M'.zip` dist_sc/
	mv `date +'SEARCHCLUB-%Y-%m-%d-%H-%M'.zip` releases/
	sed -i '' -e "s/IN_DEBUG_MODE = false/IN_DEBUG_MODE = true/g" ../lumos-shared-js/src/content/constants.ts
	git add releases/*
	git commit -am 'version bump - searchclub' --no-verify
	git push origin master --no-verify
	open releases