/**
This component based on d3js API draw a chart with floating bubbles, with gravity
<ul>
    <li>config is an object with properties to config chart
    <ul>
        <li>id: Id of DOM object that will filled</li>
        <li>points: Array with thresholds of colors, Ej: [0, 3, 7, 20, 50, 100]</li>
        <li>colors: Array with thresholds of colors, Ej: ["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C", "#08519C"]</li>
        <li>width: External width of chart</li>
        <li>height: External height of chart</li>
        <li>colorById: Id of property that will be used to render color. It must be in range of points</li> 
        <li>sizeById: Id of property that will be used to render size of bubbles</li>
        <li>groupById: Id of property that will be used to group bubbles."all" will draw a unique group with center in center of chart, "color" will group by range of colors, and another id must to be a property that can group data, such as, name, region, country, etc</li>
    </ul>
    </li>
</ul>
@author Triad(flores.leonardo@gmail.com)
*/
GravityBubbles = function (config) {
    this.margin = {
        top: 3,
        right: 3,
        bottom: 3,
        left: 3
    };
    this.firstTime = false;
    var _defaults = {
        sticky: false,
        damper: 0.102,
        gravity: -0.01,
        _height: 600,
        _width: 350,
        transition: "medium",
        minRadius: 5,
        maxRadius: 20,
        zeroBased: false,
        debug: false,
        //cuando calcula los grupos es la cantidad maxima de columnas
        lanes: 4,
        points: [0, 3, 7, 20, 50, 100],
        colors: ["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C", "#08519C"],
        id: "gravity-bubbles",
        colorById: "perc",
        sizeById: "size",
        showChild: false,
        groupById: "all",
        data: {
            tooltip: {
                template: "<b>{name}</b>",
                formatter: d3.format(",.2f")
            },
            label: {
                template: "",
                show: true
            },
            group: {
                label: function (d, _this) {
                    if (_this._config.groupById == 'all') {
                        return "";
                    } else if (_this._config.groupById === "color") {
                        if (d.key === 'more') {
                            return "> " + _this._config.points[_this._config.points.length - 1];
                        }
                        return "<= " + d.key;
                    }
                    return d.key;
                }
            },
            onclick: function (d, i) {
                //Nothing to do
                //alert("click en " + d);
            }

        },
        legend: {
            format: function (value) {
                return d3.format(",.2f")(value);
            }
        }
    };
    this._config = $.extend(true, _defaults, config);
    this.tooltip = CustomTooltip("bubble_tooltip", 240);
    this.create();
};

GravityBubbles.prototype.create = function () {
    var that = this;
    if (this._config.container) {
        this.container = d3.select(this._config.container);
    } else {
        this.container = d3.select("#" + this._config.id);
    }
    this.container.style("overflow", "hidden");
    this._config.width = typeof this._config.width === 'undefined' ? this.container[0][0].clientWidth : this._config.width;
    this._config.height = typeof this._config.height === 'undefined' ? this.container[0][0].clientHeight : this._config.height;

    this.svg = this.container.append("svg")
        .attr("class", "gravity-container")
        .style("margin-top", this.margin.top)
        .style("margin-left", this.margin.left)
        .style("width", this._config.width - this.margin.left - this.margin.right)
        .style("height", this._config.height - this.margin.top - this.margin.bottom);

    //En SVG es importante el orden de los objetos
    //El que se creo primero, sera tapado 
    this.svg.append("g").attr("id", "legend_layer");
    this.svg.append("g").attr("id", "groups_layer");
    this.svg.append("g").attr("id", "bubbles_layer");
    this.svg.append("g").attr("id", "groups_title_layer");

    this.center = {
        x: this._config.width / 2,
        y: this._config.height / 2
    };

    //this.layout_gravity = -0.01;

    //this.damper = 0.102;
    this.nodes = [];
    this.force = null;
    this.circles = null;
    this._data = [];
    this._config.groups = [];

    this.legend_scale = [];

    this.fill_color = d3.scale.linear()
        .domain(this._config.points)
        .range(this._config.colors);

    //this.radius_scale = d3.scale.linear().range([this._config.minRadius, this._config.maxRadius]);
    this.radius_scale = d3.scale.pow()
        .exponent(0.5)
        .range([this._config.minRadius, this._config.maxRadius]);
};

GravityBubbles.prototype.config = function (config) {
    this._config = $.extend(true, this._config, config);
    this._update_colors();
    this.svg
        .style("margin-left", this.margin.left)
        .style("margin-top", this.margin.top)
        .style("width", this._config.width - this.margin.left - this.margin.right)
        .style("height", this._config.height - this.margin.top - this.margin.bottom);

    if (this.force) {
        this.force.size([this._config.width, this._config.height]);
    }

    this._update_radius();
    if (!this._data || this._data.length === 0) {
        this.legend_scale = [];
    } else {
        this.legend_scale = [
                this.min_amount,
                this.min_amount + (this.max_amount - this.min_amount) / 2,
                this.max_amount];
    }

    this.center = {
        x: this._config.width / 2,
        y: this._config.height / 2
    };
    this.refresh();
};

/**
This metod is used to "follow" cursor when mouse move over bubbles
*/
GravityBubbles.prototype.update_details = function (data, i, event) {
    return this.tooltip.updatePosition(event);
};

/**
Show details of bubble
*/
GravityBubbles.prototype.show_details = function (data, i, element) {
    var content = "";
    if (typeof element._config.data.tooltip === "string") {
        content = element._data_replace(data, element._config.data.tooltip);
    } else if (typeof element._config.data.tooltip === "function") {
        content = element._config.data.tooltip.call(element, data);
        //El String que devuelve los uso para reemplazar en caso que el resultado tenga wildcards
        content = element._data_replace(data, content);
    } else if (typeof element._config.data.tooltip === "object" && typeof element._config.data.tooltip.template === "string") {
        //El String que devuelve los uso para reemplazar en caso que el resultado tenga wildcards
        content = element._data_replace(data, element._config.data.tooltip.template,
            element._config.data.tooltip.formatter);
    } else if (typeof element._config.data.tooltip === "object" && typeof element._config.data.tooltip.template === "function") {
        content = element._data_replace(data, element._config.data.tooltip.template.call(data, i, element),
            element._config.data.tooltip.formatter);
    }
    return this.tooltip.showTooltip(content, d3.event);
};

GravityBubbles.prototype.hide_details = function (data, i, element) {
    return this.tooltip.hideTooltip();
};

/**
This method receive a object data and a template.
Data are each data to be rendered.
This methods recognize wildcards such as {description}, so try to replace
this wildcard with d.description value. If property is not found, will be replaced by "" (void string)
@method _data_replace
*/
GravityBubbles.prototype._data_replace = function (d, template, formatter) {
    var self = this;
    if (!template) {
        template = this._config.template;
    } else {
        template = template.slice(0);
    }
    if (typeof formatter === 'undefined') {
        formatter = d3.format(",.2f");
    }
    var matched = template.match(/{([\w\.\_\/]+)}/g);
    if (matched) {
        $.each(matched, function (i, match) {
            var property = /{([\w\.\_\/]+)}/g.exec(match);
            var _value = "";
            //Toda propiedad que no sea id, description, verifica si es un numero.
            //Si lo es, lo formatea sino lo reemplaza por el valor
            if (d.hasOwnProperty(property[1]) && property[1] != "id" && property[1] != "name" && property[1] != "description") {
                _value = isNaN(Number(d[property[1]])) ? d[property[1]] : formatter(d[property[1]], property[1]);
                //Si existe la propiedad, se fija si el valor es un numero
                //para el caso en que los codigos tengan ceros a la izq como el SKU
            } else if (d.hasOwnProperty(property[1])) {
                _value = isNaN(Number(d[property[1]])) ? d[property[1]] : "" + Number(d[property[1]]);
            }
            template = template.replace(match, _value);
        });
    }
    return template;
};

GravityBubbles.prototype.colors = function (colors) {
    this._config.colors = colors;
    this._update_colors();
    this.refresh();
};

GravityBubbles.prototype.points = function (points) {
    this._config.points = points;
    this._update_colors();
    this._calculate_groups();
    this.refresh();
};

GravityBubbles.prototype.colorById = function (byId) {
    this._config.colorById = byId;
    this._update_colors();
    this._calculate_groups();
    this.refresh();
};

/**
Cambia la propiedad que define el tamano
*/
GravityBubbles.prototype.sizeById = function (byId) {
    var that = this;
    this._config.sizeById = byId;

    //Tengo que inicializar todos los valores que dependen de los datos
    this.min_amount = d3.min(this._data, function (d) {
        return Number(d[that._config.sizeById]);
    });
    if ((this._config.zeroBased === true) && (this.min_amount > 0)) {
        this.min_amount = 0;
    }
    this.max_amount = d3.max(this._data, function (d) {
        return Number(d[that._config.sizeById]);
    });
    this.nodes = this.nodes.sort(function (a, b) {
        return b[that._config.sizeById] - a[that._config.sizeById];
    });
    this._update_radius();

    this.legend_scale = [
                this.min_amount,
                this.min_amount + (this.max_amount - this.min_amount) / 2,
                this.max_amount];

    this.config({
        sizeById: byId
    });
    this.refresh();
};

GravityBubbles.prototype.groupById = function (byId) {
    this._config.groupById = byId && byId.length !== 0 ? byId : "all";
    var _this = this;
    this._calculate_groups();
    this.refresh();
};

/**
Method encargado de calcular los grupos segun los thredholds de color
*/
GravityBubbles.prototype._calculate_color_group = function (d) {
    var _this = this;
    var _groups = [];
    _this._config.points.forEach(function (d, i) {
        var _name = "" + d;
        _groups.push(_name);
    });
    this.group_scale = d3.scale.threshold()
        .domain(_this._config.points)
        .range(_groups);
    var value = isNaN(Number(d[_this._config.colorById])) ? 0 : Number(d[_this._config.colorById]);
    var group = this.group_scale(value);
    return typeof group === 'undefined' ? "more" : group;
};

/**
  Metodo encargado de calcular cuantos grupos hay y calcular los centros de cada uno
*/
GravityBubbles.prototype._calculate_groups = function () {
    var _this = this;
    //En caso que muestre todos juntos, armo un grupo all
    if (_this._config.groupById === 'all') {
        this._config.groups = [
            {
                key: "all",
                values: this._data,
                x: this.center.x,
                y: this.center.y
                        }
                ];
        //En caso que se agrupe por color
    } else if (this._data && _this._config.groupById === 'color') {
        this._color_ranges = d3.scale.threshold()
            .domain(this._config.points)
            .range(d3.range(this._config.points.length + 1));

        this._config.groups = d3.nest()
            .key(function (d) {
                return _this._color_ranges(d[_this._config.colorById]);
            })
            .entries(this._data);

    } else if (this._data && this._data.length > 0 && this._data[0].hasOwnProperty(this._config.groupById)) {
        this._config.groups = d3.nest()
            .key(function (d) {
                return d[_this._config.groupById];
            })
            .sortKeys(d3.ascending)
            .entries(this._data);
    }

    this._config.groups = this._config.groups.sort(function (a, b) {
        return b.radius - a.radius;
    });
    //Si agrupo por color, hago barras verticales 
    //entonces lanes es igual a la cantidad de thredsholds
    var lanes = this._config.groupById === 'color' ? this._config.groups.length : this._config.lanes;

    var numCols = this._config.groups.length > lanes ? lanes : this._config.groups.length;

    var width = this._config.width * 0.9 / numCols;
    var height = this._config.height / Math.ceil(this._config.groups.length / numCols) - 2;



    if (this._config.groups) {
        this._config.groups.forEach((function (_this) {
            return function (d, index) {
                var _row = Math.floor(index / numCols);
                d.x = width * (index % numCols);
                d.y = _row * height;
                d.dx = width;
                d.dy = height;

                d.cx = d.x + d.dx / 2;
                d.cy = d.y + d.dy / 2;
            };
        })(this));
    }
};

/**
Calcula el diametro que ocupara el conjunto de burbujas
*/
GravityBubbles.prototype._calculate_boundary = function (children) {
    var surface = 0;
    children.forEach((function (_this) {
        return function (d) {
            var _radius = _this._radius_by(d);
            var _surface = Math.PI * Math.pow(_radius, 2);
            surface += _surface;
        };
    })(this));
    return Math.sqrt(surface / Math.PI);
};

/**
Receive data and start needed calculus
*/
GravityBubbles.prototype.data = function (data) {
    this._data = data;
    var that = this;
    if (!this._data || this._data.length === 0) {
        this._data = [];
        this.nodes = [];
        this.legend_scale = [];
        this.refresh();
        return;
    }

    this.svg.selectAll(".selected")
        .classed("selected", false);

    //Tengo que inicializar todos los valores que dependen de los datos
    this.min_amount = d3.min(this._data, function (d) {
        return Number(d[that._config.sizeById]);
    });
    this.max_amount = d3.max(this._data, function (d) {
        return Number(d[that._config.sizeById]);
    });


    this.legend_scale = [
                this.min_amount,
                this.min_amount + (this.max_amount - this.min_amount) / 2,
                this.max_amount
            ];

    this.create_nodes();

    this._calculate_groups();
    //Despues de calcular los grupos

    if (this.min_amount == this.max_amount) {
        this.min_amount -= 1;
        this.max_amount += 1;
    }

    if ((this._config.zeroBased === true) && (this.min_amount > 0)) {
        this.min_amount = 0;
    }

    this.radius_scale
        .domain([this.min_amount, this.max_amount])
        .range([this._config.minRadius, this._config.maxRadius]);

    this.force = d3.layout.force()
        .nodes(this.nodes)
        .size([this._config.width / 2, this._config.height / 2]);

    this.force
        //.chargeDistance(280)
        .gravity((function (_this) {
            return function (d) {
                return _this._config.gravity;
            };
        })(this))
        .charge((function (_this) {
            return function (d, i) {
                var _group = d[_this._config.groupById] ? d[_this._config.groupById] : "all";
                //Testeado con otros valores, pero tiene que mantener el radio para que detecte
                //la colision entre las burbujas
                var _radius = _this._radius_by(d);
                return -Math.pow(_radius, 2.0) / 8;
            };
        })(this))
        .friction(0.9)
        //.alpha(0.1)
        .on("tick", (function (_this) {
            return function (e) {
                if (_this.labels) {
                    _this.labels.each(function () {
                        d3.select(this).call(_this._label_position, _this);
                    });
                }
                return _this.circles.each(_this.move_towards_center(e.alpha))
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
            };
        })(this))
        .on("end", (function (_this) {
            return function (d) {
                if (_this._config.data.label) {
                    _this.labels.call(_this._label_position, _this);
                }
            };
        })(this));
    this.refresh();
};

GravityBubbles.prototype.move_towards_center = function (alpha) {
    return (function (_this) {
        return function (d) {
            var target = _this._get_target(d, _this);
            if (target) {
                //d.x = d.x + (target.cx - d.x) * (_this.damper + 0.02) * alpha * 1.1;
                d.x = d.x + (target.cx - d.x) * _this._config.damper * alpha * 1.1;
                //d.y = d.y + (target.cy - d.y) * (_this.damper + 0.02) * alpha * 1.1;
                d.y = d.y + (target.cy - d.y) * _this._config.damper * alpha * 1.1;
                return d.y;
            }
            return 0;
        };
    })(this);
};

/**
Devuelve el grupo al que corresponde el objeto
*/
GravityBubbles.prototype._get_group = function (groupId) {
    var group = {};
    this._config.groups.forEach(function (d) {
        //Creo dos strings con los ids para comparar con el mismo formato
        //solo tomo el valor como etiquetas
        var _key = "" + d.key;
        var _id = "" + groupId;
        if (_key === _id) {
            group = d;
        }
    });
    return group;
};

/**
Se encarga de crear los nodos junto a la metadata necesaria para mostrar los circulos
*/
GravityBubbles.prototype.create_nodes = function () {
    var that = this;
    this.nodes = [];
    this._data.forEach((function (_this) {
        return function (d) {
            return _this.nodes.push(d);
        };
    })(this));
    return this.nodes.sort(function (a, b) {
        return b[that._config.sizeById] - a[that._config.sizeById];
    });
};

/**
Restore node position between diferent data instances
*/
GravityBubbles.prototype._keep_position = function (circles, _this) {
    circles.each(function (d) {
        if (typeof d.x === 'undefined') {
            d.x = Number(d3.select(this).attr("cx"));
            d.y = Number(d3.select(this).attr("cy"));
        }
    });
};

/**
This method draw a frame for each group
*/
GravityBubbles.prototype._draw_groups = function () {
    var groups_layer = this.svg.selectAll("#groups_layer");
    var groups = groups_layer.selectAll(".group").data(this._config.groups);

    groups
        .enter()
        .append("rect")
        .attr("class", "group")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", function (d) {
            return d.dx > 0 ? d.dx : 1;
        })
        .attr("height", function (d) {
            return d.dy > 0 ? d.dy : 1;
        });

    groups
        .classed("multiple", function (d) {
            if (d.key == "all") {
                return false;
            }
            return true;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", function (d) {
            return d.dx > 0 ? d.dx : 1;
        })
        .attr("height", function (d) {
            return d.dy > 0 ? d.dy : 1;
        });

    groups.exit().remove();

    var group_layer_texts = this.svg.selectAll("#groups_title_layer");
    var group_texts = group_layer_texts.selectAll(".group-text").data(this._config.groups);

    group_texts
        .enter()
        .append("text")
        .attr("class", "group-text")
        .call(this._draw_group_text, this)
        .call(this._draw_group_position, this);

    group_texts
        .call(this._draw_group_text, this)
        .call(this._draw_group_position, this);
    group_texts.exit().remove();
};

/**
Metodo encargado de dibujar el texto que dependiendo de criterio de 
agrupamiento, cambia
*/
GravityBubbles.prototype._draw_group_text = function (text, _this) {
    text.text("");
    if (_this._config.groupById === 'all') {
        return;
    }
    //Si son colores o groupBy tienen la misma logica
    text.each(function (d) {
        var tspans = [];
        if (_this._config.groupById === 'color') {
            var _range = _this._color_ranges.invertExtent(parseInt(d.key));
            var _ret = ["<"];
            if (_range[0]) {
                _ret.splice(0, 0, Math.round(_range[0]).toString());
            }
            if (_range[1]) {
                _ret.push(Math.round(_range[1]));
            }
            _tspans = [_ret.join(" ")];
        } else if (
            _this._config.data.group && _this._config.data.group.label && typeof _this._config.data.group.label === 'function') {
            var _text = _this._config.data.group.label.call(_this, d, _this);
            _tspans = _text.splitMultiple().reverse();
        }
        var line = _tspans.pop();
        var lineNumber = 0;
        do {
            var tspan = d3.select(this).append("tspan");
            tspan
                .attr("dy", ".8em")
                .text(line);
            lineNumber++;
            line = _tspans.pop();
        } while (line);
        //Cuando tiene varias lineas, las alinea centradas
        var _width = this.getBBox().width;
        var nodes = Array.prototype.slice.call(this.childNodes, 0);
        nodes
            .forEach(function (node) {
                var _span_width = node.getComputedTextLength();
                d3.select(node).attr("x", d.cx - (_span_width / 2));
            });
    });
};

GravityBubbles.prototype._draw_group_position = function (text, _this) {
    text.each(function (d) {
        //copio el margen superior y un poco de "aire"
        //d3.select(this).attr("y", _this.margin.top + 2);
        d3.select(this).attr("y", d.y + 2);
        //Alineo cada tspan segun el centro
        var nodes = Array.prototype.slice.call(this.childNodes, 0);
        nodes
            .forEach(function (node) {
                var _span_width = node.getComputedTextLength();
                d3.select(node).attr("x", d.cx - (_span_width / 2));
            });
    });
};

GravityBubbles.prototype._label_text = function (d, _this) {
    //Obtain label using an string template
    if (_this._config.data && _this._config.data.label && _this._config.data.label.template && typeof _this._config.data.label.template === 'string') {
        return _this._data_replace(d, _this._config.data.label.template, _this._config.data.label.formatter);
        //Template also can be a function, then firts gets 
    } else if (_this._config.data && _this._config.data.label && _this._config.data.label.template && typeof _this._config.data.label.template === 'function') {
        var _template = _this._config.data.label.template.call(_this, [d]);
        return _this._data_replace(d, _template, _this._config.data.label.formatter);
    }
    return null;
};

GravityBubbles.prototype._draw_text = function (text, that) {
    text
        .text(null);

    text.each(function (d) {
        var _text = that._label_text(d, that);
        if (!_text) {
            return;
        }
        var text = d3.select(this),
            //lines = _text.split(/\n+/).reverse(),
            lines = _text.splitMultiple().reverse(),
            line = lines.pop(),
            lineNumber = 0,
            lineHeight = 0.7, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = d.dy - 4,
            data = text.data(0);

        do {
            /*jshint -W083 */
            tspan = text
                .append("tspan")
                .attr("x", 0)
                .attr("y", y)
                .attr("dy", "1em")
                .classed("head", function (d) {
                    return lineNumber === 0;
                })
                .text(line);
            lineNumber++;
            line = lines.pop();
        } while (line);
        //Cuando tiene varias lineas, las alinea centradas
        var _width = this.getBBox().width;
        var nodes = Array.prototype.slice.call(this.childNodes, 0);
        nodes
            .forEach(function (node) {
                var _span_width = node.getComputedTextLength();
                var x = _width - _span_width;
                d3.select(node).attr("x", x > 0 ? x / 2 : 0);
            });

    }).call(that._label_position, that);
};

GravityBubbles.prototype._label_position = function (text, that) {
    text
    //.transition()
    //.duration(that._get_transition())
        .attr("transform", function (_this) {
            return function (d) {
                var box = this.getBBox();
                if (!d.x || !d.y) {
                    return "translate(0,0)";
                }
                var cx = d3.select(this.parentNode).selectAll("circle").attr("cx");
                var cy = d3.select(this.parentNode).selectAll("circle").attr("cy");
                //Si la etiqueta es autofit calculo la escala para mostrarla 
                //y calculo el alto y ancho para moverlo
                if (_this._config.data.label && _this._config.data.label.hasOwnProperty("autofit") && _this._config.data.label.autofit) {
                    var _radius = _this._radius_by(d);
                    var _hyp = Math.sqrt(Math.pow(box.width, 2) + Math.pow(box.height, 2));
                    var _perc = Number(_radius / (_hyp / 2));
                    var _diff = Number((_hyp / 2) / _radius);
                    var tx = _hyp === 0 ? cx : cx - (box.width / 2 * _perc);
                    var ty = _hyp === 0 ? cy : cy - (box.height / 2 * _perc);
                    _perc = _hyp === 0 ? 1 : _perc;
                    var _trans = "translate({0},{1}),scale({2},{2})";
                    return _trans.replaceParams([tx, ty, _perc]);
                    //return "translate(" + tx + "," + ty + "),scale(" + _perc + "," + _perc + ")";
                }
                return "translate(" + (cx - box.width / 2) + "," + (cy - box.height / 2) + ")";
            };
        }(that))
        .attr("visibility", function (_this) {
            return function (d) {
                var box = this.getBBox();
                var _radius = _this._radius_by(d);
                if (box.width > 0 && box.height > 0 && box.width <= (_radius * 1.8) && (typeof _this._config.data.label.show == 'undefined' || _this._config.data.label.show)) {
                    return "visible";
                }
                if (_this._config.data.label && _this._config.data.label.hasOwnProperty("autofit") && _this._config.data.label.autofit) {
                    return "visible";
                }
                return "hidden";
            };
        }(that));
};


/**
Actualiza el rango de valores del radio de las burbujas
*/
GravityBubbles.prototype._update_radius = function () {
    //Si agrupo por color, hago barras verticales 
    //entonces lanes es igual a la cantidad de thredsholds
    var lanes = this._config.groupById === 'color' ? this._config.groups.length : this._config.lanes;

    var numCols = this._config.groups.length > lanes ? lanes : this._config.groups.length;

    var width = this._config.width * 0.9 / numCols;
    if (this._config.groupById === "all") {
        var _radio = this._data.length > 0 ? this._calculate_boundary(this._data) : 0.1;
        var _max = _radio > 0 ? (this._config.height / 2) * this._config.maxRadius / _radio : 0.1;
        this._config.maxRadius = _max * 0.9;
    } else {
        this._config.maxRadius = width * 0.1;
    }
    this._config.maxRadius = this._config.maxRadius < this._config.minRadius ? this._config.minRadius + 1 : this._config.maxRadius;

    if ((this._config.zeroBased === true) && (this.min_amount > 0)) {
        this.min_amount = 0;
    }
    this.radius_scale.range([this._config.minRadius, this._config.maxRadius]);
    this.radius_scale
        .domain([this.min_amount, this.max_amount])
        .range([this._config.minRadius, this._config.maxRadius]);
};

/**
Toma todas las actualizaciones y las refleja en el grafico
*/
GravityBubbles.prototype.refresh = function () {
    //Acciones de refresh
    var _that = this;
    //    if (this._config.groupById === "all") {
    //        var _radio = this._data.length > 0 ? this._calculate_boundary(this._data) : 0.1;
    //        var _max = _radio > 0 ? (this._config.height / 2) * this._config.maxRadius / _radio : 0.1;
    //        this._config.maxRadius = _max * 0.8;
    //    } else {
    //        //this._config.maxRadius = 25;
    //    }
    this._config.width = typeof this._config.width === 'undefined' ? this.container[0][0].clientWidth : this._config.width;
    this._config.height = typeof this._config.height === 'undefined' ? this.container[0][0].clientHeight : this._config.height;

    this._draw_groups();
    this._update_radius();
    this._draw_circles();
    this._draw_centers();
    this._draw_legends();
    if (this.force) {
        this.force.start();
    }
};

GravityBubbles.prototype._draw_centers = function () {
    if (!this._config.debug) {
        return;
    }
    var centers = this.svg.selectAll(".centers").data(this._config.groups);
    centers.enter().append("circle")
        .attr("class", "centers")
        .attr("r", function (d) {
            return 5;
        })
        .attr("fill", "#000")
        .attr("cx", function (d) {
            return d.cx;
        })
        .attr("cy", function (d) {
            return d.cy;
        });

    centers
        .attr("cx", function (d) {
            return d.cx;
        })
        .attr("cy", function (d) {
            return d.cy;
        });

    centers.exit().remove();
};

GravityBubbles.prototype._center = function () {
    this.center.x = (this._config.width * 0.75) / 2;
    this.center.y = this._config.height / 2;
};

/**
Dibuja el panel de leyenda
*/
GravityBubbles.prototype._draw_legends = function () {
    var legend_layer = this.svg.selectAll("#legend_layer");
    this.legends = legend_layer.selectAll(".legend-circle").data(this.legend_scale);

    this.legends.enter()
        .append("circle")
        .attr("class", "legend-circle")
        .attr("r", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                return _this.radius_scale(d);
            };
        })(this))
        .attr("cx", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                //Tomo el ancho del mas grande
                //pongo el doble del margen porque agregue el margen al costado del canvas
                return _this._config.width - _this.radius_scale(_this.legend_scale[2]) - _this.margin.right - _this.margin.left;
            };
        })(this))
        .attr("cy", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                //Tomo el alto y le resto el radio para obtener el centro
                //agrego el doble del margen porque agregue el margen al costado del canvas
                return _this._config.height - _this.radius_scale(d) - _this.margin.bottom - _this.margin.top;
            };
        })(this));

    this.legends
        .transition()
        .duration(this._get_transition())
        .attr("r", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                return _this.radius_scale(d);
            };
        })(this))
        .attr("cx", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                //Tomo el ancho del mas grande
                return _this._config.width - _this.radius_scale(_this.legend_scale[2]) - _this.margin.right - _this.margin.left;
            };
        })(this))
        .attr("cy", (function (_this) {
            return function (d) {
                if (!_this.legend_scale || _this.legend_scale.length === 0) {
                    return 0;
                }
                //Tomo el alto y le resto el diametro para obtener el centro
                return _this._config.height - _this.radius_scale(d) - _this.margin.bottom - _this.margin.top;
            };
        })(this));

    this.legends.exit().remove();
    this.legends_texts = legend_layer.selectAll(".legend-text").data(this.legend_scale);

    this.legends_texts.enter()
        .append("text")
        .attr("class", "legend-text")
        .call(this._legend_text, this)
        .call(this._legend_text_position, this);

    this.legends_texts
        .call(this._legend_text, this)
        .call(this._legend_text_position, this);
    this.legends_texts.exit().remove();
};

/**
Texto de las leyendas se muestra junto a los circulos de leyenda
*/
GravityBubbles.prototype._legend_text = function (textNode, that) {
    this.text(function (d) {
        if (that._config.legend && that._config.legend.format) {
            return that._config.legend.format.call(this, d);
        }
    });
};

/**
Calcula y ubica el texto de la leyenda
*/
GravityBubbles.prototype._legend_text_position = function (text, _this) {
    this
        .transition()
        //.duration(_this._get_transition())
        .attr("x", function (d) {
            var _text_width = this.getComputedTextLength();
            return _this._config.width - _this.radius_scale(_this.legend_scale[2]) - (_text_width / 2) - _this.margin.right;
        })
        .attr("y", function (d) {
            //Tomo el alto y le resto el diametro para obtener el centro
            return _this._config.height - (_this.radius_scale(d) * 2 + _this.margin.bottom + 5);
        });
};

GravityBubbles.prototype._draw_circles = function () {
    var bubbles_layer = this.svg.select("#bubbles_layer");

    this.bubbles = bubbles_layer.selectAll("g").data(this.nodes);

    var _this = this;

    this.bubbles.enter()
        .append("g")
        .on("mouseover", function (d, i) {
            return _this.show_details(d, i, _this);
        })
        .on("mouseout", function (d, i) {
            return _this.hide_details(d, i, _this);
        })
        .on("click", function (d, i) {
            _this.hide_details(d, i, _this);
            d3.select(this).classed("selected", function (d, i) {
                return !d3.select(this).classed("selected");
            });
            _this._config.data.onclick.call(_this, d, this, i);
        })
        .append("circle")
        .attr("class", "bubble")
        .attr("stroke", function (d) {
            return d3.rgb(_this._fill_color_by(d)).darker();
        })
        .attr("stroke-width", 1)
        .attr("fill", function (d) {
            return _this._fill_color_by(d);
        })
        .attr("r", function (d) {
            return 0;
        })
        .attr("cx", function (d) {
            var target = _this._get_target(d, _this);
            if (target) {
                d.x = Math.floor(Math.random() * (target.dx - target.x + 1)) + target.x;
                return d.x;
            }
            return 0;
        })
        .attr("cy", function (d) {
            var target = _this._get_target(d, _this);
            if (target) {
                d.y = Math.floor(Math.random() * (target.dy - target.y + 1)) + target.y;
                return d.y;
            }
            return 0;
        })
        //.call(_this._calculate_circle_position, _this)
        .on("mouseover", function (d, i) {
            //return _this.show_details(d, i, _this);
        })
        .on("mouseout", function (d, i) {
            //return _this.hide_details(d, i, _this);
        })
        .on("click", function (d, i) {
            //_this.hide_details(d, i, _this);
            //d3.select(this).classed("selected", function (d, i) {
            //    return !d3.select(this).classed("selected");
            //});
            //_this._config.data.onclick.call(_this, d, this, i);
        })
        .select(function () {
            return this.parentNode;
        })
        .append("text")
        .attr("class", "label")
        .call(_this._draw_text, this);

    this.circles = bubbles_layer.selectAll(".bubble").data(this.nodes);
    this.circles
        .transition()
        .duration(this._get_transition())
        .ease("ease-in-out")
        .attr("r", function (d) {
            return _this._radius_by(d);
        })
        .attr("stroke", function (d) {
            return d3.rgb(_this._fill_color_by(d)).darker();
        })
        .attr("fill", function (d) {
            return _this._fill_color_by(d);
        })
        .call(_this._keep_position, _this)
        .text(function (d) {
            return d.weight;
        });
    this.circles.exit().remove();

    this.labels = bubbles_layer.selectAll(".label").data(this.nodes);
    this.labels
        .call(_this._draw_text, _this);
    this.labels.exit().remove();

    this.bubbles.exit().remove();
};

GravityBubbles.prototype._get_transition = function () {
    var _transition = 500;
    switch (this._config.transition) {
        case "slow":
            _transition = 1000;
            break;
        case "quick":
            _transition = 100;
            break;
        default:
            _transition = 500;
    }
    return _transition;
};

GravityBubbles.prototype._get_target = function (d, _this) {
    var group = typeof _this._config.groupById === 'undefined' || _this._config.groupById === 'all' ? "all" : _this._config.groupById;
    switch (group) {
        case 'all':
            target = _this._get_group("all");
            break;
        case 'color':
            target = _this._get_group(_this._color_ranges(d[_this._config.colorById]));
            break;
        default:
            target = _this._get_group(d[_this._config.groupById]);
    }
    return target;
};

GravityBubbles.prototype._calculate_circle_position = function (circles, _this) {
    circles.attr("cx", function (d) {
        if (!d3.select(this).attr("cx")) {
            return d.x;
        }
        return d3.select(this).attr("cx");
    }).attr("cy", function (d) {
        if (!d3.select(this).attr("cy")) {
            return d.y;
        }
        return d3.select(this).attr("cy");
    });
};

GravityBubbles.prototype._update_colors = function () {
    this.fill_color = d3.scale.linear()
        .domain(this._config.points)
        .range(this._config.colors);

    this.color_layer = d3.scale.linear()
        .domain(this._config.points)
        .range([0,
                    this._config.height / 4,
                    this._config.height / 2,
                    this._config.height / 4 + this._config.height / 2,
                    this._config.height]);

    this.nodes.forEach((function (_this) {
        return function (d) {
            d.weight = _this.color_layer(Number(d[_this._config.colorById]));
            //d.y = _this.color_layer(Number(d[_this._config.colorById]));
        };
    })(this));
    if (this.force) {
        //this.force.start();
    }
};

GravityBubbles.prototype._fill_color_by = function (d) {
    if (d.hasOwnProperty(this._config.colorById) && !isNaN(d[this._config.colorById])) {
        return this.fill_color(d[this._config.colorById]);
    }
    return 0;
};

GravityBubbles.prototype._radius_by = function (d) {
    if (d.hasOwnProperty(this._config.sizeById) && !isNaN(d[this._config.sizeById])) {
        var scl = this.radius_scale(d[this._config.sizeById]);
        return scl;
    }
    return 0;
};

GravityBubbles.prototype.resize = function () {
    //Toma el tamano del padre
    this.config({
        width: parseInt(this.container.style("width")),
        height: parseInt(this.container.style("height"))
    });

    var that = this;
    if (this._data && this._data.length > 0) {
        this._calculate_groups();
        this.refresh();
    }
};
