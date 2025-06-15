var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var events;
(function (events) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.listeners = {};
        }
        EventDispatcher.prototype.dispatchEvent = function (event) {
            var e;
            var type;
            if (event instanceof Event) {
                type = event.type;
                e = event;
            }
            else {
                type = event;
                e = new Event(type);
            }
            if (this.listeners[type] != null) {
                e.currentTarget = this;
                for (var i = 0; i < this.listeners[type].length; i++) {
                    var listener = this.listeners[type][i];
                    try {
                        listener.handler(e);
                    }
                    catch (error) {
                        if (window.console) {
                            console.error(error.stack);
                        }
                    }
                }
            }
        };
        EventDispatcher.prototype.addEventListener = function (type, callback, priolity) {
            if (priolity === void 0) { priolity = 0; }
            if (this.listeners[type] == null) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(new EventListener(type, callback, priolity));
            this.listeners[type].sort(function (listener1, listener2) {
                return listener2.priolity - listener1.priolity;
            });
        };
        EventDispatcher.prototype.removeEventListener = function (type, callback) {
            if (this.hasEventListener(type, callback)) {
                for (var i = 0; i < this.listeners[type].length; i++) {
                    var listener = this.listeners[type][i];
                    if (listener.equalCurrentListener(type, callback)) {
                        listener.handler = null;
                        this.listeners[type].splice(i, 1);
                        return;
                    }
                }
            }
        };
        EventDispatcher.prototype.clearEventListener = function () {
            this.listeners = {};
        };
        EventDispatcher.prototype.containEventListener = function (type) {
            if (this.listeners[type] == null)
                return false;
            return this.listeners[type].length > 0;
        };
        EventDispatcher.prototype.hasEventListener = function (type, callback) {
            if (this.listeners[type] == null)
                return false;
            for (var i = 0; i < this.listeners[type].length; i++) {
                var listener = this.listeners[type][i];
                if (listener.equalCurrentListener(type, callback)) {
                    return true;
                }
            }
            return false;
        };
        return EventDispatcher;
    }());
    events.EventDispatcher = EventDispatcher;
    var EventListener = (function () {
        function EventListener(type, handler, priolity) {
            if (type === void 0) { type = null; }
            if (handler === void 0) { handler = null; }
            if (priolity === void 0) { priolity = 0; }
            this.type = type;
            this.handler = handler;
            this.priolity = priolity;
        }
        EventListener.prototype.equalCurrentListener = function (type, handler) {
            if (this.type == type && this.handler == handler) {
                return true;
            }
            return false;
        };
        return EventListener;
    }());
    var Event = (function () {
        function Event(type, value) {
            if (type === void 0) { type = null; }
            if (value === void 0) { value = null; }
            this.type = type;
            this.value = value;
        }
        return Event;
    }());
    Event.COMPLETE = "complete";
    Event.CHANGE_PROPERTY = "changeProperty";
    events.Event = Event;
})(events || (events = {}));
/// <reference path="EventDispathcer.ts"/>
/// <reference path="jquery.d.ts" />
var ReadyCheckModule;
(function (ReadyCheckModule) {
    //コンテンツがロードされて contentscript.js と情報をやり取りできるか調べる
    var PopReadyCheck = (function (_super) {
        __extends(PopReadyCheck, _super);
        function PopReadyCheck(chrome) {
            var _this = _super.call(this) || this;
            var this_ = _this;
            // 選択されているタブを調べる popup は開いても
            // contentscript.js はロード中で反応できない事があるので反応あるまで送り続ける
            _this.setIntervalID = setInterval(function () {
                // 選択されているタブに情報を送る
                chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
                    // console.log("選択されているタブID", tab[0].id);
                    chrome.tabs.sendMessage(tab[0].id, {
                        contetState: "AreYouReady?"
                    }, function (response) {
                        // 選択されているタブの contentscript.js からの返答を受ける
                        // console.log("sendMessageの返信", response);
                        //コンテンツがロードされたと確認できたら
                        if (response.contetState == "OkGo!") {
                            clearInterval(this_.setIntervalID);
                            this_.dispatchEvent(new events.Event("ready"));
                        }
                    });
                });
            }, 10);
            return _this;
        }
        return PopReadyCheck;
    }(events.EventDispatcher));
    ReadyCheckModule.PopReadyCheck = PopReadyCheck;
})(ReadyCheckModule || (ReadyCheckModule = {}));
/// <reference path="module/jquery.d.ts" />
/// <reference path="module/ReadyCheck.ts" />
var PopReadyCheck = ReadyCheckModule.PopReadyCheck;
var PopUp = (function () {
    function PopUp() {
        this.pop_ready_check = new PopReadyCheck(chrome);
        this.int = new Int();
        var this_ = this;
        this.standby = true;
        this.pop_ready_check.addEventListener("ready", function () {
            if (this_.standby) {
                // console.log("Ready!");
                this_.standby = false;
                $(document).ready(function () {
                    this_.int.int();
                });
            }
        });
    }
    return PopUp;
}());
var Int = (function () {
    function Int() {
    }
    Int.prototype.int = function () {
        $("#Loading").fadeOut(200);
        // 選択されているタブに情報を送る
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
            // console.log(tab[0])
            chrome.tabs.sendMessage(tab[0].id, {
                fromPopUp: "Open!"
            }, function (response) {
                // console.log("@", response)
                //ボタン表示切り替え
                //Alt表示モードの場合
                if (response.ContentsShowAlt) {
                    $("#Switch_Alt").addClass("close");
                }
                else {
                    $("#Switch_Alt").removeClass("close");
                }
                //Meta表示モードの場合
                if (response.ContentsShowMeta) {
                    $("#Switch_Title").addClass("close");
                }
                else {
                    $("#Switch_Title").removeClass("close");
                }
            });
        });
        //ローカライズ化
        $("#Switch_Alt .switchBtn__ttl").html(chrome.i18n.getMessage("PopUp_ShowAltBtn"));
        $("#Switch_Title .switchBtn__ttl").html(chrome.i18n.getMessage("PopUp_ShowMetaBtn"));
        $("#Loading .loadingBlock__txt").html(chrome.i18n.getMessage("PopUp_Loading"));
        $("#Switch_Alt").on("click", function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {
                    fromPopUp: "Alt"
                }, function (response) {
                    // console.log(response)
                    if (response.ContentsShowAlt == true) {
                        $("#Switch_Alt").addClass("close");
                    }
                    else {
                        $("#Switch_Alt").removeClass("close");
                    }
                });
            });
        });
        $("#Switch_Title").on("click", function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {
                    fromPopUp: "Meta"
                }, function (response) {
                    // console.log(response)
                    if (response.ContentsShowMeta == true) {
                        $("#Switch_Title").addClass("close");
                    }
                    else {
                        $("#Switch_Title").removeClass("close");
                    }
                });
            });
        });
    };
    return Int;
}());
this.PopUp();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zY3JpcHRzL21vZHVsZS9FdmVudERpc3BhdGhjZXIudHMiLCJzcmMvc2NyaXB0cy9tb2R1bGUvUmVhZHlDaGVjay50cyIsInNyYy9zY3JpcHRzL3BvcHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFPLE1BQU0sQ0E4Rlo7QUE5RkQsV0FBTyxNQUFNO0lBQ1o7UUFBQTtZQUNDLGNBQVMsR0FBTyxFQUFFLENBQUM7UUF1RXBCLENBQUM7UUF0RUEsdUNBQWEsR0FBYixVQUFjLEtBQVU7WUFDdkIsSUFBSSxDQUFPLENBQUM7WUFDWixJQUFJLElBQVksQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ2xCLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDWCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDYixDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUVELEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUEsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQztvQkFDNUQsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELElBQUksQ0FBQzt3QkFDSixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFD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Q0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3RDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDekMsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0YsVUFBQztBQUFELENBaEVBLEFBZ0VDLElBQUE7QUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMiLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgZXZlbnRzIHtcblx0ZXhwb3J0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XG5cdFx0bGlzdGVuZXJzOmFueSA9IHt9O1xuXHRcdGRpc3BhdGNoRXZlbnQoZXZlbnQ6IGFueSk6IHZvaWQge1xuXHRcdFx0dmFyIGU6RXZlbnQ7XG5cdFx0XHR2YXIgdHlwZTogc3RyaW5nO1xuXHRcdFx0aWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcblx0XHRcdFx0dHlwZSA9IGV2ZW50LnR5cGU7XG5cdFx0XHRcdGUgPSBldmVudDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHR5cGUgPSBldmVudDtcblx0XHRcdFx0ZSA9IG5ldyBFdmVudCh0eXBlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYodGhpcy5saXN0ZW5lcnNbdHlwZV0gIT0gbnVsbCl7XG5cdFx0XHRcdGUuY3VycmVudFRhcmdldCA9IHRoaXM7XG5cdFx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHR2YXIgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmhhbmRsZXIoZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRpZiAod2luZG93LmNvbnNvbGUpIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yLnN0YWNrKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgcHJpb2xpdHk6IG51bWJlciA9IDApOiB2b2lkIHtcblx0XHRcdGlmKHRoaXMubGlzdGVuZXJzW3R5cGVdID09IG51bGwpe1xuXHRcdFx0XHR0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IFtdO1xuXHRcdFx0fVxuXG5cblx0XHRcdHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2gobmV3IEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIHByaW9saXR5KSk7XG5cdFx0XHR0aGlzLmxpc3RlbmVyc1t0eXBlXS5zb3J0KGZ1bmN0aW9uIChsaXN0ZW5lcjE6RXZlbnRMaXN0ZW5lciwgbGlzdGVuZXIyOkV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdFx0cmV0dXJuIGxpc3RlbmVyMi5wcmlvbGl0eSAtIGxpc3RlbmVyMS5wcmlvbGl0eTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTpzdHJpbmcsIGNhbGxiYWNrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRcdGlmKHRoaXMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaykpIHtcblx0XHRcdFx0Zm9yKHZhciBpOm51bWJlcj0wOyBpIDwgdGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHZhciBsaXN0ZW5lcjpFdmVudExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnNbdHlwZV1baV07XG5cdFx0XHRcdFx0aWYobGlzdGVuZXIuZXF1YWxDdXJyZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2spKSB7XG5cdFx0XHRcdFx0XHRsaXN0ZW5lci5oYW5kbGVyID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMubGlzdGVuZXJzW3R5cGVdLnNwbGljZShpLDEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNsZWFyRXZlbnRMaXN0ZW5lcigpOiB2b2lkIHtcblx0XHRcdHRoaXMubGlzdGVuZXJzID0ge307XG5cdFx0fVxuXG5cdFx0Y29udGFpbkV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0XHRpZiAodGhpcy5saXN0ZW5lcnNbdHlwZV0gPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIHRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aCA+IDA7XG5cdFx0fVxuXG5cdFx0aGFzRXZlbnRMaXN0ZW5lcih0eXBlOnN0cmluZywgY2FsbGJhY2s6RnVuY3Rpb24pOmJvb2xlYW4ge1xuXHRcdFx0aWYodGhpcy5saXN0ZW5lcnNbdHlwZV0gPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0Zm9yKHZhciBpOm51bWJlcj0wOyBpIDwgdGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHR2YXIgbGlzdGVuZXI6RXZlbnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO1xuXHRcdFx0XHRpZihsaXN0ZW5lci5lcXVhbEN1cnJlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaykpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGNsYXNzIEV2ZW50TGlzdGVuZXIge1xuXHRcdGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcgPSBudWxsLCBwdWJsaWMgaGFuZGxlcjogRnVuY3Rpb24gPSBudWxsLCBwdWJsaWMgcHJpb2xpdHk6IG51bWJlciA9IDApIHtcblx0XHR9XG5cdFx0ZXF1YWxDdXJyZW50TGlzdGVuZXIodHlwZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuXHRcdFx0aWYgKHRoaXMudHlwZSA9PSB0eXBlICYmIHRoaXMuaGFuZGxlciA9PSBoYW5kbGVyKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50IHtcbiAgICAgICAgY3VycmVudFRhcmdldDphbnk7XG4gICAgICAgIHN0YXRpYyBDT01QTEVURTogc3RyaW5nID0gXCJjb21wbGV0ZVwiO1xuICAgICAgICBzdGF0aWMgQ0hBTkdFX1BST1BFUlRZOnN0cmluZyA9XCJjaGFuZ2VQcm9wZXJ0eVwiO1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nID0gbnVsbCwgcHVibGljIHZhbHVlOiBhbnkgPSBudWxsKSB7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudERpc3BhdGhjZXIudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianF1ZXJ5LmQudHNcIiAvPlxuXG5tb2R1bGUgUmVhZHlDaGVja01vZHVsZSB7XG5cblx0Ly/jgrPjg7Pjg4bjg7Pjg4TjgYzjg63jg7zjg4njgZXjgozjgaYgY29udGVudHNjcmlwdC5qcyDjgajmg4XloLHjgpLjgoTjgorlj5bjgorjgafjgY3jgovjgYvoqr/jgbnjgotcblx0ZXhwb3J0IGNsYXNzIFBvcFJlYWR5Q2hlY2sgZXh0ZW5kcyBldmVudHMuRXZlbnREaXNwYXRjaGVyIHtcblx0XHRjaHJvbWU6IG9iamVjdDtcblx0XHRzZXRJbnRlcnZhbElEOiBudW1iZXI7XG5cdFx0Y29uc3RydWN0b3IoY2hyb21lOiBvYmplY3QpIHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXG5cdFx0XHQvLyDpgbjmip7jgZXjgozjgabjgYTjgovjgr/jg5bjgpLoqr/jgbnjgosgcG9wdXAg44Gv6ZaL44GE44Gm44KCXG5cdFx0XHQvLyBjb250ZW50c2NyaXB0LmpzIOOBr+ODreODvOODieS4reOBp+WPjeW/nOOBp+OBjeOBquOBhOS6i+OBjOOBguOCi+OBruOBp+WPjeW/nOOBguOCi+OBvuOBp+mAgeOCiue2muOBkeOCi1xuXHRcdFx0dGhpcy5zZXRJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8g6YG45oqe44GV44KM44Gm44GE44KL44K/44OW44Gr5oOF5aCx44KS6YCB44KLXG5cdFx0XHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYikge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwi6YG45oqe44GV44KM44Gm44GE44KL44K/44OWSURcIiwgdGFiWzBdLmlkKTtcblx0XHRcdFx0XHRjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJbMF0uaWQsIHtcblx0XHRcdFx0XHRcdGNvbnRldFN0YXRlOiBcIkFyZVlvdVJlYWR5P1wiXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdC8vIOmBuOaKnuOBleOCjOOBpuOBhOOCi+OCv+ODluOBriBjb250ZW50c2NyaXB0LmpzIOOBi+OCieOBrui/lOetlOOCkuWPl+OBkeOCi1xuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJzZW5kTWVzc2FnZeOBrui/lOS/oVwiLCByZXNwb25zZSk7XG5cdFx0XHRcdFx0XHQvL+OCs+ODs+ODhuODs+ODhOOBjOODreODvOODieOBleOCjOOBn+OBqOeiuuiqjeOBp+OBjeOBn+OCiVxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlLmNvbnRldFN0YXRlID09IFwiT2tHbyFcIikge1xuXHRcdFx0XHRcdFx0XHRjbGVhckludGVydmFsKHRoaXNfLnNldEludGVydmFsSUQpO1xuXHRcdFx0XHRcdFx0XHR0aGlzXy5kaXNwYXRjaEV2ZW50KG5ldyBldmVudHMuRXZlbnQoXCJyZWFkeVwiKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCAxMCk7XG5cdFx0fVxuXHR9XG5cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtb2R1bGUvanF1ZXJ5LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1vZHVsZS9SZWFkeUNoZWNrLnRzXCIgLz5cblxuaW1wb3J0IFBvcFJlYWR5Q2hlY2sgPSBSZWFkeUNoZWNrTW9kdWxlLlBvcFJlYWR5Q2hlY2s7XG5cbmNsYXNzIFBvcFVwIHtcbiAgICBzdGFuZGJ5OiBib29sZWFuO1xuICAgIHBvcF9yZWFkeV9jaGVjazogUG9wUmVhZHlDaGVjayA9IG5ldyBQb3BSZWFkeUNoZWNrKGNocm9tZSk7XG4gICAgaW50OiBJbnQgPSBuZXcgSW50KCk7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cdFx0dmFyIHRoaXNfID0gdGhpcztcbiAgICAgICAgdGhpcy5zdGFuZGJ5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wb3BfcmVhZHlfY2hlY2suYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXNfLnN0YW5kYnkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlYWR5IVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzXy5zdGFuZGJ5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzXy5pbnQuaW50KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIEludCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHR9XG5cdGludCgpIHtcblx0XHQkKFwiI0xvYWRpbmdcIikuZmFkZU91dCgyMDApO1xuXHRcdC8vIOmBuOaKnuOBleOCjOOBpuOBhOOCi+OCv+ODluOBq+aDheWgseOCkumAgeOCi1xuXHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYikge1xuXHRcdFx0Ly8gY29uc29sZS5sb2codGFiWzBdKVxuXHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiWzBdLmlkLCB7XG5cdFx0XHRcdGZyb21Qb3BVcDogXCJPcGVuIVwiXG5cdFx0XHR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkBcIiwgcmVzcG9uc2UpXG5cdFx0XHRcdC8v44Oc44K/44Oz6KGo56S65YiH44KK5pu/44GIXG5cdFx0XHRcdC8vQWx06KGo56S644Oi44O844OJ44Gu5aC05ZCIXG5cdFx0XHRcdGlmIChyZXNwb25zZS5Db250ZW50c1Nob3dBbHQpIHtcblx0XHRcdFx0XHQkKFwiI1N3aXRjaF9BbHRcIikuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKFwiI1N3aXRjaF9BbHRcIikucmVtb3ZlQ2xhc3MoXCJjbG9zZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL01ldGHooajnpLrjg6Ljg7zjg4njga7loLTlkIhcblx0XHRcdFx0aWYgKHJlc3BvbnNlLkNvbnRlbnRzU2hvd01ldGEpIHtcblx0XHRcdFx0XHQkKFwiI1N3aXRjaF9UaXRsZVwiKS5hZGRDbGFzcyhcImNsb3NlXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoXCIjU3dpdGNoX1RpdGxlXCIpLnJlbW92ZUNsYXNzKFwiY2xvc2VcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvL+ODreODvOOCq+ODqeOCpOOCuuWMllxuXHRcdCQoXCIjU3dpdGNoX0FsdCAuc3dpdGNoQnRuX190dGxcIikuaHRtbChjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKFwiUG9wVXBfU2hvd0FsdEJ0blwiKSk7XG5cdFx0JChcIiNTd2l0Y2hfVGl0bGUgLnN3aXRjaEJ0bl9fdHRsXCIpLmh0bWwoY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShcIlBvcFVwX1Nob3dNZXRhQnRuXCIpKTtcblx0XHQkKFwiI0xvYWRpbmcgLmxvYWRpbmdCbG9ja19fdHh0XCIpLmh0bWwoY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShcIlBvcFVwX0xvYWRpbmdcIikpO1xuXG5cdFx0JChcIiNTd2l0Y2hfQWx0XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbih0YWIpIHtcblx0XHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiWzBdLmlkLCB7XG5cdFx0XHRcdFx0ZnJvbVBvcFVwOiBcIkFsdFwiXG5cdFx0XHRcdH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLkNvbnRlbnRzU2hvd0FsdCA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHQkKFwiI1N3aXRjaF9BbHRcIikuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JChcIiNTd2l0Y2hfQWx0XCIpLnJlbW92ZUNsYXNzKFwiY2xvc2VcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pXG5cblx0XHQkKFwiI1N3aXRjaF9UaXRsZVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgZnVuY3Rpb24odGFiKSB7XG5cdFx0XHRcdGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYlswXS5pZCwge1xuXHRcdFx0XHRcdGZyb21Qb3BVcDogXCJNZXRhXCJcblx0XHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UuQ29udGVudHNTaG93TWV0YSA9PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHQkKFwiI1N3aXRjaF9UaXRsZVwiKS5hZGRDbGFzcyhcImNsb3NlXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkKFwiI1N3aXRjaF9UaXRsZVwiKS5yZW1vdmVDbGFzcyhcImNsb3NlXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufVxuXG50aGlzLlBvcFVwKCk7XG4iXX0=
