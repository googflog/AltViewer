/// <reference path="EventDispathcer.ts"/>
/// <reference path="jquery.d.ts" />

module AltViewModule {
	export class AltView extends events.EventDispatcher {
		ObjAltViewBlock: any = {};
		ObjAltViewContent: any = {};
		AltTitleView_012345: any = {};
		Alt_Fukidashi_txt: string;
		alt_nashi: number = 0;
		title_nashi: number = 0;
		constructor() {
			super();
		}

		show() {

			var this_ = this;

			//ローカライズ化
			this.Alt_Fukidashi_txt = chrome.i18n.getMessage("Alt_Fukidashi_txt");

			var this_ = this;
			this.dispatchEvent(new events.Event("show", true));

			//ツールチップの表示エリアを追加する
			this.ObjAltViewBlock = $("<div id='AltView_012345'></div>");
			$("body").append(this.ObjAltViewBlock);

			this.ObjAltViewContent = $("<div id='AltView_wrap'></div>");
			this.ObjAltViewBlock.append(this.ObjAltViewContent);


			//
			this.AltTitleView_012345.AltData = [];

			//ページ上の画像のデータを調べる
			$("img").each(function(index, element) {
				var obj = this_.getImgTagData(index, $(element))
				this_.AltTitleView_012345.AltData.push(obj);
			});

			console.log(this_.AltTitleView_012345)

			//Alt無しの数
			this.noAltCount(this.AltTitleView_012345.AltData);

			//収集したデータを基にツールチップを追加
			for (var i = 0; i < this.AltTitleView_012345.AltData.length; i++) {

				var TipData = "";

				//alt と title
				TipData += this.addAltTitle(this.AltTitleView_012345.AltData[i], true, true);

				//閉じるボタン
				TipData += this.addCloseBtn(this.AltTitleView_012345.AltData[i]);

				//ImgSize
				TipData += this.addImgSize(this.AltTitleView_012345.AltData[i]);

				//Naturalサイズと違う場合表示
				TipData += this.addImgNaturalSize(this.AltTitleView_012345.AltData[i]);

				//
				TipData += this.addImgSrc(this.AltTitleView_012345.AltData[i]);

				//
				TipData += this.addImgExtension(this.AltTitleView_012345.AltData[i]);

				//ツールチップを表示エリアに追加する
				var tipObj: any = this.addTooltip(this.AltTitleView_012345.AltData[i], TipData)
				$("#AltView_wrap").append(tipObj);

			}

			//ツイールチップの吹き出しの方向
			this.fukidashiCSS();


			//ツールチップマウスオーバー時
			$("#AltView_wrap div.Tip").mouseover(function() {
				var thisObj = $(this);
				var id = thisObj.attr("data");
				this_.AltTitleView_012345.AltData[id].img_path.addClass('AltView_012345_Tip_show');

				thisObj.css("z-index", 99999);
				$("#AltView_wrap div.Tip").not(thisObj).hide();
				thisObj.show();
			})
			$("#AltView_wrap div.Tip").mouseout(function() {
				var thisObj = $(this);
				var id = thisObj.attr("data");
				this_.AltTitleView_012345.AltData[id].img_path.removeClass('AltView_012345_Tip_show');

				thisObj.css("z-index", 99998);
				$("#AltView_wrap div.Tip").show();
			})

			$("#AltView_wrap div.Tip .closeBtn").on("click", function() {
				var thisObj = $(this);
				var id = thisObj.attr("data");
				var imgObj = this_.AltTitleView_012345.AltData[id].img_path
				imgObj.removeClass('AltView_012345_Tip_show');
				imgObj.removeAttr('alt_view_tip');
				this_.ImageAction(imgObj, false);

				$("#alt_view_tip_" + id).remove();
				// delete this_.AltTitleView_012345.AltData[id];

				$("#AltView_wrap div.Tip").show();
			})



			//Alt無しの数をconsoleに表示
			this.noAltShowConsoleLog();
			this.noTitleShowConsoleLog();

			//Alt無しリスト
			this.addNoAltList();

		}













		//ツールチップを追加
		addTooltip(data: any, tipData: string): any {

			//Tipに表示されるデータをまとめる
			var Tip = $("<div id='alt_view_tip_" + data.id + "' class='Tip Tip-" + data.id + "' data='" + data.id + "'><div class='txt'>" + tipData + "</div></div>");

			//
			if (data.width != data.naturalW) {
				Tip.find(".w").removeClass("set").addClass("noset");
			}
			if (data.height != data.naturalH) {
				Tip.find(".h").removeClass("set").addClass("noset");
			}

			//なにもセットされていない…
			if (!data.alt && !data.title) {
				Tip.addClass("no-set")
			}

			//Tipの位置を設定
			Tip.css({ "top": data.top, "left": data.left, "max-width": data.width, "display": "none" })

			//吹き出しの位置を設定
			Tip.find(".fuki").css("margin-left", 10);

			data.fpath = Tip;

			return Tip
		}


		addAltTitle(data: any, showAlt: boolean, showTitle: boolean): string {

			var _tipData: string = "";

			if (showAlt && showTitle) {
				//alt と title 両方とも設定されていた
				if (data.alt && data.title) {
					//AltとTitleが同じがチェック
					if (data.alt == data.title) {
						//同じ
						_tipData += "Alt,Title: [<span class='at set'>" + data.alt + "</span>]";
					} else {
						//違う
						_tipData += "Alt: [<span class='at noset'>" + data.alt + "</span>]";
						_tipData += "<br />Title: [<span class='at noset'>" + data.title + "</span>]";
					}
				} else {
					//alt
					if (data.alt) {
						_tipData += "Alt: [<span class='at set'>" + data.alt + "</span>]"
					} else {
						_tipData += "Alt: [" + "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>]"
					}

					//title
					if (data.title) {
						_tipData += "<br />Title: [<span class='at set'>" + data.title + "</span>]"
					} else {
						_tipData += "<br />Title: [" + "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>]"
					}
				}
			} else {
				if (showAlt) {
					if (data.alt) {
						_tipData += "Alt: [<span class='at set'>" + data.alt + "</span>]"
					} else {
						_tipData += "Alt: [" + "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>]"
					}
				}
				if (showTitle) {
					if (data.title) {
						if (showAlt) _tipData += "<br />";
						_tipData += "Title: [<span class='at set'>" + data.title + "</span>]"
					} else {
						_tipData += "Title: [" + "<span class='at noset'>" + this.Alt_Fukidashi_txt + "</span>]"
					}
				}
			}
			return _tipData
		}

		//閉じるボタン
		addCloseBtn(data: any) {
			return '<div class="closeBtn" data="' + data.id + '"><img src="' + chrome.runtime.getURL("images/close.svg") + '" alt="CloseBtn" width="10"></div>'
		}




		//画像サイズを追加
		addImgSize(data: any): string {

			var _tipData: string = "";
			if (data.width_attr && data.height_attr) {
				//画像サイズが設定されている
				_tipData += "<br />ImgSize: [<span class='set'><span class='set w'>" + data.width_attr + "</span> x <span class='set h'>" + data.height_attr + "</span> px</span>]"
			} else {
				//画像サイズが設定されていない場合
				if (!data.width_attr && !data.height_attr) {
					_tipData += "<br />ImgSize: [<span class='set'><span class='noset'>" + this.Alt_Fukidashi_txt + "</span></span>]";
				} else {
					if (data.width_attr) {
						_tipData += "<br />ImgSize: [<span class='set'><span class='set w'>" + data.width_attr + "</span> x ";
					} else {
						_tipData += "<br />ImgSize: [<span class='set'><span class='noset'>" + this.Alt_Fukidashi_txt + "</span>" + " x ";
					}
					if (data.height_attr) {
						_tipData += "<span class='set h'>" + data.height_attr + "</span> px</span>]";
					} else {
						_tipData += "<span class='noset'>" + this.Alt_Fukidashi_txt + "</span></span>]";
					}
				}
			}
			return _tipData;
		}

		//ナチュラルサイズを追加
		addImgNaturalSize(data: any): string {
			var _tipData: string = "";
			if (data.width != data.width_natural || data.height != data.height_natural) {
				_tipData = "<br />Natural: [<span class='set'>" + data.width_natural + " x " + data.height_natural + " px</span>]"
			}
			return _tipData;
		}

		//画像パス
		addImgSrc(data: any): string {
			return "<br />Src: [<span class='set'>" + data.src + "</span>]"
		}

		//拡張子
		addImgExtension(data: any): string {
			var _tipData: string = "";
			if (data.extension) {
				_tipData = "<br />Extension: [<span class='set'>" + data.extension + "</span>]";
			} else {
				_tipData = "<br />Extension: [<span class='set'>" + this.Alt_Fukidashi_txt + "</span>]";
			}
			return _tipData;
		}

		//Altなしの数
		noAltCount(data: any): void {
			var _alt_nashi: number = 0;
			var _title_nashi: number = 0;
			for (var i = 0; i < data.length; i++) {
				if (!data[i].alt) { _alt_nashi++; }
				if (!data[i].title) { _title_nashi++; }
			}
			this.alt_nashi = _alt_nashi;
			this.title_nashi = _title_nashi;
		}

		//Altなしの数を console.log に表示
		noAltShowConsoleLog(): void {
			console.log("Alt なし : ", this.alt_nashi, "個");
		}
		noTitleShowConsoleLog(): void {
			console.log("Title なし : ", this.title_nashi, "個");
		}

		//
		addNoAltList(): void {
			if (0 < this.alt_nashi) {
				$("html").prepend(
					"<div id='AltView_NoAlt_Wrap'>" +
					"<div id='AltView_NoAlt_Result_Wrap'><ul id='AltView_NoAlt_Result'></ul></div>" +
					"<div id='AltView_NoAlt_head_closebtn'>Altなし <span>" + this.alt_nashi + "</span> 個</div>" +
					"</div>");


				for (var i = 0; i < this.AltTitleView_012345.AltData.length; i++) {
					if (!this.AltTitleView_012345.AltData[i].alt) {
						this.addNoAltListObj(this.AltTitleView_012345.AltData[i])
					}
				}
			}
			$("#AltView_NoAlt_Wrap").css({ "margin-top": -160 });
		}

		addNoAltListObj(_obj_root: any): void {
			var _listobj: any = $("<li id='AltView_No_AltCount'><img src='" + _obj_root.src + "' width='100'></li>");
			var v = _obj_root.path.offset().top;
			$(_listobj).on("click", function() {
				$(window).scrollTop(v - 200);
			});
			$(_listobj).on("mouseout", function() {
				_obj_root.path.removeClass('AltView_012345_Tip_show');
				$("#AltView_wrap div.Tip").show();
			});
			$(_listobj).on("mouseover", function() {
				_obj_root.path.addClass('AltView_012345_Tip_show');
				$("#AltView_wrap div.Tip").not($("#alt_view_tip_" + _obj_root.id)).hide();
				$("#alt_view_tip_" + _obj_root.id).show();
			});
			$("#AltView_NoAlt_Result").append(_listobj);

		};

		//画像を解析する
		getImgTagData(index: number, element: JQuery): object {

			//スタイルシート
			var style: string = null;
			if (element.attr("style")) {
				style = element.attr("style");
			}

			//画像位置とサイズと参照先
			var top: number = element.offset().top;
			var left: number = element.offset().left;

			//ソース
			var src: string = element.attr("src");

			//画像拡張子
			var extension: string = null;
			var f = src.split('.');
			if (1 < f.length) {
				extension = f[f.length - 1].toLowerCase();
			}

			//Alt
			var alt: string = null;
			if (element.attr("alt")) {
				alt = element.attr("alt");
			}

			//タイトル
			var title: string = null;
			if (element.attr("title")) {
				title = element.attr("title");
			}

			//サイズ
			var width: number = element.width();
			var height: number = element.height();
			var width_attr: number = null;
			var height_attr: number = null;

			//Attributeサイズ
			if (element.attr("width")) {
				width_attr = parseInt(element.attr("width"));
			}
			if (element.attr("height")) {
				height_attr = parseInt(element.attr("height"));
			}

			//ナチュラルサイズを調べる
			element.css({ "width": "auto", "height": "auto" });
			var width_natural: number = element.width();
			var height_natural: number = element.height();
			if (style) {
				element.attr("style", style);
			} else {
				element.removeAttr("style");
			}

			//属性を追加
			element.attr("alt_view_tip", index);

			//画像にマウスオーバーした際の動作をセット
			this.ImageAction(element, true);

			var imgTagData: object = {
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
			}
			return imgTagData
		}


		fResizeTitleView() {
			//画面リサイズ時の処理

			$(window).on("resize.AltTitleView_012345", function() {

				for (var i = 0; i < AltTitleView_012345.AltData.length; i++) {
					AltTitleView_012345.AltData[i].fpath.css("top", AltTitleView_012345.AltData[i].path.offset().top);
					AltTitleView_012345.AltData[i].fpath.css("left", AltTitleView_012345.AltData[i].path.offset().left);

					// Tip位置調整
					var top = AltTitleView_012345.AltData[i].fpath.offset().top;
					var height = AltTitleView_012345.AltData[i].fpath.height();
					if (top - height < 0) {
						// ▲ の方向
						var id = AltTitleView_012345.AltData[i].fpath.attr("data");
						var height = AltTitleView_012345.AltData[id].height;
						AltTitleView_012345.AltData[i].fpath.css("top", (height));
					} else {
						// ▼ の方向
						AltTitleView_012345.AltData[i].fpath.css("top", (top - height));
					}
				}

			});

		}

		//ツールチップの ▼ 部分
		fukidashiCSS() {
			var this_ = this;
			//ツイールチップの吹き出しの方向
			setTimeout(function() {
				$(".Tip").each(function() {
					$(this).show();
					var top = $(this).offset().top;
					var height = $(this).outerHeight();
					if (top - height < 0) {
						// ▲ の方向
						var id = $(this).attr("data");
						var _height = this_.AltTitleView_012345.AltData[id].top + this_.AltTitleView_012345.AltData[id].height;
						$(this).css("top", (_height));
						$(this).prepend("<div class='fuki-top'></div>")
					} else {
						// ▼ の方向
						$(this).css("top", (top - height - 7));
						$(this).append("<div class='fuki-bottom'></div>")
					}
				});
			}, 100);


		}


		close() {
			if (0 < $("#AltView_012345").length) {
				//ツールチップエリアを削除する
				$("#AltView_012345").remove();
				$("#AltView_NoAlt_Wrap").remove();
				$("img").removeAttr("alt_view_tip");

				this.ImageAction($("img"), false);

				$(window).off("resize.AltTitleView_012345");
				// bMoveCap_a = false;
				this.dispatchEvent(new events.Event("show", false));
			}
		}

		ImageAction(target: any, add: boolean) {
			if (add) {
				target.on("mouseover.AltTitleView_012345", this.ImageOver);
				target.on("mouseout.AltTitleView_012345", this.ImageOut);
			} else {
				target.off("mouseover.AltTitleView_012345", this.ImageOver);
				target.off("mouseout.AltTitleView_012345", this.ImageOut);
			}
		}

		ImageOver() {
			var path = $(this);
			$("#AltView_wrap div.Tip").hide();

			var id = path.attr("alt_view_tip");
			console.log(id)
			$("#alt_view_tip_" + id).show();

			path.addClass('AltView_012345_Tip_show');
		}
		ImageOut() {
			var path = $(this);
			$("#AltView_wrap div.Tip").show();
			path.removeClass('AltView_012345_Tip_show');
		}

	}






}
