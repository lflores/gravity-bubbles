var chart;
var delay_play = 3000;
var months = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
$(document).ready(function () {
    $(".slider").bootstrapSlider({
        formatter: function (d) {
            return months[Number(d - 201500) - 1] + " " + Math.floor(d / 100);
        },
        tooltip: "show",
        ticks_labels: ["Ene 15", "Feb 15", "Mar 15", "Apr 15", "May 15"]
    });

    var month;
    chart = new GravityBubbles({
        id: "vis",
        width: 800,
        height: 300,
        sizeById: "size",
        colorById: "perc",
        _groupBy: "category",
        points: [0, 3, 7, 20, 50, 100],
        colors: ["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C", "#08519C"],
        data: {
            tooltip: function (d) {
                return "<b>Name:</b>{name}<br>{category}<br><b>Size:</b> {size}<br><b>Size of Total:</b> {perc}%";
            },
            label: {
                template: "{name}\n{perc}%\n{category}",
                autofit: true
            }
        }
    });

    //Month for first time
    load($("#timeline").bootstrapSlider("getValue"));
    group = $("#group a.active").attr("id");
    chart.groupById(group);

    $("#timeline").on("change", function (event) {
        load(event.value.newValue);
    });

    $('#group a').click(function () {
        var group_type = $(this).attr('id');
        $('#group a').removeClass('active');
        $(this).toggleClass('active');
        chart.groupById(group_type);
    });

    $('#autofit a').click(function () {
        var autofit = $(this).attr('id');
        $('#autofit a').removeClass('active');
        $(this).toggleClass('active');
        chart.config({
            data: {
                label: {
                    autofit: autofit === 'autofit' ? true : false
                }
            }
        });
    });

    $('button[name="play-button"]').click(function () {
        if ($(this).hasClass("active")) {
            $(this).find("span").removeClass("glyphicon-pause");
            stop();
            return;
        }
        $(this).find("span").addClass("glyphicon-pause");
        play();
    });
});
var interval, totalLines;

function load(month) {
    d3.json("./data/" + month + ".json", function (data) {
        if (!data) {
            //I can't load data, do nothing
            return;
        }
        totalLines = 0;
        data.children.forEach(function (item, i) {
            totalLines += item.size;
        });
        perc(data);
        chart.data(data.children);
    });
}

function perc(node) {
    node['perc'] = node['children'].reduce(function (result, item) {
        item['perc'] = (item['size'] / totalLines) * 100;
        return result + (item['children'] && item['children'].length > 0 ? perc(item) : (item['size'] / totalLines) * 100);
    }, 0);
    //node['perc'] = node['children'] ? node['perc'] : (node['size'] / totalLines) * 100;
    return (node['size'] / totalLines) * 100;
}

function rollup(node) {
    node['size'] = node['children'].reduce(function (result, item) {
        return result + (item['children'] ? rollup(item) : item['size']);
    }, 0);
    return node['size'];
}


function play() {
    var min = Number($("#timeline").bootstrapSlider("getAttribute", "min"));
    var max = Number($("#timeline").bootstrapSlider("getAttribute", "max"));
    interval = setInterval(function () {
        var index = Number($("#timeline").bootstrapSlider("getValue"));
        index++;
        index = index > max ? min : index;
        $("#timeline").bootstrapSlider("setValue", index);
        load(index);
    }, delay_play);
}

function stop() {
    if (interval) {
        clearInterval(interval);
    }
}
