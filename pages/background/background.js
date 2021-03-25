browser.browserAction.onClicked.addListener(tab => {
    browser.tabs.sendMessage(
        tab.id,
        { greeting: 1 }
    ).then(re => {
        console.log(re.response);
    }).catch(onError);
});

function onError(error) {
  console.log(`Error: ${error}`);
}
