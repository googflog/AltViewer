/// <reference path="module/jquery.d.ts" />
/// <reference path="module/chrome.d.ts" />

class Options {
  constructor() {
    var this_ = this;

    this.getStorageVal();

    $("[type=checkbox]").on("change", function () {
      this_.changeVal();
    });

    $(".version").append(chrome.runtime.getManifest().version);

    //ローカライズ化
    $("[for='alt_checkbox']").html(chrome.i18n.getMessage("Option_LabelAlt"));
    $("[for='title_checkbox']").html(chrome.i18n.getMessage("Option_LabelTitle"));
    $("[for='size_checkbox']").html(chrome.i18n.getMessage("Option_LabelSize"));
    $("[for='path_checkbox']").html(chrome.i18n.getMessage("Option_LabelPath"));
    // $("[for='extension_checkbox']").html(chrome.i18n.getMessage("Option_LabelExtension"));
    $("[for='console_checkbox']").html(chrome.i18n.getMessage("Option_LabelConsole"));
    $("[for='noAltList_checkbox']").html(chrome.i18n.getMessage("Option_LabelNoAltList"));
    $("[for='altFukidashiClose_checkbox']").html(chrome.i18n.getMessage("Option_LabelFukidashiClose"));
  }

  getStorageVal(): void {
    var this_: this;
    var items: object;
    var defaults = {
      alt_checkbox: true,
      title_checkbox: false,
      size_checkbox: true,
      path_checkbox: false,
      extension_checkbox: false,
      console_checkbox: true,
      noAltList_checkbox: true,
      altFukidashiClose_checkbox: true,
    };
    chrome.storage.sync.get(defaults, function (items) {
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
      altFukidashiClose_checkbox: $("#altFukidashiClose_checkbox").prop("checked"),
    };
    // console.log(formOptions);
    chrome.storage.sync.set(formOptions, function () {});
  }
}

var option_instans: Options = new Options();
