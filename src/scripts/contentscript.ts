/// <reference path="module/MetaView.ts" />
/// <reference path="module/AltView.ts" />
import MetaView = MetaViewModule.MetaView;
import AltView = AltViewModule.AltView;
/**
 * ContentScript
 */
class ContentScript {
  meta_view: MetaView = new MetaView();
  alt_view: AltView = new AltView();
  showAlt: boolean = false;
  showMeta: boolean = false;

  constructor() {
    chrome.runtime.onMessage.addListener((anymessage, sender, sendResponse) => {
      //ポップアップが開いてメッセージを受けた
      if (anymessage.contetState == "AreYouReady?") {
        sendResponse({
          contetState: "OkGo!",
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

      //メタ表示
      if (anymessage.fromPopUp == "Meta") {
        if (!this.showMeta) {
          this.meta_view.show();
        } else {
          this.meta_view.close();
        }
      }

      //POPUPにレスポンスを返す
      console.log("anymessage.fromPopUp", anymessage, this.showAlt, this.showMeta);

      if (anymessage.fromPopUp == "Open!" || anymessage.fromPopUp == "Alt" || anymessage.fromPopUp == "Meta") {
        setTimeout(() => {
          sendResponse({
            ContentsShowAlt: this.showAlt,
            ContentsShowMeta: this.showMeta,
          });
        }, 10);
      }

      return true;
    });
    this.alt_view.addEventListener("show", (e) => {
      if (e.value) {
        this.showAlt = true;
      } else {
        this.showAlt = false;
      }
    });
    this.meta_view.addEventListener("show", (e) => {
      if (e.value) {
        this.showMeta = true;
      } else {
        this.showMeta = false;
      }
    });
  }

  test = (e) => {
    if (e.value) {
      this.showAlt = true;
    } else {
      this.showAlt = false;
    }
  };
}

this.ContentScript();
