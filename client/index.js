(function($){
    $.fn.fixedOverflow = function(options) {
    return this.each(function(){                
        var $this = $(this);
        $this.bind("touchstart", function() {
            // Check that the element has actually overflowed, and check if at the top
            if ($this.prop("scrollHeight") > $this.innerHeight() && $this.scrollTop() == 0) {
                    // Scroll element down 1 causing scroll bounce
                    $this.scrollTop(1);
            }
            // Check that the element has actually overflowed, and check if at the bottom
            else if ($this.prop("scrollHeight") > $this.innerHeight() && ($this.prop("scrollHeight") - $this.scrollTop()) <= $this.outerHeight()) {
                    // Scroll element up 1 causing scroll bounce
                    $this.scrollTop($this.scrollTop()-1);
            }
        });
    });
};
})(jQuery);

var _slides = (function(f) {

    var container,panes, pane_count, element;

    var pane_width = 0;
    var current_pane = 0;

    var self = {
        init: function() {

            element = $("#cards");
            container = $(">ul", element);
            panes = $(">ul>li", element);

            pane_count = panes.length;
            current_pane = 0;

            this.setPaneDimensions();

            console.log(element.html());
            new Hammer(element[0], { dragLockToAxis: true }).on("release dragleft dragright swipeleft swiperight", self.handleHammer);

            $(window).on("load resize orientationchange", function() {
                self.setPaneDimensions();
            })
        },
        setPaneDimensions: function() {
            pane_width = element.width();
            panes.each(function() {
                $(this).width(pane_width);
            });
            container.width(pane_width*pane_count);
        },
        showPane: function(index, animate) {
            index = Math.max(0, Math.min(index, pane_count-1));
            current_pane = index;

            var offset = -((100/pane_count)*current_pane);
            self.setContainerOffset(offset, animate);
        },
        setContainerOffset: function(percent, animate) {
            container.removeClass("animate");

            if(animate) {
                container.addClass("animate");
            }

            if(Modernizr.csstransforms3d) {
                container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            }
            else if(Modernizr.csstransforms) {
                container.css("transform", "translate("+ percent +"%,0)");
            }
            else {
                var px = ((pane_width*pane_count) / 100) * percent;
                container.css("left", px+"px");
            }
        },
        handleHammer: function(ev) {
            // disable browser scrolling
            if (ev.type !== 'release') {
                ev.gesture.preventDefault();
            }
           
            switch(ev.type) {
                case 'dragright':
                case 'dragleft':
                    // stick to the finger
                    var pane_offset = -(100/pane_count)*current_pane;
                    var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                    // slow down at the first and last pane
                    if((current_pane == 0 && ev.gesture.direction == "right") ||
                        (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                        drag_offset *= .4;
                    }

                    self.setContainerOffset(drag_offset + pane_offset);
                    break;

                case 'swipeleft':
                    self.next();
                    ev.gesture.stopDetect();
                    break;

                case 'swiperight':
                    self.prev();
                    ev.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaX) > pane_width/3) {
                        if(ev.gesture.direction == 'right') {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                    else {
                        self.showPane(current_pane, true);
                    }
                    break;
            }
        },
        next: function() { return self.showPane(current_pane+1, true); },
        prev:function() { return self.showPane(current_pane-1, true); }

    };
    
    return self;
    
}());

$(document).ready(function() {
    
    var element = $("#cards");
    console.log(element);

    // _slides.init();
});