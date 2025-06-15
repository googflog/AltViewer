/// <reference path="EventDispathcer.ts"/>
/// <reference path="jquery.d.ts" />

module ReadyCheckModule {

	//コンテンツがロードされて contentscript.js と情報をやり取りできるか調べる
	export class PopReadyCheck extends events.EventDispatcher {
		chrome: object;
		setIntervalID: number;
		constructor(chrome: object) {
			super();
			var this_ = this;

			// 選択されているタブを調べる popup は開いても
			// contentscript.js はロード中で反応できない事があるので反応あるまで送り続ける
			this.setIntervalID = setInterval(function() {

				// 選択されているタブに情報を送る
				chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
					// console.log("選択されているタブID", tab[0].id);
					chrome.tabs.sendMessage(tab[0].id, {
						contetState: "AreYouReady?"
					}, function(response) {
						// 選択されているタブの contentscript.js からの返答を受ける
						// console.log("sendMessageの返信", response);
						//コンテンツがロードされたと確認できたら
						if (response.contetState == "OkGo!") {
							clearInterval(this_.setIntervalID);
							this_.dispatchEvent(new events.Event("ready"));
						}
					})
				});
			}, 10);
		}
	}

}
