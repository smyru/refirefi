function is_archived(url) {
    return url.indexOf("://web.archive.org/web/") > -1;
}
// Returns 2 element array containing ISO formatted date and original 
// archived URL. It is assumed that user did is_archived() test and
// the input is legit.
function unpack(url) {
    var uparts = url.split("/");
    return [
        [
            uparts[4].substr(0, 4),
            uparts[4].substr(4, 2),
            uparts[4].substr(6, 2),
        ].join("-"),
        uparts.slice(5).join("/"),
    ];
}
function sanitize_input(s) {
    if (!s) // Input will often be undefined, don't bother
        return;

    var mapping = {
        "|": "&#124;",
        "[": "&#91;",
        "]": "&#93;",
        "{": "&#123;",
        "}": "&#125;",
        "<": "&#60;",
        ">": "&#62;",
    };
    return s.replace(/[\|\][}{><]/g, function(m) {
        return mapping[m];
    });
}
// Return URL as loaded into the window, yet stripping the fragment part
// which is abused for analytics purposes.
function get_raw_url() {
    return location.href.replace(location.hash, "");
}
function iso2date(dt) {
    return dt.substring(0, dt.indexOf("T"));
}
function get_meta(name, type) {
    type = type || "property";

    var e = document.querySelector("meta["+type+"='"+name+"']");
    if (e && e.getAttribute("content"))
        return e.getAttribute("content");
}
function get_link(name) {
    var e = document.querySelector("link[rel='"+name+"']");
    if (e && e.getAttribute("href"))
        return e.getAttribute("href");
}
function gather() {
    var lang = "polski";
    var nls = {
        "english": [ "url", "title", "author", "date",  "publisher",    "language", "archive-url", "archive-date",   "quote", "access-date", ],
        "polski":  [ "url", "tytuł", "autor",  "data", "opublikowany", "język",    "archiwum",    "zarchiwizowano", "cytat", "data dostępu", ],
    };
    // We will use English through the code
    var fields = nls["english"];
    var records = [];

    for (var i = 0, j = fields.length; i < j; i++) {
        var pair = [ nls[lang][i] ];

        switch (fields[i]) {
            case "url":
                var url = get_meta("og:url", "property")
                if (!url) {
                    // Note, rel=canonical also handle AMP use case
                    url = get_link("canonical") || get_raw_url();
                }

                if (is_archived(url)) {
                    url = unpack(url)[1];
                }
                pair.push(sanitize_input(url));
                break;
            case "title":
                // Prefer syndication header over raw title, as the latter
                // is often styled with site name and stuff
                pair.push(sanitize_input(get_meta("og:title", "property") || document.title));
                break;
            case "author":
                var a = get_meta("author", "name");
                pair.push(sanitize_input(a));
                break;
            case "date":
                var dates = [ "article:published_time", "article:modified_time", ];
                var d;

                for (var n = 0, m = dates.length; n < m; n++) {
                    d = get_meta(dates[n], "property");
                    if (!d)
                        continue;

                    pair.push(iso2date(d));
                    break;
                }
                break;
            case "access-date":
                var d = new Date();
                var ds = d.toISOString();
                pair.push(iso2date(ds));
                break;
            case "publisher":
                pair.push(sanitize_input(get_meta("og:site_name", "property")));
                break;
            case "language":
                var l = get_meta("og:locale", "property");
                if (!l) {
                    var root = document.getElementsByTagName("html")[0];
                    if (root && root.getAttribute("lang"))
                        l = root.getAttribute("lang");
                }
                pair.push(l && l.length > 0 ? l.substring(0,2) : null);
                break;
            case "archive-url":
                if (is_archived(get_raw_url()))
                    pair.push(sanitize_input(get_raw_url()));
                break;
            case "archive-date":
                if (is_archived(get_raw_url())) {
                    var archive = unpack(get_raw_url());
                    pair.push(archive[0]);
                }
                break;
            case "quote":
                var so = document.getSelection();
                if (so.type == "Range")
                    pair.push(sanitize_input(so.toString()));
                break;
        }
        if (pair.length > 1 && pair[1])
            records.push(pair);
    }

    var buffer = [];
    for (var i = 0, j = records.length; i < j; i++) {
        buffer.push(records[i].join(" = "));
    }

    return "<ref>{{cytuj stronę | "+buffer.join(" | ")+" }}</ref>";
}

browser.runtime.onMessage.addListener(msg => {
    return Promise.resolve({ response: { data: gather(), }});
});
