setup:
	npm install --legacy-peer-deps
dev:
	npm run watch
prod:
	npm run build
package:
	npm run package
	open releases
ship:
	npm run release
	open releases
manifest-firefox:
	jq -s ".[0].permissions = .[0].permissions + .[1].permissions | \
		.[0].applications = .[0].applications + .[1].applications | del(.[0].optional_permissions) | .[0]" \
		public/manifest.json manifest/firefox.json > tmp_manifest.json
	mv tmp_manifest.json public/manifest.json
update-private:
	git fetch public
	git fetch origin
	LOCAL_EXISTS=`git show-ref refs/heads/master`; \
	if [ "$$LOCAL_EXISTS" = "" ]; then \
		git switch -c master origin/master; \
	else \
		git switch master; \
	fi;
	git pull origin master;
	STOP=0; \
	LIMIT=30; \
	SKIP=0; \
	while [ $$STOP -eq 0 ] && [ $$SKIP -le $$LIMIT ]; do \
		PRIVATE_COMMIT=`git log origin/master -n 1 --skip=$$SKIP --pretty="%s"`; \
		echo Looking for "$$PRIVATE_COMMIT" in public repo; \
		INNER_LIMIT=30; \
		INNER_SKIP=0; \
		FOUND=-1; \
		while [ $$INNER_SKIP -le $$LIMIT ]; do \
			LAST_PUBLIC_COMMIT=`git log public/main -n 1 --skip=$$INNER_SKIP --pretty="%s"`; \
			echo index: $$INNER_SKIP "$$LAST_PUBLIC_COMMIT"; \
			\
			if [ "$$PRIVATE_COMMIT" = "$$LAST_PUBLIC_COMMIT" ]; then \
				FOUND=$$INNER_SKIP; \
				STOP=1; \
				break; \
			fi; \
			\
			INNER_SKIP=`expr $$INNER_SKIP + 1`; \
			\
		done; \
		\
		if [ $$FOUND -ge 0 ]; then \
			HASH=`git log public/main -n 1 --skip=$$FOUND --pretty="%h"`; \
			echo Public hash starts in: $$HASH; \
			git cherry-pick public/main $$HASH..public/main; \
		fi; \
		\
		if [ $$STOP -eq 1 ]; then \
			break; \
		fi; \
		\
		SKIP=`expr $$SKIP + 1`; \
	done;
update-public:
	git fetch origin
	git fetch public
	LOCAL_EXISTS=`git show-ref refs/heads/main`; \
	if [ "$$LOCAL_EXISTS" = "" ]; then \
		git switch -c main public/main; \
	else \
		git switch main; \
	fi;
	git pull public main;
	STOP=0; \
	LIMIT=30; \
	SKIP=0; \
	while [ $$STOP -eq 0 ] && [ $$SKIP -le $$LIMIT ]; do \
		PUBLIC_COMMIT=`git log public/main -n 1 --skip=$$SKIP --pretty="%s"`; \
		echo Looking for "$$PUBLIC_COMMIT" in public repo; \
		INNER_LIMIT=30; \
		INNER_SKIP=0; \
		FOUND=-1; \
		while [ $$INNER_SKIP -le $$LIMIT ]; do \
			PRIVATE_COMMIT=`git log origin/master -n 1 --skip=$$INNER_SKIP --pretty="%s"`; \
			echo index: $$INNER_SKIP "$$PRIVATE_COMMIT"; \
			\
			if [ "$$PUBLIC_COMMIT" = "$$PRIVATE_COMMIT" ]; then \
				FOUND=$$INNER_SKIP; \
				STOP=1; \
				break; \
			fi; \
			\
			INNER_SKIP=`expr $$INNER_SKIP + 1`; \
			\
		done; \
		\
		if [ $$FOUND -ge 0 ]; then \
			HASH=`git log origin/master -n 1 --skip=$$FOUND --pretty="%h"`; \
			echo Private hash starts in: $$HASH; \
			git cherry-pick origin/master $$HASH..origin/master; \
		fi; \
		\
		if [ $$STOP -eq 1 ]; then \
			break; \
		fi; \
		\
		SKIP=`expr $$SKIP + 1`; \
	done;
