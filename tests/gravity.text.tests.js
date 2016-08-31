"use strict";

describe('text split', function () {
    it('should be loaded', function () {
        var cont = $("body").container();
        var chart = new GravityBubbles({
            container: cont,
            data: {
                tooltip: {
                    //43334556667 - FIGNONI, BRUNO\ nSize: 345654636\ nPerc: 45 %
                    template: "<b>{id}</b> - {name} - Size: {size} - Perc: {perc}%"
                },
                label: {
                    template: "{id} - {name} - Size: {size} - Perc: {perc}%",
                    autofit: true
                }
            }
        });

        chart.data([{
                "id": "345234523525",
                "name": "FIGNONI, BRUNO",
                "size": 20200,
                "perc": 60,
                "children": []
		}, {
                "id": "43334556665547",
                "name": "LOUREIRO ANDREA",
                "size": 20200,
                "perc": 30,
                "children": []
		}, {
                "id": "45425235254523",
                "name": "SCHIAVONE JULIAN ERNESTO",
                "size": 20200,
                "perc": 10,
                "children": []
		}
		]);

    });
});
