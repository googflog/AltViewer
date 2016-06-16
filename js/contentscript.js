var loadComp = false;

window.onload = function() {
	loadComp = true;
	//console.log("loadComp: ",loadComp);
}


$(function() {
	var bMoveCap_a = false;
	var bMoveCap_m = false;

	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.contetState == "OK_Desuka") {
				sendResponse({
					contetLoaded: true
				});
			}
		}
	);


	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.fromPopUp == "click") {
				fAddParam_a();
			}
			if (request.fromPopUp == "click_m") {
				fAddParam_m();
			}
			sendResponse({
				bMoveCap_a: bMoveCap_a,
				bMoveCap_m: bMoveCap_m
			});
		}
	);

	function function_name(target, argument) {
		if (target) {
			return argument + target
		} else {
			return ""
		};
	};

	//メタ表示
	function fAddParam_m() {
		if ($("div#TitleView_012345").is('*')) {
			fRemoveTitleView();
			bMoveCap_m = false;

		} else {
			bMoveCap_m = true;
			$("html").addClass('TitleView_012345_show');
			//ツールチップの表示エリアを追加する
			$("body").append("<div id='TitleView_012345'><div id='TitleView_Contents_012345'></div></div>");


			$("#TitleView_Contents_012345").append("<h3>Title: " + $("title").text() + "</h3>");
			$("#TitleView_Contents_012345").append("<hr>");
			$("#TitleView_Contents_012345").append("<h3>Meta:</h3>");

			$("meta").each(function() {
				var meta = "";
				var imgis = 0;
				var img = "";
				for (var j = 0; j < $(this).context.attributes.length; j++) {
					var name = $(this).context.attributes[j].nodeName;
					var val = $(this).context.attributes[j].nodeValue;
					var _val = $(this).context.attributes[j].nodeValue;
					if (0 <= val.indexOf("http")) {
						//URLか？
						_val = "<a href='" + val.toString() + "' target='_blank'>" + val.toString() + "</a>"
					}

					if (0 <= val.toLowerCase().indexOf("image")) {
						//画像か？
						imgis++;
					}
					if (0 <= val.toLowerCase().indexOf("http")) {
						//画像か？
						imgis++;
					}


					meta += name + ' = &quot;<span>' + _val + '</span>&quot; ';

					if (2 <= imgis) {
						img = "<div class='img'><a href=" + val + " target='_blank'><img src=" + val + " width=150 ></a></div>"
					}
				};

				if (2 <= imgis) {
					meta += img;
				}


				$("div#TitleView_Contents_012345").append("<div class='metas'>" + meta + "</div>");
			})

			$("#TitleView_012345").append("<div id='TitleView_closebtn_012345'>× CLOSE</div>");
			$("#TitleView_012345").prepend("<div id='TitleView_closebtn_head_012345'>×</div>");


			var titleview_012345_time;
			clearTimeout(titleview_012345_time);

			$("#TitleView_012345").css({ "top": -$("#TitleView_012345").height()-100 });
			$("#TitleView_012345").addClass("transition_mode");
			titleview_012345_time = setTimeout(function() {
				$("#TitleView_012345").css({ "top": 0 }).one('webkitTransitionEnd', function() {
					$(this).addClass("active");
					$("#TitleView_closebtn_head_012345, #TitleView_closebtn_012345").addClass("active");
				});
				fResizeTitleView();

			}, 200);

			$("#TitleView_closebtn_012345, #TitleView_closebtn_head_012345, html").click(function(e) {
				fRemoveTitleView();
				$("#TitleView_closebtn_head_012345, #TitleView_closebtn_012345").removeClass("active");
			});



			$("#TitleView_012345").click(function(e) {
				e.stopPropagation();
			});

			var resizeTime = false;
			$(window).on('resize', window, function(event) {
				if (resizeTime !== false) {
					clearTimeout(resizeTime);
				}
				resizeTime = setTimeout(function() {
					fResizeTitleView();
				}, 200);
			});

			function fResizeTitleView() {
				if ($(window).height() < $("#TitleView_Contents_012345").height()+$("#TitleView_closebtn_012345").height()) {
					$("#TitleView_012345").height($(window).height());
				} else {
					$("#TitleView_012345").height($("#TitleView_Contents_012345").height()+$("#TitleView_closebtn_012345").height()+150);
				};
			};
		}

		function fRemoveTitleView() {
			if ($("#TitleView_012345").hasClass("active")) {
				$("#TitleView_012345").css({ top: -$("#TitleView_012345").height() - 20 }).one('webkitTransitionEnd', function() {
					$("#TitleView_012345").remove();
					$("html").removeClass('TitleView_012345_show');
					bMoveCap_m = false;
				});
			}
		}
	}
	var AltTitleView_012345 = {};





	//Alt表示
	function fAddParam_a() {

		var Alt_Fukidashi_txt = chrome.i18n.getMessage("Alt_Fukidashi_txt");
		if (0 < $("#AltView_012345").length) {
			$("#AltView_012345").remove();
			$("img").removeAttr("alt_view_tip");

			$("img").off("mouseover.AltTitleView_012345", fImageOver);
			$("img").off("mouseout.AltTitleView_012345", fImageOut);
			$(window).off("resize.AltTitleView_012345");
			bMoveCap_a = false;
		} else {
			bMoveCap_a = true;
			//ツールチップの表示エリアを追加する
			$("body").append("<div id='AltView_012345'><div id='AltView_wrap'></div></div>");


			//ページ上の画像のデータを調べる
			// AltTitleView_012345.AltData = [{ id: "", src: "", top: 0, left: 0, alt: "", title: "", width: 0, height: 0, naturalW: 0, naturalH: 0, path: "", fpath: "" }];
			AltTitleView_012345.AltData = [];
			$("img").each(function(index, element) {

				var id = index;

				//画像位置とサイズと参照先
				var top = $(this).offset().top;
				var left = $(this).offset().left;
				var width = $(this).width();
				var height = $(this).height();
				var src = $(this).attr("src");
				var path = $(this);

				//Alt
				var alt = "";
				if ($(this).attr("alt")) {
					alt = $(this).attr("alt");
				} else {
					alt = "alt_nashi_12340";
				}

				//タイトル
				var title = "";
				if ($(this).attr("title")) {
					title = $(this).attr("title");
				} else {
					title = "title_nashi_12340";
				}

				//サイズ
				var width = "";
				if ($(this).attr("width")) {
					width = parseInt($(this).attr("width"));
				} else {
					width = "width_nashi_12340";
				}
				var height = "";
				if ($(this).attr("height")) {
					height = parseInt($(this).attr("height"));
				} else {
					height = "height_nashi_12340";
				}

				//ナチュラルサイズを調べる
				var vieW = parseInt($(this).width());
				var vieH = parseInt($(this).height());
				$(this).css({ "width": "auto", "height": "auto" });
				var naW = $(this).width();
				var naH = $(this).height();
				$(this).width(vieW);
				$(this).height(vieH);

				//属性を追加
				$(this).attr("alt_view_tip", index)

				//画像にマウスオーバーした際の動作をセット
				$(this).on("mouseover.AltTitleView_012345", fImageOver);
				$(this).on("mouseout.AltTitleView_012345", fImageOut);



				AltTitleView_012345.AltData.push({ id: id, src: src, top: top, left: left, alt: alt, title: title, width: vieW, height: vieH, naturalW: naW, naturalH: naH, path: path })
			});

			for (i = 0; i < AltTitleView_012345.AltData.length; i++) {

				var TipData = "";

				//alt と title 両方とも設定されていた
				if (AltTitleView_012345.AltData[i].alt != "alt_nashi_12340" && AltTitleView_012345.AltData[i].title != "title_nashi_12340") {
					//AltとTitleが同じがチェック
					if (AltTitleView_012345.AltData[i].alt == AltTitleView_012345.AltData[i].title) {
						//同じ
						TipData += "Alt,Title: [<span class='at set'>" + AltTitleView_012345.AltData[i].alt + "</span>]";
					} else {
						//違う
						TipData += "Alt: [<span class='at noset'>" + AltTitleView_012345.AltData[i].alt + "</span>]";
						TipData += "<br />Title: [<span class='at noset'>" + AltTitleView_012345.AltData[i].title + "</span>]";
					}
				} else {
					//alt
					if (AltTitleView_012345.AltData[i].alt != "alt_nashi_12340") {
						TipData += "Alt: [<span class='at set'>" + AltTitleView_012345.AltData[i].alt + "</span>]"
					} else {
						TipData += "Alt: [" + "<span class='at noset'>" + Alt_Fukidashi_txt + "</span>]"
					}

					//title
					if (AltTitleView_012345.AltData[i].title != "title_nashi_12340") {
						TipData += "<br />Title: [<span class='at set'>" + AltTitleView_012345.AltData[i].title + "</span>]"
					} else {
						TipData += "<br />Title: [" + "<span class='at noset'>" + Alt_Fukidashi_txt + "</span>]"
					}
				}



				//ImgSize
				if (AltTitleView_012345.AltData[i].width != "width_nashi_12340" && AltTitleView_012345.AltData[i].height != "height_nashi_12340") {
					//画像サイズが設定されている
					TipData += "<br />ImgSize: [<span class='set'><span class='set w'>" + AltTitleView_012345.AltData[i].width + "</span> x <span class='set h'>" + AltTitleView_012345.AltData[i].height + "</span> px</span>]"
				} else {
					//画像サイズが設定されていない場合

					if (AltTitleView_012345.AltData[i].width != "width_nashi_12340") {
						TipData += "<br />ImgSize: [<span class='set'><span class='set w'>" + AltTitleView_012345.AltData[i].width + "</span> x ";
					} else {
						TipData += "<br />ImgSize: [<span class='set'><span class='noset'>" + Alt_Fukidashi_txt + "</span>" + " x ";
					}

					if (AltTitleView_012345.AltData[i].height != "height_nashi_12340") {
						TipData += "<span class='set h'>" + AltTitleView_012345.AltData[i].height + "</span> px</span>]";
					} else {
						TipData += "<span class='noset'>" + Alt_Fukidashi_txt + "</span></span>]";
					}
				}

				//Naturalサイズ
				if (AltTitleView_012345.AltData[i].width != AltTitleView_012345.AltData[i].naturalW || AltTitleView_012345.AltData[i].height != AltTitleView_012345.AltData[i].naturalH) {
					TipData += "<br />Natural: [<span class='set'>" + AltTitleView_012345.AltData[i].naturalW + " x " + AltTitleView_012345.AltData[i].naturalH + " px</span>]"
				}


				//Tipに表示されるデータをまとめる
				var Tip = $("<div id='alt_view_tip_" + AltTitleView_012345.AltData[i].id + "' class='Tip Tip-" + i + "' data='" + i + "'><div class='txt'>" + TipData + "</div></div>");

				//
				if (AltTitleView_012345.AltData[i].width != AltTitleView_012345.AltData[i].naturalW) {
					Tip.find(".w").removeClass("set").addClass("noset");
				}
				if (AltTitleView_012345.AltData[i].height != AltTitleView_012345.AltData[i].naturalH) {
					Tip.find(".h").removeClass("set").addClass("noset");
				}

				//なにもセットされていない…
				if (AltTitleView_012345.AltData[i].alt == "alt_nashi_12340" && AltTitleView_012345.AltData[i].title == "title_nashi_12340") {
					Tip.addClass("no-set")
				}

				//Tipの位置を設定
				Tip.css({ "top": AltTitleView_012345.AltData[i].top, "left": AltTitleView_012345.AltData[i].left, "max-width": AltTitleView_012345.AltData[i].width, "display": "none" })

				//吹き出しの位置を設定
				Tip.find(".fuki").css("margin-left", 10);

				AltTitleView_012345.AltData[i].fpath = Tip;

				//表示エリアに追加する
				$("#AltView_wrap").append(Tip);
			}

			//画面リサイズ時の処理
			$(window).off("resize.AltTitleView_012345");
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

			setTimeout(function() {
				$(".Tip").each(function() {
					$(this).show();
					var top = $(this).offset().top;
					var height = $(this).height();
					if (top - height < 0) {
						// ▲ の方向
						var id = $(this).attr("data");
						var height = AltTitleView_012345.AltData[id].height;
						$(this).css("top", (height));
						$(this).prepend("<div class='fuki-top'></div>")


					} else {
						// ▼ の方向
						$(this).css("top", (top - height - 7));
						$(this).append("<div class='fuki-bottom'></div>")
					}
				});
				fukidashiCSS();
			}, 100)


			//ツールチップマウスオーバー時
			$("#AltView_wrap div.Tip").mouseover(function() {
				var id = $(this).attr("data");
				AltTitleView_012345.AltData[id].path.addClass('AltView_012345_Tip_show');

				$(this).css("z-index", 99999);
				$("#AltView_wrap div.Tip").not($(this)).hide();
				$(this).show();
			})
			$("#AltView_wrap div.Tip").mouseout(function() {
				var id = $(this).attr("data");
				AltTitleView_012345.AltData[id].path.removeClass('AltView_012345_Tip_show');

				$(this).css("z-index", 99998);
				$("#AltView_wrap div.Tip").show();
			})



			//ツールチップの ▼ 部分
			function fukidashiCSS() {
				$("#AltView_wrap div.Tip .fuki-bottom").css({
					"margin-left": 10,
					"height": 0,
					"width": 0,
					"border": "5px solid #000",
					"border-top-color": "#333",
					"border-left-color": "transparent",
					"border-right-color": "transparent",
					"border-bottom-color": "transparent",
					"opacity": 0.9
				})
				$("#AltView_wrap div.Tip .fuki-top").css({
					"margin-left": 10,
					"height": 0,
					"width": 0,
					"border": "5px solid #000",
					"border-top-color": "transparent",
					"border-left-color": "transparent",
					"border-right-color": "transparent",
					"border-bottom-color": "#333",
					"opacity": 0.9
				})
			};
		};
	};

	function fImageOver(event) {
		var path = $(this);
		$("#AltView_wrap div.Tip").hide();

		var id = path.attr("alt_view_tip");
		$("#alt_view_tip_" + id).show();

		path.addClass('AltView_012345_Tip_show');
	}

	function fImageOut(event) {
		var path = $(this);
		$("#AltView_wrap div.Tip").show();
		path.removeClass('AltView_012345_Tip_show');
	}
});
