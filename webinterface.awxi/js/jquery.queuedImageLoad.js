/*
 *  Queued Image Loader
 *  Copyright (C) 2010  MKay
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

(function($) {

  $.queuedImageLoader = {
    maxLoading  :  1,  /* number of parallel image-loadings */
    waitTime  :  50,  /* milliseconds to wait before loading next image */
    loading    :  0,
    queue    :  [],

    load : function(element, src) {
      this.queue.push({"element" : element, "src" : src});
      this.loadNext();
    },

    loadNext : function() {
      if (this.loading < this.maxLoading &&
        this.queue.length > 0) {

        this.loading++;
        var next = this.queue.shift();

        $(next.element)
          .bind("load", $.proxy($.queuedImageLoader, "onLoaded"))
          .bind("error", $.proxy($.queuedImageLoader, "onLoaded"))
          .attr("src", next.src);
      }
    },

    onLoaded : function() {
      this.loading--;
      setTimeout($.proxy(this, "loadNext"), this.waitTime);
    }

  };

  $.fn.queuedImageLoad = function(options) {
    var settings = {
      src  :  ''
    }

    if (options) {
      $.extend(settings, options);
    }

    this.each(function() {
      $.queuedImageLoader.load(this, settings.src);
    });
  };

})(jQuery);
