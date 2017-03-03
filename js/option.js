$(function(){

  // セーブボタンが押されたら、
  // ローカルストレージに保存する。
  $("#save").click(function () {
    localStorage["message"] = $("#message").val();
    localStorage["bgcolor"] = $("#bgcolor").val();
  });

  // オプション画面の初期値を設定する
  if (localStorage["message"]) {
    $("#message").val(localStorage["message"]);
  }
  if (localStorage["bgcolor"]) {
    var bgcolor = localStorage["bgcolor"];
    $("#bgcolor option[value=" + bgcolor + "]").attr("selected", true);
  }

});
