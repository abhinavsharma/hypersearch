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
	RELEASE_FOLDER=releases/${$(date +"%Y-%m-%d")}/source.zip
	zip -r $RELEASE_FOLDER src public "Insight Extension" tasks
	zip -D $RELEASE_FOLDER ./* .*
	RELEASE_FOLDER=""
	open releases