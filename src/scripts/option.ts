/// <reference path="module/jquery.d.ts" />

class Options {
	constructor() {
		var this_ = this;

		this.getStorageVal();

		$("[type=checkbox]").on("change", function() {
			this_.changeVal();
		});

		$(".version").append(chrome.runtime.getManifest().version);
	}

	getStorageVal(): void {
		var this_: this;
		var items: object;
		var defaults = {
			alt_checkbox: true,
			title_checkbox: true,
			size_checkbox: true,
			path_checkbox: false,
			extension_checkbox: false,
			console_checkbox: true,
			noAltList_checkbox: true,
			altFukidashiClose_checkbox: true
		};
		chrome.storage.sync.get(
			defaults,
			function(items) {
				// console.log(items);
				for (var name in items) {
					$("#" + name).prop("checked", items[name]);
				}
			});
	}
	changeVal() {

		var formOptions = {
			alt_checkbox: $("#alt_checkbox").prop("checked"),
			title_checkbox: $("#title_checkbox").prop("checked"),
			size_checkbox: $("#size_checkbox").prop("checked"),
			path_checkbox: $("#path_checkbox").prop("checked"),
			extension_checkbox: $("#extension_checkbox").prop("checked"),
			console_checkbox: $("#console_checkbox").prop("checked"),
			noAltList_checkbox: $("#noAltList_checkbox").prop("checked"),
			altFukidashiClose_checkbox: $("#altFukidashiClose_checkbox").prop("checked")
		};
		// console.log(formOptions);
		chrome.storage.sync.set(formOptions, function() { });
	}
}

var option_instans: Options = new Options();
