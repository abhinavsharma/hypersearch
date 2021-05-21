setup:
	npm install -g json-bump
	npm install
dev:
	npm run watch
prod:
	npm run build
ship:
	json-bump public/manifest.json --patch
	sed -i '' -e "s/IS_DEBUG_SWITCH = true/IS_DEBUG_SWITCH = false/g" ./src/utils/constants/index.ts
	npm run build
	zip -r `date +'INSIGHT-%Y-%m-%d-%H-%M'.zip` dist_is/
	mv `date +'INSIGHT-%Y-%m-%d-%H-%M'.zip` releases/
	sed -i '' -e "s/IS_DEBUG_SWITCH = false/IS_DEBUG_SWITCH = true/g" ./src/utils/constants/index.ts
	git add releases/*
	git commit -am 'version bump - insight' --no-verify
	git push origin master --no-verify
	open releases