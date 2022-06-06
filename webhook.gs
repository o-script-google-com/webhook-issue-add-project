function getAccessToken() {
  try {
    return UrlFetchApp.fetch(options.webapp_access_token, { muteHttpExceptions: true, method: 'GET' }).getContentText();
  } catch (error) {
    console.error(error);
  }
}
function saveBody(e) {
  try {
    if ('postData' in e && 'contents' in e.postData) {
      try { addIssueToProject(e); } catch { }
      return JSON.parse(UrlFetchApp.fetch(options.bodyRtdbUrl, {
        muteHttpExceptions: true,
        method: 'POST',
        payload: e.postData.contents
      }).getContentText());
    }
  } catch (error) {
    console.error(error);
  }
}
function addIssueToProject(e) {
  try {
    let postData = undefined;
    try { postData = JSON.parse(e.postData.contents); } catch { }
    if (typeof postData === 'undefined') return undefined;
    let { action = undefined, issue = undefined, comment = undefined } = postData;
    if (action === 'opened' && issue && typeof comment === 'undefined') {
      let query = `mutation {addProjectNextItem(input: {projectId: \"${options.allIssueProjectId}\" contentId: \"${issue.node_id}\"}) {projectNextItem {id}}}`;
      let request = {
        muteHttpExceptions: true,
        method: 'POST',
        payload: JSON.stringify({ "query": query }),
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          Accept: "application/vnd.github.v3+json"
        }
      };
      let resultAdd = JSON.parse(UrlFetchApp.fetch('https://api.github.com/graphql', request).getContentText());
      console.log({ resultAdd, request });
    };
  } catch (error) {
    console.error(error);
  }
}
