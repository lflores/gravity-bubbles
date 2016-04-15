var chart;
$(document).ready(function () {

    var month;

    chart = new GravityBubbles({
        id: "vis",
        width: 800,
        height: 300,
        sizeById: "size",
        colorById: "perc",
        points: [0, 3, 7, 20, 50, 100],
        colors: ["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C", "#08519C"],
        data: {
            tooltip: function (d) {
                return "<b>Name:</b>{name}<br><b>Size:</b> {size}<br><b>Size of Total:</b> {perc}%";
            },
            label: {
                template: "{name}\n{perc}%"
            }
        }
    });

    //Month for first time
    month = $("input[name='timeline']").val();
    load(month);

    //When month changes reload data for month
    $('input[name="timeline"]').change(function () {
        var month = $(this).val();
        $("form[name=timeline-form] > label").removeClass("active");
        $(this).parent().addClass("active");
        load(month);
    });

    $('#group a').click(function () {
        var group_type = $(this).attr('id');
        $('#group a').removeClass('active');
        $(this).toggleClass('active');
        chart.groupById(group_type);
    });

    $('button[name="play-button"]').click(function () {
        if ($(this).hasClass("active")) {
            stop();
            return;
        }
        play();
    });
});
var interval = null;

function load(month) {
    d3.json("./data/" + month + ".json", function (data) {
        if (!data) {
            //I can't load data, do nothing
            return;
        }
        chart.data(data.children);
    });
}

function play() {
    interval = setInterval(function () {
        var index = $("input[name='timeline']").index($("input[name='timeline']:checked"));
        index++;
        index = index % $("input[name='timeline']").length;
        $("input[name='timeline']").get(index).click();
    }, 5000);
}

function stop() {
    if (interval) {
        clearInterval(interval);
    }
}
