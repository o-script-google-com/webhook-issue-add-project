function doPost(e) {
  console.log(saveBody(e));
  return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
}
