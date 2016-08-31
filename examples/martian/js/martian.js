var earth1 = "#a7c761";
var earth2 = "#9aaf38";
var earth3 = "#37adbf";
var earth4 = "#1f8a9a";

var mars1 = "#D84B2A"; // orange
var mars2 = "#EE9586"; // pink
var mars3 = "#E4B7B2"; // lighter pink
var mars4 = "#BECCAE"; // light green

var jsonPath = "js/martian.json";
var dragonPath = "images/dragon.svg";
var settlementPath = "images/settlement.svg";

var percentPoints = [14, 21, 28, 35];

var _colors = {
    greenred: {
        points: percentPoints,
        colors: [mars1, mars2, mars3, mars4]
    },
    blue: {
        points: percentPoints,
        colors: [earth1, earth2, earth3, earth4]
    },
}

var sizes = {
    "mini": {
        "width": 300,
        "height": 200
    },
    "max": {
        "width": 800,
        "height": 400
    }
}
var loaded_data;
var nodes = [];
var chart;

$(document).ready(function () {



    $('input[name="color-scheme"]').change(function () {

        chart.config({
            colors: _colors[$(this).val()].colors,
            points: _colors[$(this).val()].points
        })
    });

    var toggleResolution = function (size_type) {

        $('#size a').removeClass('active');
        $(this).toggleClass('active');
        //toggle_view(view_type);
        var id = null;
        switch (size_type) {
            case "mini":
            case "max":
                $("#vis").css("width", sizes[size_type].width);
                $("#vis").css("height", sizes[size_type].height);
        }
        chart.resize();
        return false;
    };

    $('input[name="resolution"]').change(function () {

        var size_type = $(this).val();
        toggleResolution(size_type);

    });

    var toggleGroupBy = function (group_type) {

        $('#group a').removeClass('active');
        $(this).toggleClass('active');
        //toggle_view(view_type);
        var id = null;
        chart.groupById(group_type);

        return false;
    }


    $('input[name="groupby"]').change(function () {

        var group_type = $(this).val();
        toggleGroupBy(group_type);

    });

    $('input[name="autofit"]').change(function () {
        var _autofit = $(this).is(":checked");
        chart.config({
            data: {
                label: {
                    autofit: _autofit
                }
            }
        });
    });

    chart = new GravityBubbles({
        id: "vis",
        lanes: 4,
        width: sizes.max.width,
        height: sizes.max.height,
        debug: false,
        sizeById: "size",
        colorById: "perc",
        data: {
            tooltip: function (d) {
                return "Name:<span style='color:#000'> {name}</span><br>Size:<span style='color:#000'> {size}</span><br>Size of Total:<span style='color:#000'> {perc}%</span><br>Channel:<span style='color:#000'> {channel}</span>";
            },
            label: {
                template: "{name}\n{perc}%\n{channel}",
                //show: false,
                autofit: true
            },
            onclick: function (d, circle) {
                if (d.hasOwnProperty("children")) {
                    //d3.select(circle).classed("drilldown", true);
                    d3.selectAll(".bubble:not(.selected)")
                        .transition()
                        .duration(100)
                        .attr("r", 0);
                    d3.select(circle).select("circle")
                        .transition()
                        .duration(1000)
                        .attr("fill-opacity", 0.1)
                        .attr("r", chart._config.width)
                        .each("end", function () {
                            d3.selectAll(".bubble").attr("r", 0).attr("fill-opacity", null);
                            chart.data(d.children);
                            nodes.push(d);
                            breadcrumb();
                        });
                    d3.select(circle).select(".label").attr("class", "label selected");
                    d3.selectAll(".label:not(.selected)")
                        .attr("visibility", "hidden");

                }
            }
        }
    });

    var color_scheme = $("input[name='color-scheme']").val();
    chart.config({
        colors: _colors[color_scheme].colors,
        points: _colors[color_scheme].points
    });

    var playInterval;
    var selected = 1;

    d3.json(jsonPath, function (data) {
        if (!data) {
            //I can't load data, do nothing
            return;
        }
        rollup(data);
        totalLines = data.size;
        perc(data);
        channel(data);
        chart.data(data.children);
        loaded_data = data;
        console.log("data: ", data);
        //forceChannelNames(data);
        nodes.push(data);
        breadcrumb();
        updateViewports();
    });

    $(".breadcrumb li").css("color", "#000");

    var mobileCheck = getMobileCheck();
    if (mobileCheck) {
        $('input:radio[name="resolution"]').attr('checked', 'checked');
    }


    // fix the weird css error
    $('body').css("height", "2000px");
});

var totalLines;
var _users = ["marceline", "bishop", "ripley", "vasquez"];
var country = ["es", "ar", "br", "us", "uk"];

function rollup(node) {
    node['size'] = node['children'].reduce(function (result, item) {
        return result + (item['children'] ? rollup(item) : item['size']);
    }, 0);
    return node['size'];
}

function perc(node) {
    node['perc'] = node['children'].reduce(function (result, item) {
        item['perc'] = (item['size'] / totalLines) * 100;
        return result + (item['children'] ? perc(item) : (item['size'] / totalLines) * 100);
    }, 0);
    //node['perc'] = node['children'] ? node['perc'] : (node['size'] / totalLines) * 100;
    return (node['size'] / totalLines) * 100;
}


var _labels = ["Autonomous", "Chat", "VR", "Web"];
var _size_thresholds = d3.scale.threshold()
    .domain([40000, 60000, 80000, 100000])
    .range(_labels);

var _channels_thresholds = d3.scale.ordinal()
    .domain([1, 2, 3, 4])
    .range(_labels);

function channel(node) {

    node['channel'] = node['children'].reduce(function (result, item) {


        item['channel'] = _channels_thresholds(node['channel']);

        console.log();

        return (item['children'] ? channel(item) : _channels_thresholds(node['channel']));

    }, 0);

    var result = _channels_thresholds(node['channel']);

    console.log("result: ", result);

    return result;
}

function forceChannWelNames(node) {
    // 8 bbubles

    // more fakery


    _.each(node.children, function (item) {
        switch (item.name) {
            case "Human":
                item.channel = "Chat";
                break;
            case "Machine":
                item.channel = "Web";
                break;
            case "Alien":
                item.channel = "VR";
                break;
            case "Towel":
                item.channel = "Autonomous";
                break;
        }
    });


    //return node;

}




$("ol.breadcrumb").on('click', 'li a', function (event) {
    //alert("Click en: " + nodes[$(this).parent().index()].name);
    nodes.splice($(this).parent().index() + 1, 5);
    breadcrumb();
    chart.data(nodes[nodes.length - 1].children);
});

function breadcrumb() {
    $("ol.breadcrumb").children().remove();
    $.each(window.nodes, function (i, node) {
        var bread = $("<li><a href=\"#\">" + node.name + "</a></li>");
        $("ol.breadcrumb").append(bread);
        if (i == nodes.length - 1) {
            bread.html(node.name);
            bread.addClass("active");
        }
    });
}

function updateViewports() {

    // dragon 

    $("#dragonContainer").html("<svg id='dragonViewport' width='100%'></svg>");

    var dragonScope = Snap("#dragonViewport");
    var dragonGroup = dragonScope.g();

    var ship, smoke, thrusters;

    var onDragonLoadedHandler = function (loadedFragment) {
        dragonGroup.append(loadedFragment.select("defs"));

        ship = loadedFragment.select("#ship");
        smoke = loadedFragment.select("#smoke");
        thrusters = loadedFragment.select("#thrusters");

        dragonGroup.append(ship);
        dragonGroup.append(smoke)
        dragonGroup.append(thrusters);
        dragonGroup.attr("id", "dragonDropship");

        TweenMax.set("#dragonDropship", {
            y: -15,
            opacity: 0
        });

        smoke.attr("opacity", 0);
        thrusters.attr("opacity", 0);

        setTimeout(function () {

            var opacity = 0.2;
            var bOut = true;

            var flash = function () {

                var repeatCallback = function () {
                    bOut = !bOut;
                    opacity = (bOut) ? 0.3 : 0;

                    setTimeout(function () {
                        flash();
                    }, 4000);

                }

                var fadeOuCallback = function () {
                    setTimeout(function () {
                        smoke.animate({
                            "opacity": 0
                        }, 500, mina.easeout);
                        thrusters.animate({
                            "opacity": 0
                        }, 500, mina.easeout);
                    }, 4000);
                }

                smoke.animate({
                    "opacity": opacity
                }, 500, mina.easeout);
                thrusters.animate({
                    "opacity": opacity
                }, 500, mina.easeout);
                //thrusters.animate({"opacity":opacity}, 500, callback);
                //animateFire(dragonGroup);

            }

            flash();

            var onComplete = function () {
                TweenMax.to("#dragonDropship", 1, {
                    y: -5,
                    rotation: +2,
                    delay: 250
                });
                animateFire(dragonGroup);
            }

            TweenMax.to("#dragonDropship", 1, {
                x: -10,
                y: +35,
                rotation: -10,
                opacity: 1,
                onComplete: onComplete
            });

        }, 1500);

        //TweenMax.to(smoke, 1, {opacity: 0.8, delay: 1});
        //TweenMax.to(thrusters, 1, {opacity: 0.8, delay: 1});
    }

    Snap.load(dragonPath, onDragonLoadedHandler);

    // settlement
    $("#settlementContainer").html("<svg id='settlementViewport' width='100%'></svg>");

    var settlementScope = Snap("#settlementViewport");
    var settlmentGroup = settlementScope.g();

    var rover, settlement, hills, hillGroup;

    var onSettlementLoadedHandler = function (loadedFragment) {

        settlmentGroup.append(loadedFragment.select("defs"));

        rover = loadedFragment.select("#rover");
        settlement = loadedFragment.select("#settlement");
        hills = loadedFragment.select("#hills");

        hillGroup = settlmentGroup.g();

        hillGroup.append(hills);
        settlmentGroup.append(settlement);
        settlmentGroup.append(rover);

        var originalHillsTransform = hills.transform();

        _.times(20, function (index) {

            var clonedHills = hills.clone();

            hillGroup.append(clonedHills);

            var newHillX = 200 * (index + 1);
            var newHillY = originalHillsTransform.globalMatrix.f;

            var transformStr = "t(" + newHillX + "," + newHillY + ")";
            clonedHills.transform(transformStr);

        });

        var originalRoverTransform = rover.transform();
        console.log("trans originalRoverTransform", originalRoverTransform);

        var roverEndX = $(window).width() - 50;

        var newRoverX = roverEndX; //originalRoverTransform.globalMatrix.e + 900; 
        var newRoverY = originalRoverTransform.globalMatrix.f - 15;

        var roverScaleX = originalRoverTransform.globalMatrix.a;
        var roverScaleY = originalRoverTransform.globalMatrix.d;

        //rover.attr("transform", originalRoverTransform); 
        var roverTranslate, roverScale;

        var atHomeCallback = function () {
            setTimeout(function () {
                resetRover();
            }, 1000);
        };


        var atHomeCallback = function () {
            resetRover();
        }

        var flipRover = function () {

            console.log("so flipping");

            rover.transform(roverTranslate + "s(" + -roverScaleX + "," + roverScaleY + ")");
            var roverBackTranslate = "t(" + 20 + "," + 30 + ") ";
            var roverBackScale = "s(" + -roverScaleX + "," + roverScaleY + ")";
            var roverBackTransform = roverBackTranslate + roverBackScale;
            rover.animate({
                transform: roverBackTransform
            }, 65000, atHomeCallback);
        }

        var atDestinationCallback = function () {
            console.log("so flip");

            // take sample
            setTimeout(function () {
                flipRover();
            }, 3000);

        };

        var resetRover = function () {
            roverTranslate = "t(" + newRoverX + "," + newRoverY + ") ";
            roverScale = "s(" + roverScaleX + "," + roverScaleY + ")";

            rover.transform("t(20,30) " + roverScale);

            var roverTransform = roverTranslate + roverScale;
            rover.animate({
                transform: roverTransform
            }, 65000, atDestinationCallback);
        }

        resetRover();

        //rover.set({transform: originalRoverTransform});


    }

    Snap.load(settlementPath, onSettlementLoadedHandler);

}

// DATA


var particles = [];

var animateFire = function (world) {

    var dragon = Snap("#ship");
    var dragonBox = dragon.getBBox();

    var particle = {
        x: 0,
        y: 0,
        skin: null
    };

    var particleWidth = 10;
    var particleHeight = 15;

    var fireBase = dragonBox.height;
    // credit http://www.zhangxinxu.com/GitHub/demo-Snap.svg/demo/basic/Snap.filter.blur.php
    var blurFilter = world.paper.filter(Snap.filter.blur(4, 10));

    if (particles.length === 0) {

        _.times(10, function (index) {

            var particleX = Math.random() * (dragonBox.width - particleWidth);

            var skin;

            if (index < 4) {
                skin = dragon.rect(dragonBox.x, fireBase, particleWidth, particleHeight).attr({
                    fill: "orange",
                    filter: blurFilter
                }); //.transform("r190");
            } else if (index >= 4 && index < 8) {
                skin = dragon.rect(dragonBox.x + 20, fireBase, particleWidth, particleHeight).attr({
                    fill: "darkred",
                    filter: blurFilter
                });
            } else {
                skin = dragon.rect(dragonBox.x + 40, fireBase, particleWidth, particleHeight).attr({
                    fill: "orange",
                    filter: blurFilter
                }); //.transform("r310");
            }

            var newParticle = _.clone(particle);
            newParticle.skin = skin;
            particles.push(newParticle);
        });

    } else {
        _.each(particles, function (particle, index) {

            if (index < 4) {
                particle.skin.attr({
                    x: dragonBox.x,
                    y: fireBase,
                    opacity: 1,
                    fill: "orange",
                    filter: blurFilter
                });
            } else if (index >= 4 && index < 8) {
                particle.skin.attr({
                    x: dragonBox.x + 20,
                    y: fireBase,
                    opacity: 1,
                    fill: "red",
                    filter: blurFilter
                });
            } else {
                particle.skin.attr({
                    x: dragonBox.x + 40,
                    y: fireBase,
                    opacity: 1,
                    fill: "orange",
                    filter: blurFilter
                });
            }
        });

        console.log("reset particles: ", particles);
    }

    _.each(particles, function (particle, index) {

        var time = Math.floor(Math.random() * 2000);
        var top;

        var spread = 220;

        if (index < 4) {
            top = {
                x: dragonBox.x - spread,
                y: 100,
                opacity: 0,
                fill: "#000"
            };
        } else if (index >= 4 && index < 8) {
            top = {
                y: 80,
                opacity: 0,
                fill: "#000"
            };
        } else {
            top = {
                x: dragonBox.x + spread,
                y: 100,
                opacity: 0,
                fill: "#000"
            };
        }

        var callback = function () {

            //this.attr({y: fireBase, opacity: 1, fill: "#990000"});
            //this.animate(top, time);
        }

        particle.skin.animate(top, time, callback);

    });

}

var getMobileCheck = function () {

    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);

    return check;

};
