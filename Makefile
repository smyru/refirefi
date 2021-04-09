NAME=$(shell jq -r .name manifest.json)
VERSION=$(shell jq -r .version manifest.json)

FILES= \
	manifest.json \
	pages/background/background.html \
	pages/background/background.js \
	scripts/content.js \
	images/icon.svg

all:
	@if [ -z "${NAME}" ]; then \
		echo "Use gmake"; \
		false; \
	fi
	zip -FS ${NAME}.xpi ${FILES} 
