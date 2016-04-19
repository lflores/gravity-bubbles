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
        <li>formatter: It's waiting a function to format numbers, 00.00 or 00. Tested with <a href="https://github.com/mbostock/d3/wiki/Formatting">d3js formatter</a></li>
        <li>Autofit: This property make the label as scalable label, and if the bubble space is not enough, scale it, to do it visible. </li>
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

### Styles
<table>
<tr>
        <th>Selector</th>
        <th>Description</th>
        <th>Is in use?</th>
        <th>Observations</th>
    </tr>
    <tr>
        <td>.gravity-container</td>
        <td>It's just to old styles asociated with this chart</td>
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