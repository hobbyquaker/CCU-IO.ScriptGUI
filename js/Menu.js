/**
 *  CCU-IO.ScripGUI
 *  http://github.com/smiling-Jack/CCU-IO.ScriptGUI
 *
 *  Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 *  MIT License (MIT)
 *
 */

jQuery.extend(true, SGI, {

    menu_iconbar: function () {
        console.log("Start_Menue-Iconbar");

        $("#img_iconbar").tooltip();

        $("#menu").menu({position: {at: "left bottom"}});
        $("#m_neu").click(function () {
            SGI.clear();
        });
        $("#m_save").click(function () {
            if ($("body").find(".ui-dialog").length == 0) {
                SGI.save_ccu_io();
            }
        });
        $("#m_save_as").click(function () {
            if ($("body").find(".ui-dialog").length == 0) {
                SGI.save_as_ccu_io();
            }
        });
        $("#m_open").click(function () {
            if ($("body").find(".ui-dialog").length == 0) {
                SGI.open_ccu_io();
            }
        });

        $("#ul_theme li a").click(function () {
            $("#theme_css").remove();
            $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + $(this).data('info') + '/jquery-ui-1.10.3.custom.min.css"/>');

            //resize Event auslössen um Slider zu aktualisieren
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);

            storage.set(SGI.str_theme, ($(this).data('info')));
            theme = $(this).data('info');
            SGI.scrollbar_h("", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_h"));
            SGI.scrollbar_v("", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_v"));
            SGI.scrollbar_v("", $("#toolbox_body"), $(".toolbox"), $("#scroll_bar_toolbox"));
        });

        $("#clear_cache").click(function () {
            storage.set(SGI.str_theme, null);
            storage.set(SGI.str_settings, null);
            storage.set(SGI.str_prog, null);
        });

        $("#m_make_struck").click(function () {
            SGI.make_struc()
        });
        $("#m_show_script").click(function () {

            var script = Compiler.make_prg();
//            alert(script);
            SGI.show_Script(script)
        });
        $("#m_save_script").click(function () {
            SGI.save_Script();
        });
        $("#m_del_script").click(function () {
            SGI.del_script();
        });

        $("#log_prg").click(function () {
            console.log(PRG);
        });
        $("#log_sgi").click(function () {
            console.log(SGI);
        });

        $("#m_quick-help").click(function () {
            SGI.open_quick_help_dialog()
        });
        $("#m_shortcuts").click(function () {

            if ($("body").find(".shortcuts").length < 1) {

                $("body").append('\
                   <div id="dialog_shortcuts" style="text-align: left ;font-family: Menlo, Monaco, "Andale Mono", "lucida console", "Courier New", monospace" " title="Tastenkominationen">\
                   <div >X &nbsp&nbsp + Mousweel &nbsp&nbsp&nbsp-> Horizontal Scroll</div>\
                   <div >Ctrl + links Klick &nbsp&nbsp -> Schnell Hilfe</div>\
                   </div>');

                $("#dialog_shortcuts").dialog({
                    width: "400px",
                    dialogClass: "shortcuts",
                    close: function () {
                        $("#dialog_shortcuts").remove();
                    }
                });
            }
        });

        // Icon Bar XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        // Local
        $("#img_save_local").click(function () {
            data = SGI.make_savedata();
            console.log(data);

            storage.set(SGI.str_prog, data);
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_open_local").click(function () {
            var data = storage.get(SGI.str_prog);

            SGI.clear();
            SGI.load_prg(data);

            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        // Ordnen
        $("#img_set_left").click(function () {
            var items = $(".fbs_selected");
            if (items.length > 1) {

                function SortByName(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().left;

                $.each(items, function () {
                    $(this).css("left", position);
                });

                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_right").click(function () {
            var items = $(".fbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().left + $(a).width();
                    var bName = $(b).position().left + $(b).width();
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().left + $(items[0]).width();

                $.each(items, function () {
                    $(this).css("left", position - $(this).width());
                });

                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_top").click(function () {
            var items = $(".fbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_bottom").click(function () {
            var items = $(".fbs_selected");
            if (items.length > 1) {
                function SortByName(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
                }

                items.sort(SortByName);
                var position = $(items[0]).position().top;

                $.each(items, function () {
                    $(this).css("top", position);
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#img_set_steps").click(function () {
            var items = $(".fbs_selected");
            if (items.length > 1) {
                function SortByTop(a, b) {
                    var aName = $(a).position().top;
                    var bName = $(b).position().top;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                function SortByLeft(a, b) {
                    var aName = $(a).position().left;
                    var bName = $(b).position().left;
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                }

                var top_list = items.sort(SortByTop);
                var left_list = items.sort(SortByLeft);
                var left = $(left_list[0]).position().left;
                var top = $(top_list[0]).position().top;

                var step = 0;


                $.each(items, function () {
                    $(this).css("left", left + step);
                    $(this).css("top", top + step);

                    top = top + parseInt($(this).css("height").split("px")[0]) + 2;


                    step = step + 30;
                });
                var codebox = $(items.parent().parent()).attr("id");
                SGI.plumb_inst["inst_" + codebox].repaintEverything();
            }
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        // Scale
        $("#img_set_zoom").click(function () {
            SGI.zoom = 1;

            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });


            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );
        $("#img_set_zoom_in").click(function () {
            SGI.zoom = SGI.zoom + 0.1;
            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });
            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );
        $("#img_set_zoom_out").click(function () {
            SGI.zoom = SGI.zoom - 0.1;
            $.each(SGI.plumb_inst, function (idx) {
                SGI.plumb_inst[idx].setZoom(SGI.zoom);
            });

            $("#prg_panel").css({
                "transform": "scale(" + SGI.zoom + ")",
                "-ms-transform": "scale(" + SGI.zoom + ")",
                "-webkit-transform": "scale(" + SGI.zoom + ")"
            });
            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );
        $("#img_set_script_engine").click(function () {
            try {
                SGI.socket.emit("reloadScriptEngine");
            } catch (err) {
                alert("Keine Verbindung zu CCU.IO");
            }


            $(this).effect("highlight")
        }).hover(
            function () {
                $(this).addClass("ui-state-focus");
            }, function () {
                $(this).removeClass("ui-state-focus");
            }
        );

        $("#prg_panel").on("click", ".btn_min_trigger", function () {
            $($(this).parent().parent()).find(".div_hmid_trigger").toggle({
                progress: function () {
                    SGI.plumb_inst.inst_mbs.repaintEverything();
                }
            });

            $(this).effect("highlight");

        });

        console.log("Finish_Menue-Iconbar");
    },

    context_menu: function () {
        console.log("Start_Context_Menu");

        $(document).on('mouseenter', ".context-menu-item", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".context-menu-item", function () {
            $(this).toggleClass("ui-state-focus")

        });

        $(document).on('mouseenter', ".div_hmid_font", function () {

            $(this).toggleClass("ui-state-focus")
        });
        $(document).on('mouseleave', ".div_hmid_font", function () {
            $(this).toggleClass("ui-state-focus")

        });

// Body zum debuggen auskommentieren  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        $.contextMenu({
            selector: 'body',
            items: {
                "body": {
                    name: "body"
                }
            }
        });
        $("body").contextMenu(false);

        // Codebox  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.titel_codebox',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: "Entfernen",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_codebox(opt)
                    }
                }
            }
        });

        // FBS_Element   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.fbs_element_varinput',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "Eingang Hinzufügen",
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_input(opt)
                    }
                },
                "Del": {
                    name: "Entfernen",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });


        $.contextMenu({
            selector: '.fbs_element_simpel',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: "Entfernen",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: '.fbs_element_tr',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del": {
                    name: "Entfernen",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });


        // Trigger   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: ".tr_singel",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "Add ID",
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.add_trigger_hmid(opt.$trigger)
                    }
                },
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_simpel",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });

        $.contextMenu({
            selector: ".tr_time",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "Add Zeit",
                    className: "item_font ",
                    callback: function (key, opt) {
                        var id = $(opt.$trigger).attr("id");
                        PRG.mbs[id]["time"].push("00:00");
                        PRG.mbs[id]["day"].push("*");
                        var $this = $(opt.$trigger).find(".div_hmid_trigger");
                        $($this).children().remove();
                        SGI.add_trigger_time($(opt.$trigger));
                        SGI.plumb_inst.inst_mbs.repaintEverything()

                    }
                },
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".tr_time",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "Add Zeit",
                    className: "item_font ",
                    callback: function (key, opt) {
                        var id = $(opt.$trigger).attr("id");
                        PRG.mbs[id]["time"].push("00:00");
                        PRG.mbs[id]["day"].push("*");
                        var $this = $(opt.$trigger).find(".div_hmid_trigger");
                        $($this).children().remove();
                        SGI.add_trigger_time($(opt.$trigger));
                        SGI.plumb_inst.inst_mbs.repaintEverything()

                    }
                },
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".div_hmid_font",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "Add ID",
                    className: "item_font ",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.add_trigger_hmid(opt.$trigger)
                    }
                },
                "Del_id": {
                    name: "Entferne ID",
                    className: "item_font",
                    callback: function (key, opt) {

                        SGI.del_trigger_hmid(opt)
                    }
                },
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        opt.$trigger = $(opt.$trigger).parent().parent();
                        SGI.del_mbs(opt);
                    }
                }
            }
        });
        $.contextMenu({
            selector: ".mbs_element_kommentar",
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Del_elm": {
                    name: "Entferne Element",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_mbs(opt)
                    }
                },
                "background": {
                    "name": "Hintergrund",
                    className: "item_font ui-corner-all",
                    "items": {
                        "back-red": {
                            className: "item_font",
                            "name": "Rot",
                            callback: function (key, opt) {
                                $(opt.$trigger).css({"background-color": "red"});
                                PRG.mbs[$(opt.$trigger).attr("id")].backcolor = "red";
                            }
                        },
                        "back-green": {
                            className: "item_font",
                            "name": "Grün",
                            callback: function (key, opt) {
                                $(opt.$trigger).css({"background-color": "green"});
                                PRG.mbs[$(opt.$trigger).attr("id")].backcolor = "green";

                            }
                        },
                        "back-yellow": {
                            className: "item_font",
                            "name": "Gelb",
                            callback: function (key, opt) {
                                $(opt.$trigger).css({"background-color": "yellow"});
                                PRG.mbs[$(opt.$trigger).attr("id")].backcolor = "yellow";

                            }
                        },
                        "back-trans": {
                            className: "item_font",
                            "name": "Transparent",
                            callback: function (key, opt) {
                                $(opt.$trigger).css({"background-color": "transparent"});
                                PRG.mbs[$(opt.$trigger).attr("id")].backcolor = "transparent";

                            }
                        }
                    }
                },
                "font": {
                    "name": "Schrift",
                    className: "item_font ui-corner-all",
                    "items": {
                        "font-red": {
                            className: "item_font",
                            "name": "Rot",
                            callback: function (key, opt) {
                                $(opt.$trigger).children().css({"color": "red"});
                                PRG.mbs[$(opt.$trigger).attr("id")].fontcolor = "red";
                            }
                        },
                        "font-green": {
                            className: "item_font",
                            "name": "Grün",
                            callback: function (key, opt) {
                                $(opt.$trigger).children().css({"color": "green"});
                                PRG.mbs[$(opt.$trigger).attr("id")].fontcolor = "green";
                            }
                        },
                        "font-yellow": {
                            className: "item_font",
                            "name": "Gelb",
                            callback: function (key, opt) {
                                $(opt.$trigger).children().css({"color": "yellow"});
                                PRG.mbs[$(opt.$trigger).attr("id")].fontcolor = "yellow";
                            }
                        },
                        "font-white": {
                            className: "item_font",
                            "name": "Weiß",
                            callback: function (key, opt) {
                                $(opt.$trigger).children().css({"color": "white"});
                                PRG.mbs[$(opt.$trigger).attr("id")].fontcolor = "white";
                            }
                        },
                        "font-black": {
                            className: "item_font",
                            "name": "Schwarz",
                            callback: function (key, opt) {
                                $(opt.$trigger).children().css({"color": "black"});
                                PRG.mbs[$(opt.$trigger).attr("id")].fontcolor = "black";
                            }
                        }
                    }
                }
            }
        });

// I/O´s   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $.contextMenu({
            selector: '.fbs_element_io',
            zIndex: 9999,
            className: "ui-widget-content ui-corner-all",
            items: {
                "Add Input": {
                    name: "ID Auswahl",
                    className: "item_font ",
                    callback: function (key, opt) {
                        SGI.change_id(opt)
                    }
                },
                "Del": {
                    name: "Entfernen",
                    className: "item_font",
                    callback: function (key, opt) {
                        SGI.del_fbs(opt)
                    }
                }
            }
        });

    },

    del_fbs: function (opt) {
        console.log(opt);

        var trigger = $(opt).attr("$trigger");
        var children = $(trigger).find("div");
        var id = $(trigger).attr("id");
        var parent = PRG.fbs[id]["parent"].split("_");

        $.each(children, function () {
            var ep = SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].getEndpoints($(this).attr("id"));

            SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].detachAllConnections(this);

            if (ep != undefined) {
                SGI.plumb_inst["inst_" + parent[1] + "_" + parent[2]].deleteEndpoint($(ep).attr("elementId"));
            }
        });
        $($(opt).attr("$trigger")).remove();
        delete PRG.fbs[$(opt).attr("$trigger").attr("id")];
    },

    del_mbs: function (opt) {
        console.log($(opt.$trigger).attr("id"));
//            var ep = SGI.plumb_inst.inst_mbs.getEndpoints($(opt.$trigger).attr("id"));


//            SGI.plumb_inst.inst_mbs.detachAllConnections(ep);

//            if (ep != undefined) {
        SGI.plumb_inst.inst_mbs.deleteEndpoint($(opt.$trigger).attr("id"));
//            }

        $($(opt).attr("$trigger")).remove();
        delete PRG.mbs[$(opt).attr("$trigger").attr("id")];
    },

    del_codebox: function (opt) {
        var $this = $(opt).attr("$trigger");
        var children = $($this.parent()).find("div");
        $.each(children, function () {
            var ep = SGI.plumb_inst.inst_mbs.getEndpoints($(this).attr("id"));

            SGI.plumb_inst.inst_mbs.detachAllConnections(this);

            if (ep != undefined) {
                SGI.plumb_inst.inst_mbs.deleteEndpoint($(ep).attr("elementId"));
            }

            delete PRG.fbs[$(this).attr("id")];
        });
        $($this.parent()).remove();
        delete PRG.mbs[$($this.parent()).attr("id")];
    },

    change_id: function (opt) {
        hmSelect.show(homematic, this.jControl, function (obj, value) {

            PRG.fbs[$(opt.$trigger).attr("id")]["hmid"] = value;
            if (homematic.regaObjects[value]["TypeName"] == "VARDP") {
                $(opt.$trigger).find(".div_hmid").text(homematic.regaObjects[value]["Name"]);
                PRG.fbs[$(opt.$trigger).attr("id")]["name"] = homematic.regaObjects[value]["Name"];
            } else {
                var parent = homematic.regaObjects[value]["Parent"];
                var parent_data = homematic.regaObjects[parent];
                $(opt.$trigger).find(".div_hmid").text(parent_data.Name + "_" + homematic.regaObjects[value]["Type"]);
                PRG.fbs[$(opt.$trigger).attr("id")]["name"] = _name = parent_data.Name + "__" + homematic.regaObjects[value]["Type"];
            }
            SGI.plumb_inst["inst_" + $(opt.$trigger).parent().parent().attr("id")].repaintEverything();

        });
    },

    del_trigger_hmid: function (opt) {
        var parrent = $(opt.$trigger).data("info");
        var name = $(opt.$trigger).text();
        var index = $.inArray(name, PRG.mbs[parrent]["name"]);

        PRG.mbs[parrent]["name"].splice(index, 1);
        PRG.mbs[parrent]["hmid"].splice(index, 1);

        $(opt.$trigger).remove();
        SGI.plumb_inst.inst_mbs.repaintEverything()
    },

    save_as_ccu_io: function () {

        try {
            SGI.socket.emit("readdirStat", SGI.prg_store, function (data) {
                var files = [];
                var sel_file = "";

                $("body").append('\
                   <div id="dialog_save" style="text-align: center" title="Speichern als">\
                   <br>\
                       <table id="grid_save"></table>\
                        <br>\
                       <input  id="txt_save" type="text" /><br><br>\
                       <button id="btn_save_ok" >Speichern</button>\
                       <button id="btn_save_del" >Löschen</button>\
                       <button id="btn_save_abbrechen" >Abbrechen</button>\
                   </div>');

                $("#dialog_save").dialog({
                    height: 500,
                    width: 520,
                    resizable: false,
                    close: function () {
                        $("#dialog_save").remove();
                    }
                });

                if (data != undefined) {
                    $.each(data, function () {

                        var file = {
                            name: this["file"].split(".")[0],
                            typ: this["file"].split(".")[1],
                            date: this["stats"]["mtime"].split("T")[0],
                            size: this["stats"]["size"]
                        };
                        files.push(file);

                    });
                }
                $("#grid_save").jqGrid({
                    datatype: "local",
                    width: 495,
                    height: 280,
                    data: files,
                    forceFit: true,
                    multiselect: false,
                    gridview: false,
                    shrinkToFit: false,
                    scroll: false,
                    colNames: ['Datei', 'Größe', 'Typ', "Datum" ],
                    colModel: [
                        {name: 'name', index: 'name', width: 245, sorttype: "name"},
                        {name: 'size', index: 'size', width: 80, align: "right", sorttype: "name"},
                        {name: 'typ', index: 'typ', width: 60, align: "center", sorttype: "name"},
                        {name: 'date', index: 'date', width: 110, sorttype: "name"}
                    ],
                    onSelectRow: function (file) {
                        sel_file = $("#grid_save").jqGrid('getCell', file, 'name') + "." + $("#grid_save").jqGrid('getCell', file, 'typ');
                        $("#txt_save").val($("#grid_save").jqGrid('getCell', file, 'name'));
                    }
                });


                $("#btn_save_ok").button().click(function () {
                    SGI.make_savedata();
                    if ($("#txt_save").val() == "") {
                        alert("Bitte Dateiname eingeben")
                    } else {
                        try {
                            SGI.socket.emit("writeRawFile", "www/ScriptGUI/prg_Store/" + $("#txt_save").val() + ".prg", JSON.stringify(PRG.valueOf()));
                            SGI.file_name = $("#txt_save").val();
                            $("#m_file").text(SGI.file_name);

                        } catch (err) {
                            alert("Keine Verbindung zu CCU.io")
                        }
                        $("#dialog_save").remove();
                    }
                });
                $("#btn_save_del").button().click(function () {
                    row_id = $("#grid_save").jqGrid('getGridParam', 'selrow');
                    SGI.socket.emit("delRawFile", SGI.prg_store + sel_file, function (ok) {
                        if (ok == true) {
                            $("#grid_save").delRowData(row_id);
                            $("#txt_save").val("");
                        } else {
                            alert("Löschen nicht möglich");
                        }
                    })
                });

                $("#btn_save_abbrechen").button().click(function () {
                    $("#dialog_save").remove();
                });
            });

        } catch (err) {
            alert("Keine Verbindung zu CCU.IO");
        }
    },

    save_ccu_io: function () {
        if (SGI.file_name == "") {
            SGI.save_as_ccu_io()
        } else {
            SGI.make_savedata();
            try {
                SGI.socket.emit("writeRawFile", "www/ScriptGUI/prg_Store/" + SGI.file_name + ".prg", JSON.stringify(PRG.valueOf()));
            } catch (err) {
                alert("Keine Verbindung zu CCU.IO")
            }
        }
    },

    open_ccu_io: function () {
        var sel_file = "";

        try {
            SGI.socket.emit("readdirStat", SGI.prg_store, function (data) {
                var files = [];


                $("body").append('\
                   <div id="dialog_open" style="text-align: center" title="Öffnen">\
                   <br>\
                       <table id="grid_open"></table>\
                        <br>\
                       <button id="btn_open_ok" >Öffnen</button>\
                       <button id="btn_open_del" >Löschen</button>\
                       <button id="btn_open_abbrechen" >Abbrechen</button>\
                   </div>');
                $("#dialog_open").dialog({
                    height: 500,
                    width: 520,
                    resizable: false,
                    close: function () {
                        $("#dialog_open").remove();
                    }
                });

                if (data != undefined) {
                    $.each(data, function () {

                        var file = {
                            name: this["file"].split(".")[0],
                            typ: this["file"].split(".")[1],
                            date: this["stats"]["mtime"].split("T")[0],
                            size: this["stats"]["size"]
                        };
                        files.push(file);

                    });
                }

                $("#grid_open").jqGrid({
                    datatype: "local",
                    width: 500,
                    height: 330,
                    data: files,
                    forceFit: true,
                    multiselect: false,
                    gridview: false,
                    shrinkToFit: false,
                    scroll: false,
                    colNames: ['Datei', 'Größe', 'Typ', "Datum"],
                    colModel: [
                        {name: 'name', index: 'name', width: 240, sorttype: "name"},
                        {name: 'size', index: 'size', width: 80, align: "right", sorttype: "name"},
                        {name: 'typ', index: 'typ', width: 60, align: "center", sorttype: "name"},
                        {name: 'date', index: 'date', width: 100, sorttype: "name"}
                    ],
                    onSelectRow: function (file) {
                        sel_file = $("#grid_open").jqGrid('getCell', file, 'name') + "." + $("#grid_open").jqGrid('getCell', file, 'typ');
                    }
                });


                $("#btn_open_abbrechen").button().click(function () {
                    $("#dialog_open").remove();
                });

                $("#btn_open_del").button().click(function () {
                    row_id = $("#grid_open").jqGrid('getGridParam', 'selrow');
                    SGI.socket.emit("delRawFile", SGI.prg_store + sel_file, function (ok) {
                        if (ok == true) {
                            $("#grid_open").delRowData(row_id);
                        } else {
                            alert("Löschen nicht möglich");
                        }
                    })
                });

                $("#btn_open_ok").button().click(function () {
                    SGI.socket.emit("readJsonFile", SGI.prg_store + sel_file, function (data) {
                        SGI.clear();
                        SGI.load_prg(data);
                        SGI.file_name = sel_file.split(".")[0];
                        $("#m_file").text(SGI.file_name);
                    });
                    $("#dialog_open").remove();
                });
            });
        } catch (err) {
            alert("Keine Verbindung zu CCU.IO");
        }
    },

    save_Script: function () {
        var script = Compiler.make_prg();
        if (SGI.file_name == undefined || SGI.file_name == "Neu" || SGI.file_name == "") {
            alert("Bitte erst Programm Speichern")
        } else {
            try {
                SGI.socket.emit("writeRawFile", "scripts/" + SGI.file_name + ".js", script);
            } catch (err) {
                alert("Keine Verbindung zu CCU.IO")
            }
        }
    },

    del_script: function(){
        var sel_file = "";

        try {
            SGI.socket.emit("readdirStat", "scripts/", function (data) {

                var files = [];

                $("body").append('\
                   <div id="dialog_del_script" style="text-align: center" title="Script löschen">\
                   <br>\
                       <table id="grid_del_script"></table>\
                        <br>\
                       <button id="btn_del_script" >Löschen</button>\
                   </div>');
                $("#dialog_del_script").dialog({
                    height: 500,
                    width: 520,
                    resizable: false,
                    close: function () {
                        $("#dialog_del_script").remove();
                    }
                });
                console.log(data)
                if (data != undefined && data.length != 0) {

                    $.each(data, function () {
                        if (this.file != "global.js"){
                        var file = {
                            name: this["file"].split(".")[0],
                            typ: this["file"].split(".")[1],
                            date: this["stats"]["mtime"].split("T")[0],
                            size: this["stats"]["size"]
                        };
                        files.push(file);
                        }
                    });
                    }

                $("#grid_del_script").jqGrid({
                    datatype: "local",
                    width: 485,
                    height: 330,
                    data: files,
                    forceFit: true,
                    multiselect: false,
                    gridview: false,
                    shrinkToFit: false,
                    scroll: false,
                    colNames: ['Datei', 'Größe', 'Typ', "Datum"],
                    colModel: [
                        {name: 'name', index: 'name', width: 240, sorttype: "name"},
                        {name: 'size', index: 'size', width: 80, align: "right", sorttype: "name"},
                        {name: 'typ', index: 'typ', width: 60, align: "center", sorttype: "name"},
                        {name: 'date', index: 'date', width: 100, sorttype: "name"}
                    ],
                    onSelectRow: function (file) {
                        sel_file = $("#grid_del_script").jqGrid('getCell', file, 'name') + "." + $("#grid_del_script").jqGrid('getCell', file, 'typ');
                    }
                });

                $("#btn_del_script").button().click(function () {
                    row_id = $("#grid_del_script").jqGrid('getGridParam', 'selrow');
                    SGI.socket.emit("delRawFile", "scripts/" + sel_file, function (ok) {
                        if (ok == true) {
                            $("#grid_del_script").delRowData(row_id);
                        } else {
                            alert("Löschen nicht möglich");
                        }
                    })
                });
            });
        } catch (err) {
            alert("Keine Verbindung zu CCU.IO");
        }

    },

    show_Script: function (data) {

        var h = $(window).height() - 200;
        var v = $(window).width() - 400;

        $("body").append('\
                   <div id="dialog_code" style="text-align: center" title="Scriptvorschau">\
                    <textarea id="codemirror" name="codemirror" class="code frame_color ui-corner-all"></textarea>\
                   </div>');
        $("#dialog_code").dialog({
            height: h,
            width: v,
            resizable: true,
            close: function () {
                $("#dialog_code").remove();
            }
        });

        var editor = CodeMirror.fromTextArea(document.getElementById("codemirror"), {
            mode: {name: "javascript", json: true},
//            value:data.toString(),
            lineNumbers: true,
            readOnly: true,
            theme: "monokai"

        });

        editor.setOption("value", data.toString());
    },

    info_box: function (data) {

        var _data = data.split("\n").join("<br />");

        $("body").append('\
                   <div id="dialog_info" style="text-align: center" title="Info">\
                   <br>\
                   <span>' + _data + '</span>\
                   <br>\
                   <button id="btn_info_close" >Schliesen</button>\
                   </div>');

        $("#dialog_info").dialog({
//            modal: true,
            dialogClass: "info_box",
            maxHeight: "80%",

            close: function () {
                $("#dialog_info").remove();
            }
        });
        $("#btn_info_close").button().click(function () {
            $("#dialog_open").remove();
        });


    },

    open_quick_help_dialog: function () {

        if ($("body").find(".quick-help").length < 1) {

            $("body").append('\
                   <div id="dialog_quick-help" style="text-align: center, " title="Quick Help">\
                   <div id="help-content"></div>\
                   </div>');

            $("#dialog_quick-help").dialog({

                dialogClass: "quick-help",
                close: function () {
                    $("#dialog_quick-help").remove();
                }
            });

            $(".quick-help").css({
                position: "absolute",
                top: "51px",
                left: "auto",
                right: "21px",
                width: "200px"

            })
        }

    },

    quick_help: function () {
        $(document).click(function (elem) {
            if (SGI.key == 17) {
                SGI.open_quick_help_dialog();

                console.log($(elem.target))

                if ($(elem.target).hasClass("fbs_element") || $(elem.target).hasClass("mbs_element")) {
                    var type = "";

                    if ($(elem.target).attr("id").split("_")[0] == "trigger") {
                        type = $(elem.target).attr("id").split("_")[0] + "_" + $(elem.target).attr("id").split("_")[1];
                    } else {
                        type = $(elem.target).attr("id").split("_")[0];
                    }

                    $("#help-content").load("help/quick-help.html #" + type);
                } else {
                    $.each($(elem.target).parents(), function () {
                        if ($(this).hasClass("fbs_element") || $(this).hasClass("mbs_element")) {

                            if ($(this).attr("id").split("_")[0] = "trigger") {
                                type = $(this).attr("id").split("_")[0] + "_" + $(this).attr("id").split("_")[1];
                            } else {
                                type = $(this).attr("id").split("_")[0];
                            }
                            console.log(type)
                            $("#help-content").load("help/quick-help.html #" + type);  // TODO ist das so richtig ? es soll nur die id geladen werden
                        }

                    });
                }

                if ($(elem.target).parent().hasClass("fbs") || $(elem.target).parent().hasClass("mbs")) {
                    var type = $(elem.target).parent().attr("id");
                    $("#help-content").load("help/quick-help.html #" + type);
                }
                console.log(type)
            }
        });
    }
});
