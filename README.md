# gravity-bubbles

> Animated bubbles chart with gravity

![Version](http://img.shields.io/version/0.0.5.png?color=green)


## Features
This is a component that use [d3](http://d3js.org/) library and generate a JQuery UI widget, to control colors and thredsholds in a colored gradient background.
Based on [Linear Gauge](http://docs.fusioncharts.com/flex/charts/) Flex components, such as Fusion Charts or [this](http://www.ardisialabs.com/flex-components/linearGauges), this component birth like a personal needs, and I decided to share it.
Once initialized, you can drag thresholds and see changes of color gradients.
Also, you can register an event change ("lineargaugechange") and send result to another component, such as graphic chart.

Examples
###Default:
![Linear Gauge Default](http://rawgit.com/lflores/linear-gauge/master/src/images/linear-gauge.png)
###Wide:
![Linear Gauge Wide](http://rawgit.com/lflores/linear-gauge/master/src/images/linear-gauge-wide.png)
###High:
![Linear Gauge High](http://rawgit.com/lflores/linear-gauge/master/src/images/linear-gauge-high.png)
###Color & Points
![Linear Gauge Colors&Point](http://rawgit.com/lflores/linear-gauge/master/src/images/linear-gauge-colors-points.png)


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
When a threshold drag ends, a <strong>lineargaugechange</strong> is fired to comunicate that values are changed.
<table>
    <tr>
        <th>Event</th>
        <th>Property</th>
        <th>Value</th>
    </tr>
    <tr>
        <td><strong>lineargaugechange</strong></td>
        <td>points</td>
        <td>Return an array of changed thresholds</td>
    </tr>
  <tr>
        <td><strong>lineargaugechange</strong></td>
        <td>colors</td>
        <td>Return an array of current colors</td>
    </tr>
</table>


## Plugin api
#### jQuery

```javascript
$(function() {
    // instantiate the plugin
    
    //Default Example
    $("#gradient").linearGauge();
    ...
    // change width
    $("#gradient").linearGauge("width",200);
    ...
    // change height
    $("#gradient").linearGauge("width",200);
    
    // change points and colors
    $("#gradient").linearGauge({
        points: [0, 10, 50, 100],
        colors: ["red", "orange", "green", "blue"]
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