(function($){
    $.fn.crossfade = function(replacement, options){
        
        options = $.extend({
            duration: 1000,
            complete: $.noop,
            wrapperTagName: "div",
            wrapperDisplay: $(replacement).css("display"),
            useCssTransitions: true
        }, options);
        
        function createWrapper(position){
            var el = document.createElement(options.wrapperTagName);
            el.style.position = position;
            el.style.background = "transparent";
            return el;
        }
        
        function createOverlay(){
            var overlay = createWrapper("absolute");
            overlay.style.left = "0px";
            overlay.style.top = "0px";
            return overlay;
        }
        
        var useCssTransitions = typeof Modernizr !== "undefined" && Modernizr.csstransitions && options.useCssTransitions;
        
        return this.each(function(){
            
            // Firefox bug #723484
            if(this.nodeName == "IMG"){
                this.style.background = "#fff";
            }
            
            var self = this;
            var $this = $(this);
            var $replacement = $(replacement);
            
            var container = createWrapper("relative");
            container.style.display = options.wrapperDisplay;
            container.style.width = $this.outerWidth(true) + "px";
            container.style.height = $this.outerHeight(true) + "px";
            
            var $thisOverlay = $(createOverlay());
            $thisOverlay.append($this.clone());
            
            var $replacementOverlay = $(createOverlay());
            $replacementOverlay.append($replacement);
            
            $(container).append($replacementOverlay).append($thisOverlay);
            
            $(this).replaceWith(container);
            
            var complete = function(){
                $thisOverlay.remove();
                $replacementOverlay.unwrap().children().unwrap();
                options.complete.call(self);
            };
            
            if(useCssTransitions){
                
                $thisOverlay.css({
                    "-webkit-transition": "opacity " + options.duration + "ms ease-in-out",
                    "-moz-transition": "opacity " + options.duration + "ms ease-in-out",
                    "-o-transition": "opacity " + options.duration + "ms ease-in-out",
                    "-ms-transition": "opacity " + options.duration + "ms ease-in-out",
                    "transition": "opacity " + options.duration + "ms ease-in-out"
                });
                
                setTimeout(function(){
                    $thisOverlay.css({opacity:0});
                    setTimeout(complete, options.duration);
                }, 0);
            }
            else{
                $thisOverlay.fadeOut(options.duration, complete);
            }
        });
    };
    
})(jQuery);
