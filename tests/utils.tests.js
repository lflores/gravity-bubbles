var deepExtend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        if (!obj) {
            continue;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    out[key] = deepExtend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }
    return out;
};


function getContainer(id) {
    var $child = $("<div id=\"" + id + "\"></div>");
    $child.css("height", 300);
    $child.css("width", 600);
    $child.css("border", "1px gray solid");
    $child.css("border-radius", "5px");
    $("body").append($child);
    return $child[0];
}


describe('objects tests', function () {
    it('should be loaded', function () {
        var _defaults = {
            sticky: false,
            height: 600,
            width: 350,
            minRadius: 5,
            maxRadius: 20,
            data: {
                "label": {
                    autofit: false
                }
            }
        };
        var _config = {
            minRadius: 10,
            height: 600,
            width: 800,
            data: {
                "tooltip": {
                    template: "lalala"
                },
                "label": {
                    autofit: true
                }
            }
        };
        var container = getContainer("lala")
        var bubbles = new GravityBubbles({
            id: "lala"
        });
        //var config = deepExtend(_defaults, _config);
        //var config = bubbles.extend(_defaults, _config);
        var config = _defaults.extends(_config);
        expect(config.sticky).toBe(false);
        expect(config.minRadius).toBe(10);
        expect(config.width).toBe(800);
        expect(config.height).toBe(600);
        expect(config.data.label.autofit).toBe(true);
        expect(config.data.tooltip.template).toBe("lalala");



    });

    it("text split test", function () {
        //43334556667
        //FIGNONI, BRUNO
        //Size: 345654636
        //Perc: 45%
        var _splited = "43334556667 - FIGNONI, BRUNO\nSize: 345654636\nPerc: 45%".splitMultiple();
        expect(_splited.length).toBe(4);

        var _other = "43334556667 - FIGNONI, BRUNO - Size: 3 - Perc: 45%".splitMultiple();
        expect(_other.length).toBe(4);

        var _other = "43334556667 - FIGNONI, BRUNO\nSize: 3 - Perc: 45%".splitMultiple();
        expect(_other.length).toBe(4);

        var _other = "43334556667 - FIGNONI, BRUNO\nSize: 3\nPerc: 45%".splitMultiple();
        expect(_other.length).toBe(4);
    });
});
