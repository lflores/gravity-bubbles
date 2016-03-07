# gravity-bubbles

> Animated bubbles chart with gravity

![Version](http://img.shields.io/version/0.0.5.png?color=green)


## Features
This is a component that use [d3](http://d3js.org/) library and generate a bubble chart with centered gravity.

Based on [Jim Vallandingham Blog Post](http://vallandingham.me/bubble_charts_in_d3.html), [Obama’s 2013 Budget Proposal](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=0) and [Automobile Force](http://projects.delimited.io/experiments/force-bubbles/radial.html), Gravity Bubbles it's a component that draw a collection of bubbles, and allow the user to compare data attributes by color ad size.

###Some features
* Tooltip templated configuration
* Label templated configuration
* Animated transitions
* Size comparizons
* Easy color schema changes
* All items are visibles, including negatives and smallest data 

Examples
###Default:
![Gravity Bubbles Default Color Scheme(Budget proposal)](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-default.png)
###Styles:
![Gravity Bubbles Blue Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-blue.png)
![Gravity Bubbles Green Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-green.png)
![Gravity Bubbles Brown Scheme](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-brown.png)



## Get started
You can see an example in [jsfiddle](http://jsfiddle.net/leoflores/6qq1zks6/1/) that explain some concepts of use, and show how to change some properties.
To start using it, you must to download this proyect, and solve dependencies.
Dependencies:
* jquery
* jquery ui
* d3 api



## Options
You can pass these options to the initialize function to set a custom look and feel for the plugin.

<table>
    <tr>
        <th>Property (Type)</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>width</strong></td>
        <td>Calculated container width</td>
        <td>It's the external width of component. Doesn't include left and right margins</td>
    </tr>
  <tr>
        <td><strong>height</strong></td>
        <td>40</td>
        <td>It's the external height of component. Doesn't include top and bottom margins</td>
    </tr>
    <tr>
        <td><strong>points</strong></td>
        <td>[0, 25, 50, 75, 100]</td>
        <td>They are thresholds of color changes</td>
    </tr>
    <tr>
        <td><strong>colors</strong></td>
        <td>["#ff0000", "#ffa300", "#ffe100", "#fffa00", "#1f6f02"]</td>
        <td>They are the distinct colors that change on the thresholds</td>
    </tr>
     <tr>
        <td><strong>minorTicks</strong></td>
        <td>false</td>
        <td>Indicates if minor scale is shown</td>
    </tr><tr>
        <td><strong>thresholds</strong></td>
        <td>true</td>
        <td>Indicates if thresholds is shown</td>
    </tr>
</table>


## Callbacks
When the user click on bubble, a <strong>click</strong> is fired to comunicate that values have been clicked. It can be used to do a drilldown
<table>
    <tr>
        <th>Event</th>
        <th>Property</th>
        <th>Value</th>
    </tr>
    <tr>
        <td><strong>click</strong></td>
        <td>d: data clicked</td>
        <td>Data</td>
    </tr>
</table>


## Plugin api
#### jQuery

```javascript
$(function() {
    // instantiate the plugin
    
    chart = new GravityBubbles({
                id: "vis",
               sizeById: "size",
                colorById: "perc",
                data: {
                    tooltip: function(d) {
                        //Parameter d is clicked data
                        //You can return a string template
                        return "<b>Name:</b>{name}<br><b>Size:</b> {size}<br><b>Size of Total:</b> {perc}%";
                    },
                    label: function (d) {
                        //Parameter d is clicked data
                        //You can return a string template
                        return "<b>Name:</b>{name}<br><b>Size:</b> {size}<br><b>Size of Total:</b> {perc}%";
                    },

                    onclick: function(d) {
                        //Parameter d is clicked data
                    }
                }
            });
});
```


## Browser Support
Native support

* Chrome
* Safari
* FireFox
* Opera
* Internet Explorer 9+

Support for Internet Explorer 9.


## Copyright
Copyright (c) 2016 Leonardo Flores, contributors. Released under the MIT, GPL licenses