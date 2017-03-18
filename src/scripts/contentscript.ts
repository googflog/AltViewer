/// <reference path="module/MetaView.ts" />
/// <reference path="module/AltView.ts" />
import MetaView = MetaViewModule.MetaView;
import AltView = AltViewModule.AltView;
class ContentScript {
    meta_view: MetaView = new MetaView();
    alt_view: AltView = new AltView();
    showAlt: boolean = false;
    showMeta: boolean = false;

    constructor() {
        chrome.runtime.onMessage.addListener(function(anymessage, sender, sendResponse) {

            /*
            *
            ポップアップが開いてメッセージを受けた
            *
            */
			if (anymessage.contetState == "AreYouReady?") {
                sendResponse({
                    contetState: "OkGo!"
                });
            }

            /*
            *
            Alt表示
            *
            */
            if (anymessage.fromPopUp == "Alt") {
                if (!this.showAlt) {
                    this.alt_view.show();
                } else {
                    this.alt_view.close();
                }
            }

            /*
            *
            メタ表示
            *
            */
            if (anymessage.fromPopUp == "Meta") {
                if (!this.showMeta) {
                    this.meta_view.show();
                } else {
                    this.meta_view.close();
                }
            }

            /*
            *
            POPUPにレスポンスを返す
            *
            */
            if (anymessage.fromPopUp == "Open!" || anymessage.fromPopUp == "Alt" || anymessage.fromPopUp == "Meta") {
                sendResponse({
                    ContentsShowAlt: this.showAlt,
                    ContentsShowMeta: this.showMeta
                });
            }

            return true;
        });
        var AltTitleView_012345 = {};
        var _this = this;
        this.alt_view.addEventListener("show", function(e) {
            if (e.value) {
                _this.showAlt = true;
            } else {
                _this.showAlt = false;
            }
        });

        this.meta_view.addEventListener("show", function(e) {
            if (e.value) {
                _this.showMeta = true;
            } else {
                _this.showMeta = false;
            }
        });

    }
}

this.ContentScript();
