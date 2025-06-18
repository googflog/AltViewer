/// <reference path="EventDispathcer.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="chrome.d.ts" />

module MetaViewModule {
  export class MetaView extends events.EventDispatcher {
    ObjMetaViewWrapBlock: any;
    ObjMetaViewBlock: any;
    ObjMetaViewContent: any;

    constructor() {
      super();
    }

    show() {
      let this_ = this;
      this.dispatchEvent(new events.Event("show", true));
      $("html").addClass("TitleView_012345_show");

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
        var meta: string = "";
        var imgis: number = 0;
        var img: string = "";
        var imgpath: string = "";

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

          meta += name + ' = &quot;<span class="TitleView012345_Contents__metas__span">' + _val + "</span>&quot; ";

          if (2 <= imgis) {
            img = "<div class='TitleView012345_Contents__metas__img'><a class='TitleView012345_Contents__metas__a' href=" + imgpath + " target='_blank'><img src=" + imgpath + " ></a></div>";
          }
        }

        if (2 <= imgis) {
          meta += img;
        }

        this_.ObjMetaViewContent.append("<div class='TitleView012345_Contents__metas'>" + meta + "</div>");
      });

      //閉じるボタン
      this.ObjMetaViewBlock.prepend("<div id='TitleView_closebtn_head_012345' class='TitleView012345_HeadCloseBtn'><img src='" + chrome.runtime.getURL("images/close_w.svg") + "' width='45'></div>");
      this.ObjMetaViewBlock.append(
        "<div id='TitleView_closebtn_012345' class='TitleView012345_CloseBtn'><img class='TitleView012345_CloseBtn_img' src='" +
          chrome.runtime.getURL("images/close_w.svg") +
          "' width='45'><div class='TitleView012345_CloseBtn_txt'> CLOSE</div></div>"
      );

      //Meta一覧表示
      var titleview_012345_time: any;
      this.ObjMetaViewWrapBlock.css({ top: -this.ObjMetaViewWrapBlock.outerHeight() - 100 });
      this.ObjMetaViewWrapBlock.addClass("transition_mode");
      titleview_012345_time = setTimeout(function () {
        this_.ObjMetaViewWrapBlock.css({ top: 0 }).one("webkitTransitionEnd", function () {
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
      var resizeTime: any = 0;
      $(window).on("resize.TitleView_012345", function (event) {
        if (resizeTime !== 0) {
          clearTimeout(resizeTime);
        }
        resizeTime = setTimeout(function () {
          this_.fResizeTitleView();
        }, 200);
      });
    }

    //リサイズ
    fResizeTitleView() {
      // if ($(window).height() < this.ObjMetaViewContent.outerHeight() + $("#TitleView_closebtn_012345").height()) {
      //     this.ObjMetaViewWrapBlock.height($(window).height());
      // } else {
      //     this.ObjMetaViewWrapBlock.height(this.ObjMetaViewContent.height() + $("#TitleView_closebtn_012345").height() + 150);
      // };
    }

    //
    close() {
      var this_ = this;
      if (this.ObjMetaViewWrapBlock.hasClass("active")) {
        this.dispatchEvent(new events.Event("show", false));
        this.ObjMetaViewWrapBlock.css({ top: -this.ObjMetaViewWrapBlock.height() - 20 }).one("webkitTransitionEnd", function () {
          this_.ObjMetaViewWrapBlock.remove();
          $(window).off("resize.TitleView_012345");
          $("html").removeClass("TitleView_012345_show");
        });
      }
    }
  }
}
