/**
 *  CCU-IO.ScripGUI
 *  http://github.com/smiling-Jack/CCU-IO.ScriptGUI
 *
 *  Copyright (c) 2013 Steffen Schorling http://github.com/smiling-Jack
 *  MIT License (MIT)
 *
 */

var PRG = {};

var SGI = {
    socket: {},
    zoom: 1,
    theme: "",
    counter: 0,
    str_theme: "ScriptGUI_Theme",
    str_settings: "ScriptGUI_Settings",
    str_prog: "ScriptGUI_Programm",


    file_name: "",
    prg_store: "www/ScriptGUI/prg_Store/",


    Setup: function () {
        console.log("Start_Setup");

        // Lade Theme XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        theme = storage.get(SGI.str_theme);
        if (theme == undefined) {
            theme = "dark-hive"
        }
        $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + theme + '/jquery-ui-1.10.3.custom.min.css"/>');

        // slider XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        SGI.scrollbar_h("init", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_h"), 50);
        SGI.scrollbar_v("init", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_v"), 50);
        SGI.scrollbar_v("init", $("#toolbox_body"), $(".toolbox"), $("#scroll_bar_toolbox"), 100);

        var key = "";
        $(document).keydown(function (event) {
            key = String.fromCharCode(event.keyCode);
        });

        $(document).keyup(function () {
            key = "";
        });

        $('#prg_body').on('mousewheel', function (event, delta, deltaX, deltaY) {

            if (key.toString() == "X") {
                var ist = $("#scroll_bar_h").slider("option", "value");
                if (ist > 100) {
                    $("#scroll_bar_h").slider("option", "value", 100)
                } else if (ist < 0) {
                    $("#scroll_bar_h").slider("option", "value", 0)
                } else {
                    $("#scroll_bar_h").slider("option", "value", ist + delta * 3)
                }

            } else {
                var ist = $("#scroll_bar_v").slider("option", "value");
                if (ist > 100) {
                    $("#scroll_bar_v").slider("option", "value", 100)
                } else if (ist < 0) {
                    $("#scroll_bar_v").slider("option", "value", 0)
                } else {
                    $("#scroll_bar_v").slider("option", "value", ist + delta * 3)
                }
            }
        });

        // Toolbox XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $(".toolbox").hide();

        // Make btn Toolboxauswahl
        $("#toolbox_select").multiselect({
            multiple: false,
            header: false,
            noneSelectedText: false,
            selectedList: 1,
            minWidth: 135
        });

        $("#toolbox_" + $("#toolbox_select").val()).show();

        // Toolboxauswahl
        $("#toolbox_select").change(function () {
            $(".toolbox").hide();
            $("#toolbox_" + $(this).val()).show();
        });

        // Toolboxauswahl Style
        $("#main").find("button.ui-multiselect").addClass("multiselect_toolbox");


        console.log("Finish_Setup");
        SGI.Main();
        SGI.menu_iconbar();
        SGI.context_menu();
    },

    scrollbar_h: function (init, scrollPane_h, scroll_content, scroll_bar_h, value) {

        //scrollpane parts
        var scrollPane = scrollPane_h,
            scrollContent = scroll_content;
        //build slider
        if (init != "init") {
            var scrollbar = scroll_bar_h
        } else {
            var scrollbar = scroll_bar_h.slider({
                slide: function (event, ui) {
                    if (scrollContent.width() > scrollPane.width()) {
                        scrollContent.css("margin-left", Math.round(
                            ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                        ) + "px");
                    } else {
                        scrollContent.css("margin-left", 0);
                    }
                },
                change: function (event, ui) {
                    if (scrollContent.width() > scrollPane.width()) {
                        scrollContent.css("margin-left", Math.round(
                            ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                        ) + "px");
                    } else {
                        scrollContent.css("margin-left", 0);
                    }
                }
            });

            //append icon to handle
            var handleHelper = scrollbar.find(".ui-slider-handle")
                .mousedown(function () {
                    scrollbar.width(handleHelper.width());
                })
                .mouseup(function () {
//                    scrollbar.width("100%");
                })
                .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
                .wrap("<div class='ui-handle-helper-parent'></div>").parent();
            //change overflow to hidden now that slider handles the scrolling
            scrollPane.css("overflow", "hidden");

        }

        //size scrollbar and handle proportionally to scroll distance
        function sizeScrollbar_h() {
            var remainder = scrollContent.width() - scrollPane.width();
            var proportion = remainder / scrollContent.width();
            var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
            scrollbar.find(".ui-slider-handle").css({
                width: handleSize,
                height: "10px",
                "margin-left": (-handleSize / 2) + 2,
                "margin-top": 0

            });


            $(scroll_bar_h).width(parseInt($(scrollbar.parent()).width() - handleSize - 4));
            $(scroll_bar_h).css({left: parseInt(handleSize / 2) + "px"});
        }

        //reset slider value based on scroll content position
        function resetValue_h() {
            var remainder = scrollPane.width() - scrollContent.width();
            var leftVal = scrollContent.css("margin-left") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-left"));
            var percentage = Math.round(leftVal / remainder * 100);
            scrollbar.slider("value", percentage);
        }

        //if the slider is 100% and window gets larger, reveal content
        function reflowContent_h() {
            var showing = scrollContent.width() + parseInt(scrollContent.css("margin-left"), 10);
            var gap = scrollPane.width() - showing;
            if (gap > 0) {
                scrollContent.css("margin-left", parseInt(scrollContent.css("margin-left"), 10) + gap);
            }
        }

        //change handle position on window resize
        $(window).resize(function () {

            setTimeout(function () {             // TODO Timout wegen der Maximate dauer
                resetValue_h();
                sizeScrollbar_h();
                reflowContent_h();

            }, 300);
        });


        //init scrollbar size
        setTimeout(sizeScrollbar_h, 100);//safari wants a timeout

        if (init == "init") {
            $(scroll_bar_h).slider("value", value);
            console.log("Finish_Scrollbar_H init");
        } else {
            console.log("Finish_Scrollbar_H");
        }

    },

    scrollbar_v: function (init, scrollPane_v, scroll_content, scroll_bar_v, value) {

        //scrollpane parts
        var scrollPane = scrollPane_v,
            scrollContent = scroll_content;
        //build slider
        if (init != "init") {
            var scrollbar = scroll_bar_v
        } else {
            var scrollbar = scroll_bar_v.slider({
                orientation: "vertical",
                slide: function (event, ui) {
                    if (scrollContent.height() > scrollPane.height()) {
                        scrollContent.css("margin-top", Math.round(
                            (100 - ui.value) / 100 * ( scrollPane.height() - scrollContent.height() )
                        ) + "px");

                    } else {
                        scrollContent.css("margin-top", 0);

                    }
                },
                change: function (event, ui) {
                    if (scrollContent.height() > scrollPane.height()) {
                        scrollContent.css("margin-top", Math.round(
                            (100 - ui.value) / 100 * ( scrollPane.height() - scrollContent.height() )
                        ) + "px");

                    } else {
                        scrollContent.css("margin-top", 0);

                    }
                }
            });

            //append icon to handle
            var handleHelper = scrollbar.find(".ui-slider-handle")
                .mousedown(function () {
                    scrollbar.height(handleHelper.height());
                })
                .mouseup(function () {
                    scrollbar.height(handleHelper.height());
                })
                .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
                .wrap("<div class='ui-handle-helper-parent'></div>").parent();
            //change overflow to hidden now that slider handles the scrolling
            scrollPane.css("overflow", "hidden");
        }
        //size scrollbar and handle proportionally to scroll distance
        function sizeScrollbar_v() {

            var remainder = scrollContent.height() - scrollPane.height();
            var proportion = remainder / scrollContent.height();
            var handleSize = scrollPane.height() - ( proportion * scrollPane.height() );

            scrollbar.find(".ui-slider-handle").css({

                height: handleSize,
                width: "10px",
                "margin-bottom": (-handleSize / 2) - 4,
                "margin-left": "-6.5px"
            });

            $(scroll_bar_v).height(parseInt($(scrollbar.parent()).height() - handleSize - 4));
            $(scroll_bar_v).css({top: parseInt(handleSize / 2) + "px"});
            $(scroll_bar_v).find(".ui-icon").css({top: parseInt(handleSize / 2) - 8 + "px"});

        }

        //reset slider value based on scroll content position
        function resetValue_v() {

            var remainder = scrollPane.height() - scrollContent.height();
            var topVal = scrollContent.css("margin-top") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-top"));

            var percentage = Math.round(topVal / remainder * 100);
            scrollbar.slider("value", 100 - percentage);
        }

        //if the slider is 100% and window gets larger, reveal content
        function reflowContent_v() {
            var showing = scrollContent.height() + parseInt(scrollContent.css("margin-top"), 10);
            var gap = scrollPane.height() - showing;
            if (gap > 0) {
                scrollContent.css("margin-top", parseInt(scrollContent.css("margin-top"), 10) + gap);
            }
        }

        //change handle position on window resize
        $(window).resize(function () {
            $(scroll_bar_v).find("a").css({"background-image": "url(css/" + theme + "/images/scrollbar_r.png",
                backgroundRepeat: "repeat"});

            setTimeout(function () {             // TODO Timout wegen der Maximate dauer
                resetValue_v();
                sizeScrollbar_v();
                reflowContent_v();

            }, 300);
        });


        //init scrollbar size
        setTimeout(sizeScrollbar_v, 100);//safari wants a timeout


        $(scroll_bar_v).find(".ui-icon").css({
            "transform": "rotate(90deg)",
            "-ms-transform": "rotate(90deg)",
            "-webkit-transform": "rotate(90deg)",
            left: "-2px"
        });


        $(scroll_bar_v).find("a").css({"background-image": "url(css/" + theme + "/images/scrollbar_r.png)",
            backgroundRepeat: "repeat"});

        if (init == "init") {
            $(scroll_bar_v).slider("value", value);
            console.log("Finish_Scrollbar_V init");
        } else {
            console.log("Finish_Scrollbar_V");
        }

    },

    Main: function () {
        console.log("Start_Main");

        // Aufzeigen der Default mit XXX gekennzeichnet wurde geändert
        jsPlumb.Defaults = {
            Anchor: "BottomCenter",
            Anchors: [ null, null ],
            ConnectionsDetachable: true,
            ConnectionOverlays: [],
            Connector: "Bezier",
            Container: $("#prg_panel"),                             //xxx
            DoNotThrowErrors: false,
            DragOptions: { },
            DropOptions: {tolerance: "touch" },
            Endpoint: "Dot",
            Endpoints: [ null, null ],
            EndpointOverlays: [ ],
            EndpointStyle: { fillStyle: "#456" },
            EndpointStyles: [ null, null ],
            EndpointHoverStyle: null,
            EndpointHoverStyles: [ null, null ],
            HoverPaintStyle: null,
            LabelStyle: { color: "black" },
            LogEnabled: false,
            Overlays: [ ],
            MaxConnections: 1,
            PaintStyle: { lineWidth: 4, strokeStyle: "blue" },      //xxx
            ReattachConnections: false,
            RenderMode: "svg",
            Scope: "jsPlumb_DefaultScope"
        };

        jsPlumb.bind("click", function (conn) {
            jsPlumb.detach(conn);
        });

//        Make element draggable
        var active_toolbox;
        $(".fbs").draggable({
            helper: "clone",
            zIndex: -1,
            revert: true,
            revertDuration: 0,
            containment: '#main',
            start: function (e, ui) {
                active_toolbox = $(e.currentTarget).parent();
                var add = $(this).clone();
                $(add).attr("id", "helper");
                $(add).addClass("helper");
                $(add).appendTo(".main");
            },
            drag: function (e, ui) {
                $(".main").find("#helper").css({
                    left: ui.position.left,
                    top: (ui.offset.top) - 35
                })
            },
            stop: function (e, ui) {
                $("#helper").remove()
            }
        });

        //Make element droppable
        $(".prg_panel").droppable({
            drop: function (ev, ui) {

                if (ui["draggable"] != ui["helper"] && ev.pageX > 150) {
                    console.log("add");
                    var hmid = [];
                    var type = $(ui["draggable"][0]).attr("id");
                    var top = (ui["offset"]["top"] - $("#prg_panel").offset().top + 42) / SGI.zoom;
                    var left = (ui["offset"]["left"] - $("#prg_panel").offset().left ) - 3 / SGI.zoom;

                    SGI.add_fbs_element(type, top, left, hmid);
                    SGI.make_fbs_drag();
                    SGI.counter++;
                }
            }
        });


        // Select FBS
        $("#prg_panel").on("click", ".fbs_element", function (e) {
            if ($(e.target).is(".btn_add_input") || $(e.target).is(".btn_input_ch") || $(e.target).is(".btn_min_trigger")) {
            } else {
                $(this).toggleClass("fbs_selected");
            }
        });

        // None select FBS
        $('#prg_panel').click(function (e) {
            if ($(e.target).is("#prg_panel")) {
                $(".fbs_element").removeClass("fbs_selected");
            }
        });
        console.log("Finish_Main");
    },

    load_prg: function (data) {
        console.log(data)

        $.each(data.trigger, function () {
            var type = this["type"];
            var top = this.positionY;
            var left = this.positionX;
            var hmid = this.hmid;
            var name = this["name"];
            SGI.add_fbs_element(type, top, left, hmid, name);
        });

        $.each(data.blocks, function () {
            var type = this.fbs_id.split("_")[0];
            SGI.counter = this.fbs_id.split("_")[1];
            var top = this.positionY;
            var left = this.positionX;
            var input_n = this.input_n;
            var hmid = this.hmid;
            var value = this.value;
            var name = this["name"];

            SGI.add_fbs_element(type, top, left, hmid, name, input_n, value);
        });
        SGI.make_fbs_drag();

        SGI.counter = $(data.blocks).length;

        $.each(data.connections, function () {
            var source = this.pageSourceId;
            var target = this.pageTargetId;
            jsPlumb.connect({uuids: [source, target]});
        });
    },

    add_fbs_element: function (type, top, left, hmid, name, input_n, value) {
        var data = {
            fbs_id: "",
            type: "",
            hmid: [],
            name: [],
            value: 0,
            input_n: ""
        };
        var input_data = "";
        var $this = this;

        data.type = type;
        data.hmid = hmid;
        data.fbs_id = hmid + "_" + SGI.counter;

        if (name == undefined || name.length == 0) {
            data.name = ["Rechtsklick"];
        } else {
            data.name = name;
        }

        var in_n = input_n;
        if (input_n == undefined || input_n == null) {
            in_n = 2;
        }

        if(value == undefined){
            data.value = 0;
        }else{
            data.value = value
        }

        if (type.split("_")[0] == "trigger") {
            PRG[type] = data;
        } else {
            PRG[type + "_" + SGI.counter] = data;
        }

        if (type == "und") {
            for (var i = 1; i < in_n + 1; i++) {
                input_data += '<div id="und_' + SGI.counter + '_in' + i + '"  class="div_input und_' + SGI.counter + '_in"><a class="input_font">IN ' + i + '</a></div>';
            }
            $("#prg_panel").append('\
                             <div id="und_' + SGI.counter + '" class="fbs_element fbs_element_varinput">\
                                <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: green">\
                                    <a class="head_font">' + type + '</a>\
                                </div>\
                                <div id="left_' + SGI.counter + '" class="div_left">\
                                    ' + input_data + '\
                                </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                                    <div id="' + type + '_' + SGI.counter + '_out" class="div_output1 und_' + SGI.counter + '_out"><a class="output_font">OUT</a></div>\
                                </div>\
                            </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "oder") {
            for (var i = 1; i < in_n + 1; i++) {
                input_data += '<div id="oder_' + SGI.counter + '_in' + i + '"  class="div_input oder_' + SGI.counter + '_in"><a class="input_font">IN ' + i + '</a></div>';
            }
            $("#prg_panel").append('\
                             <div id="oder_' + SGI.counter + '" class="fbs_element fbs_element_varinput">\
                                <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: green">\
                                    <a class="head_font">' + type + '</a>\
                                </div>\
                                <div id="left_' + SGI.counter + '" class="div_left">\
                                    ' + input_data + '\
                                </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                                    <div id="' + type + '_' + SGI.counter + '_out" class="div_output1 oder_' + SGI.counter + '_out"><a class="output_font">OUT</a></div>\
                                </div>\
                             </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "not") {

            $("#prg_panel").append('\
                             <div id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_simpel">\
                                <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: green">\
                                    <a class="head_font">' + type + '</a>\
                                </div>\
                                <div id="left_' + SGI.counter + '" class="div_left">\
                                  <div id="' + type + '_' + SGI.counter + '_in"  class="div_input ' + type + '_' + SGI.counter + '_in"><a class="input_font">IN</a></div>\
                                </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                                    <div id="' + type + '_' + SGI.counter + '_out" class="div_output1 ' + type + '_' + SGI.counter + '_out"><a class="output_font">OUT</a></div>\
                                </div>\
                             </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "input") {
            $("#prg_panel").append('\
                        <div id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="left_' + SGI.counter + '" class="div_left"></div>\
                            <div id="right_' + SGI.counter + '" class="div_right">\
                                <div id="' + type + '_' + SGI.counter + '_out" class="div_io_in ' + type + '_' + SGI.counter + '_out"></div>\
                            </div>\
                            <div id="div_hmid_' + SGI.counter + '" class="div_hmid">' + data.name + '</div>\
                             <div id="head_' + SGI.counter + '"  class="div_head_right " style="background-color: yellow">\
                                    <p class="head_font_io">GET</p>\
                            </div>\
                        </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "true") {
            $("#prg_panel").append('\
                        <div id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="left_' + SGI.counter + '" class="div_left"></div>\
                            <div id="right_' + SGI.counter + '" class="div_right">\
                                <div id="' + type + '_' + SGI.counter + '_out" class="div_io_in ' + type + '_' + SGI.counter + '_out"></div>\
                            </div>\
                            <div id="div_hmid_' + SGI.counter + '" class="div_konst">TRUE</div>\
                             <div id="head_' + SGI.counter + '"  class="div_head_right " style="background-color: green">\
                                    <p class="head_font_io">1</p>\
                            </div>\
                        </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "false") {
            $("#prg_panel").append('\
                        <div id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="left_' + SGI.counter + '" class="div_left"></div>\
                            <div id="right_' + SGI.counter + '" class="div_right">\
                                <div id="' + type + '_' + SGI.counter + '_out" class="div_io_in ' + type + '_' + SGI.counter + '_out"></div>\
                            </div>\
                            <div id="div_hmid_' + SGI.counter + '" class="div_konst">FALSE</div>\
                             <div id="head_' + SGI.counter + '"  class="div_head_right " style="background-color: green">\
                                    <p class="head_font_io">0</p>\
                            </div>\
                        </div>');
            set_pos()
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "zahl") {
            $("#prg_panel").append('\
                        <div id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="left_' + SGI.counter + '" class="div_left"></div>\
                            <div id="right_' + SGI.counter + '" class="div_right">\
                                <div id="' + type + '_' + SGI.counter + '_out" class="div_io_in ' + type + '_' + SGI.counter + '_out"></div>\
                            </div>\
                            <input class="inp_var" type=int value="' + data.value + '" id="var_' + SGI.counter + '">\
                             <div id="head_' + SGI.counter + '"  class="div_head_right " style="background-color: darkviolet">\
                                    <p class="head_font_io">Zahl</p>\
                            </div>\
                        </div>');
            set_pos();
            $('#var_' + SGI.counter).numberMask({type: 'float', beforePoint: 3, afterPoint: 2, decimalMark: '.'});
            $('#var_' + SGI.counter).change(function () {
                PRG["zahl_" + $(this).attr("id").split("_")[1]]["value"] = parseFloat($(this).val());
            });
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "output") {
            $("#prg_panel").append('\
                        <div  id="' + type + '_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="left_' + SGI.counter + '" class="div_output_left">\
                               <div id="' + type + '_' + SGI.counter + '_in" class="div_io_out output_' + SGI.counter + '_in"></div>\
                            </div>\
                            <div  id="right_' + SGI.counter + '" class="div_right"></div>\
                             <div id="head_' + SGI.counter + '"  class="div_head_left " style="background-color: yellow">\
                                    <p class="head_font_io">SET</p>\
                            </div>\
                            <div id="div_hmid_' + SGI.counter + '" class="div_hmid">' + data.name + '</div>\
                        </div>');
            set_pos();
        }
//         //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "trigger_valNe") {

            if ($("#prg_panel").find("#trigger_valNe").length == 0) {

                $("#prg_panel").append('\
                        <div id="' + type + '" class="fbs_element fbs_element_trigger">\
                            <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: red">\
                                    <p class="head_font">Trigger ' + type.split("_")[1] + '</p>\
                                    <img src="img/icon/bullet_toggle_minus.png" class="btn_min_trigger"/>\
                            </div>\
                            <div class="div_hmid_trigger">\
                            </div>\
                        </div>');
                set_pos();
                SGI.add_trigger_name($("#prg_panel").find("#" + type));
            } else {
                alert("Trigger schon vorhanden");
            }
        }

        function set_pos() {
            if (type.split("_")[0] == "trigger") {

                if ($this.draggable == undefined) {
                    fbs = $("#prg_panel").find("#" + type);

                    fbs.css({"top": top + "px", "left": left + "px"});
                }
            } else {
                fbs = $("#" + type + "_" + SGI.counter);
                fbs.css({"top": top + "px", "left": left + "px"});
            }
        }

        var _in = $('.' + type + '_' + SGI.counter + '_in');
        $.each(_in, function () {
            var id = $(this).attr("id");
            SGI.add_endpoint(id, "input", parent);
        });

        var _out = $('.' + type + '_' + SGI.counter + '_out');
        $.each(_out, function () {
            var id = $(this).attr("id");
            SGI.add_endpoint(id, "output", parent);
        });
    },

    add_input: function (opt) {

        var id = $($(opt).attr("$trigger")).attr("id");
        var n = id.split("_")[1];
        var type = id.split("_")[0];
        var index = $($("#" + id).find("[id^='left']")).children().length + 1;
        var add_id = type + '_' + n + '_in' + index + '';

        $($("#" + id).find("[id^='left']")).append('\
                <div id="' + add_id + '"  class="div_input ' + type + '_' + n + '_in"><a class="input_font">IN ' + index + '</a></div>\
                ');

        SGI.add_endpoint(add_id, "input");

        jsPlumb.repaintEverything();
    },

    add_endpoint: function (id, type) {

        if (type == "input") {
            var endpointStyle = {fillStyle: "green"};
            jsPlumb.addEndpoint(id, { uuid: id }, {
                anchor: "Left",
                isTarget: true,
                connector: "Flowchart",
                paintStyle: endpointStyle,
                endpoint: [ "Rectangle", { width: 30, height: 10} ]
            });
        }
        if (type == "output") {
            var endpointStyle = {fillStyle: "orange"};
            jsPlumb.addEndpoint(id, { uuid: id }, {
                uuid: $(id).attr("id"),
                anchor: "Right",
                isSource: true,
                maxConnections: -1,
                connector: "Flowchart",
                paintStyle: endpointStyle,
                endpoint: [ "Rectangle", { width: 20, height: 10} ]
            });
        }
    },

    add_trigger_hmid: function ($this) {

        hmSelect.show(homematic, this.jControl, function (obj, hmid) {
            var _name;
            if (homematic.regaObjects[hmid]["TypeName"] == "VARDP") {
                _name = homematic.regaObjects[value]["Type"];
            } else {

                var parent = homematic.regaObjects[hmid]["Parent"];
                var parent_data = homematic.regaObjects[parent];
                _name = parent_data.Name + "_" + homematic.regaObjects[value]["Type"];
            }

            PRG[$this.attr("id")]["hmid"].push(hmid);
            if (PRG[$this.attr("id")]["name"][0] == "Rechtsklick") {
                PRG[$this.attr("id")]["name"][0] = _name;
            } else {
                PRG[$this.attr("id")]["name"].push(_name);
            }

            SGI.add_trigger_name($this)
        });
    },

    add_trigger_name: function ($this) {

        console.log($this)

        $($this).find(".div_hmid_font").remove();

        $.each(PRG[$this.attr("id")]["name"], function () {

            var add = '<div data-info="' + $this.attr("id") + '" class="div_hmid_font">' + this + '</div>';

            $($this).find(".div_hmid_trigger").append(add)

        });
    },

    make_fbs_drag: function () {
        //Todo SGI.zoom faktor mit berücksichtigen
        $(".fbs_element").draggable({
//            grid:[20,20],
            distance: 5,
            alsoDrag: ".fbs_selected",

//            snap: true,
            start: function (event, ui) {
//                ui.position.left = 0;
//                ui.position.top = 0;

            },

            drag: function (event, ui) {
                var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
                var newLeft = (ui.originalPosition.left + changeLeft) / SGI.zoom; // adjust new left by our zoomScale

                var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
                var newTop = (ui.originalPosition.top + changeTop) / SGI.zoom; // adjust new top by our zoomScale

                ui.position.left = newLeft;
                ui.position.top = newTop;

                jsPlumb.repaintEverything() //TODO es muss nur ein repaint gemacht werden wenn mehrere selected sind
            },
            stop: function () {
                jsPlumb.repaintEverything() //TODO es muss nur ein repaint gemacht werden wenn mehrere selected sind
            }
        });
    },

    make_savedata: function () {
        console.log("Start_Make_Savedata");

        var data = {
            trigger: [],
            blocks: [],
            connections: []
        };

        $("#prg_panel .fbs_element_trigger").each(function (idx, elem) {
            var $this = $(elem);
            PRG[$this.attr("id")]["positionX"] = parseInt($this.css("left"), 10);
            PRG[$this.attr("id")]["positionY"] = parseInt($this.css("top"), 10);
            data.trigger.push(PRG[$this.attr("id")]);
        });

        $("#prg_panel .fbs_element:not(.fbs_element_trigger)").each(function (idx, elem) {
            var $this = $(elem);

            PRG[$this.attr("id")]["positionX"] = parseInt($this.css("left"), 10);
            PRG[$this.attr("id")]["positionY"] = parseInt($this.css("top"), 10);
            PRG[$this.attr("id")]["input_n"] = $($this).find(".div_input").length;
            PRG[$this.attr("id")]["fbs_id"] = $($this).attr("id");

            data.blocks.push(PRG[$this.attr("id")]);
        });

        $.each(jsPlumb.getConnections(), function (idx, connection) {
            data.connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });

        console.log(data);
        return data;
    },

    make_struc: function () {
        console.log("Start_Make_Struk");

        var fbs = [];
        var struck = {
            trigger: [],
            fbs: []

        };

        $("#prg_panel .fbs_element_trigger").each(function (idx, elem) {
            var $this = $(elem);

            struck.trigger.push({
                fbs_id: $this.attr('id'),
                hmid: PRG[$($this).attr("id")]["hmid"]
            });
        });

        $("#prg_panel .fbs_element").not(".fbs_element_trigger").each(function (idx, elem) {
            var $this = $(elem);
            fbs.push({
                fbs_id: $this.attr('id'),
                positionX: parseInt($this.css("left"), 10),
                positionY: parseInt($this.css("top"), 10),
                hmid: PRG[$($this).attr("id")]["hmid"],
                value: PRG[$($this).attr("id")]["value"]
            });
        });

        var connections = [];
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });
//        console.log(connections);

        function SortByName(a, b) {
            var aName = a.positionX;
            var bName = b.positionX;
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        fbs.sort(SortByName);

        // Erstelle Scrip Stucktur

        $.each(fbs, function () {
            var id = this["fbs_id"];
            var data = {
                type: undefined,
                input: [],
                output: [],
                hmid: undefined,
                value: undefined,
            };

            data.type = this["fbs_id"].split("_")[0];
            data.hmid = this["hmid"];
            data.value = this["value"];


            $.each(connections, function () {

                input = this["pageTargetId"].split("_");
                input_name = (input[0] + "_" + input[1]);

                output = this["pageSourceId"].split("_");
                output_name = (output[0] + "_" + output[1]);

                if (input_name == id) {
                    var add = {
                        eingang: input[2],
                        herkunft: this.pageSourceId
                    };

                    data.input.push(add);
                }

                if (output_name == id) {
                    var add = {
                        ausgang: this.pageSourceId
                    };
                    data.output.push(add)
                }
            });
            struck.fbs.push(data);
        });

        console.log(struck);
        console.log("Finish_Make_Struk");
        return (struck);
    },

    clear: function () {
        jsPlumb.reset();
        $("#prg_panel").children().remove();
        SGI.counter = 0;
        $("#m_file").text("neu");
        SGI.file_name = "";
        PRG = {};
    }
};

var homematic = {
    uiState: new can.Observe({"_65535": {"Value": null}}),
    setState: new can.Observe({"_65535": {"Value": null}}),
    regaIndex: {},
    regaObjects: {},
    setStateTimers: {}

};

var Compiler = {

    script: "",

    make_trigger: function () {

    },

    make_prg: function () {
        Compiler.script = "";
        var struck = SGI.make_struc();
        console.log(struck);

        $.each(struck.trigger, function () {
            var $trigger = this;

            if (this["fbs_id"] == "trigger_valNe") {
                $.each($trigger.hmid, function () {
                    Compiler.script += 'subscribe({id: ' + this + ' , valNe:false}, function () { code_1() }); \n'
                });
            }
        });
        Compiler.script += '\n';
        Compiler.script += 'function code_1() {\n'

        $.each(struck.fbs, function () {

            if (this["type"] == "input") {
                Compiler.script += ' var ' + this.output[0].ausgang + '= datapoints[' + this.hmid + '][0];\n';
            }

            if (this["type"] == "output") {
                Compiler.script += ' setState(' + this.hmid + ',' + this["input"][0]["herkunft"] + ');\n';
            }

            if (this["type"] == "true") {
                Compiler.script += ' var ' + this.output[0].ausgang + '= true;\n';
            }
            if (this["type"] == "false") {
                Compiler.script += ' var ' + this.output[0].ausgang + '= false;\n';
            }
            if (this["type"] == "zahl") {
                console.log("info")
                console.log(this)
                Compiler.script += ' var ' + this.output[0].ausgang + '= '+ this.value +' ;\n';
            }


            if (this["type"] == "oder") {
                var n = this["input"].length;
                Compiler.script += 'if(';
                $.each(this["input"], function (index, obj) {
                    Compiler.script += obj.herkunft + ' == true';
                    if (index + 1 < n) {
                        Compiler.script += ' || ';
                    }
                });
                Compiler.script += '){\nvar ' + this.output[0].ausgang + ' = true;}else{\nvar ' + this.output[0].ausgang + ' = false;}\n\n'
            }

            if (this["type"] == "und") {
                var n = this["input"].length;
                Compiler.script += 'if(';
                $.each(this["input"], function (index, obj) {
                    Compiler.script += obj.herkunft + ' == true';
                    if (index + 1 < n) {
                        Compiler.script += ' && ';
                    }
                });
                Compiler.script += '){\nvar ' + this.output[0].ausgang + ' = true;}else{\nvar ' + this.output[0].ausgang + ' = false;}\n\n'
            }

            if (this["type"] == "not") {

                Compiler.script += 'var ' + this.output[0].ausgang + ' = !' + this["input"][0]["herkunft"] + '\n\n';
            }

        });

        Compiler.script += '\n}';
        return (Compiler.script);
    }
};


(function () {
    $(document).ready(function () {

        try {
            SGI.socket = io.connect($(location).attr('protocol') + '//' + $(location).attr('host')+"?key="+socketSession);

            SGI.socket.on('event', function (obj) {
                if (homematic.uiState["_" + obj[0]] !== undefined) {
                    var o = {};
                    o["_" + obj[0] + ".Value"] = obj[1];
                    o["_" + obj[0] + ".Timestamp"] = obj[2];
                    o["_" + obj[0] + ".Certain"] = obj[3];
                    homematic.uiState.attr(o);
                }
            });

            SGI.socket.emit("getIndex", function (index) {
                homematic.regaIndex = index;
                SGI.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/regaIndex.json", JSON.stringify(index));

                SGI.socket.emit("getObjects", function (obj) {

                    homematic.regaObjects = obj;
                    SGI.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Objects.json", JSON.stringify(obj));

                    SGI.socket.emit("getDatapoints", function (data) {
                        SGI.socket.emit("writeRawFile", "www/ScriptGUI/sim_Store/Datapoints.json", JSON.stringify(data));

                        for (var dp in data) {
                            homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
                        }
                    });
                });
            });
        }
        catch (err) {
            console.log("rega Local");
            $.getJSON("sim_store/regaIndex.json", function (index) {
                homematic.regaIndex = index;
                console.log(index);
            });

            $.getJSON("sim_store/Objects.json", function (obj) {
                homematic.regaObjects = obj;

                $.getJSON("sim_store/Datapoints.json", function (data) {
                    for (var dp in data) {
                        homematic.uiState.attr("_" + dp, { Value: data[dp][0], Timestamp: data[dp][1], LastChange: data[dp][3]});
                    }
                });
            });
        }

        SGI.Setup();

//todo Ordentliches disable sichen was man auch wieder einzelnt enabeln kann
//       $("body").disableSelection();
    });
})(jQuery);
