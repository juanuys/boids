.PHONY: run dist

dist:
	mkdir -p docs
	touch docs/_config.yml
	npm run dist
	./cachebust.sh

run:
	npm run start