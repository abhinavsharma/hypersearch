setup:
	npm install
dev:
	npm run watch
prod:
	npm run build
ship:
	npm run release
	git add .
	git commit -m "chore: add release artifacts" --no-verify
	git push --follow-tags origin master
	open releases