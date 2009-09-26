/*
 * jQuery gridBuilder
 * Version 0.3 (24/10/2009)
 *
 * Copyright (c) 2009 Kilian Valkhof (kilianvalkhof.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/*
 * @todo add a floating data panel which you can input all settings with
 * @todo make floating data panel spew out js code too
 */
  "use strict";
(function ($) {
  $.fn.gridBuilder = function (useroptions) {
    return this.each(function () {
      var $this = $(this);

      //init options
      var options = $.extend(
        {width: $this.width(), height: $this.height(), id: this.id},
        $.fn.gridBuilder.defaults,
        useroptions
      );

      // build canvas and context
      var gridCanvas = $.fn.gridBuilder.makeCanvas(options);
      var gridContext = gridCanvas.getContext("2d");

      // draw it all
      $.fn.gridBuilder.drawVertical(gridContext, options);
      $.fn.gridBuilder.drawHorizontal(gridContext, options);
      $.fn.gridBuilder.setBackground(this, gridCanvas, options);

      // redraw on resize
      function reDraw() {
        $.fn.gridBuilder.destroy($this, true);
        $this.gridBuilder(useroptions);
      }

      $(window).bind('resize', function () {
        if (!options.resizeTimer) {
          options.resizeTimer = setTimeout(reDraw, 100);
        }
      });
    });
  };

  //Provide defaults
  $.fn.gridBuilder.defaults = {
    color:          '#ddd',
    secondaryColor: '#f1f1f1',
    vertical:       18,
    horizontal:     140,
    gutter:         40,
    resizeTimer:    null
  };

  // build a canvas the size of the chosen element
  $.fn.gridBuilder.makeCanvas = function (options) {
    var canvas = document.createElement('canvas');
    canvas.id = "gridCanvasFor" + options.id;
    canvas.height = options.height;
    canvas.width = options.width;
    return canvas;
  };

  // draw the vertical lines
  $.fn.gridBuilder.drawVertical = function (gridContext, options) {
    if (options.horizontal) {
      gridContext.beginPath();
      for (var x = options.horizontal - 0.5; x <= options.width; x += options.horizontal) {
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, options.height);
        x += options.gutter;
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, options.height);
      }
      $.fn.gridBuilder.draw(gridContext, options.color);

      //draw secondary lines
      if (options.secondaryColor) {
        gridContext.beginPath();
        for (var xs = (options.horizontal / 2) - 0.5; xs <= options.width; xs += options.horizontal) {
          gridContext.moveTo(xs, 0);
          gridContext.lineTo(xs, options.height);
          xs += options.gutter;
        }
        $.fn.gridBuilder.draw(gridContext, options.secondaryColor);
      }
    }
  };

  // draw the horizontal lines
  $.fn.gridBuilder.drawHorizontal = function (gridContext, options) {
    if (options.vertical) {
      gridContext.beginPath();
      for (var y = options.vertical - 0.5; y <= options.height; y += options.vertical) {
        gridContext.moveTo(0, y);
        gridContext.lineTo(options.width, y);
      }
      $.fn.gridBuilder.draw(gridContext, options.color);

      //draw secondary lines
      if (options.secondaryColor) {
        gridContext.beginPath();
        for (var ys = (options.vertical / 2) - 0.5; ys <= options.height; ys += options.vertical) {
          gridContext.moveTo(0, ys);
          gridContext.lineTo(options.width, ys);
        }
        $.fn.gridBuilder.draw(gridContext, options.secondaryColor);
      }
    }
  };

  // draw elements
  $.fn.gridBuilder.draw = function (gridContext, color) {
    gridContext.strokeStyle = color;
    gridContext.stroke();
  };

  // set as background
  $.fn.gridBuilder.setBackground = function (element, gridCanvas, options) {
    var canvasData = gridCanvas.toDataURL();
    $(element).css("background-image", 'url(' + canvasData + ')');
  };

  // remove canvas element, get rid of background image
  $.fn.gridBuilder.destroy = function (element, redraw) {
    if (!redraw) {
      element.css("background-image", 'none');
    }
    $("gridCanvasFor" + element.id).remove();
  };

}(jQuery));

