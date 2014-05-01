var loadComp=false;

window.onload=function(){
	loadComp=true;
	//console.log("loadComp: ",loadComp);
}


$(function(){
	var bMoveCap_a = false;
	var bMoveCap_m = false;

	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse){
			if (request.contetState == "OK_Desuka") {
				sendResponse({
					contetLoaded: true
				});
			}
		}
	);


	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse){
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

	function function_name (target,argument) {
		if(target){
			return argument+target
		}else{
			return ""
		};
	};

	//メタ表示
	function fAddParam_m(){

		if($("div#TitleView_012345").is('*')){
			fRemoveTitleView();
			bMoveCap_m = false;
		}else{
			bMoveCap_m = true;
			//ツールチップの表示エリアを追加する
			$("body").append("<div id='TitleView_012345'><div id='TitleView_Contents_012345'></div></div>");
			$("div#TitleView_Contents_012345").append("<h3>Title: " + $("title").text() + "</h3>");
			$("div#TitleView_Contents_012345").append("<hr>");
			$("div#TitleView_Contents_012345").append("<h3>Meta:</h3>");

			$("meta").each(function(){
				var meta = "";
				for ( var j = 0 ; j < $(this).context.attributes.length ; j ++ ) {
					var name = $(this).context.attributes[j].nodeName;
					var val = $(this).context.attributes[j].nodeValue;
					meta += name + ' = "<span>' + val + '</span>" ';
				};
				$("div#TitleView_Contents_012345").append("<p>" + meta + "</p>");
			})

			$("div#TitleView_Contents_012345").append("<p id='TitleView_closebtn_012345'>× CLOSE</p>");

			$("div#TitleView_012345").css(
				'cssText', 
				'font-size: 	12px!important;'+
				'line-height: 	26px!important;'+
				'color: 		#fff!important;'+
				'text-align: 	left!important;'+
				'padding: 		0px!important;'+
				'box-sizing: 	border-box!important;'+
				'margin: 		0!important;'+
				'background: 	rgba(0,0,0,0.75)!important;'+

				'position: 		fixed;'+
				'z-index: 		9999999;'+
				'top: 			-1000px;'+
				'left: 			0;'+
				'width: 		100%;'+
				'overflow: 		auto;'+
				'text-shadow: 	0px 0px 7px #000,0px 0px 7px #000;'+
				'transition: 	0.4s cubic-bezier(0.77, 0, 0.175, 1);'
			);
			$("div#TitleView_012345 p , div#TitleView_012345 span").css(
				'cssText', 
				'font-size: 	12px!important;'+
				'line-height: 	26px!important;'+
				'color: 		#fff!important;'+
				'text-align: 	left!important;'+
				'padding: 		0!important;'+
				'margin: 		0!important;'+
				'box-sizing: 	border-box!important;'
			);
			$("div#TitleView_012345 h3").css(
				'cssText',
				'font-size: 	14px!important;'+
				'font-weight: 	bold!important;'+
				'color: 		#fff!important;'+
				'border: 		none!important;'+
				'padding: 		10px 20px 10px 20px!important;'+
				'margin: 		0px!important;'+
				'background: 	none!important;'+
				'box-sizing: 	border-box!important;'
			);
			$("div#TitleView_012345 span").css(
				'cssText',
				'color: 		#9cc6ff!important;'
			);
			$("div#TitleView_012345 p").css(
				'cssText',
				'line-height: 	19px!important;'+
				'padding: 		0px 20px 19px 5em !important;'+
				'margin: 		0px!important;'
			);
			$("div#TitleView_012345 hr").css(
				'cssText',
				'height: 		2px!important;'+
				'background: 	rgba(0, 0, 0 ,0.3);'+
				'border: 		0;'+
				'margin: 		0px!important;'+
				'padding: 		0!important;'
			);
			$("#TitleView_closebtn_012345").css(
				'cssText',
				'margin: 		0px!important;'+
				'padding: 		5px 0 5px 0!important;'+
				'cursor: 		pointer!important;'+
				'text-align: 	center!important;'+
				'background: 	rgba(0, 0, 0, 0.7)!important;'+
				'color: 		#fff!important;'+
				'text-shadow: 	1px 1px 1px rgba(0,0,0,0.5)!important;'
			);
			
			var titleview_012345_time;
			clearTimeout(titleview_012345_time);
			titleview_012345_time = setTimeout(function(){
				$("div#TitleView_012345").css({"top":0}).one('webkitTransitionEnd', function(){
					$(this).addClass("active");
				});
				fResizeTitleView();

			},100);

			$("#TitleView_closebtn_012345 , html").click(function(e){
				fRemoveTitleView();
				return false
			});

			function fRemoveTitleView(){
				if($("div#TitleView_012345").hasClass("active")){
					$("div#TitleView_012345").css({top: -$("div#TitleView_012345").height() - 20}).one('webkitTransitionEnd', function(){
						$("div#TitleView_012345").remove();
						bMoveCap_m = false;
					});
				}
			}
			$("#TitleView_closebtn_012345").mouseover(function(e){
				$("#TitleView_closebtn_012345").css(
					'cssText',
					'margin: 		0px!important;'+
					'padding: 		5px 0 5px 0!important;'+
					'cursor: 		pointer!important;'+
					'text-align: 	center!important;'+
					'background: 	rgba(0, 0, 0, 0.7)!important;'+
					'text-shadow: 	1px 1px 1px rgba(0,0,0,0.5)!important;'+
					'color: 		#eb6100!important;'
				);
			});
			$("#TitleView_closebtn_012345").mouseout(function(e){
				$("#TitleView_closebtn_012345").css(
					'cssText',
					'margin: 		0px!important;'+
					'padding: 		5px 0 5px 0!important;'+
					'cursor: 		pointer!important;'+
					'text-align: 	center!important;'+
					'background: 	rgba(0, 0, 0, 0.7)!important;'+
					'text-shadow: 	1px 1px 1px rgba(0,0,0,0.5)!important;'+
					'color: 		#fff!important;'
				);
			});

			$("div#TitleView_012345").click(function(e){
				e.stopPropagation();
			});

			var resizeTime = false;
			$(window).on('resize',window,function(event){
				if (resizeTime !== false) {
					clearTimeout(resizeTime);
				}
				resizeTime = setTimeout(function() {
					fResizeTitleView();
				}, 200);
			});
			function fResizeTitleView(){
				if($(window).height() < $("div#TitleView_Contents_012345").height()){
					$("div#TitleView_012345").height($(window).height());
				}else{
					$("div#TitleView_012345").height($("div#TitleView_Contents_012345").height());
				};
			};
		}
	}

	//Alt表示
	function fAddParam_a(){

		var Alt_Fukidashi_txt = chrome.i18n.getMessage("Alt_Fukidashi_txt");
		if(0 < $("#AltView_012345").length){
			$("#AltView_012345").remove();
			$("img").removeAttr("alt_view_tip");

			$("img").unbind("mouseover",fImageOver);
			$("img").unbind("mouseout",fImageOut);
			bMoveCap_a = false;
		}else{
			bMoveCap_a = true;
			//ツールチップの表示エリアを追加する
			$("body").append("<div id='AltView_012345'><div id='AltView_wrap'></div></div>");
			$("#AltView_012345").css({"position":"absolute","z-index":9999,"top":0,"left":0,"width":"100%"})
			$("#AltView_wrap").css({"position":"relative","width":"100%"})

			//ページ上の画像のデータを調べる
			var aAltData=[{id:"",src:"",top:0,left:0,alt:"",title:"",width:0,height:0,naturalW:0,naturalH:0,path:"",fpath:""}];
			$("img").each(function(index, element){

				var id=index;

				//画像位置とサイズと参照先
				var top=$(this).offset().top;
				var left=$(this).offset().left;
				var width=$(this).width();
				var height=$(this).height();
				var src=$(this).attr("src");

				//Alt
				var alt="";
				if($(this).attr("alt")){
					alt=$(this).attr("alt");
				}else{
					alt="alt_nashi_12340";
				}

				//タイトル
				var title="";
				if($(this).attr("title")){
					title=$(this).attr("title");
				}else{
					title="title_nashi_12340";
				}

				//サイズ
				var width="";
				if($(this).attr("width")){
					width=parseInt($(this).attr("width"));
				}else{
					width="width_nashi_12340";
				}
				var height="";
				if($(this).attr("height")){
					height=parseInt($(this).attr("height"));
				}else{
					height="height_nashi_12340";
				}

				//ナチュラルサイズを調べる
				var vieW = parseInt($(this).width());
				var vieH = parseInt($(this).height());
				$(this).css({"width":"auto","height":"auto"});
				var naW = $(this).width();
				var naH = $(this).height();
				$(this).width(vieW);
				$(this).height(vieH);

				//属性を追加
				$(this).attr("alt_view_tip",index)
					
				//画像にマウスオーバーした際の動作をセット
				$(this).bind({
					"mouseover": fImageOver
				});
				$(this).bind({
					"mouseout": fImageOut
				});



				aAltData.push({id:id,src:src,top:top,left:left,alt:alt,title:title,width:vieW,height:vieH,naturalW:naW,naturalH:naH,path:$(this)})
			});	
			
			for(i=0;i<aAltData.length;i++){

				var TipData = "";

				//alt と title 両方とも設定されていた
				if(aAltData[i].alt!="alt_nashi_12340" && aAltData[i].title!="title_nashi_12340"){
					//AltとTitleが同じがチェック
					if(aAltData[i].alt==aAltData[i].title){
						//同じ
						TipData+="Alt,Title: [<span class='at set'>"+aAltData[i].alt+"</span>]";
					}else{
						//違う
						TipData+="Alt: [<span class='at noset'>"+aAltData[i].alt+"</span>]";
						TipData+="<br />Title: [<span class='at noset'>"+aAltData[i].title+"</span>]";
					}
				}else{
					//alt
					if(aAltData[i].alt!="alt_nashi_12340"){
						TipData+="Alt: [<span class='at set'>"+aAltData[i].alt+"</span>]"
					}else{
						TipData+="Alt: ["+"<span class='at noset'>"+Alt_Fukidashi_txt+"</span>]"
					}

					//title
					if(aAltData[i].title!="title_nashi_12340"){
						TipData+="<br />Title: [<span class='at set'>"+aAltData[i].title+"</span>]"
					}else{
						TipData+="<br />Title: ["+"<span class='at noset'>"+Alt_Fukidashi_txt+"</span>]"
					}					
				}



				//ImgSize
				if(aAltData[i].width!="width_nashi_12340" && aAltData[i].height!="height_nashi_12340"){
					//画像サイズが設定されている
					TipData+="<br />ImgSize: [<span class='set'><span class='set w'>"+aAltData[i].width+"</span> x <span class='set h'>"+aAltData[i].height+"</span> px</span>]"
				}else{
					//画像サイズが設定されていない場合

					if(aAltData[i].width!="width_nashi_12340"){
						TipData+="<br />ImgSize: [<span class='set'><span class='set w'>"+aAltData[i].width+"</span> x ";
					}else{
						TipData+="<br />ImgSize: [<span class='set'><span class='noset'>"+Alt_Fukidashi_txt+"</span>"+" x ";
					}

					if(aAltData[i].height!="height_nashi_12340"){
						TipData+= "<span class='set h'>"+aAltData[i].height+"</span> px</span>]";
					}else{
						TipData+="<span class='noset'>"+Alt_Fukidashi_txt+"</span></span>]";
					}
				}

				//Naturalサイズ
				if(aAltData[i].width!=aAltData[i].naturalW || aAltData[i].height!=aAltData[i].naturalH){
					TipData+="<br />Natural: [<span class='set'>"+aAltData[i].naturalW+" x "+aAltData[i].naturalH+" px</span>]"
				}


				//Tipに表示されるデータをまとめる
				var Tip=$("<div id='alt_view_tip_"+aAltData[i].id+"' class='Tip Tip-"+i+"' data='"+i+"'><div class='txt'>"+TipData+"</div></div>");

				//
				if(aAltData[i].width!=aAltData[i].naturalW){
					Tip.find(".w").removeClass("set").addClass("noset");
				}
				if(aAltData[i].height!=aAltData[i].naturalH){
					Tip.find(".h").removeClass("set").addClass("noset");
				}

				//なにもセットされていない…
				if(aAltData[i].alt=="alt_nashi_12340" && aAltData[i].title=="title_nashi_12340"){
					Tip.addClass("no-set")
				}

				//Tipの位置を設定
				Tip.css({"top":aAltData[i].top,"left":aAltData[i].left,"max-width":aAltData[i].width,"display":"none"})
				
				//吹き出しの位置を設定
				Tip.find(".fuki").css("margin-left",10);

				aAltData[i].fpath = Tip;

				//表示エリアに追加する
				$("#AltView_wrap").append(Tip);
			}


			setTimeout(function(){
				$(".Tip").each(function() {
					$(this).show();
					var top = $(this).offset().top;
					var height = $(this).height();
					if(top-height<0){
						// ▲ の方向
						var id = $(this).attr("data");
						var height = aAltData[id].height;
						$(this).css("top",(height));
						$(this).prepend("<div class='fuki-top'></div>")

						
					}else{
						// ▼ の方向
						$(this).css("top",(top-height-7));
						$(this).append("<div class='fuki-bottom'></div>")
					}					
			    });	
				fukidashiCSS();
			}, 100)


			//ツールチップマウスオーバー時
			$("#AltView_wrap div.Tip").mouseover(function() {
				var id=$(this).attr("data");
				var path=aAltData[id].path;
				path.css({
					"box-shadow":"0px 0px 0px 5px rgba(255, 167, 21, 0.7)"
				});

			    $(this).css("z-index",99999);
			    $("#AltView_wrap div.Tip").not($(this)).hide();
			    $(this).show();
			})
			$("#AltView_wrap div.Tip").mouseout(function() {
				var id=$(this).attr("data")
				var path=aAltData[id].path
				path.css({"box-shadow":"none"})


				$(this).css("z-index",99998);
				$("#AltView_wrap div.Tip").show();
			})

			//ツールチップ本体
			$("#AltView_wrap div.Tip").css({
				"position":"absolute"
			})

			//ツールチップのテキスト部分
			$("#AltView_wrap div.Tip .txt").css({
				"text-align":"left",
				"font-size":"11px",
				"line-height":"14px",
				"text-shadow": "1px 1px 1px rgba(0,0,0,0.7)",
				//"font-weight": "bold",
				"font-family":"sans-serif",
				"color":"#fff",
				"cursor":"auto",
				"background":"#333",
				"padding":"8px 8px 7px 8px",
				"box-shadow":"1px 1px 10px rgba(0,0,0,0.5)",
				"border-radius":0,
				"opacity":0.9,
				"min-width":150,
				"word-wrap":"break-word",
				"color":"#b0b0b0"
			})

			/*$("#AltView_wrap div.Tip.no-set .txt").css({
				"color":"#f89406"
			})*/
			$("#AltView_wrap div.Tip .txt .noset").css({
				"color":"#f89406"
			})
			$("#AltView_wrap div.Tip .txt .set").css({
				"color":"#fff",
				"font-weight": "normal"
			})
			

			//ツールチップの ▼ 部分
			function fukidashiCSS(){
				$("#AltView_wrap div.Tip .fuki-bottom").css({
				"margin-left":10,
				"height":0,
				"width":0,
				"border":"5px solid #000",
				"border-top-color":"#333",
				"border-left-color":"transparent",
				"border-right-color":"transparent",
				"border-bottom-color":"transparent",
				"opacity":0.9
				})
				$("#AltView_wrap div.Tip .fuki-top").css({
					"margin-left":10,
					"height":0,
					"width":0,
					"border":"5px solid #000",
					"border-top-color":"transparent",
					"border-left-color":"transparent",
					"border-right-color":"transparent",
					"border-bottom-color":"#333",
					"opacity":0.9
				})
			};
		};
	};

	function fImageOver(event){
		var path=$(this);
		$("#AltView_wrap div.Tip").hide();

		var id=path.attr("alt_view_tip");
		$("#alt_view_tip_"+id).show();

		path.css({
			"box-shadow":"0px 0px 0px 5px rgba(255, 167, 21, 0.7)"
		});
	}
	function fImageOut(event){
		var path=$(this);
		$("#AltView_wrap div.Tip").show();
		path.css({"box-shadow":"none"});
	}
});
