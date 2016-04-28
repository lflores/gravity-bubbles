describe("GravityBubbles tests", function () {
    //var chart;
    var voidSelectorEquality = function (selector, result) {
        return selector.length === result || selector[0].length === result ? true : false;
    }

    function getContainer(id) {
        var $child = $("<div id=\"" + id + "\"></div>");
        $child.css("height", 300);
        $child.css("width", 600);
        $child.css("border", "1px red dashed");
        $("body").append($child);
        return $child[0];
    }


    beforeEach(function () {
        jasmine.addCustomEqualityTester(voidSelectorEquality);
    });

    afterEach(function () {

    });

    it("flare node test", function () {
        var container = getContainer("flare")
        var chart = new GravityBubbles({
            id: "flare",
            container: container,
            sizeById: "size",
            colorById: "perc",
            groupById: "all",
            data: {
                tooltip: {
                    template: "<b>{name}</b><br>Size: {size}<br>{perc}%"
                }
            }
        });
        chart.data([{
                "name": "flare",
                "size": 20020,
                "perc": 60,
                "children": []
		},
            {
                "name": "flare",
                "size": 20200,
                "perc": 30,
                "children": []
		}, {
                "name": "flare2",
                "size": 22200,
                "perc": 10,
                "children": []
		}
		]);
        expect(chart).not.toBe(null);
        expect(chart.data).not.toBeNull();
        expect(chart.container).not.toBeNull();
    });

    it("check builded layers", function () {
        var container = getContainer("flare1")
        chart = new GravityBubbles({
            id: "flare1",
            sizeById: "size",
            colorById: "perc",
            groupById: "all",
            width: 300,
            height: 200,
            data: {
                tooltip: {
                    template: "<b>{name}</b><br>Size: {size}<br>{perc}%"
                }
            }
        });
        chart.data([{
                "name": "flare",
                "size": 2020200,
                "perc": 100,
                "children": []
		},
            {
                "name": "flare",
                "size": 20200,
                "perc": 10,
                "children": []
		}
		]);
        expect(chart.container).toBeDefined();

        var svg = chart.container.select("svg");
        expect(svg).toBeDefined();;

        var groups_layer = svg.selectAll("#groups_layer");
        expect(groups_layer).toBeDefined();
        expect(groups_layer).toEqual(1);
        //dump(groups_layer);

        //expect(groups_layer.selectAll("rect")).toEqual(1);

        var bubbles_layer = svg.selectAll("#bubbles_layer");
        expect(bubbles_layer).toBeDefined();
        //it doesn't have bubbles
        //expect(bubbles_layer.selectAll(".circles")).toEqual(0);

        var legend_layer = svg.selectAll("#legend_layer");
        expect(legend_layer).toBeDefined();
        //expect(legend_layer.selectAll(".legend-circle")).toEqual(0);

        var groups_title_layer = svg.selectAll("#groups_title_layer");
        expect(groups_title_layer).toBeDefined();
        //expect(groups_title_layer.selectAll(".group_text")).toEqual(0);
    });
});
