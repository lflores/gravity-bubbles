/**!
 * gravity-bubbles
 * Animated bubbles chart with gravity
 *
 * @license 
 * @author Leonardo Flores <flores.leonardo@gmail.com> (http://www.triadsoft.com.ar)
 * @version 0.9.5
 **/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['GravityBubbles'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['GravityBubbles'] = factory();
  }
}(this, function () {

        GravityBubbles = function (config) {
            this.margin = {
                top: 3,
                right: 3,
                bottom: 3,
                left: 3
            };
            var _defaults = {
                sticky: false,
                height: 600,
                width: 350,
                minRadius: 5,
                maxRadius: 40,
                debug: false,
                //cuando calcula los grupos es la cantidad maxima de columnas
                lanes: 3,
                //Colores originales de comercial
                //colors: ["#ff0000", "#ff9a00", "#ffeb00", "#d6ff00", "#08ff00"],
                //colors: ["#000", "#f20000", "#fbb400", "#ddff00", "#9fec00"],
                points: [0, 15, 20, 40, 100],
                colors: ["#d84b2a", "#beccae", "#7aa25c", "#7aa25c"],
                id: "treemap",
                colorById: "gp_brl",
                sizeById: "ns_brl",
                showChild: false,
                groupById: "all",
                data: {
                    labels: {
                        label: "{description}",
                        formatter: d3.format(",.2f")
                    },
                    tooltip: {
                        template: "<b>{name} - {description}</b><br><b>GP %:</b>{gp_brl} <br><b>GTN %:</b> {gtn_brl}<br><b>NS:</b> {ns_brl}",
                        formatter: d3.format(",.2f")
                    },
                    group: {
                        label: function (d, _this) {
                            if (_this._config.groupById === 'all') {
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
                    },

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

            this.container = d3.select("#" + this._config.id);
            this.container.style("overflow", "hidden");

            this.svg = this.container.append("svg")
                .attr("class", "map-container")
                .attr("width", this._config.width)
                .attr("height", this._config.height);

            //En SVG es importante el orden de los objetos
            //El que se creo primero, sera tapado 
            this.svg.append("g").attr("id", "groups_layer");
            this.svg.append("g").attr("id", "bubbles_layer");
            this.svg.append("g").attr("id", "legend_layer");
            this.svg.append("g").attr("id", "groups_title_layer");

            this.center = {
                x: this._config.width / 2,
                y: this._config.height / 2
            };

            this.layout_gravity = -0.1;

            this.damper = 0.1;
            this.nodes = [];
            this.force = null;
            this.circles = null;

            this.fill_color = d3.scale.linear()
                .domain(this._config.points)
                .range(this._config.colors);

            this.radius_scale = d3.scale.pow()
                .exponent(0.5)
                .range([this._config.minRadius, this._config.maxRadius]);
        };

        GravityBubbles.prototype.config = function (config) {
            this._config = $.extend(true, this._config, config);
            this._update_colors();

            this.svg
                .attr("width", this._config.width)
                .attr("height", this._config.height);

            if (this.force) {
                this.force.size([this._config.width, this._config.height]);
            }

            this._update_radius();

            this.legend_scale = [
                this.min_amount,
                this.min_amount + (this.max_amount - this.min_amount) / 2,
                this.max_amount];

            this.center = {
                x: this._config.width / 2,
                y: this._config.height / 2
            };
            this.refresh();
        };

        GravityBubbles.prototype.update_details = function (data, i, event) {
            return this.tooltip.updatePosition(event);
        };

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
            this.force.start();
        };

        GravityBubbles.prototype.colorById = function (byId) {
            this._config.colorById = byId;
            this._update_colors();
            this._calculate_groups();
            this.refresh();
            this.force.start();
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
            this.force.start();
        };

        GravityBubbles.prototype.groupById = function (byId) {
            this._config.groupById = byId && byId.length !== 0 ? byId : "all";
            var _this = this;
            this._calculate_groups();
            this.refresh();
            this.force.start();
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
                this._data.forEach((function (_this) {
                    return function (d) {
                        return d[_this._config.groupById] == _this._calculate_color_group(d);
                    };
                })(this));
                this._config.groups = d3.nest()
                    .key(function (d) {
                        return d[_this._config.groupById];
                    })
                    .sortKeys(function (a, b) {
                        if (Number(a) < Number(b)) {
                            return -1;
                        } else if (Number(a) > Number(b)) {
                            return 1;
                        }
                        return 0;
                    })
                    .entries(this._data);
            } else if (this._data && this._data[0].hasOwnProperty(this._config.groupById)) {
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

            this._config.maxRadius = height - 3;
            this.radius_scale.range([this._config.minRadius, this._config.maxRadius]);


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
                this.nodes = [];
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

            this.radius_scale
                .domain([this.min_amount, this.max_amount])
                .range([this._config.minRadius, this._config.maxRadius]);

            this.legend_scale = [
                this.min_amount,
                this.min_amount + (this.max_amount - this.min_amount) / 2,
                this.max_amount
            ];

            this.create_nodes();

            this._calculate_groups();

            this.force = d3.layout.force()
                .nodes(this.nodes)
                .size([this._config.width, this._config.height]);

            this.force
                //.chargeDistance(280)
                .gravity((function (_this) {
                    return function (d) {
                        return _this.layout_gravity;
                    };
                })(this))
                .charge((function (_this) {
                    return function (d, i) {
                        var _group = d[_this._config.groupById] ? d[_this._config.groupById] : "all";
                        //Testeado con otros valores, pero tiene que mantener el radio para que detecte
                        //la colision entre las burbujas
                        var _radius = _this._radius_by(d);
                        return -Math.pow(_radius, 2.0) / 7;
                    };
                })(this))
                .friction(0.9)
                .alpha(0.1)
                .on("tick", (function (_this) {
                    return function (e) {
                        return _this.circles.each(_this.move_towards_center(e.alpha))
                            .attr("cx", function (d) {
                                return d.x;
                            })
                            .attr("cy", function (d) {
                                return d.y;
                            });
                    };
                })(this));

            this.refresh();
            this.force.start();
        };

        GravityBubbles.prototype.move_towards_center = function (alpha) {
            return (function (_this) {
                return function (d) {
                    var _group = typeof _this._config.groupById === 'undefined' || _this._config.groupById === 'all' ? "all" : d[_this._config.groupById];
                    var target = _this._get_group(_group);
                    d.x = d.x + (target.cx - d.x) * (_this.damper + 0.02) * alpha * 1.1;
                    d.y = d.y + (target.cy - d.y) * (_this.damper + 0.02) * alpha * 1.1;
                    return d.y;
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
                    //d.x = Math.random() * _this._config.width;
                    //d.y = Math.random() * _this._config.height;
                    return _this.nodes.push(d);
                };
            })(this));
            return this.nodes.sort(function (a, b) {
                return b[that._config.sizeById] - a[that._config.sizeById];
            });
        };

        /**
        Metodo encargado de dibujar los grupos de las burbujas
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
                    return d.dx;
                })
                .attr("height", function (d) {
                    return d.dy;
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
                    return d.dx;
                })
                .attr("height", function (d) {
                    return d.dy;
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
            //.attr("x", function (d) {
            //    return d.x + (d.dx / 2) - (this.getComputedTextLength() / 2);
            //}).attr("y", function (d) {
            //    return d.y + 15;
            //})

            group_texts
                .call(this._draw_group_text, this)
                .call(this._draw_group_position, this);
            //.attr("x", function (d) {
            //    return d.x + (d.dx / 2) - (this.getComputedTextLength() / 2);
            //}).attr("y", function (d) {
            //    return d.y + 15;
            //})
            group_texts.exit().remove();
        };

        /**
        Metodo encargado de dibujar el texto que dependiendo de criterio de 
        agrupamiento, cambia
        */
        GravityBubbles.prototype._draw_group_text = function (d, _this) {
            if (_this._config.groupById === 'all') {
                this.text("");
                return;
            }
            if (_this._config.groupById === 'color') {
                this.text(function (d) {
                    if (d.key === 'more') {
                        return ">= " + _this._config.points[_this._config.points.length - 1];
                    }
                    return "< " + d.key;
                });
                return;
            }

            if (
                _this._config.data.group && _this._config.data.group.label && typeof _this._config.data.group.label === 'function') {
                this.text(function (d) {
                    return _this._config.data.group.label.call(_this, d, _this);
                });
            }
        };

        GravityBubbles.prototype._draw_group_position = function (d, _this) {
            this
                .attr("x", function (d) {
                    //No se si esta bueno hacerlo aca
                    if (_this._config.groupById != 'all' && _this._config.groupById != 'color' && this.getComputedTextLength() > d.dx) {
                        var _text = this.innerHTML.split("-");
                        this.innerHTML = _text[0];
                    }
                    //------------
                    return d.x + (d.dx / 2) - (this.getComputedTextLength() / 2);
                }).attr("y", function (d) {
                    return d.y + 15;
                });
        };

        /**
        Actualiza el rango de valores del radio de las burbujas
        */
        GravityBubbles.prototype._update_radius = function () {
            this.radius_scale
                .domain([this.min_amount, this.max_amount])
                .range([this._config.minRadius, this._config.maxRadius]);
        };

        /**
        Toma todas las actualizaciones y las refleja en el grafico
        */
        GravityBubbles.prototype.refresh = function () {
            //Acciones de refresh
            if (!this._data || this._data.length === 0)
                return;

            var _that = this;
            if (this._config.groupById === "all") {
                var _radio = this._calculate_boundary(this._data);
                var _max = (this._config.height / 2) * this._config.maxRadius / _radio;
                this._config.maxRadius = _max * 0.8;
            } else {
                this._config.maxRadius = 25;
            }
            this._draw_groups();
            this._update_radius();
            this._draw_circles();
            this._draw_centers();
            this._draw_legends();
        };

        GravityBubbles.prototype._draw_centers = function () {
            if (!this._config.debug) {
                return;
            }
            var centers = this.svg.selectAll(".centros").data(this._config.groups);
            centers.enter().append("circle")
                .attr("class", "centros")
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
            if (!this._data || this._data.length === 0) {
                return;
            }
            var legend_layer = this.svg.selectAll("#legend_layer");
            this.legends = legend_layer.selectAll(".legend-circle").data(this.legend_scale);

            this.legends.enter()
                .append("circle")
                .attr("class", "legend-circle")
                .attr("r", (function (_this) {
                    return function (d) {
                        return _this.radius_scale(d);
                    };
                })(this))
                .attr("cx", (function (_this) {
                    return function (d) {
                        //Tomo el ancho del mas grande
                        return _this._config.width - _this.radius_scale(_this.legend_scale[2]) - _this.margin.right;
                    };
                })(this))
                .attr("cy", (function (_this) {
                    return function (d) {
                        //Tomo el alto y le resto el radio para obtener el centro
                        return _this._config.height - _this.radius_scale(d) - _this.margin.bottom;
                    };
                })(this));

            this.legends
                .transition()
                .duration(1000)
                .attr("r", (function (_this) {
                    return function (d) {
                        return _this.radius_scale(d);
                    };
                })(this))
                .attr("cx", (function (_this) {
                    return function (d) {
                        //Tomo el ancho del mas grande
                        return _this._config.width - _this.radius_scale(_this.legend_scale[2]) - _this.margin.right;
                    };
                })(this))
                .attr("cy", (function (_this) {
                    return function (d) {
                        //Tomo el alto y le resto el diametro para obtener el centro
                        return _this._config.height - _this.radius_scale(d) - _this.margin.bottom;
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
            this.circles = bubbles_layer.selectAll(".bubble").data(this.nodes);
            var that = this;

            this.circles.enter()
                .append("circle")
                .attr("class", "bubble")
                .attr("stroke", function (d) {
                    return d3.rgb(that._fill_color_by(d)).darker();
                })
                .attr("fill", function (d) {
                    return that._fill_color_by(d);
                })
                .attr("r", function (d) {
                    return 0;
                })
                .attr("cx", function (d) {
                    //return that._config.width;
                    return d.x;
                })
                .attr("cy", function (d) {
                    //return that._config.height;
                    //return that.color_layer(Number(d[that._config.colorById]));
                    return d.y;
                })
                .on("mouseover", function (d, i) {
                    return that.show_details(d, i, that);
                })
                .on("mouseout", function (d, i) {
                    return that.hide_details(d, i, that);
                })
                .on("click", function (d, i) {
                    that.hide_details(d, i, that);
                    d3.select(this).classed("selected", function (d, i) {
                        return !d3.select(this).classed("selected");
                    });
                    that._config.data.onclick.call(that, d, i);
                });
            //.on("drag", this.force.drag);

            this.circles
                .transition()
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });

            this.circles
                .transition()
                .duration(1000)
                .ease("ease-in-out")
                .attr("r", function (d) {
                    return that._radius_by(d);
                })
                .attr("stroke", function (d) {
                    return d3.rgb(that._fill_color_by(d)).darker();
                })
                .attr("fill", function (d) {
                    return that._fill_color_by(d);
                }).text(function (d) {
                    return d.weight;
                });

            this.circles.exit().remove();
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
            if (this.force)
                this.force.start();
        };

        GravityBubbles.prototype._fill_color_by = function (d) {
            if (d.hasOwnProperty(this._config.colorById) && !isNaN(d[this._config.colorById])) {
                return this.fill_color(d[this._config.colorById]);
            }
            return 0;
        };

        GravityBubbles.prototype._radius_by = function (d) {
            if (d.hasOwnProperty(this._config.sizeById) && !isNaN(d[this._config.sizeById])) {
                return this.radius_scale(d[this._config.sizeById]);
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
                this.force.start();
            }
        };

return GravityBubbles;

}));
