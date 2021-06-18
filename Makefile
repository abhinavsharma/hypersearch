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
	RELEASE_FOLDER=releases/${$(date +"%Y-%m-%d-%H-%M")}/source.zip
	zip -r $RELEASE_FOLDER src public "Insight Extension" tasks
	zip -D $RELEASE_FOLDER ./* .*
	RELEASE_FOLDER=""
	open releases
manifest-firefox:
	jq -s ".[0].permissions = .[0].permissions + .[1].permissions | del(.[0].optional_permissions) | .[0]" \
		public/manifest.json manifest/firefox.json > tmp_manifest.json
	mv tmp_manifest.json public/manifest.json
