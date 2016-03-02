### jQuery

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