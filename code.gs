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
  
  


// 【こちらだけを残します】動作確認テスト用の関数
function testGetFolder() {
  // 直接IDを指定する最終手段
  var id = "1NqQ6XzrIPb_lgA0Y3qF3zyiojXeoguZJ5MFu63migx4"; 
                    
  var folder = getFolderOfId(id);
  if (folder) {
    Logger.log("親フォルダ名: " + folder.getName());
  }
}
