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
var MetaViewModule;
(function (MetaViewModule) {
    var MetaView = (function (_super) {
        __extends(MetaView, _super);
        function MetaView() {
            return _super.call(this) || this;
        }
        MetaView.prototype.show = function () {
            var this_ = this;
            this.dispatchEvent(new events.Event("show", true));
            $("html").addClass('TitleView_012345_show');
            //Metaの表示エリアを追加する
            this.ObjMetaViewWrapBlock = $("<div id='TitleView_012345' class='TitleView012345_Box'></div>");
            $("body").append(this.ObjMetaViewWrapBlock);
            this.ObjMetaViewBlock = $("<div class='TitleView012345_Objs'></div>");
            $(this.ObjMetaViewWrapBlock).append(this.ObjMetaViewBlock);
            this.ObjMetaViewContent = $("<div id='TitleView_Contents_012345' class='TitleView012345_Contents'></div>");
            this.ObjMetaViewBlock.append(this.ObjMetaViewContent);
            this.ObjMetaViewContent.append("<h3 class='TitleView012345_Contents__ttl'>Title: " + $("head title").text() + "</h3>");
            this.ObjMetaViewContent.append("<hr class='TitleView012345_Contents__hr'>");
            this.ObjMetaViewContent.append("<h3 class='TitleView012345_Contents__ttl'>Meta:</h3>");
            //Metaを調べる
            $("head meta").each(function () {
                var meta = "";
                var imgis = 0;
                var img = "";
                var imgpath = "";
                for (var j = 0; j < $(this).context.attributes.length; j++) {
                    var name = $(this).context.attributes[j].nodeName;
                    var val = $(this).context.attributes[j].nodeValue;
                    var _val = $(this).context.attributes[j].nodeValue;
                    if (0 <= val.indexOf("http")) {
                        //URLか？
                        _val = "<a class='TitleView012345_Contents__metas__a' href='" + val.toString() + "' target='_blank'>" + val.toString() + "</a>";
                    }
                    if (0 <= val.toLowerCase().indexOf("image")) {
                        //画像か？
                        imgis++;
                    }
                    if (0 <= val.toLowerCase().indexOf("http")) {
                        //画像か？
                        imgis++;
                        imgpath = val;
                    }
                    meta += name + ' = &quot;<span class="TitleView012345_Contents__metas__span">' + _val + '</span>&quot; ';
                    if (2 <= imgis) {
                        img = "<div class='TitleView012345_Contents__metas__img'><a class='TitleView012345_Contents__metas__a' href=" + imgpath + " target='_blank'><img src=" + imgpath + " width=150 ></a></div>";
                    }
                }
                ;
                if (2 <= imgis) {
                    meta += img;
                }
                this_.ObjMetaViewContent.append("<div class='TitleView012345_Contents__metas'>" + meta + "</div>");
            });
            //閉じるボタン
            this.ObjMetaViewBlock.prepend("<div id='TitleView_closebtn_head_012345' class='TitleView012345_HeadCloseBtn'><img src='" + chrome.runtime.getURL("images/close_w.svg") + "' width='45'></div>");
            this.ObjMetaViewBlock.append("<div id='TitleView_closebtn_012345' class='TitleView012345_CloseBtn'><img src='" + chrome.runtime.getURL("images/close_w.svg") + "' width='45'><div> CLOSE</div></div>");
            //Meta一覧表示
            var titleview_012345_time;
            this.ObjMetaViewWrapBlock.css({ "top": -this.ObjMetaViewWrapBlock.outerHeight() - 100 });
            this.ObjMetaViewWrapBlock.addClass("transition_mode");
            titleview_012345_time = setTimeout(function () {
                this_.ObjMetaViewWrapBlock.css({ "top": 0 }).one('webkitTransitionEnd', function () {
                    $(this).addClass("active");
                    $("#TitleView_closebtn_head_012345, #TitleView_closebtn_012345").addClass("active");
                });
                this_.fResizeTitleView();
            }, 200);
            //閉じるボタンを押した際
            $("#TitleView_closebtn_012345, #TitleView_closebtn_head_012345, html").on("click", function (e) {
                $("#TitleView_closebtn_head_012345, #TitleView_closebtn_012345").removeClass("active");
                this_.close();
            });
            //バブリング停止
            this.ObjMetaViewWrapBlock.on("click", function (e) {
                e.stopPropagation();
            });
            //リサイズ
            var resizeTime = 0;
            $(window).on('resize.TitleView_012345', function (event) {
                if (resizeTime !== 0) {
                    clearTimeout(resizeTime);
                }
                resizeTime = setTimeout(function () {
                    this_.fResizeTitleView();
                }, 200);
            });
        };
        //リサイズ
        MetaView.prototype.fResizeTitleView = function () {
            // if ($(window).height() < this.ObjMetaViewContent.outerHeight() + $("#TitleView_closebtn_012345").height()) {
            //     this.ObjMetaViewWrapBlock.height($(window).height());
            // } else {
            //     this.ObjMetaViewWrapBlock.height(this.ObjMetaViewContent.height() + $("#TitleView_closebtn_012345").height() + 150);
            // };
        };
        //
        MetaView.prototype.close = function () {
            var this_ = this;
            if (this.ObjMetaViewWrapBlock.hasClass("active")) {
                this.dispatchEvent(new events.Event("show", false));
                this.ObjMetaViewWrapBlock.css({ top: -this.ObjMetaViewWrapBlock.height() - 20 }).one('webkitTransitionEnd', function () {
                    this_.ObjMetaViewWrapBlock.remove();
                    $(window).off('resize.TitleView_012345');
                    $("html").removeClass('TitleView_012345_show');
                });
            }
        };
        return MetaView;
    }(events.EventDispatcher));
    MetaViewModule.MetaView = MetaView;
})(MetaViewModule || (MetaViewModule = {}));
/// <reference path="EventDispathcer.ts"/>
/// <reference path="jquery.d.ts" />
var AltViewModule;
(function (AltViewModule) {
    var AltView = (function (_super) {
        __extends(AltView, _super);
        function AltView() {
            var _this = _super.call(this) || this;
            _this.ObjAltViewBlock = {};
            _this.ObjAltViewContent = {};
            _this.AltTitleView_012345 = {};
            _this.checkbox = {};
            _this.alt_nashi = 0;
            _this.title_nashi = 0;
            _this.show = function () {
                var this_ = _this;
                _this.getOptions();
                _this.showMove();
            };
            _this.getOptions = function () {
                var this_ = _this;
                var defaults = {
                    alt_checkbox: true,
                    title_checkbox: false,
                    size_checkbox: true,
                    path_checkbox: false,
                    extension_checkbox: false,
                    console_checkbox: true,
                    noAltList_checkbox: true,
                    altFukidashiClose_checkbox: true
                };
                chrome.storage.sync.get(defaults, function (items) {
                    this_.checkbox = items;
                });
            };
            _this.showMove = function () {
                var this_ = _this;
                var checkbox = _this.checkbox;
                _this.dispatchEvent(new events.Event("show", true));
                //ツールチップの表示エリアを追加する
                _this.ObjAltViewBlock = null;
                _this.ObjAltViewBlock = $("<div id='AltView_012345'></div>");
                $("body").append(_this.ObjAltViewBlock);
                _this.ObjAltViewContent = null;
                _this.ObjAltViewContent = $("<div id='AltView_wrap'></div>");
                _this.ObjAltViewBlock.append(_this.ObjAltViewContent);
                //
                _this.AltTitleView_012345.AltData = [];
                //ページ上の画像のデータを調べる
                $("img").each(function (index, element) {
                    var obj = this_.getImgTagData(index, $(element));
                    this_.AltTitleView_012345.AltData.push(obj);
                });
                //Alt無しの数
                _this.noAltCount(_this.AltTitleView_012345.AltData);
                /*
                *
                * 収集したデータを基にツールチップを追加
                *
                */
                for (var i = 0; i < _this.AltTitleView_012345.AltData.length; i++) {
                    var TipData = "";
                    //閉じるボタン
                    TipData += _this.addCloseBtn(_this.AltTitleView_012345.AltData[i]);
                    //alt と title
                    if (checkbox.alt_checkbox && checkbox.title_checkbox) {
                        TipData += _this.addAltTitle(_this.AltTitleView_012345.AltData[i], true, true);
                    }
                    else if (checkbox.alt_checkbox) {
                        TipData += _this.addAltTitle(_this.AltTitleView_012345.AltData[i], true, false);
                    }
                    else if (checkbox.title_checkbox) {
                        TipData += _this.addAltTitle(_this.AltTitleView_012345.AltData[i], false, true);
                    }
                    //ImgSize
                    if (checkbox.size_checkbox) {
                        TipData += _this.addImgSize(_this.AltTitleView_012345.AltData[i]);
                        //Naturalサイズと違う場合表示
                        TipData += _this.addImgNaturalSize(_this.AltTitleView_012345.AltData[i]);
                    }
                    //画像パス
                    if (checkbox.path_checkbox) {
                        TipData += _this.addImgSrc(_this.AltTitleView_012345.AltData[i]);
                    }
                    //拡張子
                    if (checkbox.extension_checkbox) {
                        // TipData += this.addImgExtension(this.AltTitleView_012345.AltData[i]);
                    }
                    //ツールチップを表示エリアに追加する
                    var tipObj = _this.addTooltip(_this.AltTitleView_012345.AltData[i], TipData);
                    // 表示情報が無い場合吹き出しださない
                    if (checkbox.alt_checkbox || checkbox.title_checkbox || checkbox.size_checkbox || checkbox.path_checkbox || checkbox.extension_checkbox) {
                        $("#AltView_wrap").append(tipObj);
                    }
                    // if (checkbox.extension_checkbox || checkbox.extension_checkbox) {
                    // 	$("#AltView_wrap .Tip .txt").addClass("longtxt")
                    // }
                }
                //ツイールチップの吹き出しの方向
                _this.fukidashiCSS();
                //ツールチップマウスオーバー時
                $("#AltView_wrap div.Tip").mouseover(function () {
                    var thisObj = $(this);
                    var id = thisObj.attr("data");
                    this_.AltTitleView_012345.AltData[id].img_path.addClass('AltView_012345_Tip_show');
                    thisObj.css("z-index", 99999);
                    $("#AltView_wrap div.Tip").not(thisObj).hide();
                    thisObj.show();
                });
                $("#AltView_wrap div.Tip").mouseout(function () {
                    var thisObj = $(this);
                    var id = thisObj.attr("data");
                    this_.AltTitleView_012345.AltData[id].img_path.removeClass('AltView_012345_Tip_show');
                    thisObj.css("z-index", 99998);
                    $("#AltView_wrap div.Tip").show();
                });
                $("#AltView_wrap div.Tip .closeBtn").on("click.Tip", function () {
                    var thisObj = $(this);
                    var id = thisObj.attr("data");
                    var imgObj = this_.AltTitleView_012345.AltData[id].img_path;
                    imgObj.removeClass('AltView_012345_Tip_show');
                    imgObj.removeAttr('alt_view_tip');
                    this_.ImageAction(imgObj, false);
                    $("#alt_view_tip_" + id).remove();
                    // delete this_.AltTitleView_012345.AltData[id];
                    $(this).off("click.Tip");
                    $("#AltView_wrap div.Tip").show();
                });
                //Alt数
                // this.noAltCount(this.AltTitleView_012345.AltData);
                //Alt無しの数をconsoleに表示
                if (checkbox.console_checkbox) {
                    _this.noAltShowConsoleLog();
                    _this.noTitleShowConsoleLog();
                }
                /*
                *
                * Alt無しリスト
                *
                */
                _this.addNoAltList(checkbox.noAltList_checkbox, checkbox.alt_checkbox, checkbox.title_checkbox, checkbox.altFukidashiClose_checkbox);
                //
                _this.fResizeTitleView();
            };
            //ローカライズ化
            var this_ = _this;
            _this.Alt_Fukidashi_txt = chrome.i18n.getMessage("Alt_Fukidashi_txt");
            _this.Alt_List_txt1 = chrome.i18n.getMessage("Alt_List_txt1");
            _this.Alt_List_txt2 = chrome.i18n.getMessage("Alt_List_txt2");
            _this.Alt_List_txt3 = chrome.i18n.getMessage("Alt_List_txt3");
            _this.Alt_List_txt4 = chrome.i18n.getMessage("Alt_List_txt4");
            _this.Alt_List_txt5 = chrome.i18n.getMessage("Alt_List_txt5");
            _this.Alt_List_txt6 = chrome.i18n.getMessage("Alt_List_txt6");
            _this.Alt_List_txt7 = chrome.i18n.getMessage("Alt_List_txt7");
            _this.getOptions();
            return _this;
        }
        //ツールチップを追加
        AltView.prototype.addTooltip = function (data, tipData) {
            //Tipに表示されるデータをまとめる
            var Tip = $("<div id='alt_view_tip_" + data.id + "' class='Tip Tip-" + data.id + "' data='" + data.id + "'><div class='txt'>" + tipData + "</div></div>");
            //
            if (data.width != data.width_natural && data.width_attr != data.width_natural) {
                Tip.find(".w").removeClass("set").addClass("noset");
            }
            if (data.height != data.height_natural && data.height_attr != data.height_natural) {
                Tip.find(".h").removeClass("set").addClass("noset");
            }
            //なにもセットされていない…
            if (!data.alt && !data.title) {
                Tip.addClass("no-set");
            }
            //Tipの位置を設定
            Tip.css({ "top": data.top, "left": data.left, "max-width": data.width < 200 ? 200 : data.width, "display": "none" });
            //吹き出しの位置を設定
            Tip.find(".fuki").css("margin-left", 10);
            data.fpath = Tip;
            return Tip;
        };
        AltView.prototype.addAltTitle = function (data, showAlt, showTitle) {
            var _tipData = "";
            //AltとTitle
            if (showAlt && showTitle && data.alt == data.title && data.alt != null && data.title != null) {
                _tipData += "<div class='txt__line'><span class='txt__lineHead'>Alt,Title</span><div class='txt__lineBody'><span class='at'>" + data.alt + "</span></div></div>";
            }
            else {
                var altTxt = "";
                var altNoSet = "";
                if (showAlt) {
                    if (data.alt) {
                        altTxt = data.alt;
                        altNoSet = "";
                    }
                    else {
                        altTxt = this.Alt_Fukidashi_txt;
                        altNoSet = "noset";
                    }
                }
                var titleTxt = "";
                var titleNoSet = "";
                if (showTitle) {
                    if (data.title) {
                        titleTxt = data.title;
                        titleNoSet = "";
                    }
                    else {
                        titleTxt = this.Alt_Fukidashi_txt;
                        titleNoSet = "noset";
                    }
                }
                if (showAlt && showTitle && data.alt != data.title) {
                    altNoSet = "noset";
                    titleNoSet = "noset";
                }
                if (showAlt) {
                    _tipData += "<div class='txt__line'><span class='txt__lineHead'>Alt</span><div class='txt__lineBody'><span class='at " + altNoSet + "'>" + altTxt + "</span></div></div>";
                }
                if (showTitle) {
                    _tipData += "<div class='txt__line'><span class='txt__lineHead'>Title</span><div class='txt__lineBody'><span class='at " + titleNoSet + "'>" + titleTxt + "</span></div></div>";
                }
            }
            return _tipData;
        };
        //閉じるボタン
        AltView.prototype.addCloseBtn = function (data) {
            return '<div class="closeBtn" data="' + data.id + '"><img src="' + chrome.runtime.getURL("images/close.svg") + '" alt="CloseBtn" width="8"></div>';
        };
        //画像サイズを追加
        AltView.prototype.addImgSize = function (data) {
            var _tipData = "<div class='txt__line'>" + "<span class='txt__lineHead'>ImgSize</span><div class='txt__lineBody'>";
            if (data.width_attr && data.height_attr) {
                //画像サイズが設定されている
                _tipData += "<span class='at w'>" + data.width_attr + "</span><span class='x'>x</span><span class='at h'>" + data.height_attr + "</span><span class='px'>px</span>";
            }
            else {
                //画像サイズが設定されていない場合
                if (!data.width_attr && !data.height_attr) {
                    _tipData += "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>";
                }
                else {
                    if (data.width_attr) {
                        _tipData += "<span class='at w'>" + data.width_attr + "</span><span class='x'>x</span>";
                    }
                    else {
                        _tipData += "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span><span class='x'>x</span>";
                    }
                    if (data.height_attr) {
                        _tipData += "<span class='at h'>" + data.height_attr + "</span><span class='px'>px</span>";
                    }
                    else {
                        _tipData += "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>";
                    }
                }
            }
            _tipData += "</div></div>";
            return _tipData;
        };
        //ナチュラルサイズを追加
        AltView.prototype.addImgNaturalSize = function (data) {
            var _tipData = "<div class='txt__line'>" + "<span class='txt__lineHead'>Natural</span><div class='txt__lineBody'>";
            if (data.width != data.width_natural || data.height != data.height_natural || (!data.width_attr && !data.height_attr)) {
                _tipData += "<span class='set'>" + data.width_natural + "</span><span class='x'>x</span><span class='set'>" + data.height_natural + "</span><span class='px'>px</span></div></div>";
                return _tipData;
            }
            else {
                return "";
            }
        };
        //画像パス
        AltView.prototype.addImgSrc = function (data) {
            var _tipData = "<div class='txt__line'>" + "<span class='txt__lineHead'>Src</span><div class='txt__lineBody'>";
            _tipData += "<a href='" + data.src + "' target='_blank'>" + data.src + "</a></span></div></div>";
            return _tipData;
        };
        //拡張子
        AltView.prototype.addImgExtension = function (data) {
            var _tipData = "<div class='txt__line'>" + "<span class='txt__lineHead'>Extension</span><div class='txt__lineBody'>";
            if (data.extension) {
                _tipData += "<span class='exten'>" + data.extension + "</span></div></div>";
            }
            else {
                _tipData += "<span class='noset'> ? </span></div></div>";
            }
            return _tipData;
        };
        //Altなしの数
        AltView.prototype.noAltCount = function (data) {
            var _alt_nashi = 0;
            var _title_nashi = 0;
            for (var i = 0; i < data.length; i++) {
                if (!data[i].alt) {
                    _alt_nashi++;
                }
                if (!data[i].title) {
                    _title_nashi++;
                }
            }
            this.alt_nashi = _alt_nashi;
            this.title_nashi = _title_nashi;
        };
        //Altなしの数を console.log に表示
        AltView.prototype.noAltShowConsoleLog = function () {
            // console.log("%cAlt & Meta viewer %cver " + chrome.runtime.getManifest().version, 'padding:0.3em 1em; background: #f87a00; color:white; font-size: 11px;', 'background: #ccc; padding:0.3em 0.5em; font-size: 11px;');
            console.log("%cAlt & Meta viewer", 'padding:0.3em 1em; background: #f87a00; color:white; font-size: 11px;');
            console.log("Alt なし : %c" + this.alt_nashi + "%c 個", 'font-size: 10px; font-weight: bold;', '');
        };
        AltView.prototype.noTitleShowConsoleLog = function () {
            console.log("Title なし : %c" + this.title_nashi + "%c 個", 'font-size: 10px; font-weight: bold;', '');
        };
        //
        AltView.prototype.addNoAltList = function (altlistbtn, alt_show, title_show, closebtn) {
            var this_ = this;
            //無しカウント
            var noCountVal = 0;
            //リスト作成
            var ulObj = $("<ul class='altViewNoAltUlBlock'></ul>");
            for (var i = 0; i < this.AltTitleView_012345.AltData.length; i++) {
                var listObj;
                if (alt_show && !title_show) {
                    //Alt なし
                    if (!this.AltTitleView_012345.AltData[i].alt) {
                        listObj = this.addNoAltListObj(this.AltTitleView_012345.AltData[i]);
                        noCountVal++;
                    }
                }
                else if (title_show && !alt_show) {
                    //Title なし
                    if (!this.AltTitleView_012345.AltData[i].title) {
                        listObj = this.addNoAltListObj(this.AltTitleView_012345.AltData[i]);
                        noCountVal++;
                    }
                }
                else if (alt_show && title_show) {
                    //Alt または Title なし
                    if (!this.AltTitleView_012345.AltData[i].alt || !this.AltTitleView_012345.AltData[i].title) {
                        listObj = this.addNoAltListObj(this.AltTitleView_012345.AltData[i]);
                        noCountVal++;
                    }
                }
                ulObj.append(listObj);
            }
            var ListTabTxt = "";
            var ListTabOrder = this.Alt_List_txt1;
            if (0 < noCountVal) {
                if (alt_show && !title_show) {
                    ListTabTxt = this.Alt_List_txt2;
                }
                else if (title_show && !alt_show) {
                    ListTabTxt = this.Alt_List_txt3;
                }
                else if (alt_show && title_show) {
                    ListTabTxt = this.Alt_List_txt4;
                }
            }
            else {
                if (alt_show && !title_show) {
                    ListTabTxt = this.Alt_List_txt5;
                }
                else if (title_show && !alt_show) {
                    ListTabTxt = this.Alt_List_txt6;
                }
                else if (alt_show && title_show) {
                    ListTabTxt = this.Alt_List_txt7;
                }
            }
            if (0 < noCountVal) {
                //Alt無い画像があった場合
                $("html").prepend("<div id='AltView_NoAlt_Wrap' class='load'>" +
                    "<div id='AltView_NoAlt_Result_Wrap'></div>" +
                    "<a href='#' id='AltView_NoAlt_head_closeAltBtn'>" +
                    "<img src='" + chrome.runtime.getURL("images/close_w.svg") + "' alt='CloseBtn' width='35'>" +
                    "</a>" +
                    "<a href='#' class='altViewNoAltHeadCloseBtn'>" +
                    "<img class='arrow' src='" + chrome.runtime.getURL("images/arrow.svg") + "' alt='' width='35'>" +
                    "<p class='altViewNoAltHeadCloseBtn__txt'>" + ListTabTxt + "<span>" + noCountVal + "</span>" + ListTabOrder + "</p></a>" +
                    "</div>");
                $(".altViewNoAltHeadCloseBtn").on("click", function (e) {
                    e.preventDefault();
                    $("#AltView_NoAlt_Wrap").toggleClass("active");
                });
                $("body").on("click", function (e) {
                    $("#AltView_NoAlt_Wrap").removeClass("active");
                });
            }
            else {
                //Alt完璧の場合
                $("html").prepend("<div id='AltView_NoAlt_Wrap' class='load'>" +
                    "<div id='AltView_NoAlt_Result_Wrap'></div>" +
                    "<a href='#' id='AltView_NoAlt_head_closeAltBtn'>" +
                    "<img src='" + chrome.runtime.getURL("images/close_w.svg") + "' alt='CloseBtn' width='35'>" +
                    "</a>" +
                    "<a href='#' class='altViewNoAltHeadCloseBtn altViewNoAltHeadCloseBtn-perfect'>" +
                    "<p class='altViewNoAltHeadCloseBtn__txt'>" + ListTabTxt + "</p></a>" +
                    "</div>");
                $(".altViewNoAltHeadCloseBtn").on("click", function (e) {
                    e.preventDefault();
                    $(this).css("margin-top", -50);
                });
            }
            //リスト追加
            $("#AltView_NoAlt_Result_Wrap").append(ulObj);
            //にょっきり
            setTimeout(function () { $("#AltView_NoAlt_Wrap").removeClass("load"); }, 500);
            //閉じるボタン
            $("#AltView_NoAlt_head_closeAltBtn").on("click", function (e) {
                e.preventDefault();
                this_.close();
            });
            //ALTリストを非表示に設定している場合
            if (!altlistbtn || (!alt_show && !title_show)) {
                $(".altViewNoAltHeadCloseBtn").remove();
            }
            //閉じるボタンを非表示に設定している場合
            if (!closebtn) {
                $("#AltView_NoAlt_head_closeAltBtn").remove();
            }
        };
        // Altなしリスト追加
        AltView.prototype.addNoAltListObj = function (obj) {
            var listobj = $("<li class='altViewNoAltUlBlock__list'><a href='#' class='altViewNoAltUlBlock__img'><img src='" + obj.src + "' width='100'></a></li>");
            var top_ = obj.img_path.offset().top;
            listobj.on("click", function (e) {
                e.preventDefault();
                $(window).scrollTop(top_ - 200);
            });
            listobj.on("mouseout", function () {
                obj.img_path.removeClass('AltView_012345_Tip_show');
                $("#AltView_wrap div.Tip").show();
            });
            listobj.on("mouseover", function () {
                obj.img_path.addClass('AltView_012345_Tip_show');
                $("#AltView_wrap div.Tip").not($("#alt_view_tip_" + obj.id)).hide();
                $("#alt_view_tip_" + obj.id).show();
            });
            return listobj;
        };
        ;
        /*
        *
        * 画像を解析する
        *
        */
        AltView.prototype.getImgTagData = function (index, element) {
            //スタイルシート
            var style = null;
            if (element.attr("style")) {
                style = element.attr("style");
            }
            //画像位置とサイズと参照先
            var top = element.offset().top;
            var left = element.offset().left;
            //ソース
            var src = element.attr("src");
            //画像拡張子
            var extension = null;
            // var fileType = this.getImageFileType(element);
            // console.log("type",fileType)
            // if (src.indexOf('.webp') != -1 || src.indexOf('.jpg') != -1 || src.indexOf('.jpeg') != -1 || src.indexOf('.bmp') != -1 || src.indexOf('.gif') != -1 || src.indexOf('.png') != -1 || src.indexOf('.svg') != -1 || src.indexOf('.tiff') != -1) {
            // 	var f = src.split('.');
            // 	if (1 < f.length) {
            // 		extension = f[f.length - 1].toLowerCase();
            // 	}
            // }
            //Alt
            var alt = null;
            if (element.attr("alt")) {
                alt = element.attr("alt");
            }
            //タイトル
            var title = null;
            if (element.attr("title")) {
                title = element.attr("title");
            }
            //サイズ
            var width = element.width();
            var height = element.height();
            var width_attr = null;
            var height_attr = null;
            //Attributeサイズ
            if (element.attr("width")) {
                width_attr = parseInt(element.attr("width"));
            }
            if (element.attr("height")) {
                height_attr = parseInt(element.attr("height"));
            }
            //ナチュラルサイズを調べる
            element.css({ "width": "auto", "height": "auto" });
            var width_natural = element.width();
            var height_natural = element.height();
            if (style) {
                element.attr("style", style);
            }
            else {
                element.removeAttr("style");
            }
            //属性を追加
            element.attr("alt_view_tip", index);
            //画像にマウスオーバーした際の動作をセット
            this.ImageAction(element, true);
            var imgTagData = {
                id: index,
                style: style,
                src: src,
                img_path: element,
                extension: extension,
                top: top,
                left: left,
                alt: alt,
                title: title,
                width: width,
                height: height,
                width_attr: width_attr,
                height_attr: height_attr,
                width_natural: width_natural,
                height_natural: height_natural
            };
            return imgTagData;
        };
        AltView.prototype.fResizeTitleView = function () {
            //画面リサイズ時の処理
            var this_ = this;
            $(window).on("resize.AltTitleView_012345", function () {
                for (var i = 0; i < this_.AltTitleView_012345.AltData.length; i++) {
                    this_.AltTitleView_012345.AltData[i].fpath.css("top", this_.AltTitleView_012345.AltData[i].img_path.offset().top);
                    this_.AltTitleView_012345.AltData[i].fpath.css("left", this_.AltTitleView_012345.AltData[i].img_path.offset().left);
                }
                // Tip位置調整
                this_.fukidashiCSS();
            });
        };
        //ツールチップの ▼ 部分
        AltView.prototype.fukidashiCSS = function () {
            var this_ = this;
            //ツイールチップの吹き出しの方向
            setTimeout(function () {
                // $(".Tip .fuki-top, .Tip .fuki-bottom").remove();
                $(".Tip").each(function () {
                    var id = $(this).attr("data");
                    $(this).find(".fuki-top").remove();
                    $(this).find(".fuki-bottom").remove();
                    $(this).show();
                    // var top = $(this).offset().top;
                    var top = this_.AltTitleView_012345.AltData[id].top;
                    var height = $(this).outerHeight();
                    if (top - height < 0) {
                        // ▲ の方向
                        var _height = this_.AltTitleView_012345.AltData[id].top + this_.AltTitleView_012345.AltData[id].height;
                        $(this).css("top", (_height));
                        $(this).prepend("<div class='fuki-top'></div>");
                    }
                    else {
                        // ▼ の方向
                        $(this).css("top", (top - height - 7));
                        $(this).append("<div class='fuki-bottom'></div>");
                    }
                });
            }, 300);
        };
        // getImageFileType(arrayBuffer) {
        // 	var ba = new Uint8Array(arrayBuffer);
        // 	var headerStr = "";
        // 	var headerHex = "";
        // 	for (var i = 0; i < 10; i++) { // 始めの10個分を読む
        // 		headerHex += ba[i].toString(16); // 16進文字列で読む
        // 		headerStr += String.fromCharCode(ba[i]); // 文字列で読む
        // 	}
        // 	var fileType = "unknown";
        // 	if (headerHex.indexOf("ffd8") != -1) { // JPGはヘッダーに「ffd8」を含む
        // 		fileType = "JPG";
        // 	} else if (headerStr.indexOf("PNG") != -1) { // PNGはヘッダーに「PNG」を含む
        // 		fileType = "PNG";
        // 	} else if (headerStr.indexOf("GIF") != -1) { // GIFはヘッダーに「GIF」を含む
        // 		fileType = "GIF";
        // 	} else if (headerStr.indexOf("BM") != -1) { // BMPはヘッダーに「BM」を含む
        // 		fileType = "BMP";
        // 	}
        // 	console.log("fileType=" + fileType + " headerStr=" + headerStr + " headerHex=" + headerHex);
        // 	return fileType;
        // }
        AltView.prototype.close = function () {
            if (0 < $("#AltView_012345").length) {
                $("#AltView_wrap div.Tip .closeBtn").off("click.Tip");
                //ツールチップエリアを削除する
                $("#AltView_012345").remove();
                $("#AltView_NoAlt_Wrap").remove();
                $("img").removeAttr("alt_view_tip");
                this.ImageAction($("img"), false);
                $(window).off("resize.AltTitleView_012345");
                // bMoveCap_a = false;
                this.dispatchEvent(new events.Event("show", false));
            }
        };
        AltView.prototype.ImageAction = function (target, add) {
            if (add) {
                target.on("mouseover.AltTitleView_012345", this.ImageOver);
                target.on("mouseout.AltTitleView_012345", this.ImageOut);
            }
            else {
                target.off("mouseover.AltTitleView_012345", this.ImageOver);
                target.off("mouseout.AltTitleView_012345", this.ImageOut);
            }
        };
        AltView.prototype.ImageOver = function () {
            var path = $(this);
            $("#AltView_wrap div.Tip").hide();
            var id = path.attr("alt_view_tip");
            // console.log(id)
            $("#alt_view_tip_" + id).show();
            path.addClass('AltView_012345_Tip_show');
        };
        AltView.prototype.ImageOut = function () {
            var path = $(this);
            $("#AltView_wrap div.Tip").show();
            path.removeClass('AltView_012345_Tip_show');
        };
        return AltView;
    }(events.EventDispatcher));
    AltViewModule.AltView = AltView;
})(AltViewModule || (AltViewModule = {}));
/// <reference path="module/MetaView.ts" />
/// <reference path="module/AltView.ts" />
var MetaView = MetaViewModule.MetaView;
var AltView = AltViewModule.AltView;
var ContentScript = (function () {
    function ContentScript() {
        this.meta_view = new MetaView();
        this.alt_view = new AltView();
        this.showAlt = false;
        this.showMeta = false;
        chrome.runtime.onMessage.addListener(function (anymessage, sender, sendResponse) {
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
                }
                else {
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
                }
                else {
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
        this.alt_view.addEventListener("show", function (e) {
            if (e.value) {
                _this.showAlt = true;
            }
            else {
                _this.showAlt = false;
            }
        });
        this.meta_view.addEventListener("show", function (e) {
            if (e.value) {
                _this.showMeta = true;
            }
            else {
                _this.showMeta = false;
            }
        });
    }
    return ContentScript;
}());
this.ContentScript();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zY3JpcHRzL21vZHVsZS9FdmVudERpc3BhdGhjZXIudHMiLCJzcmMvc2NyaXB0cy9tb2R1bGUvTWV0YVZpZXcudHMiLCJzcmMvc2NyaXB0cy9tb2R1bGUvQWx0Vmlldy50cyIsInNyYy9zY3JpcHRzL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sTUFBTSxDQThGWjtBQTlGRCxXQUFPLE1BQU07SUFDWjtRQUFBO1lBQ0MsY0FBUyxHQUFPLEVBQUUsQ0FBQztRQXVFcEIsQ0FBQztRQXRFQSx1Q0FBYSxHQUFiLFVBQWMsS0FBVTtZQUN2QixJQUFJLENBQU8sQ0FBQztZQUNaLElBQUksSUFBWSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDbEIsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNYLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUNiLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixDQUFDO1lBRUQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUNoQyxDQUFDLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztnQkFDdkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO29CQUM1RCxJQUFJLFFBQVEsR0FBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dC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QUM7b0JBQ1QsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUM3QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDbEMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFDTCxvQkFBQztBQUFELENBL0VBLEFBK0VDLElBQUE7QUFFRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBldmVudHMge1xuXHRleHBvcnQgY2xhc3MgRXZlbnREaXNwYXRjaGVyIHtcblx0XHRsaXN0ZW5lcnM6YW55ID0ge307XG5cdFx0ZGlzcGF0Y2hFdmVudChldmVudDogYW55KTogdm9pZCB7XG5cdFx0XHR2YXIgZTpFdmVudDtcblx0XHRcdHZhciB0eXBlOiBzdHJpbmc7XG5cdFx0XHRpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuXHRcdFx0XHR0eXBlID0gZXZlbnQudHlwZTtcblx0XHRcdFx0ZSA9IGV2ZW50O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHlwZSA9IGV2ZW50O1xuXHRcdFx0XHRlID0gbmV3IEV2ZW50KHR5cGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZih0aGlzLmxpc3RlbmVyc1t0eXBlXSAhPSBudWxsKXtcblx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0ID0gdGhpcztcblx0XHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHZhciBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuaGFuZGxlcihlKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh3aW5kb3cuY29uc29sZSkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhY2spO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBwcmlvbGl0eTogbnVtYmVyID0gMCk6IHZvaWQge1xuXHRcdFx0aWYodGhpcy5saXN0ZW5lcnNbdHlwZV0gPT0gbnVsbCl7XG5cdFx0XHRcdHRoaXMubGlzdGVuZXJzW3R5cGVdID0gW107XG5cdFx0XHR9XG5cblxuXHRcdFx0dGhpcy5saXN0ZW5lcnNbdHlwZV0ucHVzaChuZXcgRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgcHJpb2xpdHkpKTtcblx0XHRcdHRoaXMubGlzdGVuZXJzW3R5cGVdLnNvcnQoZnVuY3Rpb24gKGxpc3RlbmVyMTpFdmVudExpc3RlbmVyLCBsaXN0ZW5lcjI6RXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0XHRyZXR1cm4gbGlzdGVuZXIyLnByaW9saXR5IC0gbGlzdGVuZXIxLnByaW9saXR5O1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOnN0cmluZywgY2FsbGJhY2s6RnVuY3Rpb24pOnZvaWQge1xuXHRcdFx0aWYodGhpcy5oYXNFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKSkge1xuXHRcdFx0XHRmb3IodmFyIGk6bnVtYmVyPTA7IGkgPCB0aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0dmFyIGxpc3RlbmVyOkV2ZW50TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtcblx0XHRcdFx0XHRpZihsaXN0ZW5lci5lcXVhbEN1cnJlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaykpIHtcblx0XHRcdFx0XHRcdGxpc3RlbmVyLmhhbmRsZXIgPSBudWxsO1xuXHRcdFx0XHRcdFx0dGhpcy5saXN0ZW5lcnNbdHlwZV0uc3BsaWNlKGksMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y2xlYXJFdmVudExpc3RlbmVyKCk6IHZvaWQge1xuXHRcdFx0dGhpcy5saXN0ZW5lcnMgPSB7fTtcblx0XHR9XG5cblx0XHRjb250YWluRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdGlmICh0aGlzLmxpc3RlbmVyc1t0eXBlXSA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gdGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoID4gMDtcblx0XHR9XG5cblx0XHRoYXNFdmVudExpc3RlbmVyKHR5cGU6c3RyaW5nLCBjYWxsYmFjazpGdW5jdGlvbik6Ym9vbGVhbiB7XG5cdFx0XHRpZih0aGlzLmxpc3RlbmVyc1t0eXBlXSA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRmb3IodmFyIGk6bnVtYmVyPTA7IGkgPCB0aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciBsaXN0ZW5lcjpFdmVudExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnNbdHlwZV1baV07XG5cdFx0XHRcdGlmKGxpc3RlbmVyLmVxdWFsQ3VycmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0Y2xhc3MgRXZlbnRMaXN0ZW5lciB7XG5cdFx0Y29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZyA9IG51bGwsIHB1YmxpYyBoYW5kbGVyOiBGdW5jdGlvbiA9IG51bGwsIHB1YmxpYyBwcmlvbGl0eTogbnVtYmVyID0gMCkge1xuXHRcdH1cblx0XHRlcXVhbEN1cnJlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG5cdFx0XHRpZiAodGhpcy50eXBlID09IHR5cGUgJiYgdGhpcy5oYW5kbGVyID09IGhhbmRsZXIpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cbiAgICBleHBvcnQgY2xhc3MgRXZlbnQge1xuICAgICAgICBjdXJyZW50VGFyZ2V0OmFueTtcbiAgICAgICAgc3RhdGljIENPTVBMRVRFOiBzdHJpbmcgPSBcImNvbXBsZXRlXCI7XG4gICAgICAgIHN0YXRpYyBDSEFOR0VfUFJPUEVSVFk6c3RyaW5nID1cImNoYW5nZVByb3BlcnR5XCI7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcgPSBudWxsLCBwdWJsaWMgdmFsdWU6IGFueSA9IG51bGwpIHtcblxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50RGlzcGF0aGNlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqcXVlcnkuZC50c1wiIC8+XG5cbm1vZHVsZSBNZXRhVmlld01vZHVsZSB7XG5cblxuICAgIGV4cG9ydCBjbGFzcyBNZXRhVmlldyBleHRlbmRzIGV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xuICAgICAgICBPYmpNZXRhVmlld1dyYXBCbG9jazogb2JqZWN0O1xuICAgICAgICBPYmpNZXRhVmlld0Jsb2NrOiBvYmplY3Q7XG4gICAgICAgIE9iak1ldGFWaWV3Q29udGVudDogb2JqZWN0O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICBsZXQgdGhpc18gPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBldmVudHMuRXZlbnQoXCJzaG93XCIsIHRydWUpKTtcbiAgICAgICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKCdUaXRsZVZpZXdfMDEyMzQ1X3Nob3cnKTtcblxuXG4gICAgICAgICAgICAvL01ldGHjga7ooajnpLrjgqjjg6rjgqLjgpLov73liqDjgZnjgotcbiAgICAgICAgICAgIHRoaXMuT2JqTWV0YVZpZXdXcmFwQmxvY2sgPSAkKFwiPGRpdiBpZD0nVGl0bGVWaWV3XzAxMjM0NScgY2xhc3M9J1RpdGxlVmlldzAxMjM0NV9Cb3gnPjwvZGl2PlwiKTtcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLk9iak1ldGFWaWV3V3JhcEJsb2NrKTtcblxuICAgICAgICAgICAgdGhpcy5PYmpNZXRhVmlld0Jsb2NrID0gJChcIjxkaXYgY2xhc3M9J1RpdGxlVmlldzAxMjM0NV9PYmpzJz48L2Rpdj5cIik7XG4gICAgICAgICAgICAkKHRoaXMuT2JqTWV0YVZpZXdXcmFwQmxvY2spLmFwcGVuZCh0aGlzLk9iak1ldGFWaWV3QmxvY2spO1xuXG4gICAgICAgICAgICB0aGlzLk9iak1ldGFWaWV3Q29udGVudCA9ICQoXCI8ZGl2IGlkPSdUaXRsZVZpZXdfQ29udGVudHNfMDEyMzQ1JyBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzJz48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLk9iak1ldGFWaWV3QmxvY2suYXBwZW5kKHRoaXMuT2JqTWV0YVZpZXdDb250ZW50KTtcblxuICAgICAgICAgICAgdGhpcy5PYmpNZXRhVmlld0NvbnRlbnQuYXBwZW5kKFwiPGgzIGNsYXNzPSdUaXRsZVZpZXcwMTIzNDVfQ29udGVudHNfX3R0bCc+VGl0bGU6IFwiICsgJChcImhlYWQgdGl0bGVcIikudGV4dCgpICsgXCI8L2gzPlwiKTtcbiAgICAgICAgICAgIHRoaXMuT2JqTWV0YVZpZXdDb250ZW50LmFwcGVuZChcIjxociBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzX19ocic+XCIpO1xuICAgICAgICAgICAgdGhpcy5PYmpNZXRhVmlld0NvbnRlbnQuYXBwZW5kKFwiPGgzIGNsYXNzPSdUaXRsZVZpZXcwMTIzNDVfQ29udGVudHNfX3R0bCc+TWV0YTo8L2gzPlwiKTtcblxuICAgICAgICAgICAgLy9NZXRh44KS6Kq/44G544KLXG4gICAgICAgICAgICAkKFwiaGVhZCBtZXRhXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGE6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIGltZ2lzOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBpbWc6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIGltZ3BhdGg6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8ICQodGhpcykuY29udGV4dC5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5jb250ZXh0LmF0dHJpYnV0ZXNbal0ubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLmNvbnRleHQuYXR0cmlidXRlc1tqXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfdmFsID0gJCh0aGlzKS5jb250ZXh0LmF0dHJpYnV0ZXNbal0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA8PSB2YWwuaW5kZXhPZihcImh0dHBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVVJM44GL77yfXG4gICAgICAgICAgICAgICAgICAgICAgICBfdmFsID0gXCI8YSBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzX19tZXRhc19fYScgaHJlZj0nXCIgKyB2YWwudG9TdHJpbmcoKSArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyB2YWwudG9TdHJpbmcoKSArIFwiPC9hPlwiXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA8PSB2YWwudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiaW1hZ2VcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v55S75YOP44GL77yfXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdpcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgwIDw9IHZhbC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJodHRwXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eUu+WDj+OBi++8n1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1naXMrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW1ncGF0aCA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG1ldGEgKz0gbmFtZSArICcgPSAmcXVvdDs8c3BhbiBjbGFzcz1cIlRpdGxlVmlldzAxMjM0NV9Db250ZW50c19fbWV0YXNfX3NwYW5cIj4nICsgX3ZhbCArICc8L3NwYW4+JnF1b3Q7ICc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKDIgPD0gaW1naXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IFwiPGRpdiBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzX19tZXRhc19faW1nJz48YSBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzX19tZXRhc19fYScgaHJlZj1cIiArIGltZ3BhdGggKyBcIiB0YXJnZXQ9J19ibGFuayc+PGltZyBzcmM9XCIgKyBpbWdwYXRoICsgXCIgd2lkdGg9MTUwID48L2E+PC9kaXY+XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAoMiA8PSBpbWdpcykge1xuICAgICAgICAgICAgICAgICAgICBtZXRhICs9IGltZztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzXy5PYmpNZXRhVmlld0NvbnRlbnQuYXBwZW5kKFwiPGRpdiBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0NvbnRlbnRzX19tZXRhcyc+XCIgKyBtZXRhICsgXCI8L2Rpdj5cIik7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvL+mWieOBmOOCi+ODnOOCv+ODs1xuICAgICAgICAgICAgdGhpcy5PYmpNZXRhVmlld0Jsb2NrLnByZXBlbmQoXCI8ZGl2IGlkPSdUaXRsZVZpZXdfY2xvc2VidG5faGVhZF8wMTIzNDUnIGNsYXNzPSdUaXRsZVZpZXcwMTIzNDVfSGVhZENsb3NlQnRuJz48aW1nIHNyYz0nXCIrY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiaW1hZ2VzL2Nsb3NlX3cuc3ZnXCIpK1wiJyB3aWR0aD0nNDUnPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuT2JqTWV0YVZpZXdCbG9jay5hcHBlbmQoXCI8ZGl2IGlkPSdUaXRsZVZpZXdfY2xvc2VidG5fMDEyMzQ1JyBjbGFzcz0nVGl0bGVWaWV3MDEyMzQ1X0Nsb3NlQnRuJz48aW1nIHNyYz0nXCIrY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiaW1hZ2VzL2Nsb3NlX3cuc3ZnXCIpK1wiJyB3aWR0aD0nNDUnPjxkaXY+IENMT1NFPC9kaXY+PC9kaXY+XCIpO1xuXG4gICAgICAgICAgICAvL01ldGHkuIDopqfooajnpLpcbiAgICAgICAgICAgIHZhciB0aXRsZXZpZXdfMDEyMzQ1X3RpbWU6IG51bWJlcjtcbiAgICAgICAgICAgIHRoaXMuT2JqTWV0YVZpZXdXcmFwQmxvY2suY3NzKHsgXCJ0b3BcIjogLXRoaXMuT2JqTWV0YVZpZXdXcmFwQmxvY2sub3V0ZXJIZWlnaHQoKSAtIDEwMCB9KTtcbiAgICAgICAgICAgIHRoaXMuT2JqTWV0YVZpZXdXcmFwQmxvY2suYWRkQ2xhc3MoXCJ0cmFuc2l0aW9uX21vZGVcIik7XG4gICAgICAgICAgICB0aXRsZXZpZXdfMDEyMzQ1X3RpbWUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXNfLk9iak1ldGFWaWV3V3JhcEJsb2NrLmNzcyh7IFwidG9wXCI6IDAgfSkub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjVGl0bGVWaWV3X2Nsb3NlYnRuX2hlYWRfMDEyMzQ1LCAjVGl0bGVWaWV3X2Nsb3NlYnRuXzAxMjM0NVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzXy5mUmVzaXplVGl0bGVWaWV3KCk7XG5cbiAgICAgICAgICAgIH0sIDIwMCk7XG5cbiAgICAgICAgICAgIC8v6ZaJ44GY44KL44Oc44K/44Oz44KS5oq844GX44Gf6ZqbXG4gICAgICAgICAgICAkKFwiI1RpdGxlVmlld19jbG9zZWJ0bl8wMTIzNDUsICNUaXRsZVZpZXdfY2xvc2VidG5faGVhZF8wMTIzNDUsIGh0bWxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJChcIiNUaXRsZVZpZXdfY2xvc2VidG5faGVhZF8wMTIzNDUsICNUaXRsZVZpZXdfY2xvc2VidG5fMDEyMzQ1XCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXNfLmNsb3NlKClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL+ODkOODluODquODs+OCsOWBnOatolxuICAgICAgICAgICAgdGhpcy5PYmpNZXRhVmlld1dyYXBCbG9jay5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8v44Oq44K144Kk44K6XG4gICAgICAgICAgICB2YXIgcmVzaXplVGltZTogbnVtYmVyID0gMDtcbiAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplLlRpdGxlVmlld18wMTIzNDUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNpemVUaW1lICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzaXplVGltZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNfLmZSZXNpemVUaXRsZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+ODquOCteOCpOOCulxuICAgICAgICBmUmVzaXplVGl0bGVWaWV3KCkge1xuICAgICAgICAgICAgLy8gaWYgKCQod2luZG93KS5oZWlnaHQoKSA8IHRoaXMuT2JqTWV0YVZpZXdDb250ZW50Lm91dGVySGVpZ2h0KCkgKyAkKFwiI1RpdGxlVmlld19jbG9zZWJ0bl8wMTIzNDVcIikuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLk9iak1ldGFWaWV3V3JhcEJsb2NrLmhlaWdodCgkKHdpbmRvdykuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLk9iak1ldGFWaWV3V3JhcEJsb2NrLmhlaWdodCh0aGlzLk9iak1ldGFWaWV3Q29udGVudC5oZWlnaHQoKSArICQoXCIjVGl0bGVWaWV3X2Nsb3NlYnRuXzAxMjM0NVwiKS5oZWlnaHQoKSArIDE1MCk7XG4gICAgICAgICAgICAvLyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cblx0XHRjbG9zZSgpIHtcblx0XHRcdHZhciB0aGlzXyA9IHRoaXM7XG5cdFx0XHRpZiAodGhpcy5PYmpNZXRhVmlld1dyYXBCbG9jay5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xuXHRcdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IGV2ZW50cy5FdmVudChcInNob3dcIiwgZmFsc2UpKTtcblx0XHRcdFx0dGhpcy5PYmpNZXRhVmlld1dyYXBCbG9jay5jc3MoeyB0b3A6IC10aGlzLk9iak1ldGFWaWV3V3JhcEJsb2NrLmhlaWdodCgpIC0gMjAgfSkub25lKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dGhpc18uT2JqTWV0YVZpZXdXcmFwQmxvY2sucmVtb3ZlKCk7XG5cdFx0XHRcdFx0JCh3aW5kb3cpLm9mZigncmVzaXplLlRpdGxlVmlld18wMTIzNDUnKTtcblx0XHRcdFx0XHQkKFwiaHRtbFwiKS5yZW1vdmVDbGFzcygnVGl0bGVWaWV3XzAxMjM0NV9zaG93Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cbiAgICB9XG5cblxuXG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnREaXNwYXRoY2VyLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpxdWVyeS5kLnRzXCIgLz5cblxubW9kdWxlIEFsdFZpZXdNb2R1bGUge1xuXHRleHBvcnQgY2xhc3MgQWx0VmlldyBleHRlbmRzIGV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xuXHRcdE9iakFsdFZpZXdCbG9jazogYW55ID0ge307XG5cdFx0T2JqQWx0Vmlld0NvbnRlbnQ6IGFueSA9IHt9O1xuXHRcdEFsdFRpdGxlVmlld18wMTIzNDU6IGFueSA9IHt9O1xuXHRcdGNoZWNrYm94OiBhbnkgPSB7fTtcblx0XHRBbHRfRnVraWRhc2hpX3R4dDogc3RyaW5nO1xuXG5cdFx0YWx0X25hc2hpOiBudW1iZXIgPSAwO1xuXHRcdHRpdGxlX25hc2hpOiBudW1iZXIgPSAwO1xuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHRcdC8v44Ot44O844Kr44Op44Kk44K65YyWXG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXHRcdFx0dGhpcy5BbHRfRnVraWRhc2hpX3R4dCA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJBbHRfRnVraWRhc2hpX3R4dFwiKTtcblxuXHRcdFx0dGhpcy5BbHRfTGlzdF90eHQxID0gY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShcIkFsdF9MaXN0X3R4dDFcIik7XG5cdFx0XHR0aGlzLkFsdF9MaXN0X3R4dDIgPSBjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKFwiQWx0X0xpc3RfdHh0MlwiKTtcblx0XHRcdHRoaXMuQWx0X0xpc3RfdHh0MyA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJBbHRfTGlzdF90eHQzXCIpO1xuXHRcdFx0dGhpcy5BbHRfTGlzdF90eHQ0ID0gY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShcIkFsdF9MaXN0X3R4dDRcIik7XG5cdFx0XHR0aGlzLkFsdF9MaXN0X3R4dDUgPSBjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKFwiQWx0X0xpc3RfdHh0NVwiKTtcblx0XHRcdHRoaXMuQWx0X0xpc3RfdHh0NiA9IGNocm9tZS5pMThuLmdldE1lc3NhZ2UoXCJBbHRfTGlzdF90eHQ2XCIpO1xuXHRcdFx0dGhpcy5BbHRfTGlzdF90eHQ3ID0gY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShcIkFsdF9MaXN0X3R4dDdcIik7XG5cblx0XHRcdHRoaXMuZ2V0T3B0aW9ucygpO1xuXHRcdH1cblxuXG5cblx0XHRzaG93ID0gKCkgPT4ge1xuXHRcdFx0dmFyIHRoaXNfID0gdGhpcztcblxuXHRcdFx0dGhpcy5nZXRPcHRpb25zKCk7XG5cdFx0XHR0aGlzLnNob3dNb3ZlKCk7XG5cblx0XHR9XG5cblx0XHRnZXRPcHRpb25zID0gKCkgPT4ge1xuXHRcdFx0dmFyIHRoaXNfID0gdGhpcztcblx0XHRcdHZhciBkZWZhdWx0cyA9IHtcblx0XHRcdFx0YWx0X2NoZWNrYm94OiB0cnVlLFxuXHRcdFx0XHR0aXRsZV9jaGVja2JveDogZmFsc2UsXG5cdFx0XHRcdHNpemVfY2hlY2tib3g6IHRydWUsXG5cdFx0XHRcdHBhdGhfY2hlY2tib3g6IGZhbHNlLFxuXHRcdFx0XHRleHRlbnNpb25fY2hlY2tib3g6IGZhbHNlLFxuXHRcdFx0XHRjb25zb2xlX2NoZWNrYm94OiB0cnVlLFxuXHRcdFx0XHRub0FsdExpc3RfY2hlY2tib3g6IHRydWUsXG5cdFx0XHRcdGFsdEZ1a2lkYXNoaUNsb3NlX2NoZWNrYm94OiB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0Y2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXG5cdFx0XHRcdGRlZmF1bHRzLFxuXHRcdFx0XHRmdW5jdGlvbihpdGVtcykge1xuXHRcdFx0XHRcdHRoaXNfLmNoZWNrYm94ID0gaXRlbXM7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXG5cdFx0c2hvd01vdmUgPSAoKSA9PiB7XG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXG5cdFx0XHR2YXIgY2hlY2tib3ggPSB0aGlzLmNoZWNrYm94O1xuXG5cdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IGV2ZW50cy5FdmVudChcInNob3dcIiwgdHJ1ZSkpO1xuXG5cdFx0XHQvL+ODhOODvOODq+ODgeODg+ODl+OBruihqOekuuOCqOODquOCouOCkui/veWKoOOBmeOCi1xuXHRcdFx0dGhpcy5PYmpBbHRWaWV3QmxvY2sgPSBudWxsO1xuXHRcdFx0dGhpcy5PYmpBbHRWaWV3QmxvY2sgPSAkKFwiPGRpdiBpZD0nQWx0Vmlld18wMTIzNDUnPjwvZGl2PlwiKTtcblx0XHRcdCQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLk9iakFsdFZpZXdCbG9jayk7XG5cblx0XHRcdHRoaXMuT2JqQWx0Vmlld0NvbnRlbnQgPSBudWxsO1xuXHRcdFx0dGhpcy5PYmpBbHRWaWV3Q29udGVudCA9ICQoXCI8ZGl2IGlkPSdBbHRWaWV3X3dyYXAnPjwvZGl2PlwiKTtcblx0XHRcdHRoaXMuT2JqQWx0Vmlld0Jsb2NrLmFwcGVuZCh0aGlzLk9iakFsdFZpZXdDb250ZW50KTtcblxuXG5cdFx0XHQvL1xuXHRcdFx0dGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGEgPSBbXTtcblxuXHRcdFx0Ly/jg5rjg7zjgrjkuIrjga7nlLvlg4/jga7jg4fjg7zjgr/jgpLoqr/jgbnjgotcblx0XHRcdCQoXCJpbWdcIikuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgb2JqID0gdGhpc18uZ2V0SW1nVGFnRGF0YShpbmRleCwgJChlbGVtZW50KSlcblx0XHRcdFx0dGhpc18uQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhLnB1c2gob2JqKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvL0FsdOeEoeOBl+OBruaVsFxuXHRcdFx0dGhpcy5ub0FsdENvdW50KHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhKTtcblxuXHRcdFx0Lypcblx0XHRcdCpcblx0XHRcdCog5Y+O6ZuG44GX44Gf44OH44O844K/44KS5Z+644Gr44OE44O844Or44OB44OD44OX44KS6L+95YqgXG5cdFx0XHQqXG5cdFx0XHQqL1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YS5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdHZhciBUaXBEYXRhID0gXCJcIjtcblxuXHRcdFx0XHQvL+mWieOBmOOCi+ODnOOCv+ODs1xuXHRcdFx0XHRUaXBEYXRhICs9IHRoaXMuYWRkQ2xvc2VCdG4odGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0pO1xuXG5cdFx0XHRcdC8vYWx0IOOBqCB0aXRsZVxuXHRcdFx0XHRpZiAoY2hlY2tib3guYWx0X2NoZWNrYm94ICYmIGNoZWNrYm94LnRpdGxlX2NoZWNrYm94KSB7XG5cdFx0XHRcdFx0VGlwRGF0YSArPSB0aGlzLmFkZEFsdFRpdGxlKHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2ldLCB0cnVlLCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChjaGVja2JveC5hbHRfY2hlY2tib3gpIHtcblx0XHRcdFx0XHRUaXBEYXRhICs9IHRoaXMuYWRkQWx0VGl0bGUodGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0sIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChjaGVja2JveC50aXRsZV9jaGVja2JveCkge1xuXHRcdFx0XHRcdFRpcERhdGEgKz0gdGhpcy5hZGRBbHRUaXRsZSh0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXSwgZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9JbWdTaXplXG5cdFx0XHRcdGlmIChjaGVja2JveC5zaXplX2NoZWNrYm94KSB7XG5cdFx0XHRcdFx0VGlwRGF0YSArPSB0aGlzLmFkZEltZ1NpemUodGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0pO1xuXHRcdFx0XHRcdC8vTmF0dXJhbOOCteOCpOOCuuOBqOmBleOBhuWgtOWQiOihqOekulxuXHRcdFx0XHRcdFRpcERhdGEgKz0gdGhpcy5hZGRJbWdOYXR1cmFsU2l6ZSh0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly/nlLvlg4/jg5Hjgrlcblx0XHRcdFx0aWYgKGNoZWNrYm94LnBhdGhfY2hlY2tib3gpIHtcblx0XHRcdFx0XHRUaXBEYXRhICs9IHRoaXMuYWRkSW1nU3JjKHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL+aLoeW8teWtkFxuXHRcdFx0XHRpZiAoY2hlY2tib3guZXh0ZW5zaW9uX2NoZWNrYm94KSB7XG5cdFx0XHRcdFx0Ly8gVGlwRGF0YSArPSB0aGlzLmFkZEltZ0V4dGVuc2lvbih0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly/jg4Tjg7zjg6vjg4Hjg4Pjg5fjgpLooajnpLrjgqjjg6rjgqLjgavov73liqDjgZnjgotcblx0XHRcdFx0dmFyIHRpcE9iajogYW55ID0gdGhpcy5hZGRUb29sdGlwKHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2ldLCBUaXBEYXRhKVxuXHRcdFx0XHQvLyDooajnpLrmg4XloLHjgYznhKHjgYTloLTlkIjlkLnjgY3lh7rjgZfjgaDjgZXjgarjgYRcblx0XHRcdFx0aWYgKGNoZWNrYm94LmFsdF9jaGVja2JveCB8fCBjaGVja2JveC50aXRsZV9jaGVja2JveCB8fCBjaGVja2JveC5zaXplX2NoZWNrYm94IHx8IGNoZWNrYm94LnBhdGhfY2hlY2tib3ggfHwgY2hlY2tib3guZXh0ZW5zaW9uX2NoZWNrYm94KSB7XG5cdFx0XHRcdFx0JChcIiNBbHRWaWV3X3dyYXBcIikuYXBwZW5kKHRpcE9iaik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiAoY2hlY2tib3guZXh0ZW5zaW9uX2NoZWNrYm94IHx8IGNoZWNrYm94LmV4dGVuc2lvbl9jaGVja2JveCkge1xuXHRcdFx0XHQvLyBcdCQoXCIjQWx0Vmlld193cmFwIC5UaXAgLnR4dFwiKS5hZGRDbGFzcyhcImxvbmd0eHRcIilcblx0XHRcdFx0Ly8gfVxuXG5cdFx0XHR9XG5cblx0XHRcdC8v44OE44Kk44O844Or44OB44OD44OX44Gu5ZC544GN5Ye644GX44Gu5pa55ZCRXG5cdFx0XHR0aGlzLmZ1a2lkYXNoaUNTUygpO1xuXG5cblx0XHRcdC8v44OE44O844Or44OB44OD44OX44Oe44Km44K544Kq44O844OQ44O85pmCXG5cdFx0XHQkKFwiI0FsdFZpZXdfd3JhcCBkaXYuVGlwXCIpLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHRoaXNPYmogPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgaWQgPSB0aGlzT2JqLmF0dHIoXCJkYXRhXCIpO1xuXHRcdFx0XHR0aGlzXy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaWRdLmltZ19wYXRoLmFkZENsYXNzKCdBbHRWaWV3XzAxMjM0NV9UaXBfc2hvdycpO1xuXG5cdFx0XHRcdHRoaXNPYmouY3NzKFwiei1pbmRleFwiLCA5OTk5OSk7XG5cdFx0XHRcdCQoXCIjQWx0Vmlld193cmFwIGRpdi5UaXBcIikubm90KHRoaXNPYmopLmhpZGUoKTtcblx0XHRcdFx0dGhpc09iai5zaG93KCk7XG5cdFx0XHR9KVxuXHRcdFx0JChcIiNBbHRWaWV3X3dyYXAgZGl2LlRpcFwiKS5tb3VzZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHRoaXNPYmogPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgaWQgPSB0aGlzT2JqLmF0dHIoXCJkYXRhXCIpO1xuXHRcdFx0XHR0aGlzXy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaWRdLmltZ19wYXRoLnJlbW92ZUNsYXNzKCdBbHRWaWV3XzAxMjM0NV9UaXBfc2hvdycpO1xuXG5cdFx0XHRcdHRoaXNPYmouY3NzKFwiei1pbmRleFwiLCA5OTk5OCk7XG5cdFx0XHRcdCQoXCIjQWx0Vmlld193cmFwIGRpdi5UaXBcIikuc2hvdygpO1xuXHRcdFx0fSlcblxuXG5cdFx0XHQkKFwiI0FsdFZpZXdfd3JhcCBkaXYuVGlwIC5jbG9zZUJ0blwiKS5vbihcImNsaWNrLlRpcFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHRoaXNPYmogPSAkKHRoaXMpO1xuXHRcdFx0XHR2YXIgaWQgPSB0aGlzT2JqLmF0dHIoXCJkYXRhXCIpO1xuXHRcdFx0XHR2YXIgaW1nT2JqID0gdGhpc18uQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2lkXS5pbWdfcGF0aFxuXHRcdFx0XHRpbWdPYmoucmVtb3ZlQ2xhc3MoJ0FsdFZpZXdfMDEyMzQ1X1RpcF9zaG93Jyk7XG5cdFx0XHRcdGltZ09iai5yZW1vdmVBdHRyKCdhbHRfdmlld190aXAnKTtcblx0XHRcdFx0dGhpc18uSW1hZ2VBY3Rpb24oaW1nT2JqLCBmYWxzZSk7XG5cblx0XHRcdFx0JChcIiNhbHRfdmlld190aXBfXCIgKyBpZCkucmVtb3ZlKCk7XG5cdFx0XHRcdC8vIGRlbGV0ZSB0aGlzXy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaWRdO1xuXHRcdFx0XHQkKHRoaXMpLm9mZihcImNsaWNrLlRpcFwiKTtcblx0XHRcdFx0JChcIiNBbHRWaWV3X3dyYXAgZGl2LlRpcFwiKS5zaG93KCk7XG5cdFx0XHR9KVxuXG5cblx0XHRcdC8vQWx05pWwXG5cdFx0XHQvLyB0aGlzLm5vQWx0Q291bnQodGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGEpO1xuXG5cdFx0XHQvL0FsdOeEoeOBl+OBruaVsOOCkmNvbnNvbGXjgavooajnpLpcblx0XHRcdGlmIChjaGVja2JveC5jb25zb2xlX2NoZWNrYm94KSB7XG5cdFx0XHRcdHRoaXMubm9BbHRTaG93Q29uc29sZUxvZygpO1xuXHRcdFx0XHR0aGlzLm5vVGl0bGVTaG93Q29uc29sZUxvZygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvKlxuXHRcdFx0KlxuXHRcdFx0KiBBbHTnhKHjgZfjg6rjgrnjg4hcblx0XHRcdCpcblx0XHRcdCovXG5cdFx0XHR0aGlzLmFkZE5vQWx0TGlzdChjaGVja2JveC5ub0FsdExpc3RfY2hlY2tib3gsIGNoZWNrYm94LmFsdF9jaGVja2JveCwgY2hlY2tib3gudGl0bGVfY2hlY2tib3gsIGNoZWNrYm94LmFsdEZ1a2lkYXNoaUNsb3NlX2NoZWNrYm94KTtcblxuXG5cdFx0XHQvL1xuXHRcdFx0dGhpcy5mUmVzaXplVGl0bGVWaWV3KCk7XG5cblx0XHR9XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblx0XHQvL+ODhOODvOODq+ODgeODg+ODl+OCkui/veWKoFxuXHRcdGFkZFRvb2x0aXAoZGF0YTogYW55LCB0aXBEYXRhOiBzdHJpbmcpOiBhbnkge1xuXG5cdFx0XHQvL1RpcOOBq+ihqOekuuOBleOCjOOCi+ODh+ODvOOCv+OCkuOBvuOBqOOCgeOCi1xuXHRcdFx0dmFyIFRpcCA9ICQoXCI8ZGl2IGlkPSdhbHRfdmlld190aXBfXCIgKyBkYXRhLmlkICsgXCInIGNsYXNzPSdUaXAgVGlwLVwiICsgZGF0YS5pZCArIFwiJyBkYXRhPSdcIiArIGRhdGEuaWQgKyBcIic+PGRpdiBjbGFzcz0ndHh0Jz5cIiArIHRpcERhdGEgKyBcIjwvZGl2PjwvZGl2PlwiKTtcblxuXHRcdFx0Ly9cblxuXG5cblx0XHRcdGlmIChkYXRhLndpZHRoICE9IGRhdGEud2lkdGhfbmF0dXJhbCAmJiBkYXRhLndpZHRoX2F0dHIgIT0gZGF0YS53aWR0aF9uYXR1cmFsKSB7XG5cdFx0XHRcdFRpcC5maW5kKFwiLndcIikucmVtb3ZlQ2xhc3MoXCJzZXRcIikuYWRkQ2xhc3MoXCJub3NldFwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChkYXRhLmhlaWdodCAhPSBkYXRhLmhlaWdodF9uYXR1cmFsICYmIGRhdGEuaGVpZ2h0X2F0dHIgIT0gZGF0YS5oZWlnaHRfbmF0dXJhbCkge1xuXHRcdFx0XHRUaXAuZmluZChcIi5oXCIpLnJlbW92ZUNsYXNzKFwic2V0XCIpLmFkZENsYXNzKFwibm9zZXRcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8v44Gq44Gr44KC44K744OD44OI44GV44KM44Gm44GE44Gq44GE4oCmXG5cdFx0XHRpZiAoIWRhdGEuYWx0ICYmICFkYXRhLnRpdGxlKSB7XG5cdFx0XHRcdFRpcC5hZGRDbGFzcyhcIm5vLXNldFwiKVxuXHRcdFx0fVxuXG5cdFx0XHQvL1RpcOOBruS9jee9ruOCkuioreWumlxuXHRcdFx0VGlwLmNzcyh7IFwidG9wXCI6IGRhdGEudG9wLCBcImxlZnRcIjogZGF0YS5sZWZ0LCBcIm1heC13aWR0aFwiOiBkYXRhLndpZHRoIDwgMjAwID8gMjAwIDogZGF0YS53aWR0aCwgXCJkaXNwbGF5XCI6IFwibm9uZVwiIH0pXG5cblx0XHRcdC8v5ZC544GN5Ye644GX44Gu5L2N572u44KS6Kit5a6aXG5cdFx0XHRUaXAuZmluZChcIi5mdWtpXCIpLmNzcyhcIm1hcmdpbi1sZWZ0XCIsIDEwKTtcblxuXHRcdFx0ZGF0YS5mcGF0aCA9IFRpcDtcblxuXHRcdFx0cmV0dXJuIFRpcFxuXHRcdH1cblxuXG5cdFx0YWRkQWx0VGl0bGUoZGF0YTogYW55LCBzaG93QWx0OiBib29sZWFuLCBzaG93VGl0bGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuXG5cdFx0XHR2YXIgX3RpcERhdGE6IHN0cmluZyA9IFwiXCI7XG5cblx0XHRcdC8vQWx044GoVGl0bGVcblx0XHRcdGlmIChzaG93QWx0ICYmIHNob3dUaXRsZSAmJiBkYXRhLmFsdCA9PSBkYXRhLnRpdGxlICYmIGRhdGEuYWx0ICE9IG51bGwgJiYgZGF0YS50aXRsZSAhPSBudWxsKSB7XG5cdFx0XHRcdF90aXBEYXRhICs9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz48c3BhbiBjbGFzcz0ndHh0X19saW5lSGVhZCc+QWx0LFRpdGxlPC9zcGFuPjxkaXYgY2xhc3M9J3R4dF9fbGluZUJvZHknPjxzcGFuIGNsYXNzPSdhdCc+XCIgKyBkYXRhLmFsdCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PlwiXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHZhciBhbHRUeHQgPSBcIlwiO1xuXHRcdFx0XHR2YXIgYWx0Tm9TZXQgPSBcIlwiO1xuXG5cdFx0XHRcdGlmIChzaG93QWx0KSB7XG5cdFx0XHRcdFx0aWYgKGRhdGEuYWx0KSB7XG5cdFx0XHRcdFx0XHRhbHRUeHQgPSBkYXRhLmFsdDtcblx0XHRcdFx0XHRcdGFsdE5vU2V0ID0gXCJcIjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YWx0VHh0ID0gdGhpcy5BbHRfRnVraWRhc2hpX3R4dDtcblx0XHRcdFx0XHRcdGFsdE5vU2V0ID0gXCJub3NldFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciB0aXRsZVR4dCA9IFwiXCI7XG5cdFx0XHRcdHZhciB0aXRsZU5vU2V0ID0gXCJcIjtcblx0XHRcdFx0aWYgKHNob3dUaXRsZSkge1xuXHRcdFx0XHRcdGlmIChkYXRhLnRpdGxlKSB7XG5cdFx0XHRcdFx0XHR0aXRsZVR4dCA9IGRhdGEudGl0bGU7XG5cdFx0XHRcdFx0XHR0aXRsZU5vU2V0ID0gXCJcIjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGl0bGVUeHQgPSB0aGlzLkFsdF9GdWtpZGFzaGlfdHh0O1xuXHRcdFx0XHRcdFx0dGl0bGVOb1NldCA9IFwibm9zZXRcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2hvd0FsdCAmJiBzaG93VGl0bGUgJiYgZGF0YS5hbHQgIT0gZGF0YS50aXRsZSkge1xuXHRcdFx0XHRcdGFsdE5vU2V0ID0gXCJub3NldFwiO1xuXHRcdFx0XHRcdHRpdGxlTm9TZXQgPSBcIm5vc2V0XCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2hvd0FsdCkge1xuXHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz48c3BhbiBjbGFzcz0ndHh0X19saW5lSGVhZCc+QWx0PC9zcGFuPjxkaXYgY2xhc3M9J3R4dF9fbGluZUJvZHknPjxzcGFuIGNsYXNzPSdhdCBcIithbHROb1NldCtcIic+XCIgKyBhbHRUeHQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj5cIlxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNob3dUaXRsZSkge1xuXHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz48c3BhbiBjbGFzcz0ndHh0X19saW5lSGVhZCc+VGl0bGU8L3NwYW4+PGRpdiBjbGFzcz0ndHh0X19saW5lQm9keSc+PHNwYW4gY2xhc3M9J2F0IFwiK3RpdGxlTm9TZXQrXCInPlwiICsgdGl0bGVUeHQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj5cIlxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXG5cblx0XHRcdHJldHVybiBfdGlwRGF0YVxuXHRcdH1cblxuXHRcdC8v6ZaJ44GY44KL44Oc44K/44OzXG5cdFx0YWRkQ2xvc2VCdG4oZGF0YTogYW55KSB7XG5cdFx0XHRyZXR1cm4gJzxkaXYgY2xhc3M9XCJjbG9zZUJ0blwiIGRhdGE9XCInICsgZGF0YS5pZCArICdcIj48aW1nIHNyYz1cIicgKyBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJpbWFnZXMvY2xvc2Uuc3ZnXCIpICsgJ1wiIGFsdD1cIkNsb3NlQnRuXCIgd2lkdGg9XCI4XCI+PC9kaXY+J1xuXHRcdH1cblxuXG5cblxuXHRcdC8v55S75YOP44K144Kk44K644KS6L+95YqgXG5cdFx0YWRkSW1nU2l6ZShkYXRhOiBhbnkpOiBzdHJpbmcge1xuXG5cdFx0XHR2YXIgX3RpcERhdGE6IHN0cmluZyA9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz5cIiArIFwiPHNwYW4gY2xhc3M9J3R4dF9fbGluZUhlYWQnPkltZ1NpemU8L3NwYW4+PGRpdiBjbGFzcz0ndHh0X19saW5lQm9keSc+XCI7XG5cdFx0XHRpZiAoZGF0YS53aWR0aF9hdHRyICYmIGRhdGEuaGVpZ2h0X2F0dHIpIHtcblx0XHRcdFx0Ly/nlLvlg4/jgrXjgqTjgrrjgYzoqK3lrprjgZXjgozjgabjgYTjgotcblx0XHRcdFx0X3RpcERhdGEgKz0gXCI8c3BhbiBjbGFzcz0nYXQgdyc+XCIgKyBkYXRhLndpZHRoX2F0dHIgKyBcIjwvc3Bhbj48c3BhbiBjbGFzcz0neCc+eDwvc3Bhbj48c3BhbiBjbGFzcz0nYXQgaCc+XCIgKyBkYXRhLmhlaWdodF9hdHRyICsgXCI8L3NwYW4+PHNwYW4gY2xhc3M9J3B4Jz5weDwvc3Bhbj5cIlxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL+eUu+WDj+OCteOCpOOCuuOBjOioreWumuOBleOCjOOBpuOBhOOBquOBhOWgtOWQiFxuXHRcdFx0XHRpZiAoIWRhdGEud2lkdGhfYXR0ciAmJiAhZGF0YS5oZWlnaHRfYXR0cikge1xuXHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPHNwYW4gY2xhc3M9J2F0IG5vc2V0Jz5cIiArIHRoaXMuQWx0X0Z1a2lkYXNoaV90eHQgKyBcIjwvc3Bhbj5cIlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChkYXRhLndpZHRoX2F0dHIpIHtcblx0XHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPHNwYW4gY2xhc3M9J2F0IHcnPlwiICsgZGF0YS53aWR0aF9hdHRyICsgXCI8L3NwYW4+PHNwYW4gY2xhc3M9J3gnPng8L3NwYW4+XCI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPHNwYW4gY2xhc3M9J2F0IG5vc2V0Jz5cIiArIHRoaXMuQWx0X0Z1a2lkYXNoaV90eHQgKyBcIjwvc3Bhbj48c3BhbiBjbGFzcz0neCc+eDwvc3Bhbj5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRhdGEuaGVpZ2h0X2F0dHIpIHtcblx0XHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPHNwYW4gY2xhc3M9J2F0IGgnPlwiICsgZGF0YS5oZWlnaHRfYXR0ciArIFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdweCc+cHg8L3NwYW4+XCI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdF90aXBEYXRhICs9IFwiPHNwYW4gY2xhc3M9J2F0IG5vc2V0Jz5cIiArIHRoaXMuQWx0X0Z1a2lkYXNoaV90eHQgKyBcIjwvc3Bhbj5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdF90aXBEYXRhICs9IFwiPC9kaXY+PC9kaXY+XCJcblx0XHRcdHJldHVybiBfdGlwRGF0YTtcblx0XHR9XG5cblx0XHQvL+ODiuODgeODpeODqeODq+OCteOCpOOCuuOCkui/veWKoFxuXHRcdGFkZEltZ05hdHVyYWxTaXplKGRhdGE6IGFueSk6IHN0cmluZyB7XG5cdFx0XHR2YXIgX3RpcERhdGE6IHN0cmluZyA9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz5cIiArIFwiPHNwYW4gY2xhc3M9J3R4dF9fbGluZUhlYWQnPk5hdHVyYWw8L3NwYW4+PGRpdiBjbGFzcz0ndHh0X19saW5lQm9keSc+XCI7XG5cdFx0XHRpZiAoZGF0YS53aWR0aCAhPSBkYXRhLndpZHRoX25hdHVyYWwgfHwgZGF0YS5oZWlnaHQgIT0gZGF0YS5oZWlnaHRfbmF0dXJhbCB8fCAoIWRhdGEud2lkdGhfYXR0ciAmJiAhZGF0YS5oZWlnaHRfYXR0cikpIHtcblx0XHRcdFx0X3RpcERhdGEgKz0gXCI8c3BhbiBjbGFzcz0nc2V0Jz5cIiArIGRhdGEud2lkdGhfbmF0dXJhbCArIFwiPC9zcGFuPjxzcGFuIGNsYXNzPSd4Jz54PC9zcGFuPjxzcGFuIGNsYXNzPSdzZXQnPlwiICsgZGF0YS5oZWlnaHRfbmF0dXJhbCArIFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdweCc+cHg8L3NwYW4+PC9kaXY+PC9kaXY+XCJcblx0XHRcdFx0cmV0dXJuIF90aXBEYXRhO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8v55S75YOP44OR44K5XG5cdFx0YWRkSW1nU3JjKGRhdGE6IGFueSk6IHN0cmluZyB7XG5cdFx0XHR2YXIgX3RpcERhdGE6IHN0cmluZyA9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz5cIiArIFwiPHNwYW4gY2xhc3M9J3R4dF9fbGluZUhlYWQnPlNyYzwvc3Bhbj48ZGl2IGNsYXNzPSd0eHRfX2xpbmVCb2R5Jz5cIjtcblx0XHRcdF90aXBEYXRhICs9IFwiPGEgaHJlZj0nXCIgKyBkYXRhLnNyYyArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyBkYXRhLnNyYyArIFwiPC9hPjwvc3Bhbj48L2Rpdj48L2Rpdj5cIjtcblx0XHRcdHJldHVybiBfdGlwRGF0YVxuXHRcdH1cblxuXHRcdC8v5ouh5by15a2QXG5cdFx0YWRkSW1nRXh0ZW5zaW9uKGRhdGE6IGFueSk6IHN0cmluZyB7XG5cdFx0XHR2YXIgX3RpcERhdGE6IHN0cmluZyA9IFwiPGRpdiBjbGFzcz0ndHh0X19saW5lJz5cIiArIFwiPHNwYW4gY2xhc3M9J3R4dF9fbGluZUhlYWQnPkV4dGVuc2lvbjwvc3Bhbj48ZGl2IGNsYXNzPSd0eHRfX2xpbmVCb2R5Jz5cIjtcblx0XHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xuXHRcdFx0XHRfdGlwRGF0YSArPSBcIjxzcGFuIGNsYXNzPSdleHRlbic+XCIgKyBkYXRhLmV4dGVuc2lvbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PlwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0X3RpcERhdGEgKz0gXCI8c3BhbiBjbGFzcz0nbm9zZXQnPiA/IDwvc3Bhbj48L2Rpdj48L2Rpdj5cIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBfdGlwRGF0YTtcblx0XHR9XG5cblx0XHQvL0FsdOOBquOBl+OBruaVsFxuXHRcdG5vQWx0Q291bnQoZGF0YTogYW55KTogdm9pZCB7XG5cdFx0XHR2YXIgX2FsdF9uYXNoaTogbnVtYmVyID0gMDtcblx0XHRcdHZhciBfdGl0bGVfbmFzaGk6IG51bWJlciA9IDA7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKCFkYXRhW2ldLmFsdCkgeyBfYWx0X25hc2hpKys7IH1cblx0XHRcdFx0aWYgKCFkYXRhW2ldLnRpdGxlKSB7IF90aXRsZV9uYXNoaSsrOyB9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmFsdF9uYXNoaSA9IF9hbHRfbmFzaGk7XG5cdFx0XHR0aGlzLnRpdGxlX25hc2hpID0gX3RpdGxlX25hc2hpO1xuXHRcdH1cblxuXHRcdC8vQWx044Gq44GX44Gu5pWw44KSIGNvbnNvbGUubG9nIOOBq+ihqOekulxuXHRcdG5vQWx0U2hvd0NvbnNvbGVMb2coKTogdm9pZCB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIiVjQWx0ICYgTWV0YSB2aWV3ZXIgJWN2ZXIgXCIgKyBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24sICdwYWRkaW5nOjAuM2VtIDFlbTsgYmFja2dyb3VuZDogI2Y4N2EwMDsgY29sb3I6d2hpdGU7IGZvbnQtc2l6ZTogMTFweDsnLCAnYmFja2dyb3VuZDogI2NjYzsgcGFkZGluZzowLjNlbSAwLjVlbTsgZm9udC1zaXplOiAxMXB4OycpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIlY0FsdCAmIE1ldGEgdmlld2VyXCIsICdwYWRkaW5nOjAuM2VtIDFlbTsgYmFja2dyb3VuZDogI2Y4N2EwMDsgY29sb3I6d2hpdGU7IGZvbnQtc2l6ZTogMTFweDsnKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiQWx0IOOBquOBlyA6ICVjXCIgKyB0aGlzLmFsdF9uYXNoaSArIFwiJWMg5YCLXCIsICdmb250LXNpemU6IDEwcHg7IGZvbnQtd2VpZ2h0OiBib2xkOycsICcnKTtcblx0XHR9XG5cdFx0bm9UaXRsZVNob3dDb25zb2xlTG9nKCk6IHZvaWQge1xuXHRcdFx0Y29uc29sZS5sb2coXCJUaXRsZSDjgarjgZcgOiAlY1wiICsgdGhpcy50aXRsZV9uYXNoaSArIFwiJWMg5YCLXCIsICdmb250LXNpemU6IDEwcHg7IGZvbnQtd2VpZ2h0OiBib2xkOycsICcnKTtcblx0XHR9XG5cblxuXG5cdFx0Ly9cblx0XHRhZGROb0FsdExpc3QoYWx0bGlzdGJ0bjogYm9vbGVhbiwgYWx0X3Nob3c6IGJvb2xlYW4sIHRpdGxlX3Nob3c6IGJvb2xlYW4sIGNsb3NlYnRuOiBib29sZWFuKTogdm9pZCB7XG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXG5cdFx0XHQvL+eEoeOBl+OCq+OCpuODs+ODiFxuXHRcdFx0dmFyIG5vQ291bnRWYWwgPSAwO1xuXG5cdFx0XHQvL+ODquOCueODiOS9nOaIkFxuXHRcdFx0dmFyIHVsT2JqID0gJChcIjx1bCBjbGFzcz0nYWx0Vmlld05vQWx0VWxCbG9jayc+PC91bD5cIik7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBsaXN0T2JqOiBKUXVlcnk7XG5cdFx0XHRcdGlmIChhbHRfc2hvdyAmJiAhdGl0bGVfc2hvdykge1xuXHRcdFx0XHRcdC8vQWx0IOOBquOBl1xuXHRcdFx0XHRcdGlmICghdGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0uYWx0KSB7XG5cdFx0XHRcdFx0XHRsaXN0T2JqID0gdGhpcy5hZGROb0FsdExpc3RPYmoodGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0pO1xuXHRcdFx0XHRcdFx0bm9Db3VudFZhbCsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICh0aXRsZV9zaG93ICYmICFhbHRfc2hvdykge1xuXHRcdFx0XHRcdC8vVGl0bGUg44Gq44GXXG5cdFx0XHRcdFx0aWYgKCF0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXS50aXRsZSkge1xuXHRcdFx0XHRcdFx0bGlzdE9iaiA9IHRoaXMuYWRkTm9BbHRMaXN0T2JqKHRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2ldKTtcblx0XHRcdFx0XHRcdG5vQ291bnRWYWwrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoYWx0X3Nob3cgJiYgdGl0bGVfc2hvdykge1xuXHRcdFx0XHRcdC8vQWx0IOOBvuOBn+OBryBUaXRsZSDjgarjgZdcblx0XHRcdFx0XHRpZiAoIXRoaXMuQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2ldLmFsdCB8fCAhdGhpcy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0udGl0bGUpIHtcblx0XHRcdFx0XHRcdGxpc3RPYmogPSB0aGlzLmFkZE5vQWx0TGlzdE9iaih0aGlzLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXSk7XG5cdFx0XHRcdFx0XHRub0NvdW50VmFsKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHVsT2JqLmFwcGVuZChsaXN0T2JqKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIExpc3RUYWJUeHQgPSBcIlwiO1xuXHRcdFx0dmFyIExpc3RUYWJPcmRlciA9IHRoaXMuQWx0X0xpc3RfdHh0MTtcblx0XHRcdGlmICgwIDwgbm9Db3VudFZhbCkge1xuXHRcdFx0XHRpZiAoYWx0X3Nob3cgJiYgIXRpdGxlX3Nob3cpIHtcblx0XHRcdFx0XHRMaXN0VGFiVHh0ID0gdGhpcy5BbHRfTGlzdF90eHQyO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRpdGxlX3Nob3cgJiYgIWFsdF9zaG93KSB7XG5cdFx0XHRcdFx0TGlzdFRhYlR4dCA9IHRoaXMuQWx0X0xpc3RfdHh0Mztcblx0XHRcdFx0fSBlbHNlIGlmIChhbHRfc2hvdyAmJiB0aXRsZV9zaG93KSB7XG5cdFx0XHRcdFx0TGlzdFRhYlR4dCA9IHRoaXMuQWx0X0xpc3RfdHh0NDtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoYWx0X3Nob3cgJiYgIXRpdGxlX3Nob3cpIHtcblx0XHRcdFx0XHRMaXN0VGFiVHh0ID0gdGhpcy5BbHRfTGlzdF90eHQ1O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRpdGxlX3Nob3cgJiYgIWFsdF9zaG93KSB7XG5cdFx0XHRcdFx0TGlzdFRhYlR4dCA9IHRoaXMuQWx0X0xpc3RfdHh0Njtcblx0XHRcdFx0fSBlbHNlIGlmIChhbHRfc2hvdyAmJiB0aXRsZV9zaG93KSB7XG5cdFx0XHRcdFx0TGlzdFRhYlR4dCA9IHRoaXMuQWx0X0xpc3RfdHh0Nztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoMCA8IG5vQ291bnRWYWwpIHtcblx0XHRcdFx0Ly9BbHTnhKHjgYTnlLvlg4/jgYzjgYLjgaPjgZ/loLTlkIhcblx0XHRcdFx0JChcImh0bWxcIikucHJlcGVuZChcblx0XHRcdFx0XHRcIjxkaXYgaWQ9J0FsdFZpZXdfTm9BbHRfV3JhcCcgY2xhc3M9J2xvYWQnPlwiICtcblx0XHRcdFx0XHRcIjxkaXYgaWQ9J0FsdFZpZXdfTm9BbHRfUmVzdWx0X1dyYXAnPjwvZGl2PlwiICtcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGlkPSdBbHRWaWV3X05vQWx0X2hlYWRfY2xvc2VBbHRCdG4nPlwiICtcblx0XHRcdFx0XHRcIjxpbWcgc3JjPSdcIiArIGNocm9tZS5ydW50aW1lLmdldFVSTChcImltYWdlcy9jbG9zZV93LnN2Z1wiKSArIFwiJyBhbHQ9J0Nsb3NlQnRuJyB3aWR0aD0nMzUnPlwiICtcblx0XHRcdFx0XHRcIjwvYT5cIiArXG5cdFx0XHRcdFx0XCI8YSBocmVmPScjJyBjbGFzcz0nYWx0Vmlld05vQWx0SGVhZENsb3NlQnRuJz5cIiArXG5cdFx0XHRcdFx0XCI8aW1nIGNsYXNzPSdhcnJvdycgc3JjPSdcIiArIGNocm9tZS5ydW50aW1lLmdldFVSTChcImltYWdlcy9hcnJvdy5zdmdcIikgKyBcIicgYWx0PScnIHdpZHRoPSczNSc+XCIgK1xuXHRcdFx0XHRcdFwiPHAgY2xhc3M9J2FsdFZpZXdOb0FsdEhlYWRDbG9zZUJ0bl9fdHh0Jz5cIiArIExpc3RUYWJUeHQgKyBcIjxzcGFuPlwiICsgbm9Db3VudFZhbCArIFwiPC9zcGFuPlwiICsgTGlzdFRhYk9yZGVyICsgXCI8L3A+PC9hPlwiICtcblx0XHRcdFx0XHRcIjwvZGl2PlwiKTtcblxuXHRcdFx0XHQkKFwiLmFsdFZpZXdOb0FsdEhlYWRDbG9zZUJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JChcIiNBbHRWaWV3X05vQWx0X1dyYXBcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdCQoXCIjQWx0Vmlld19Ob0FsdF9XcmFwXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9BbHTlroznkqfjga7loLTlkIhcblx0XHRcdFx0JChcImh0bWxcIikucHJlcGVuZChcblx0XHRcdFx0XHRcIjxkaXYgaWQ9J0FsdFZpZXdfTm9BbHRfV3JhcCcgY2xhc3M9J2xvYWQnPlwiICtcblx0XHRcdFx0XHRcIjxkaXYgaWQ9J0FsdFZpZXdfTm9BbHRfUmVzdWx0X1dyYXAnPjwvZGl2PlwiICtcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGlkPSdBbHRWaWV3X05vQWx0X2hlYWRfY2xvc2VBbHRCdG4nPlwiICtcblx0XHRcdFx0XHRcIjxpbWcgc3JjPSdcIiArIGNocm9tZS5ydW50aW1lLmdldFVSTChcImltYWdlcy9jbG9zZV93LnN2Z1wiKSArIFwiJyBhbHQ9J0Nsb3NlQnRuJyB3aWR0aD0nMzUnPlwiICtcblx0XHRcdFx0XHRcIjwvYT5cIiArXG5cdFx0XHRcdFx0XCI8YSBocmVmPScjJyBjbGFzcz0nYWx0Vmlld05vQWx0SGVhZENsb3NlQnRuIGFsdFZpZXdOb0FsdEhlYWRDbG9zZUJ0bi1wZXJmZWN0Jz5cIiArXG5cdFx0XHRcdFx0XCI8cCBjbGFzcz0nYWx0Vmlld05vQWx0SGVhZENsb3NlQnRuX190eHQnPlwiICsgTGlzdFRhYlR4dCArIFwiPC9wPjwvYT5cIiArXG5cdFx0XHRcdFx0XCI8L2Rpdj5cIik7XG5cdFx0XHRcdCQoXCIuYWx0Vmlld05vQWx0SGVhZENsb3NlQnRuXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKHRoaXMpLmNzcyhcIm1hcmdpbi10b3BcIiwgLTUwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQvL+ODquOCueODiOi/veWKoFxuXHRcdFx0JChcIiNBbHRWaWV3X05vQWx0X1Jlc3VsdF9XcmFwXCIpLmFwcGVuZCh1bE9iaik7XG5cblx0XHRcdC8v44Gr44KH44Gj44GN44KKXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkKFwiI0FsdFZpZXdfTm9BbHRfV3JhcFwiKS5yZW1vdmVDbGFzcyhcImxvYWRcIik7IH0sIDUwMCk7XG5cblx0XHRcdC8v6ZaJ44GY44KL44Oc44K/44OzXG5cdFx0XHQkKFwiI0FsdFZpZXdfTm9BbHRfaGVhZF9jbG9zZUFsdEJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR0aGlzXy5jbG9zZSgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vQUxU44Oq44K544OI44KS6Z2e6KGo56S644Gr6Kit5a6a44GX44Gm44GE44KL5aC05ZCIXG5cdFx0XHRpZiAoIWFsdGxpc3RidG4gfHwgKCFhbHRfc2hvdyAmJiAhdGl0bGVfc2hvdykpIHtcblx0XHRcdFx0JChcIi5hbHRWaWV3Tm9BbHRIZWFkQ2xvc2VCdG5cIikucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHQvL+mWieOBmOOCi+ODnOOCv+ODs+OCkumdnuihqOekuuOBq+ioreWumuOBl+OBpuOBhOOCi+WgtOWQiFxuXHRcdFx0aWYgKCFjbG9zZWJ0bikge1xuXHRcdFx0XHQkKFwiI0FsdFZpZXdfTm9BbHRfaGVhZF9jbG9zZUFsdEJ0blwiKS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBbHTjgarjgZfjg6rjgrnjg4jov73liqBcblx0XHRhZGROb0FsdExpc3RPYmoob2JqOiBhbnkpOiBKUXVlcnkge1xuXHRcdFx0dmFyIGxpc3RvYmogPSAkKFwiPGxpIGNsYXNzPSdhbHRWaWV3Tm9BbHRVbEJsb2NrX19saXN0Jz48YSBocmVmPScjJyBjbGFzcz0nYWx0Vmlld05vQWx0VWxCbG9ja19faW1nJz48aW1nIHNyYz0nXCIgKyBvYmouc3JjICsgXCInIHdpZHRoPScxMDAnPjwvYT48L2xpPlwiKTtcblxuXHRcdFx0dmFyIHRvcF8gPSBvYmouaW1nX3BhdGgub2Zmc2V0KCkudG9wO1xuXHRcdFx0bGlzdG9iai5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG9wKHRvcF8gLSAyMDApO1xuXHRcdFx0fSk7XG5cdFx0XHRsaXN0b2JqLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG9iai5pbWdfcGF0aC5yZW1vdmVDbGFzcygnQWx0Vmlld18wMTIzNDVfVGlwX3Nob3cnKTtcblx0XHRcdFx0JChcIiNBbHRWaWV3X3dyYXAgZGl2LlRpcFwiKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdGxpc3RvYmoub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG9iai5pbWdfcGF0aC5hZGRDbGFzcygnQWx0Vmlld18wMTIzNDVfVGlwX3Nob3cnKTtcblx0XHRcdFx0JChcIiNBbHRWaWV3X3dyYXAgZGl2LlRpcFwiKS5ub3QoJChcIiNhbHRfdmlld190aXBfXCIgKyBvYmouaWQpKS5oaWRlKCk7XG5cdFx0XHRcdCQoXCIjYWx0X3ZpZXdfdGlwX1wiICsgb2JqLmlkKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBsaXN0b2JqXG5cblx0XHR9O1xuXG5cdFx0Lypcblx0XHQqXG5cdFx0KiDnlLvlg4/jgpLop6PmnpDjgZnjgotcblx0XHQqXG5cdFx0Ki9cblx0XHRnZXRJbWdUYWdEYXRhKGluZGV4OiBudW1iZXIsIGVsZW1lbnQ6IEpRdWVyeSk6IG9iamVjdCB7XG5cblx0XHRcdC8v44K544K/44Kk44Or44K344O844OIXG5cdFx0XHR2YXIgc3R5bGU6IHN0cmluZyA9IG51bGw7XG5cdFx0XHRpZiAoZWxlbWVudC5hdHRyKFwic3R5bGVcIikpIHtcblx0XHRcdFx0c3R5bGUgPSBlbGVtZW50LmF0dHIoXCJzdHlsZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly/nlLvlg4/kvY3nva7jgajjgrXjgqTjgrrjgajlj4LnhaflhYhcblx0XHRcdHZhciB0b3A6IG51bWJlciA9IGVsZW1lbnQub2Zmc2V0KCkudG9wO1xuXHRcdFx0dmFyIGxlZnQ6IG51bWJlciA9IGVsZW1lbnQub2Zmc2V0KCkubGVmdDtcblxuXHRcdFx0Ly/jgr3jg7zjgrlcblx0XHRcdHZhciBzcmM6IHN0cmluZyA9IGVsZW1lbnQuYXR0cihcInNyY1wiKTtcblxuXHRcdFx0Ly/nlLvlg4/mi6HlvLXlrZBcblx0XHRcdHZhciBleHRlbnNpb246IHN0cmluZyA9IG51bGw7XG5cblx0XHRcdC8vIHZhciBmaWxlVHlwZSA9IHRoaXMuZ2V0SW1hZ2VGaWxlVHlwZShlbGVtZW50KTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwidHlwZVwiLGZpbGVUeXBlKVxuXHRcdFx0Ly8gaWYgKHNyYy5pbmRleE9mKCcud2VicCcpICE9IC0xIHx8IHNyYy5pbmRleE9mKCcuanBnJykgIT0gLTEgfHwgc3JjLmluZGV4T2YoJy5qcGVnJykgIT0gLTEgfHwgc3JjLmluZGV4T2YoJy5ibXAnKSAhPSAtMSB8fCBzcmMuaW5kZXhPZignLmdpZicpICE9IC0xIHx8IHNyYy5pbmRleE9mKCcucG5nJykgIT0gLTEgfHwgc3JjLmluZGV4T2YoJy5zdmcnKSAhPSAtMSB8fCBzcmMuaW5kZXhPZignLnRpZmYnKSAhPSAtMSkge1xuXHRcdFx0Ly8gXHR2YXIgZiA9IHNyYy5zcGxpdCgnLicpO1xuXHRcdFx0Ly8gXHRpZiAoMSA8IGYubGVuZ3RoKSB7XG5cdFx0XHQvLyBcdFx0ZXh0ZW5zaW9uID0gZltmLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH1cblxuXG5cdFx0XHQvL0FsdFxuXHRcdFx0dmFyIGFsdDogc3RyaW5nID0gbnVsbDtcblx0XHRcdGlmIChlbGVtZW50LmF0dHIoXCJhbHRcIikpIHtcblx0XHRcdFx0YWx0ID0gZWxlbWVudC5hdHRyKFwiYWx0XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL+OCv+OCpOODiOODq1xuXHRcdFx0dmFyIHRpdGxlOiBzdHJpbmcgPSBudWxsO1xuXHRcdFx0aWYgKGVsZW1lbnQuYXR0cihcInRpdGxlXCIpKSB7XG5cdFx0XHRcdHRpdGxlID0gZWxlbWVudC5hdHRyKFwidGl0bGVcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8v44K144Kk44K6XG5cdFx0XHR2YXIgd2lkdGg6IG51bWJlciA9IGVsZW1lbnQud2lkdGgoKTtcblx0XHRcdHZhciBoZWlnaHQ6IG51bWJlciA9IGVsZW1lbnQuaGVpZ2h0KCk7XG5cdFx0XHR2YXIgd2lkdGhfYXR0cjogbnVtYmVyID0gbnVsbDtcblx0XHRcdHZhciBoZWlnaHRfYXR0cjogbnVtYmVyID0gbnVsbDtcblxuXHRcdFx0Ly9BdHRyaWJ1dGXjgrXjgqTjgrpcblx0XHRcdGlmIChlbGVtZW50LmF0dHIoXCJ3aWR0aFwiKSkge1xuXHRcdFx0XHR3aWR0aF9hdHRyID0gcGFyc2VJbnQoZWxlbWVudC5hdHRyKFwid2lkdGhcIikpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQuYXR0cihcImhlaWdodFwiKSkge1xuXHRcdFx0XHRoZWlnaHRfYXR0ciA9IHBhcnNlSW50KGVsZW1lbnQuYXR0cihcImhlaWdodFwiKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8v44OK44OB44Ol44Op44Or44K144Kk44K644KS6Kq/44G544KLXG5cdFx0XHRlbGVtZW50LmNzcyh7IFwid2lkdGhcIjogXCJhdXRvXCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wiIH0pO1xuXHRcdFx0dmFyIHdpZHRoX25hdHVyYWw6IG51bWJlciA9IGVsZW1lbnQud2lkdGgoKTtcblx0XHRcdHZhciBoZWlnaHRfbmF0dXJhbDogbnVtYmVyID0gZWxlbWVudC5oZWlnaHQoKTtcblx0XHRcdGlmIChzdHlsZSkge1xuXHRcdFx0XHRlbGVtZW50LmF0dHIoXCJzdHlsZVwiLCBzdHlsZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly/lsZ7mgKfjgpLov73liqBcblx0XHRcdGVsZW1lbnQuYXR0cihcImFsdF92aWV3X3RpcFwiLCBpbmRleCk7XG5cblx0XHRcdC8v55S75YOP44Gr44Oe44Km44K544Kq44O844OQ44O844GX44Gf6Zqb44Gu5YuV5L2c44KS44K744OD44OIXG5cdFx0XHR0aGlzLkltYWdlQWN0aW9uKGVsZW1lbnQsIHRydWUpO1xuXG5cdFx0XHR2YXIgaW1nVGFnRGF0YTogb2JqZWN0ID0ge1xuXHRcdFx0XHRpZDogaW5kZXgsXG5cdFx0XHRcdHN0eWxlOiBzdHlsZSxcblx0XHRcdFx0c3JjOiBzcmMsXG5cdFx0XHRcdGltZ19wYXRoOiBlbGVtZW50LFxuXHRcdFx0XHRleHRlbnNpb246IGV4dGVuc2lvbixcblx0XHRcdFx0dG9wOiB0b3AsXG5cdFx0XHRcdGxlZnQ6IGxlZnQsXG5cdFx0XHRcdGFsdDogYWx0LFxuXHRcdFx0XHR0aXRsZTogdGl0bGUsXG5cdFx0XHRcdHdpZHRoOiB3aWR0aCxcblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHQsXG5cdFx0XHRcdHdpZHRoX2F0dHI6IHdpZHRoX2F0dHIsXG5cdFx0XHRcdGhlaWdodF9hdHRyOiBoZWlnaHRfYXR0cixcblx0XHRcdFx0d2lkdGhfbmF0dXJhbDogd2lkdGhfbmF0dXJhbCxcblx0XHRcdFx0aGVpZ2h0X25hdHVyYWw6IGhlaWdodF9uYXR1cmFsXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW1nVGFnRGF0YVxuXHRcdH1cblxuXG5cdFx0ZlJlc2l6ZVRpdGxlVmlldygpIHtcblx0XHRcdC8v55S76Z2i44Oq44K144Kk44K65pmC44Gu5Yem55CGXG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXHRcdFx0JCh3aW5kb3cpLm9uKFwicmVzaXplLkFsdFRpdGxlVmlld18wMTIzNDVcIiwgZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzXy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzXy5BbHRUaXRsZVZpZXdfMDEyMzQ1LkFsdERhdGFbaV0uZnBhdGguY3NzKFwidG9wXCIsIHRoaXNfLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXS5pbWdfcGF0aC5vZmZzZXQoKS50b3ApO1xuXHRcdFx0XHRcdHRoaXNfLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXS5mcGF0aC5jc3MoXCJsZWZ0XCIsIHRoaXNfLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpXS5pbWdfcGF0aC5vZmZzZXQoKS5sZWZ0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBUaXDkvY3nva7oqr/mlbRcblx0XHRcdFx0dGhpc18uZnVraWRhc2hpQ1NTKCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG4gICAgICAgIC8v44OE44O844Or44OB44OD44OX44GuIOKWvCDpg6jliIZcblx0XHRmdWtpZGFzaGlDU1MoKSB7XG5cdFx0XHR2YXIgdGhpc18gPSB0aGlzO1xuXHRcdFx0Ly/jg4TjgqTjg7zjg6vjg4Hjg4Pjg5fjga7lkLnjgY3lh7rjgZfjga7mlrnlkJFcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vICQoXCIuVGlwIC5mdWtpLXRvcCwgLlRpcCAuZnVraS1ib3R0b21cIikucmVtb3ZlKCk7XG5cdFx0XHRcdCQoXCIuVGlwXCIpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIGlkID0gJCh0aGlzKS5hdHRyKFwiZGF0YVwiKTtcblx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoXCIuZnVraS10b3BcIikucmVtb3ZlKCk7XG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKFwiLmZ1a2ktYm90dG9tXCIpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdCQodGhpcykuc2hvdygpO1xuXHRcdFx0XHRcdC8vIHZhciB0b3AgPSAkKHRoaXMpLm9mZnNldCgpLnRvcDtcblx0XHRcdFx0XHR2YXIgdG9wID0gdGhpc18uQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2lkXS50b3A7XG5cdFx0XHRcdFx0dmFyIGhlaWdodCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0XHRpZiAodG9wIC0gaGVpZ2h0IDwgMCkge1xuXHRcdFx0XHRcdFx0Ly8g4payIOOBruaWueWQkVxuXG5cdFx0XHRcdFx0XHR2YXIgX2hlaWdodCA9IHRoaXNfLkFsdFRpdGxlVmlld18wMTIzNDUuQWx0RGF0YVtpZF0udG9wICsgdGhpc18uQWx0VGl0bGVWaWV3XzAxMjM0NS5BbHREYXRhW2lkXS5oZWlnaHQ7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyhcInRvcFwiLCAoX2hlaWdodCkpO1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5wcmVwZW5kKFwiPGRpdiBjbGFzcz0nZnVraS10b3AnPjwvZGl2PlwiKVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIOKWvCDjga7mlrnlkJFcblx0XHRcdFx0XHRcdCQodGhpcykuY3NzKFwidG9wXCIsICh0b3AgLSBoZWlnaHQgLSA3KSk7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2Z1a2ktYm90dG9tJz48L2Rpdj5cIilcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgMzAwKTtcblx0XHR9XG5cblx0XHQvLyBnZXRJbWFnZUZpbGVUeXBlKGFycmF5QnVmZmVyKSB7XG5cdFx0Ly8gXHR2YXIgYmEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG5cdFx0Ly8gXHR2YXIgaGVhZGVyU3RyID0gXCJcIjtcblx0XHQvLyBcdHZhciBoZWFkZXJIZXggPSBcIlwiO1xuXHRcdC8vIFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7IC8vIOWni+OCgeOBrjEw5YCL5YiG44KS6Kqt44KAXG5cdFx0Ly8gXHRcdGhlYWRlckhleCArPSBiYVtpXS50b1N0cmluZygxNik7IC8vIDE26YCy5paH5a2X5YiX44Gn6Kqt44KAXG5cdFx0Ly8gXHRcdGhlYWRlclN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJhW2ldKTsgLy8g5paH5a2X5YiX44Gn6Kqt44KAXG5cdFx0Ly8gXHR9XG5cdFx0Ly8gXHR2YXIgZmlsZVR5cGUgPSBcInVua25vd25cIjtcblx0XHQvLyBcdGlmIChoZWFkZXJIZXguaW5kZXhPZihcImZmZDhcIikgIT0gLTEpIHsgLy8gSlBH44Gv44OY44OD44OA44O844Gr44CMZmZkOOOAjeOCkuWQq+OCgFxuXHRcdC8vIFx0XHRmaWxlVHlwZSA9IFwiSlBHXCI7XG5cdFx0Ly8gXHR9IGVsc2UgaWYgKGhlYWRlclN0ci5pbmRleE9mKFwiUE5HXCIpICE9IC0xKSB7IC8vIFBOR+OBr+ODmOODg+ODgOODvOOBq+OAjFBOR+OAjeOCkuWQq+OCgFxuXHRcdC8vIFx0XHRmaWxlVHlwZSA9IFwiUE5HXCI7XG5cdFx0Ly8gXHR9IGVsc2UgaWYgKGhlYWRlclN0ci5pbmRleE9mKFwiR0lGXCIpICE9IC0xKSB7IC8vIEdJRuOBr+ODmOODg+ODgOODvOOBq+OAjEdJRuOAjeOCkuWQq+OCgFxuXHRcdC8vIFx0XHRmaWxlVHlwZSA9IFwiR0lGXCI7XG5cdFx0Ly8gXHR9IGVsc2UgaWYgKGhlYWRlclN0ci5pbmRleE9mKFwiQk1cIikgIT0gLTEpIHsgLy8gQk1Q44Gv44OY44OD44OA44O844Gr44CMQk3jgI3jgpLlkKvjgoBcblx0XHQvLyBcdFx0ZmlsZVR5cGUgPSBcIkJNUFwiO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0Y29uc29sZS5sb2coXCJmaWxlVHlwZT1cIiArIGZpbGVUeXBlICsgXCIgaGVhZGVyU3RyPVwiICsgaGVhZGVyU3RyICsgXCIgaGVhZGVySGV4PVwiICsgaGVhZGVySGV4KTtcblx0XHQvLyBcdHJldHVybiBmaWxlVHlwZTtcblx0XHQvLyB9XG5cblxuXHRcdGNsb3NlKCkge1xuXHRcdFx0aWYgKDAgPCAkKFwiI0FsdFZpZXdfMDEyMzQ1XCIpLmxlbmd0aCkge1xuXHRcdFx0XHQkKFwiI0FsdFZpZXdfd3JhcCBkaXYuVGlwIC5jbG9zZUJ0blwiKS5vZmYoXCJjbGljay5UaXBcIik7XG5cdFx0XHRcdC8v44OE44O844Or44OB44OD44OX44Ko44Oq44Ki44KS5YmK6Zmk44GZ44KLXG5cdFx0XHRcdCQoXCIjQWx0Vmlld18wMTIzNDVcIikucmVtb3ZlKCk7XG5cdFx0XHRcdCQoXCIjQWx0Vmlld19Ob0FsdF9XcmFwXCIpLnJlbW92ZSgpO1xuXHRcdFx0XHQkKFwiaW1nXCIpLnJlbW92ZUF0dHIoXCJhbHRfdmlld190aXBcIik7XG5cblx0XHRcdFx0dGhpcy5JbWFnZUFjdGlvbigkKFwiaW1nXCIpLCBmYWxzZSk7XG5cblx0XHRcdFx0JCh3aW5kb3cpLm9mZihcInJlc2l6ZS5BbHRUaXRsZVZpZXdfMDEyMzQ1XCIpO1xuXHRcdFx0XHQvLyBiTW92ZUNhcF9hID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgZXZlbnRzLkV2ZW50KFwic2hvd1wiLCBmYWxzZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdEltYWdlQWN0aW9uKHRhcmdldDogYW55LCBhZGQ6IGJvb2xlYW4pIHtcblx0XHRcdGlmIChhZGQpIHtcblx0XHRcdFx0dGFyZ2V0Lm9uKFwibW91c2VvdmVyLkFsdFRpdGxlVmlld18wMTIzNDVcIiwgdGhpcy5JbWFnZU92ZXIpO1xuXHRcdFx0XHR0YXJnZXQub24oXCJtb3VzZW91dC5BbHRUaXRsZVZpZXdfMDEyMzQ1XCIsIHRoaXMuSW1hZ2VPdXQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFyZ2V0Lm9mZihcIm1vdXNlb3Zlci5BbHRUaXRsZVZpZXdfMDEyMzQ1XCIsIHRoaXMuSW1hZ2VPdmVyKTtcblx0XHRcdFx0dGFyZ2V0Lm9mZihcIm1vdXNlb3V0LkFsdFRpdGxlVmlld18wMTIzNDVcIiwgdGhpcy5JbWFnZU91dCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0SW1hZ2VPdmVyKCkge1xuXHRcdFx0dmFyIHBhdGggPSAkKHRoaXMpO1xuXHRcdFx0JChcIiNBbHRWaWV3X3dyYXAgZGl2LlRpcFwiKS5oaWRlKCk7XG5cblx0XHRcdHZhciBpZCA9IHBhdGguYXR0cihcImFsdF92aWV3X3RpcFwiKTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGlkKVxuXHRcdFx0JChcIiNhbHRfdmlld190aXBfXCIgKyBpZCkuc2hvdygpO1xuXG5cdFx0XHRwYXRoLmFkZENsYXNzKCdBbHRWaWV3XzAxMjM0NV9UaXBfc2hvdycpO1xuXHRcdH1cblx0XHRJbWFnZU91dCgpIHtcblx0XHRcdHZhciBwYXRoID0gJCh0aGlzKTtcblx0XHRcdCQoXCIjQWx0Vmlld193cmFwIGRpdi5UaXBcIikuc2hvdygpO1xuXHRcdFx0cGF0aC5yZW1vdmVDbGFzcygnQWx0Vmlld18wMTIzNDVfVGlwX3Nob3cnKTtcblx0XHR9XG5cblx0fVxuXG5cblxuXG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwibW9kdWxlL01ldGFWaWV3LnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtb2R1bGUvQWx0Vmlldy50c1wiIC8+XG5pbXBvcnQgTWV0YVZpZXcgPSBNZXRhVmlld01vZHVsZS5NZXRhVmlldztcbmltcG9ydCBBbHRWaWV3ID0gQWx0Vmlld01vZHVsZS5BbHRWaWV3O1xuY2xhc3MgQ29udGVudFNjcmlwdCB7XG4gICAgbWV0YV92aWV3OiBNZXRhVmlldyA9IG5ldyBNZXRhVmlldygpO1xuICAgIGFsdF92aWV3OiBBbHRWaWV3ID0gbmV3IEFsdFZpZXcoKTtcbiAgICBzaG93QWx0OiBib29sZWFuID0gZmFsc2U7XG4gICAgc2hvd01ldGE6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGFueW1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgIOODneODg+ODl+OCouODg+ODl+OBjOmWi+OBhOOBpuODoeODg+OCu+ODvOOCuOOCkuWPl+OBkeOBn1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGFueW1lc3NhZ2UuY29udGV0U3RhdGUgPT0gXCJBcmVZb3VSZWFkeT9cIikge1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRldFN0YXRlOiBcIk9rR28hXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgQWx06KGo56S6XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoYW55bWVzc2FnZS5mcm9tUG9wVXAgPT0gXCJBbHRcIikge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zaG93QWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWx0X3ZpZXcuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWx0X3ZpZXcuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgIOODoeOCv+ihqOekulxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGFueW1lc3NhZ2UuZnJvbVBvcFVwID09IFwiTWV0YVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dNZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YV92aWV3LnNob3coKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFfdmlldy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgUE9QVVDjgavjg6zjgrnjg53jg7PjgrnjgpLov5TjgZlcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChhbnltZXNzYWdlLmZyb21Qb3BVcCA9PSBcIk9wZW4hXCIgfHwgYW55bWVzc2FnZS5mcm9tUG9wVXAgPT0gXCJBbHRcIiB8fCBhbnltZXNzYWdlLmZyb21Qb3BVcCA9PSBcIk1ldGFcIikge1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgICAgIENvbnRlbnRzU2hvd0FsdDogdGhpcy5zaG93QWx0LFxuICAgICAgICAgICAgICAgICAgICBDb250ZW50c1Nob3dNZXRhOiB0aGlzLnNob3dNZXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIEFsdFRpdGxlVmlld18wMTIzNDUgPSB7fTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5hbHRfdmlldy5hZGRFdmVudExpc3RlbmVyKFwic2hvd1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0FsdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1ldGFfdmlldy5hZGRFdmVudExpc3RlbmVyKFwic2hvd1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93TWV0YSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dNZXRhID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxufVxuXG50aGlzLkNvbnRlbnRTY3JpcHQoKTtcbiJdfQ==
