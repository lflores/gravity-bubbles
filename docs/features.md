This is a visual component that draw a chart with centered gravity based on [d3](http://d3js.org/) API library.

Based on [Jim Vallandingham Blog Post](http://vallandingham.me/bubble_charts_in_d3.html), [Obama’s 2013 Budget Proposal](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=0) and [Automobile Force](http://projects.delimited.io/experiments/force-bubbles/radial.html), Gravity Bubbles it's a component that draw a collection of bubbles, and allow the user to compare data attributes by color and size. 

The main characteristic is the "gravity" to center, and hence its name. 

Also the component include 3 views:
* "all" view with unique center in center of chart
* "color" view, that are bubbles grouped by color fences, as vertical bands.
* A free group that is a name of property of data that can be used to group data, (such as country, category, contact id, etc).

##Some features
* Tooltip templated configuration
* Label templated configuration
* Animated transitions
* Size comparizons
* Group data capability
* Easy color schema changes
* Resizable data legend
* All items are visibles, including negatives and smallest data 

Examples
##Default:
![Gravity Bubbles ungruped](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-default.png)
##Grouping by color:
![Gravity Bubbles Color groups](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-group-color.png)
##Grouping by category:
![Gravity Bubbles Category groups](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-group-category.png)
##Live Example
![Gravity Bubbles Example](http://www.triadsoft.com.ar/examples/gravity-bubbles/)
##Fiddle Example
![Gravity jsfiddle](http://jsfiddle.net/6cLpuL7j/8/)

##Colors Examples:
![Gravity Bubbles Blue Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-blue.png)
![Gravity Bubbles Green Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-green.png)
![Gravity Bubbles Brown Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-brown.png)
