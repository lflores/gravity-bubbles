"use strict";
/**
This tests build components with minimun parameters and checks
that don't trows errors
*/
describe("GravityBubbles tests", function () {
    var chart;
    var voidSelectorEquality = function (selector, result) {
        return selector.length == result || selector[0].length === result ? true : false;
    }

    function getContainer(id) {
        var $child = $("<div id=\"" + id + "\"></div>");
        $child.css("height", 300);
        $child.css("width", 600);
        $child.css("border", "1px gray solid");
		$child.css("border-radius", "5px");
        $("body").append($child);
        return $child[0];
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(voidSelectorEquality);
    });

    afterEach(function () {});

    it("default values", function () {
        var container = getContainer("default");
        var chart = new GravityBubbles({
            container: container
        });
        expect(chart).not.toBe(null);
        expect(chart.data).not.toBeNull();
        expect(chart.container).not.toBeNull();
    });

    it("check builded layers", function () {
        var container = getContainer("default1");
        var chart = new GravityBubbles({
            container: container
        });
        expect(chart.container).toBeDefined();

        var svg = chart.container.select("svg");
        expect(svg).toBeDefined();

        var groups_layer = svg.selectAll("#groups_layer");
        expect(groups_layer).toBeDefined();

        var bubbles_layer = svg.selectAll("#bubbles_layer");
        expect(bubbles_layer).toBeDefined();
        //it doesn't have bubbles
        expect(bubbles_layer.selectAll(".circles")).toEqual(0);

        var legend_layer = svg.selectAll("#legend_layer");
        expect(legend_layer).toBeDefined();
        expect(legend_layer.selectAll(".legend-circle")).toEqual(0);

        var groups_title_layer = svg.selectAll("#groups_title_layer");
        expect(groups_title_layer).toBeDefined();
        expect(groups_title_layer.selectAll(".group_text")).toEqual(0);
    });

    it("check classes", function () {});
});
