### jQuery

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