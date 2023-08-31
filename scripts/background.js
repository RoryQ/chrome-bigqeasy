let askToOpenTempTable = false;
let askToExploreTempTable = false;

function logTempTable(requestDetails) {
  if (
    /https:\/\/clients6\.google\.com\/bigquery\/v2internal\/projects\/.*\/datasets\/_.*/gm.test(
      requestDetails.url
    ) &&
    (askToOpenTempTable || askToExploreTempTable)
  ) {
    const regexProject = /.*projects\/([^\/]*)\/.*/gm;
    const regexDataset = /.*datasets\/([^\/]*)\/.*/gm;
    const regexTable = /.*tables\/([^(:|?|\/)]*)(:|\?|\/).*/gm;

    let projectId = regexProject.exec(requestDetails.url);
    let dataset = regexDataset.exec(requestDetails.url);
    let table = regexTable.exec(requestDetails.url);

    if (projectId && dataset && table) {
      let tempTable =
        projectId[1] + "." + dataset[1] + "." + table[1];

      browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
          if (askToOpenTempTable) {
            browser.tabs.executeScript(tabs[0].id, {
              code: 'injectFn("' + tempTable + '");'
            });
            askToOpenTempTable = false;
          }
          if (askToExploreTempTable) {
            askToExploreTempTable = false;
            let config = {
              projectId: projectId[1],
              tableId: table[1],
              datasetId: dataset[1],
              billingProjectId: projectId[1],
              connectorType: "BIG_QUERY",
              sqlType: "STANDARD_SQL"
            };
            browser.tabs.create({
              url:
                "https://datastudio.google.com/u/0/explorer?config=" +
                encodeURIComponent(JSON.stringify(config))
            });
          }
        })
        .catch((error) => console.error(error));
    }
  }
}

browser.webRequest.onCompleted.addListener(
  logTempTable,
  { urls: ["https://clients6.google.com/bigquery/v2internal/projects/*"] }
);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  askToOpenTempTable = request.askToOpenTempTable;
  askToExploreTempTable = request.askToExploreTempTable;

  sendResponse({});
  return true;
});

console.log("background.js loaded");
