browser.browserAction.onClicked.addListener(tab => {
    browser.tabs.sendMessage(
        tab.id,
        { greeting: 1 }
    ).then(re => {
        navigator.clipboard.writeText(re.response.data).then(function() {
            console.log("Backend has written to clipboard");
        }, function() {
            console.log("ERROR writing to clipboard");
        });
    }).catch(onError);
});

function onError(error) {
  console.log(`ERROR: ${error}`);
}
