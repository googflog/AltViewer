/// <reference path="module/jquery.d.ts" />
/// <reference path="module/ReadyCheck.ts" />

import PopReadyCheck = ReadyCheckModule.PopReadyCheck;

class PopUp {
    standby: boolean;
    pop_ready_check: PopReadyCheck = new PopReadyCheck(chrome);
    int: Int = new Int();
    constructor() {
		var this_ = this;
        this.standby = true;
        this.pop_ready_check.addEventListener("ready", function() {
            if (this_.standby) {
                console.log("Ready!");
                this_.standby = false;
                $(document).ready(() => {
                    this_.int.int();
                })
            }
        });
    }
}

class Int {
	constructor() {
	}
	int() {
		$("#Loading").fadeOut(200);
		// 選択されているタブに情報を送る
		chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
			console.log(tab[0])
			chrome.tabs.sendMessage(tab[0].id, {
				fromPopUp: "Open!"
			}, function(response) {
				console.log("@", response)
				//ボタン表示切り替え
				//Alt表示モードの場合
				if (response.ContentsShowAlt) {
					$("#Switch_Alt").addClass("close");
				} else {
					$("#Switch_Alt").removeClass("close");
				}
				//Meta表示モードの場合
				if (response.ContentsShowMeta) {
					$("#Switch_Title").addClass("close");
				} else {
					$("#Switch_Title").removeClass("close");
				}

			});
		});

		//ローカライズ化
		$("#Switch_Alt .switchBtn__ttl").html(chrome.i18n.getMessage("PopUp_ShowAltBtn"));
		$("#Switch_Title .switchBtn__ttl").html(chrome.i18n.getMessage("PopUp_ShowMetaBtn"));
		$("#Loading .loadingBlock__txt").html(chrome.i18n.getMessage("PopUp_Loading"));

		$("#Switch_Alt").on("click", function() {
			chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {
					fromPopUp: "Alt"
				}, function(response) {
          console.log(response)
					if (response.ContentsShowAlt == true) {
						$("#Switch_Alt").addClass("close");
					} else {
						$("#Switch_Alt").removeClass("close");
					}
				});
			});
		})

		$("#Switch_Title").on("click", function() {
			chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
				chrome.tabs.sendMessage(tab[0].id, {
					fromPopUp: "Meta"
				}, function(response) {
          console.log(response)
					if (response.ContentsShowMeta == true) {
						$("#Switch_Title").addClass("close");
					} else {
						$("#Switch_Title").removeClass("close");
					}
				});
			});
		});
	}
}

this.PopUp();
