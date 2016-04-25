This is a visual component that draw a chart with centered gravity based on [d3](http://d3js.org/) API library.

Based on [Jim Vallandingham Blog Post](http://vallandingham.me/bubble_charts_in_d3.html), [Obama’s 2013 Budget Proposal](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=0) and [Automobile Force](http://projects.delimited.io/experiments/force-bubbles/radial.html), Gravity Bubbles it's a component that draw a collection of bubbles, and allow the user to compare data attributes by color and size. 

The main characteristic is the "gravity" to center, and hence its name. 

![Gravity Bubbles Grouping](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-grouping.gif)

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
* Adaptable data legend
* All items are visibles, including negatives and smallest data