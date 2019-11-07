# gravity-bubbles

> This component, using d3js API, draw animated bubbles chart with gravity

[![Build Status](https://travis-ci.org/lflores/gravity-bubbles.svg?branch=master)](https://travis-ci.org/lflores/gravity-bubbles)


## Features
This is a visual component that draw a chart with centered gravity based on [d3](http://d3js.org/) API library.

Based on [Jim Vallandingham Blog Post](http://vallandingham.me/bubble_charts_in_d3.html), [Obama’s 2013 Budget Proposal](http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=0) and [Automobile Force](http://projects.delimited.io/experiments/force-bubbles/radial.html), Gravity Bubbles it's a component that draw a collection of bubbles, and allow the user to compare data attributes by color and size. 

The main characteristic is the "gravity" to center, and hence its name. 

![Gravity Bubbles Grouping](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-grouping.gif)

Also the component include 3 views:
* "all" view with unique center in center of chart
* "color" view, that are bubbles grouped by color fences, as vertical bands.
* A free group that is a name of property of data that can be used to group data, (such as country, category, contact id, etc).

### Some features
* Tooltip templated configuration
* Label templated configuration
* Animated transitions
* Size comparizons
* Group data capability
* Easy color schema changes
* Adaptable data legend
* All items are visibles, including negatives and smallest data


## Examples
#### Default:
![Gravity Bubbles ungruped](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-default.png)
#### Grouping by color:
![Gravity Bubbles Color groups](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-group-color.png)
#### Grouping by category:
![Gravity Bubbles Category groups](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-group-category.png)

#### [Flare Example](http://lflores.github.com/flare/)
Based on common tree data "flare", and using D3js library, this example shows bubbles grouped in center (force), like earth gravity, with distinct sizes and colors, you can dive into data hierarchy.

![Gravity Bubbles Flare Example](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-flare.gif)

[Please show me](http://lflores.github.com/flare/)

#### [Evolution Example](http://lflores.github.com/evolution/)
Based on D3js library, this example shows the evolution of bubbles through time, loading data in asynchronous form, under demand. Or you can push play to automate the action.

![Gravity Bubbles Evolution](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-timeline.gif)

[I want to see it...](http://lflores.github.com/evolution/)

#### [Martian Example](http://lflores.github.com/martian/)(Thanks to [headwins](https://github.com/headwinds))
In the year 2030, we face a new form of global conscription. Since we've ruined our planet, NATO has ordered the remaining population to board the fleet of Dragon class drop ships headed for that distant red rock in the sky which we'll have to now call home. Many are seeking asylum status in Southeast Asia to avoid ruining another planet.

![Martian Example](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-martian.gif)


#### [Gravity Label](http://jsfiddle.net/6cLpuL7j/)
This fiddle example shows how to configure the component for adaptable label to enabled space

#### Colors Changes:
It's easy to change bubble colors, setting points and colors arrays.

![Gravity Bubbles Color Changes](http://rawgit.com/lflores/gravity-bubbles/master/src/images/gravity-bubbles-color-change.gif)


## Get started
If you want to see it in action, go to [jsfiddle](https://jsfiddle.net/leoflores/6cLpuL7j/) that explain some concepts of use, and show how to change some properties. Or if you want to see a more complex use, please go to [gravity-bubbles](http://lflores.github.com/flare)
Currently I'm documenting the project, and please, [contact me](https://github.com/lflores/gravity-bubbles/issues) if you want to help or discovered some issue.
To start using it, you must to download this proyect, and solve next dependencies.

## Dependencies:
* [jquery](http://jquery.com/download/)
* [d3 api](https://github.com/mbostock/d3)
* [linear-gauge](https://github.com/lflores/linear-gauge) (only for examples)
* [jquery-ui](https://jqueryui.com/) (only for examples)



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
        <td><strong>data</strong></td>
        <td></td>
        <td>This node is an object that receives parameter exclusive for data</td>
    </tr>
    <tr>
        <td><strong>data\label</strong></td>
        <td>none</td>
        <td>It has three optional parameter, they are template,formatter and autofit.
        <ul>
        <li>template: It's an string that show label values using wildcards such as {name}, that try to lockup a property called name</li>
        <li>show: Force to show label. Default value is true</li>
        <li>formatter: It's waiting a function to format numbers, 00.00 or 00. Tested with <a href="https://github.com/mbostock/d3/wiki/Formatting">d3js formatter</a></li>
        <li>autofit: This property make the label as scalable label, and if the bubble space is not enough, scale it, to do it visible. </li>
        </ul>
        </td>
    </tr>
    <tr>
        <td><strong>data\tooltip</strong></td>
        <td>none</td>
        <td>It has two optional parameter, they are template and formatter</td>
    </tr>
    <tr>
        <td><strong>data\sizeById</strong></td>
        <td>size</td>
        <td>Indicates property to be used to radius of bubble</td>
    </tr>
    <tr>
        <td><strong>data\colorById</strong></td>
        <td>perc</td>
        <td>Indicates property to be used to colorize bubbles</td>
    </tr>
</table>

#### Styles
<table>
<tr>
        <th>Selector</th>
        <th>Description</th>
        <th>Is in use?</th>
        <th>Observations</th>
    </tr>
    <tr>
        <td>.gravity-container</td>
        <td>It's just to hold styles asociated with this chart</td>
        <td>Yes</td>
        <td>Change it to add borders, background, and so on</td>
    </tr>
    <tr>
        <td>.gravity-container .bubble </td>
        <td>This class holds basic properties to bubbles, such as border and opacity</td>
        <td>Yes</td>
        <td>Overwrite to change. Don't all properties related with color, are changed by component</td>
    </tr>
    <tr>
        <td>.gravity-container .bubble:hover</td>
        <td>This class holds basic properties to bubbles, when user hover it</td>
        <td>Yes</td>
        <td>Overwrite to change.</td>
    </tr>
        <tr>
        <td>.gravity-container .bubble.drilldown</td>
        <td>This class holds basic properties to bubbles, when user hover it</td>
        <td>No</td>
        <td>Overwrite to change.</td>
    </tr>
    <tr>
        <td>.gravity-container .group</td>
        <td>This class is for group background</td>
        <td>Yes</td>
        <td>Overwrite to change or add border or colors.</td>
    </tr>
    <tr>
        <td>.gravity-container rect.group.multiple</td>
        <td>This class is for group background when is mutiple type</td>
        <td>No?</td>
        <td>Overwrite to change or add border or colors.</td>
    </tr>
    <tr>
        <td>.gravity-container .group-text</td>
        <td>This class is to define properties of group text, such as font, color and so on</td>
        <td>Yes</td>
        <td>Overwrite to change or add stroke or font size.</td>
    </tr>
    <tr>
        <td>.gravity-container .legend-circle</td>
        <td>Style for legend at right that shows information about drawed bubbles (max, min)</td>
        <td>Yes</td>
        <td>Overwrite to change stroke or change dash array.</td>
    </tr>
    <tr>
        <td>.gravity-container .legend-text</td>
        <td>Style for text of legend</td>
        <td>Yes</td>
        <td>Overwrite to change stroke or font.</td>
    </tr>
    <tr>
        <td>.gravity-container text.label</td>
        <td>Style for labels inside bubble</td>
        <td>Yes</td>
        <td>Overwrite to change stroke or font.</td>
    </tr>
    <tr>
        <td>.gravity-container .tooltip</td>
        <td>This style define tooltip format (when hovering bubble)</td>
        <td>Yes</td>
        <td>Overwrite to change size, background color, font, etc.</td>
    </tr>
    <tr>
        <td>.gravity-container .tooltip .title</td>
        <td>This style customize title of tooltip</td>
        <td>Yes</td>
        <td>Overwrite to change size, background color, font, etc.</td>
    </tr>
    <tr>
        <td>.gravity-container .tooltip .name</td>
        <td>This style customize title of tooltip</td>
        <td>Yes</td>
        <td>Overwrite to change size, background color, font, etc.</td>
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
        <td>d</td>
        <td>Data Clicked</td>
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
                    label: {
                        //{name} Indicates that will try to show property value called name
                        template : "{name}\n{perc}%",
                        //Force the label to fill bubble and scale it
                        autofit: true
                    },

                    onclick: function(d) {
                        //Parameter d is clicked data
                    }
                }
            });
});
```


## Testing (New)
Now project supports testing and run all tests under tests folder.
Solving dependencies with karma and jasmine you can run tests with.
```
grunt test
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
Copyright (c) 2016 triad, contributors. Released under the GPL-3.0 license 

Special Thanks to contributors:
* [headwinds](http://github.com/headwinds)
* [vlandham](http://github.com/vlandham)
