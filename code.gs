function getFolderOfId(spreadsheetId) {
  if (!spreadsheetId) {
    Logger.log("エラー: スプレッドシートIDが空です。");
    return null;
  }

  
    var file = DriveApp.getFileById(spreadsheetId);
    var pp = file.getParents();
    
    if (pp.hasNext()) {
      return pp.next();
    } else {
      Logger.log("親フォルダが見つかりませんでした（マイドライブ直下の可能性があります）。");
      return null;
    }
}
  
  
function createFeatureSpreadsheetCopy(masterSpreadsheetId, featureName) {
  if (!masterSpreadsheetId) {
    Logger.log("エラー: masterSpreadsheetId が空です。");
    return null;
  }

  if (!featureName) {
    Logger.log("エラー: featureName が空です。");
    return null;
  }

  var masterFile = DriveApp.getFileById(masterSpreadsheetId);
  var parentFolder = getFolderOfId(masterSpreadsheetId);

  var now = new Date();
  var dateText = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "yyyyMMdd_HHmm"
  );

  var safeFeatureName = featureName.replace(/[\\/:*?"<>|#%{}]/g, "-");
  var copyName = "feature_" + safeFeatureName + "_" + dateText;

  var copiedFile;
  if (parentFolder) {
    copiedFile = masterFile.makeCopy(copyName, parentFolder);
  } else {
    copiedFile = masterFile.makeCopy(copyName);
  }

  var copiedSpreadsheet = SpreadsheetApp.openById(copiedFile.getId());

  writeFeatureInfoToConfigSheet_(
    copiedSpreadsheet,
    masterSpreadsheetId,
    featureName,
    copiedFile.getId()
  );

  Logger.log("feature用スプレッドシートを作成しました。");
  Logger.log("名前: " + copiedFile.getName());
  Logger.log("URL: " + copiedFile.getUrl());

  return {
    id: copiedFile.getId(),
    name: copiedFile.getName(),
    url: copiedFile.getUrl()
  };
}


function writeFeatureInfoToConfigSheet_(
  spreadsheet,
  masterSpreadsheetId,
  featureName,
  featureSpreadsheetId
) {
  var sheet = spreadsheet.getSheetByName("CONFIG");

  if (!sheet) {
    sheet = spreadsheet.insertSheet("CONFIG");
  }

  setConfigValue_(sheet, "ENV", "feature");
  setConfigValue_(sheet, "FEATURE_NAME", featureName);
  setConfigValue_(sheet, "MASTER_SPREADSHEET_ID", masterSpreadsheetId);
  setConfigValue_(sheet, "FEATURE_SPREADSHEET_ID", featureSpreadsheetId);
  setConfigValue_(sheet, "CREATED_AT", new Date());
  // setConfigValue_(sheet, "CREATED_BY", Session.getActiveUser().getEmail());
}


function setConfigValue_(sheet, key, value) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["key", "value"]);
  }

  var lastRow = sheet.getLastRow();
  var values = sheet.getRange(1, 1, lastRow, 1).getValues();

  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }

  sheet.appendRow([key, value]);
}

function testCreateFeatureSpreadsheetCopy() {
  var masterSpreadsheetId = "1NqQ6XzrIPb_lgA0Y3qF3zyiojXeoguZJ5MFu63migx4";
  var featureName = "git-management-practice";

  var result = createFeatureSpreadsheetCopy(masterSpreadsheetId, featureName);

  if (result) {
    Logger.log("作成成功");
    Logger.log(result.url);
  }
}

// 【こちらだけを残します】動作確認テスト用の関数
function testGetFolder() {
  // 直接IDを指定する最終手段
  var id = "1NqQ6XzrIPb_lgA0Y3qF3zyiojXeoguZJ5MFu63migx4"; 
                    
  var folder = getFolderOfId(id);
  if (folder) {
    Logger.log("親フォルダ名: " + folder.getName());
  }
}
