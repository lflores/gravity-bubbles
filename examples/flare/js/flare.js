$(document).ready(function () {

    var _colors = {
        greenred: {
            points: [0, 3, 7, 20, 50, 100],
            colors: ["#D84B2A", "#EE9586", "#E4B7B2", "#BECCAE", "#9CAF84", "#7AA25C"]
        },
        green: {
            points: [0, 3, 7, 20, 50, 100],
            colors: ["#FFFFCC", "#C2E699", "#78C679", "#31A354", "#006837", "#006837"]
        },
        brown: {
            points: [0, 3, 7, 20, 50, 100],
            colors: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404", "#993404"]
        },
        blue: {
            points: [0, 3, 7, 20, 50, 100],
            colors: ["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C", "#08519C"]
        },
        lightblue: {
            points: [0, 3, 7, 20, 50, 100],
            colors: ["#B44B4B", "#B44B4B", "#669898", "#38C7C7", "#00FFFF", "#00FFFF"]
        }
    };

    var sizes = {
        "mini": {
            "width": 300,
            "height": 200
        },
        "medium": {
            "width": 600,
            "height": 300
        },
        "max": {
            "width": 800,
            "height": 400
        }
    };
    var loaded_data;
    var nodes = [];
    var chart;

    $(document).ready(function () {
        $("#gauge").linearGauge({
            width: 215,
            height: 35,
            thresholds: true,
            _points: _colors.blue.points,
            _colors: _colors.blue.colors
        });

        $('input[name="color-scheme"]').change(function () {
            $("#gauge").linearGauge({
                points: _colors[$(this).val()].points,
                colors: _colors[$(this).val()].colors
            });
            $("#gauge").linearGauge("colors", _colors[$(this).val()].colors);
            $("#gauge").linearGauge("points", _colors[$(this).val()].points);
            chart.config({
                colors: _colors[$(this).val()].colors,
                points: _colors[$(this).val()].points
            })
        });

        $('#size a').click(function () {
            var size_type = $(this).attr('id');
            $('#size a').removeClass('active');
            $(this).toggleClass('active');
            //toggle_view(view_type);
            var id = null;
            switch (size_type) {
                case "mini":
                case "medium":
                case "max":
                    $("#vis").css("width", sizes[size_type].width);
                    $("#vis").css("height", sizes[size_type].height);
            }
            chart.resize();
            return false;
        });

        $('#group a').click(function () {
            var group_type = $(this).attr('id');
            $('#group a').removeClass('active');
            $(this).toggleClass('active');
            //toggle_view(view_type);
            var id = null;
            chart.groupById(group_type);
            //                switch (group_type) {
            //                    case "all":
            //                        chart.groupById("all");
            //                        break;
            //                    case "color":
            //                        chart.groupById("color");
            //                        break;
            //                    case "category":
            //                        chart.groupById("category");
            //                        break;
            //                }
            //chart.resize();
            return false;
        });

        chart = new GravityBubbles({
            id: "vis",
            lanes: 5,
            width: sizes.medium.width,
            height: sizes.medium.height,
            debug: false,
            sizeById: "size",
            colorById: "perc",
            data: {
                tooltip: function (d) {
                    return "<b>Name:</b>{name}<br><b>Size:</b> {size}<br><b>Size of Total:</b> {perc}%";
                },
                label: {
                    template: "{name}\n{perc}%"
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
                                //d3.selectAll(".label").attr("class", "label").attr("visibility", "visible");
                                //chart.data([]);
                                chart.data(d.children);
                                nodes.push(d);
                                breadcrumb();
                            });
                        d3.select(circle).select(".label").attr("class", "label selected");
                        d3.selectAll(".label:not(.selected)")
                            .attr("visibility", "hidden");
                        //.attr("transform", "scale(1,2)");

                    }
                }
            }
        });


        var color_scheme = $("input[name='color-scheme']").val();
        chart.config({
            colors: _colors[color_scheme].colors,
            points: _colors[color_scheme].points
        });
        $("#gauge").linearGauge("points", _colors[color_scheme].points);
        $("#gauge").linearGauge("colors", _colors[color_scheme].colors);

        var playInterval;
        var selected = 1;

        $("#gauge").on("lineargaugechange", function (evt, data) {
            chart.colors(data.colors);
            chart.points(data.points);
        })

        d3.json("js/flare.json", function (data) {
            if (!data) {
                //I can't load data, do nothing
                return;
            }
            rollup(data);
            totalLines = data.size;
            perc(data);
            category(data);
            user(data);
            //console.log(_data);
            chart.data(data.children);
            console.log(data.children);
            loaded_data = data;
            nodes.push(data);
            breadcrumb();
        });
    });

    var totalLines;
    var _users = ["triad", "memo", "terminator", "alien"];
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
    var _sizes = ["small", "medium", "large", "x-large"];
    var _size_thresholds = d3.scale.threshold()
        .domain([0, 10000, 100000, 1000000])
        .range(_sizes);

    function category(node) {
        node['category'] = node['children'].reduce(function (result, item) {
            item['category'] = _size_thresholds(node['size']);
            return (item['children'] ? category(item) : _size_thresholds(node['size']));
        }, 0);
        return _size_thresholds(node['size']);
    }

    function user(node) {
        node['user'] = node['children'].reduce(function (result, item) {
            item['user'] = _users[Math.floor(Math.random() * _users.length)];
            return (item['children'] ? user(item) : _users[Math.floor(Math.random() * _users.length)]);
        }, 0);
        return _users[Math.floor(Math.random() * _users.length)];
    }


    $("ol.breadcrumb").on('click', 'li a', function (event) {
        //alert("Click en: " + nodes[$(this).parent().index()].name);
        nodes.splice($(this).parent().index() + 1, 5);
        breadcrumb();
        chart.data(nodes[nodes.length - 1].children);
    });

    function breadcrumb() {
        $("ol.breadcrumb").children().remove();
        $.each(nodes, function (i, node) {
            var bread = $("<li><a href=\"#\">" + node.name + "</a></li>");
            $("ol.breadcrumb").append(bread);
            if (i == nodes.length - 1) {
                bread.html(node.name);
                bread.addClass("active");
            }
        });
    }
});
