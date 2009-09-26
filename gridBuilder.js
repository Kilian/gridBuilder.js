/*
 * jQuery gridBuilder
 * Version 1.1 (26/10/2009)
 *
 * Copyright (c) 2009 Kilian Valkhof (kilianvalkhof.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
"use strict";
(function ($) {
  $.fn.gridBuilder = function (useroptions) {
    return this.each(function () {
      var $this = $(this);

      //init options
      var options = $.extend(
        {id: this.id},
        $.fn.gridBuilder.defaults,
        useroptions
      );

      // get width and height of repeating block
      options.width = options.horizontal + options.gutter;
      options.height = options.vertical;

      // build canvas and context
      var gridCanvas = $.fn.gridBuilder.makeCanvas(options);
      var gridContext = gridCanvas.getContext("2d");

      // draw all lines and place them as background
      $.fn.gridBuilder.drawVertical(gridContext, options);
      $.fn.gridBuilder.drawHorizontal(gridContext, options);
      $.fn.gridBuilder.setBackground(this, gridCanvas, options);
    });
  };

  //Provide defaults
  $.fn.gridBuilder.defaults = {
    color:          '#eee',
    secondaryColor: '#f9f9f9',
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
        $.fn.gridBuilder.drawSingleLine(gridContext, x, 0, x, options.height);
        if (options.gutter > 0) {
          x += options.gutter;
          $.fn.gridBuilder.drawSingleLine(gridContext, x, 0, x, options.height);
        }
      }
      $.fn.gridBuilder.draw(gridContext, options.color);

      //draw secondary lines
      if (options.secondaryColor) {
        gridContext.beginPath();
        for (var xs = (options.horizontal / 2) - 0.5; xs <= options.width; xs += options.horizontal) {
          $.fn.gridBuilder.drawSingleLine(gridContext, xs, 0, xs, options.height);
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
        $.fn.gridBuilder.drawSingleLine(gridContext, 0, y, options.width, y);
      }
      $.fn.gridBuilder.draw(gridContext, options.color);

      //draw secondary lines
      if (options.secondaryColor) {
        gridContext.beginPath();
        for (var ys = (options.vertical / 2) - 0.5; ys <= options.height; ys += options.vertical) {
          $.fn.gridBuilder.drawSingleLine(gridContext, 0, ys, options.width, ys);
        }
        $.fn.gridBuilder.draw(gridContext, options.secondaryColor);
      }
    }
  };

  // draw single line
  $.fn.gridBuilder.drawSingleLine = function (gridContext, x, y,newx,newy) {
    gridContext.moveTo(x, y);
    gridContext.lineTo(newx, newy);
  }
  // draw elements on the canvas
  $.fn.gridBuilder.draw = function (gridContext, color) {
    gridContext.strokeStyle = color;
    gridContext.stroke();
  };

  // set as background
  $.fn.gridBuilder.setBackground = function (element, gridCanvas, options) {
    var canvasData = gridCanvas.toDataURL();
    $(element).css({
      "background-image": "url(" + canvasData + ")",
      "background-repeat":"repeat"
    });
  };

  // remove canvas element, get rid of background image
  $.fn.gridBuilder.destroy = function (element, redraw) {
      if (!redraw) { element.css({"background-image": "none"}); }
      $("gridCanvasFor" + element.id).remove();
  };
}(jQuery));

