setup:
	npm install
dev:
	npm run watch
prod:
	npm run build
ship:
	npm run release
	git push --follow-tags origin master
	open releases