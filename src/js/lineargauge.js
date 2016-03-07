/**
This widget is an implementation of linear gauge using d3 library
*/
var lineargauge = $.widget("custom.linearGauge", {
    options: {
        points: [0, 25, 50, 75, 100],
        colors: ["#ff0000", "#ffa300", "#ffe100", "#fffa00", "#1f6f02"],
        orient: "bottom",
        //width: 170,
        margin: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 10
        },
        height: 40,
        thresholds: true,
        minorTicks: false,
        ticks: 10,
        //propiedades "ocultas"
        _thresholdPadding: 4
    },

    _create: function () {
        var that = this;
        if (!this.options.width) {
            this.options.width = $(this.element).width();
        }

        if (!this.options.height) {
            this.options.height = $(this.element).height();
        }

        this.svg = d3.select($(this.element).get(0)).append("svg");
        //Tengo que mantener el orden
        this.background = this.svg
            .append("rect")
            .attr("class", "gauge-body");

        this._drawBackground();
        this.gradient = this.svg
            .append("rect")
            .attr("class", "gradient");

        this.linearGradient = this.svg
            .append("g")
            .append("linearGradient");

        this._drawGradient();
        this.axis = this.svg
            .append("g")
            .attr("class", "axis");

        this.subAxis = this.svg.append("g")
            .attr("class", "axis")
            .classed("minor", true);

        this.thresholdsGroup = this.svg.append("g").attr("class", "thresholds");
        this.thresholds = this.thresholdsGroup.selectAll(".threshold").data(this.options.points);

        var groups = this.thresholds
            .enter()
            .append("g")
            .attr("class", "threshold");
        groups.append("line");
        groups.append("path");
        groups.append("title");

        this.svg
            .attr("width", this.options.width)
            .attr("height", this.options.height);
        this.refresh();
    },

    _dispatchEvent: function () {
        this._trigger("change", null, {
            points: this.options.points,
            colors: this.options.colors
        });
    },

    refresh: function () {
        this._drawBackground();
        this._drawGradient();
        this._drawScale();
        this._drawThresholds();
    },

    _drawBackground: function () {
        this.background
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .classed("gauge-body", true);
    },

    _drawGradient: function () {
        var _this = this;
        this.gradient
            .attr("x", this.options.margin.left)
            .attr("y", this.options.margin.top)
            .attr("width", this.options.width - (this.options.margin.left + this.options.margin.right))
            .attr("height", this.options.height - (this.options.margin.top + this.options.margin.bottom + 2))
            .attr("fill", "url(#" + $(this.element).attr("id") + "-gradient)");

        this.linearGradient
            .attr("y1", this.options.margin.top)
            .attr("y2", this.options.height - (this.options.margin.top + this.options.margin.bottom + 2))
            .attr("x1", this.options.margin.left)
            .attr("x2", this.options.width - this.options.margin.left - this.options.margin.right)
            .attr("id", $(this.element).attr("id") + "-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("stroke", "#fcfcfc");

        var _thresholds = d3.scale.linear()
            .domain([d3.min(this.options.points), d3.max(this.options.points)])
            .range([0, 1]);

        var gradient = this.linearGradient
            .selectAll("stop").data(this.options.points);

        gradient
            .enter()
            .append("stop")
            .attr("offset", function (d) {
                return _thresholds(d);
            })
            .attr("stop-color", function (d, i) {
                return _this.options.colors[i];
            });

        gradient
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("offset", function (d) {
                return _thresholds(d);
            })
            .attr("stop-color", function (d, i) {
                return _this.options.colors[i];
            });
    },


    /**
    Method to draw thredsholds, including style of arrow by limits, line over scale, tooltip, etc.
    */
    _drawThresholds: function () {
        if (!this.options.thresholds) {
            return;
        }
        var _thresholds = this.thresholdsGroup.selectAll(".threshold").data(this.options.points);

        var groups = _thresholds
            .enter()
            .append("g")
            .attr("class", "threshold");
        groups.append("line");
        groups.append("path");
        groups.append("title");


        var pointsScale = d3.scale.linear()
            .domain([d3.min(this.options.points), d3.max(this.options.points)])
            .range([0, this.options.width - (this.options.margin.left + this.options.margin.right) - 1]);

        var lineHeight = this.options.height - this.options.margin.top;
        var that = this;


        _thresholds
            .classed("draggable", function (d) {
                if (d === d3.min(that.options.points) || d === d3.max(that.options.points)) {
                    return false;
                }
                return true;
            })
            .transition()
            .duration(1000)
            .ease("elastic")
            .attr("transform", function (d) {
                return "translate(" + (pointsScale(d) + 1) + ",2)";
            });


        var _formatter = d3.format(",.2f");
        var _draggedNode = null;

        /**
           Metodos para arrastrar el grupo de flecha y linea
           */
        var drag = d3.behavior.drag()
            //.origin(function (d) { return d; })
            .on("dragstart", function (d) {
                d3.select(this).attr('pointer-events', 'none');
            })
            .on("drag", function (d, i) {
                _draggedNode = d3.event.x;
                //var _coords = d3.mouse(that.svg);
                d3.select(this).attr("transform", "translate(" + d3.event.x + ",3)");
                var _current = d3.event.x;
                //var _current = d3.event.x - that.options.margin.left + that.options._thresholdPadding;
                d3.select(this)
                    .selectAll("title")
                    .classed("tooltip", true)
                    .text(_formatter(pointsScale.invert((_current))));
                //En teoría los arrastrables no pueden ser el ultimo ni el primero
                //por lo que no habría problemas con los límites
                var _nextNode = pointsScale(that.options.points[i + 2]);
                //var _currNode = pointsScale(that.options.points[i]);
                var _prevNode = pointsScale(that.options.points[i]);

                _draggedNode = _current;
                if (_current > _nextNode) {
                    d3.event.sourceEvent.stopPropagation();
                    _current = _nextNode - 5;
                    d3.select(this)
                        .transition().ease("bouncing")
                        .attr("transform", "translate(" + _current + ",3)");
                    d3.select(this)
                        .selectAll("title")
                        .classed("tooltip", true)
                        .text(_formatter(pointsScale.invert((_current))));
                    _draggedNode = _current;
                    this.dispatchEvent(new Event('mouseup'));
                    return;
                }

                if (_current < _prevNode) {
                    d3.event.sourceEvent.stopPropagation();
                    _current = _prevNode + 5;
                    d3.select(this)
                        .transition().ease("bouncing")
                        .attr("transform", "translate(" + _current + ",3)");
                    d3.select(this)
                        .selectAll("title")
                        .classed("tooltip", true)
                        .text(_formatter(pointsScale.invert((_current))));
                    _draggedNode = _current;
                    this.dispatchEvent(new Event('mouseup'));
                }
            })
            .on("dragend", function (d, i) {
                var _perc = pointsScale.invert(_draggedNode);
                that.options.points[i + 1] = _perc;
                that.points(that.options.points);
                that._dispatchEvent();
                d3.select(this).classed("dragging", false);
                _dragCanceled = null;
                d3.select(this).attr('pointer-events', '');
            });


        this.thresholdsGroup.selectAll(".draggable").call(drag);

        //Update
        _thresholds.select("path")
            .attr("d", function (d) {
                if (d === d3.max(that.options.points)) {
                    return "M 0 0 L 4 0 L 4 9 L 0 0";
                } else if (d === d3.min(that.options.points)) {
                    return "M 4 0 L 9 0 L 4 9 L 4 0";
                }
                //return "M 0 0 L 9 0 L 4 9 L 0 0";
                return "M 0 0 L 5 0 L 3 9 L 0 0";
            })
            .attr("x", 0)
            .attr("y", 0);

        _thresholds.select("line")
            .attr("x1", 3)
            .attr("x2", 3)
            .attr("y1", 3)
            .attr("y2", lineHeight - 4);

        _thresholds.select("title")
            .text(function (d) {
                return _formatter(d);
            });

        _thresholds.exit().remove();
    },


    _drawScale: function () {
        var _data = d3.range(20);
        var that = this;
        var widthScale = d3.scale.linear()
            .domain([d3.min(this.options.points), d3.max(this.options.points)])
            .range([0, this.options.width - (this.options.margin.left + this.options.margin.right) - 1]);

        this.axis
            .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")")
            .call(d3.svg.axis()
                .scale(widthScale)
                .orient(this.options.orient)
                .ticks(this.options.ticks)
                .tickSize(that.options.height - (that.options.margin.top + that.options.margin.bottom + 2))
            );

        if (this.options.minorTicks) {
            this.subAxis
                .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")")
                .call(
                    d3.svg.axis()
                    .scale(widthScale)
                    .orient(this.options.orient)
                    .ticks(this.options.ticks * 10)
                    .tickSize((that.options.height - that.options.margin.top - that.options.margin.bottom) / 2)
                );
        }
    },

    _pointsAsValue: function (points) {
        var _points = [];
        $.each(points, function (i, point) {
            _points.push(Number(point));
        });
        return _points;
    },

    resize: function () {
        this.options.width = $(this.element).width();
        this.options.height = $(this.element).height();
        this.refresh();
    },

    /**
    Funciona como setter y getter
    */
    points: function (points) {
        if (points === undefined) {
            return this.options.points;
        }
        this.options.points = this._pointsAsValue(points);
        this.refresh();
    },

    colors: function (colors) {
        if (colors === undefined) {
            return this.options.colors;
        }
        this.options.colors = colors;
        this.refresh();
    },

    minorTicks: function (minorTicks) {
        if (minorTicks === undefined) {
            return this.options.minorTicks;
        }
        this.options.minorTicks = minorTicks;
        this.refresh();
    },

    width: function (width) {
        if (width === undefined) {
            return this.options.width;
        }
        this.options.width = width;
        this.refresh();
    },
});
