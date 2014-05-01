$(function(){

	/*$("h1").css({opacity: 0.0})
	$("h1").animate(
	{opacity: 1.0},
    {duration: 400, easing: "linear"}
	)
	*/
	var timer_id = setInterval( function () {
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {
				contetState: "OK_Desuka"
			}, function(response){
				if(response.contetLoaded){
					clearInterval( timer_id );
					//console.log("o",response.contetLoaded);
					fInt();
				}else{
					//console.log("x",response.contetLoaded);
				}
				
			});
		});
	} , 100 );

	function fInt(){

		clearInterval( timer_id );

		$("#Loading").fadeOut(200);

		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.sendRequest(tab.id, {
				fromPopUp: "apper"
			}, function(response){

				if (response.bMoveCap_a) {
					$("#Switch_Alt").addClass("close");
				}else{
					$("#Switch_Alt").removeClass("close");
				}

				if (response.bMoveCap_m) {
					$("#Switch_Title").addClass("close");
				}else{
					$("#Switch_Title").removeClass("close");
				}
				
				$("#Switch_Alt").click(function(){
					chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.sendRequest(tab.id, {fromPopUp:"click"}, function(response) {
							if(response.bMoveCap_a==true){
								$("#Switch_Alt").addClass("close");
							}else{
								$("#Switch_Alt").removeClass("close");
							}
						});
					});
				})
				
				$("#Switch_Title").click(function(){
					chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.sendRequest(tab.id, {fromPopUp:"click_m"}, function(response) {
							if(response.bMoveCap_m==true){
								$("#Switch_Title").addClass("close");
							}else{
								$("#Switch_Title").removeClass("close");
							}
						});
					});
				});
				//ローカライズ化
				$("#Switch_Alt dt").html(chrome.i18n.getMessage("PopUp_ShowAltBtn"));
				$("#Switch_Title dt").html(chrome.i18n.getMessage("PopUp_ShowMetaBtn"));
				$("#Loading p").html(chrome.i18n.getMessage("PopUp_Loading"));
			});
		});
	}
});

