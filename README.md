Wikipedia editor's web citation helper extension for Firefox

The idea is to automate mundane tasks each editor goes through to document an article with online references.

## Features

* Use the extension by clicking toolbar button to create a reference to currently viewed page
* Scanning of current webpage for metadata to feed Wikipedia template.
* Assembled reference is put into clipboard, and can be pasted into an article
* URLs and non structured fields are sanitized with regards to characters sensitive to Mediawiki syntax.
* archive.org support — if the viewed page is loaded from web archive, triggering the extension while viewing it will populate the following fields: archive URL and archive date, as well as the original URL with proper content.
* If you want to provide a quotation within your reference, select a text on the page and only then click the extention button. The selected text will be copied over.
* The access-date field is automatically set to the current day, you can edit it afterwards if necessary.
* Code has been designed to limit browser extension permissions to absolute minimum. The code is triggered only when the button is clicked, thus the actual permissions given is `activeTab` access as declared in `manifest.json` and not all websites as stated by the browser.

## Supported languages

Technically any language may be supported in future version provided its Wikipedia has a compatible template. Currently the extension supports Polish (and technically English which served as the base of the logic).

## Recognized metadata
The extension does not parses webpages, it gathers metadata exposed by publishers, usually prepared for social media robots and search engine optimizations. The metadata for sindication is prefered over raw data sources. Ie. Open Graph field `og:title` would take precedence over `<title>` tag, since the latter if often styled with site name suffix and other decorations.

***URL*** — is sourced in the following order: `link[rel=canonical]`, `meta[property=og:url]`, lastly `location.href` serves as fallback yet it is stripped of `location.hash`,

***title*** — `meta[property=og:title]`, `document.title`

***language*** — first 2 characters of `meta[property=og:locale]`, eventually `html[lang]` attribute

***author*** — this field has particularly poor coverage and support in metadata on websites in author's observations. Currently the only source is `meta[name=author]`. Others are currently under consideration and tests.

***publisher*** — `meta[property=og:site_name]`

***access-date*** — automatically generated of current day according to ISO format (`YYYY-MM-DD`).

***date*** — `meta[property=article:published_time]`, `meta[property=article:modified_time]`

***quote*** — selected text on the page

Example of minimalistic data generated:
`<ref>{{cytuj stronę | url = https://github.com/smyru/refirefi | tytuł = smyru/refirefi | język = en | data dostępu = 2021-04-10 }}</ref>`

Example showing almost all of supported template fields:
`<ref>{{cytuj stronę | url = http://www.polskistandardplatnosci.pl/ | tytuł = Polski Standard Płatności | język = pl | archiwum = https://web.archive.org/web/20140705181419/http://www.polskistandardplatnosci.pl/ | zarchiwizowano = 2014-07-05 | cytat = Spółka Polski Standard Płatności podpisała umowę o współpracy z Krajową Izbą Rozliczeniową | data dostępu = 2021-04-10 }}</ref>`

## Limitations

The information gathered will be limited to the amount provided by referenced website as metadata. Also please do note, that the metadata may be wrong, outdated and overlooked by publisher, so check the formatted ref against the page before posting.

## Installation

Currently the extension is available for tests in a non packaged form. To use it, you need to clone the repository and instruct your Firefox to load the extension from disk. see [here for some guidelines](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/). Sadly, due to Firefox design the temporary loaded extension has to be loaded over and over after each browser restart.

The extension was designed to require the least amount of permissions possible. The only permissions required is access to the web page loaded in the current tab, the extension has been activated on, and clipboard write access to provide the output for usage. Note, the extension may only write to clipboard. It cannot read from the clipboard.
