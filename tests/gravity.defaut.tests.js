"use strict";
/**
This tests build components with minimun parameters and checks
that don't trows errors
*/
describe("GravityBubbles default tests", function () {
    var chart;
    var voidSelectorEquality = function (selector, result) {
        return selector.length == result || selector[0].length === result ? true : false;
    }


    beforeEach(function () {
        jasmine.addCustomEqualityTester(voidSelectorEquality);
    });

    afterEach(function () {});

    it("default values", function () {
        var container = $("body").container();
        var chart = new GravityBubbles({
            container: container
        });
        expect(chart).not.toBe(null);
        expect(chart.data).not.toBeNull();
        expect(chart.container).not.toBeNull();
    });

    it("check builded layers", function () {
        var container = $("body").container();
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


});
