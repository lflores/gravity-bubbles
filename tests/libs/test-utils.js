/**
Utilities only for tests
*/
$.fn.container = function (id) {
    if (typeof id == 'undefined') {
        id = "gb-" + $("body").find("[id^='gb-']").length;
    }
    var $child = $("<div id=\"" + id + "\"></div>");
    $child.css("height", 300);
    $child.css("width", 600);
    $child.css("border", "1px gray solid");
    $child.css("border-radius", "5px");
    $("body").append($child);
    return $child[0];
};
