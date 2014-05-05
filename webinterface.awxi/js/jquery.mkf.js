/*
 *  AWX - Ajax based Webinterface for XBMC
 *  Copyright (C) 2012  MKay, mizaki
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

/**********************
 * Requires:          *
 * ------------------ *
 *  jquery.class.js   *
 *  jquery.hotkeys.js *
 **********************/


// The Lib
var mkf = {};


(function($) {

  /*####################################################################*
   * Globals                                                            *
   *####################################################################*/

  /*******
   * String Functions
   *******/
  String.prototype.startsWith = function(pattern){
    if (pattern.length > this.length)
      return false;

    return this.substr(0, pattern.length) == pattern;
  };
  String.prototype.endsWith = function(pattern){
    if (pattern.length > this.length)
      return false;

    return this.substr(this.length-pattern.length, pattern.length) == pattern;
  };
  String.prototype.trim = function() {
    return this.rtrim().ltrim();
  };
  String.prototype.ltrim = function() {
    return this.replace(/^\s+/, '');
  };
  String.prototype.rtrim = function() {
    return this.replace(/\s+$/, '');
  };


  /**
   * To generate unique IDs.
   */
  var idGenerator = {
    id: 0,
    next: function() {
      return this.id++;
    }
  };



  /*####################################################################*
   * Program Structure: Pages, Menus, PageContextMenus, Location Bars   *
   *####################################################################*/

  /**
   * CLASSES
   */

  /**
   * This class describes a page.
   * A page can have subpages, a content, a title, a menuButtonText that will
   * be shown in Menus and a shortcut. Moreover handler-functions can be
   * defined which are called just before the page is shown or hidden.
   */
  var Page = Class.extend({
    // Constructor
    init: function(options) {
      this.subPages = [];
      this.parentPage = null;
      this.id = 'page' + idGenerator.next();

      // may be set by user (options-parameter)
      this.content = '';
      this.title = '';
      this.menuButtonText = '';
      this.shortcut =  '';
      this.contextMenu =  [];
      this.className = '';

      this.onShow = function() {};
      this.onHide = function() {};

      // TODO may return false to prevent show/hide
      // this.onShowRequest = function() {};
      // this.onHideRequest = function() {};

      $.extend(this, options);
    },

    getContextMenu: function() {
      return this.contextMenu;
    },

    setContextMenu: function(contextMenu) {
      this.contextMenu = contextMenu;
    },

    // Create a new page with the specified options and add it as subpage
    // of the current page.
    // The new page will be returned.
    addPage: function(options) {
      return this.addRawPage(new Page(options));
    },

    addRawPage: function(page) {
      if (page instanceof Page) {
        page.parentPage = this;
        this.subPages.push(page);
        return page;
      }
      return null;
    },

    removePage: function(page) {
      var del = -1;
      $.each(this.subPages, function(i, sp)  {
        if (sp == page) {
          del = i;
          return false;
        }
      });
      if (del != -1) {
        this.subPages.splice(del, 1);
      }
    }
  });

  /**
   * A TempPage is a page that has a short lifetime and is not included
   * in the program's page-structure.
   */
  var TempPage = Page.extend({
    init: function(options) {
      // onKillRequest may return false to prevent auto-killing the page.
      this.onKillRequest = function() { return true; }
      this._super(options);
    }
  });



  $.extend(mkf, {
    /**
     * Page Context Menu
     */
    pageContextMenu: {
      pageContextMenuContainer: [],
      currentPageContextMenu: null,

      addContainer: function(container) {
        this.pageContextMenuContainer.push(container);
      },

      /**
       * Fill all pageContextMenuContainer with the new context menu.
       */
      update: function(contextMenu) {
        this.currentPageContextMenu = contextMenu;

        // unbind all existing shortcuts for this shortcuthandler
        $(document).unbind('keydown', this.shortcutHandler);

        var $pageContextMenu = $('');

        if (contextMenu.length) {
          $pageContextMenu = $('<ul class="mkfPageContextMenu"></ul>');
        }

        $.each(contextMenu, function(i, menuItem)  {
          var li = $('<li><a href="" /></li>');
          li.find('a')
            .addClass(menuItem.icon)
            .attr('title', menuItem.title)
            .click(menuItem.onClick)

          if (menuItem.id) {
            li.attr('id', menuItem.id)
          }

          $pageContextMenu.append(li);

          // register shortcut
          if (menuItem.shortcut) {
            $(document).bind('keydown',
              menuItem.shortcut,
              $.proxy(mkf.pageContextMenu, "shortcutHandler"));
          }
        });

        $.each(this.pageContextMenuContainer, function(i, c) {
          c.empty().append($pageContextMenu.clone(true));
        });
      },

      shortcutHandler: function(e) {
        // execute onClick-Handler which belongs to the shortcut
        $.each(this.currentPageContextMenu, function(i, item) {
          if (item.shortcut && item.shortcut == e.data) {
            item.onClick();
          }
        });
      }
    }, // END mkf.pageContextMenu



    /**
     * Location Bar
     */
    locationBar: {
      locationBarContainer: [],

      addContainer: function(container) {
        this.locationBarContainer.push(container);
      },

      update: function(location) {
        var locationNum = location.length;

        // build location bars
        $.each(this.locationBarContainer, function(i, c) {
          $locationBar = $('<ul class="mkfLocationBar"></ul>');

          $.each(location, function(i, L) {
            var text = (c.options.clickable?
                  '<a href="">' + (c.options.prepend? c.options.prepend : '') + L.title + '</a>':
                  L.title);
            var classes = '';
            classes += (L.className? L.className : '');
            classes += (locationNum-1==i? ' last': '');
            classes = classes.ltrim();
            $li = $('<li' +
                (classes? ' class="' + classes + '"': '') +
                '>' + text + '</li>');
            if (c.options.clickable) {
              $li.find('a').click(function() {
                mkf.pages.showPage(L, c.options.autoKill);
                return false;
              });
            }
            $locationBar.append($li);
          });

          c.container.empty();
          c.container.append($locationBar);
        });
      }
    }, // END mkf.locationBar



    /**
     * Pages
     */
    pages: {
      rootPage: new Page(),
      activePage: null,

      addPage: function(options) {
        return this.rootPage.addPage(options);
      },

      /**
       * Show the specified Page or TempPage.
       * If the page contains a TempPage, the innermost TempPage will
       * be shown instead. (TempPages may be nested)
       * If autoKill is true then it will be requested to kill all
       * TempPages.
       */
      showPage: function(page, autoKill) {
        // automatically kill TempPages?
        if (typeof autoKill === 'undefined') {
          autoKill = false;
        }

        // is page already shown?
        if (this.activePage == page) {
          return;
        }

        if (this.activePage) {
          this.activePage.onHide()
        }

        // hide all pages
        $('.pageContent').hide();

        var toShow = page;

        // TempPages have higher priority than normal pages.
        // If TempPage exist then show it.
        // TempPages may be nested.
        while (this.hasTempPage(toShow)) {
          toShow = this.getTempPage(toShow);
          if (!autoKill) {
            break;
          }

          // try to kill TempPage
          if (toShow.onKillRequest()) {
            // kill allowed --> kill TempPage
            this.killTempPage(toShow);
            toShow = page;
          } else {
            // kill not allowed --> show TempPage
            break;
          }
        }

        this.activePage = toShow;

        toShow.onShow();

        /*if (toShow.parentPage.className == 'videos') {
          $('div.mfkPage, div.videos').show();
          $('.' + toShow.id).parent('.subPages').show();
          $('div.mfkPage, div.music').hide() 
        };
        if (toShow.parentPage.className == 'music') {
          $('div.mfkPage, div.music').show();
          $('.' + toShow.id).parent('.subPages').show();
          $('div.mfkPage, div.videos').hide() 
        };
        //console.log(toShow);
        $('#navigation ul.mkfMenu ul, ul.systemMenu ul').hide(); 
        $('.' + toShow.id).show();*/
        $('.' + toShow.id + ' > .pageContent').show();
        //$('.' + toShow.id + ' > .subPages').show();
        
        /*if (page.subPages == '') { $('.' + page.id).children('.subPages').hide(); console.log('empty subPages') };
        console.log($('.' + page.id).children('.subPages'));*/

        // Update menus + location bars
        mkf.pageContextMenu.update(toShow.contextMenu);
        mkf.locationBar.update(this.getPath(toShow));
        this.updateMenu(toShow);
      },

      createTempPage: function(ownerPage, options) {
        // create TempPage
        var page = ownerPage.addRawPage(new TempPage(options));

        var $newPage = $('<div class="mkfPage ' + page.id + '">' +
                '<div class="pageContent"></div>' +
                '<div class="subPages"></div></div>');
        $newPage.find('.pageContent')
          .append(page.content)
          .hide();
        $('.' + ownerPage.id)
          .children('.subPages').append($newPage);
          
          /*if (ownerPage.subPages == '') { $('.' + ownerPage.id).children('.subPages').hide(); console.log('empty subPages') };
          console.log(ownerPage);*/
        return page;
      },

      killTempPage: function(page) {
        // remove page from parents subPages
        page.parentPage.removePage(page);
        // remove from dom
        $('.' + page.id).remove();
      },

      showTempPage: function(tempPage) {
        if (this.activePage == tempPage.parentPage) {
          this.showPage(tempPage);
        }
      },

      closeTempPage: function(page) {
        this.killTempPage(page); // !!! no kill-request here

        // If the closed TempPage was active then show its parent.
        if (this.activePage == page) {
          this.showPage(page.parentPage);
        }
      },

      hasTempPage: function(page) {
        var has = false;
        $.each(page.subPages, function(i, sp) {
          if (sp instanceof TempPage) {
            has = true;
            return false;
          }
        });
        return has;
      },

      /**
       * Get innermost TempPage because TempPages may be nested.
       */
      getTempPage: function(page) {
        var result;
        var testPages = $.extend(true, [], page.subPages); // copy
        while (testPages.length) {
          var p = testPages.shift();
          if (p instanceof TempPage) {
            result = p;
            $.each(p.subPages, function(i, sp) {
              testPages.unshift(sp);
            });
          }
        }
        return result;
      },

      getPath: function(page) {
        var path = [];
        var p = page;
        while(p != mkf.pages.rootPage) {
          path.unshift(p);
          p = p.parentPage;
        }
        return path;
      },

      updateMenu: function(page) {
        var path = this.getPath(page);

        // reset
        $('.menuItem').removeClass('activeMenuItem');
        $('.menuItem a').removeClass('activeMenuItem');

        $.each(path, function(i, p) {
          $('.menuItem.' + p.id)
            .addClass('activeMenuItem')
            .children('a').addClass('activeMenuItem');
        });
      }
    } // END mkf.pages

  }); // END extend mkf



  /**
   * Create the containers for all pages (except TempPages).
   */
  $.fn.mkfPages = function() {
    var $mkfPages = $('<div class="mkfPages"></div>');

    // build dom-tree for all pages
    var todoPages = [mkf.pages.rootPage];
    while (todoPages.length) {
      var p = todoPages.shift();
      $.each(p.subPages, function(i, sp) {
        if (sp instanceof TempPage) {
          return true;
        }
        var $pagesContainer =
          (sp.parentPage != mkf.pages.rootPage?
          $mkfPages.find('.' + sp.parentPage.id)
            .children('.subPages'):
          $mkfPages);
        var $newPage = $('<div class="mkfPage ' + sp.id +
                (sp.className? ' ' + sp.className: '') +
                '">' +
                '<div class="pageContent"></div>' +
                '<div class="subPages"></div></div>');
        $newPage.find('.pageContent').append(sp.content);
        $newPage.appendTo($pagesContainer);
        todoPages.push(sp);
      });
    }

    this.each (function() {
      // Note:
      // $mkfPages is not cloned! So all pages will exist only once!
      $(this).append($mkfPages);
    });

    // hide all pages
    //$('.mkfPage').hide();
    $('.mkfPage .pageContent').hide();

  }; // END mkfPages



  /**
   * Create a menu.
   *
   * Options:
   *     root:    The page-object to start building the menu from.
   *           (Default: mkf.pages.rootPage)
   *     levels:    The number of menu-levels to show (0 to show all).
   *          (Default: 0)
   *     autoKill:  True: TempPages will be automatically killed if page
   *          should be shown.
   *          False: TempPages won't be killed if page should be shown.
   *          TempPages will be shown instead of the page.
   *          (Default: false)
   */
  $.fn.mkfMenu = function(options) {
    var settings  = {
      root: mkf.pages.rootPage,
      levels: 0,
      autoKill: false,
      className: ''
    };
    $.extend(settings, options);

    var $mkfMenu = $('<ul class="mkfMenu' +
            (settings.className? ' ' + settings.className: '') +
            '"></ul>');

    var todoPages = [{level: 1, page: settings.root}];
    while (todoPages.length) {
      var p = todoPages.shift();
      $.each(p.page.subPages, function(i, sp) {
        if (sp instanceof TempPage) {
          return true;
        }

        var $parentMenu =
          (sp.parentPage != settings.root?
          $mkfMenu.find('.menuItem.' + sp.parentPage.id).find('ul:first'):
          $mkfMenu);
          
        var $newMenuItem = $('<li class="menuItem ' + sp.id +
                  (sp.className? ' ' + sp.className: '') +
                  '">' +
                  '<a href="" class="menuItemLink">' +
                  sp.menuButtonText +
                  '</a>' +
                  '</li>');

        $newMenuItem.appendTo($parentMenu);
        $newMenuItem.children('a').click(function() {
            mkf.pages.showPage(sp, settings.autoKill);
            $('#navigation ul.mkfMenu .mkfSubMenu1, ul.systemMenu ul').hide();
            return false;
          });

        // The number of levels to show may be limited by
        // settings.levels.
        if (settings.levels <= 0 || settings.levels > p.level) {
          if (sp.subPages.length) {
            $newMenuItem.append('<ul class="mkfSubMenu' + p.level + '"></ul>');
          }
          todoPages.push({level: p.level+1, page: sp});
        }
        
        
      });
    }

    this.each (function() {
      $(this).append($mkfMenu.clone(true));
    });

  }; // END mkfMenu



  $.fn.mkfPageContextMenu = function() {
    this.each (function() {
      mkf.pageContextMenu.addContainer($(this));
    });
  }; // END mkfPageContextMenu



  $.fn.mkfLocationBar = function(options) {
    var settings = {
      clickable: false,
      autoKill: false
    }
    $.extend(settings, options);

    this.each (function() {
      mkf.locationBar.addContainer({
        container: $(this),
        'options': settings
      });
    });
  }; // END mkfLocationBar



  /*####################################################################*
   * Message Log                                                        *
   *####################################################################*/

  $.extend(mkf, {
    /**
     * Message Log
     */
    messageLog : {
      messageLogContainer: [],

      status : {"loading" : 0, "success" : 1, "error" : 3},

      addContainer: function(container) {
        this.messageLogContainer.push(container);
      },

      show: function(text, status, wait) {
        if (!status) {
          status = this.status.loading;
        }

        var messageHandle = idGenerator.next();

        var $msg = $('<div class="mkfMessage mkfMessage' +
                messageHandle + '">' + 
                '<div class="icon ' +
                this.getStatusFromEnum(status) +
                '"></div>' +
                '<div class="text"></div>' +
              '</div>');

        $.each(this.messageLogContainer, function(i, c) {
          c.append($msg.clone());
        });

        this.setText(messageHandle, text);

        // auto-hide
        if (wait) {
          this.hide(messageHandle, wait);
        }

        return messageHandle;
      },

      hide: function(messageHandle, wait, status) {
        if (status) {
          this.setStatus(messageHandle, status);
        }
        if (typeof wait === 'undefined' || wait < 0) {
          wait = 0;
        }

        window.setTimeout(
          function() {
            $('.mkfMessage'+messageHandle)
              .fadeOut('fast', function() {
                $(this).remove();
              });
          }
          , wait
        );
        
        //Close on click
         $('.mkfMessage'+messageHandle).click( function() {
          $(this).fadeOut('fast', function() { $(this).remove() } );
        });
      },

      appendTextAndHide: function(messageHandle, text, wait, status) {
        this.appendText(messageHandle, text);
        this.hide(messageHandle, wait, status);
      },

      setText: function(messageHandle, text) {
        $('.mkfMessage' + messageHandle + ' .text').text(text);
      },

      replaceTextAndHide: function(messageHandle, text, wait, status) {
        this.replaceText(messageHandle, text);
        this.hide(messageHandle, wait, status);
      },
      
      appendText: function(messageHandle, text) {
        $('.mkfMessage' + messageHandle + ' .text').append(text);
      },

      replaceText: function(messageHandle, text) {
        $('.mkfMessage' + messageHandle + ' .text').text(text);
      },
      
      getStatusFromEnum: function(status) {
        if (status == this.status.loading) return 'loading';
        else if (status == this.status.success) return 'success';
        else if (status == this.status.error) return 'error';
      },

      setStatus: function(messageHandle, status) {
        var newStatusClass = this.getStatusFromEnum(status);
        $('.mkfMessage' + messageHandle + ' .icon')
          .removeClass('loading success error')
          .addClass(newStatusClass);
      }
    } // END mkf.messageLog

  }); // END extend mkf


  $.fn.mkfMessageLog = function() {
    this.each (function() {
      mkf.messageLog.addContainer($(this));
    });
  }; // END messageLog



  /*####################################################################*
   * Dialog                                                             *
   *####################################################################*/

  $.extend(mkf, {
    dialog : {
      show: function(options) {
        var settings = {
          content      : '',
          classname    : '',
          loadingIcon    : false,
          closeButton    : true,
          closeButtonText  : ''
        };

        if (options) {
          $.extend(settings, options);
        }

        var dialogHandle = idGenerator.next();

        $('body').append(
          '<div id="mkfDialog' + dialogHandle +
          '" class="mkfOverlay" style="height: ' + $(document).height() + 'px">' +
            '<div class="dialog ' + settings.classname + '">' + 
            (settings.closeButton?
              '<a href="" class="close">' +
              settings.closeButtonText + '</a>':
              '') + 
            '<div class="dialogContent"></div>' + 
            '</div>' +
          '</div>');

        //Scale overlay height to avoid seeing behind the curtain
        $( window ).resize( xbmc.debouncer( function ( e ) {
            if ($(document).height() > $('#mkfDialog' + dialogHandle).height()) {
              $('#mkfDialog' + dialogHandle).css('height', $(document).height());
            } else {
              $('#mkfDialog' + dialogHandle).css('height', $(window).height());
            };
          } ) );
          
        if (settings.closeButton) {
          $('#mkfDialog' + dialogHandle + ' .close')
            .click(function () {
              mkf.dialog.close(dialogHandle); return false;
            });
        }

        this.setContent(dialogHandle,
                settings.content,
                settings.loadingIcon);

        return dialogHandle;
      },

      close: function(dialogHandle) {
        $('#mkfDialog'+dialogHandle).fadeOut('fast', function() {
          $(this).remove();
        });
      },

      setLoading: function(dialogHandle, loading) {
        if (loading) {
          $('#mkfDialog' + dialogHandle + ' .dialog')
            .addClass('loading');
        } else {
          $('#mkfDialog' + dialogHandle + ' .dialog')
            .removeClass('loading');
        }
      },

      setContent: function(dialogHandle, html, loading) {
        this.setLoading(dialogHandle, loading);
        $('#mkfDialog' + dialogHandle + ' .dialogContent').html(html).animate({ height: 'show', opacity: 1 }, 100, function() {
          //console.log($(this).height())
          if ( $('.mkfOverlay').height() < $(this).height() ) { $('.mkfOverlay').height( $(this).height() +20 ) };
        });
      },

      appendContent: function(dialogHandle, html, loading) {
        this.setLoading(dialogHandle, loading);
        $('#mkfDialog' + dialogHandle + ' .dialogContent').append(html);
      },

      addClass: function(dialogHandle, addClass) {
        $('#mkfDialog'+dialogHandle + ' .dialog').addClass(addClass);
      }

    } // END mkf.dialog

  }); // END extend mkf



  /*####################################################################*
   * Settings stored in Cookies                                         *
   *####################################################################*/

  $.extend(mkf, {
    cookieSettings: {
      settings: null,

      load: function() {
        this.settings = {}; // clear settings

        if (document.cookie) {
          var ss = document.cookie.split(';');
          $.each(ss, function(i, s)  {
            var tmp = s.split('=');
            if (tmp.length == 2) {
              mkf.cookieSettings.settings[tmp[0].trim()] = tmp[1].trim();
            }
          });
        }
      },

      add: function(setting, value) {
        var d = new Date((new Date()).getTime() +1000*60*60*24*365);
        document.cookie = setting + '=' + value + '; expires=' +
                  d.toGMTString() + ';';
        this.load();
      },

      get: function(setting, defaultVal) {
        if (this.settings == null) {
          this.load(); // settings were not loaded yet
        }

        if (this.settings[setting]) {
          return this.settings[setting]
        }
        if (defaultVal) {
          return defaultVal;
        }
        return null;
      }
    }
  });



  /*####################################################################*
   * ScriptLoader                                                       *
   *####################################################################*/

  $.extend(mkf, {
    scriptLoader: {
      load: function(options) {
        $.ajax({
          type: "GET",
          url: options.script,
          data: null,
          success: function(data, textStatus) {
            options.onload();
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            options.onerror();
          },
          beforeSend: function(xhr) {
            // Fix for FireFox 3 to prevent "malformed"-message
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType("text/plain");
            }
          },
          dataType: "script"
        });
      }
    }
  });



  /*####################################################################*
   * Languages                                                          *
   *####################################################################*/

  $.extend(mkf, {
    lang: {
      languages: {},
      curLang: '',
      langMsg: '',

      add: function(newLang) {
        // e.g. newLang = {langage:'German', short:'de', author:'MKay', values: {...}}
        this.languages[newLang.short] = newLang;
      },

      get: function(key, context) {
        if (!this.curLang) {
          return 'ERROR:LANGUAGE_UNDEFINED';
        } else if (context) {
          return this.langMsg.pgettext(context, key);
        } else {
          return this.langMsg.gettext(key);
        };
        
      },

      setLanguage: function(lang, callback) {
        this.curLang = lang;
        var ld = 'lang/' + lang + '.json';
        $.getJSON(ld, function(data) {
          mkf.lang.langMsg = new Jed({
            locale_data: { "messages": data }, 
            "missing_key_callback" : function(key) {
            console.error(key)
            }
          }); 
          callback(true)
        })
        .error(function() { callback(false) });
      },

      getLanguages: function(callback) {
        //With Gotham have to read a static list
        $.getJSON('lang/manifest.json', function(data) {
          callback(data);
        });
      }
    }
  });

})(jQuery);
