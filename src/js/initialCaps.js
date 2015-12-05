/**
 * initialCaps
 *
 * Add a span to make correct french lettrine on each first paragraph in
 * a container
 * @author  Damien Senger <hi@hiwelo.co>
 * @version 1.0
 */

;(function ($) {
  'use strict';

  $.initialCaps = function (container, options) {
    var base = this;

    base.$container = $(container); // jQuery version of this element
    base.container = container; // DOM version of this element

    // Add a reverse reference to the DOM object
    base.$container.data('initialCaps', base);

    /**
     * Plugin initialization
     * @return {void}
     */
    base.init = function () {
      base.options = $.extend({}, $.initialCaps.defaultOptions, options);

      var containerFirstChild = base.options.containerFirstChild,
          targets = base.options.target;

      if (containerFirstChild) {
        var $item = base.$container.children().first(),
            controlItem = base.controlItem($item);

        if (controlItem) {
          var firstElementSpecificClassName;
          if (base.options.firstElementSpecificClass) {
            firstElementSpecificClassName = base.options.firstElementSpecificClassName;
          }
          base.doInitialCaps($item, firstElementSpecificClassName);
        }
      }

      if (base.options.onlyFirstChild === false) {
        return $.each(targets, function() {
          var $elements = base.$container.children(this);

          if ($elements.length) {
            $elements.each(function () {
              var $item = $(this).next(),
                  controlItem = base.controlItem($item);

              if (controlItem) {
                base.doInitialCaps($item);
              }
            });
          }
        });
      }
    };

    /**
     * Control if an item exist and if the container have a minimal height
     * @param  {object} $item jQuery DOM object
     * @return {bool}         controlled item
     */
    base.controlItem = function ($item) {
      var tag = $item.prop('tagName').toLowerCase(),
          targetItems = base.options.targetItems;

      if ($.inArray(tag, targetItems) !== -1) {
        var heightControl = base.blockHeightControl($item);

        if (heightControl) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /**
     * This method verify if the number of lines is superior at the minimal asked
     * number of lines
     * @param  {object} block Asked DOM object
     * @return {bool}         true if the number is superior or equal
     */
    base.blockHeightControl = function ($block) {
      var height = parseInt($block.innerHeight()),
          boxSizing = $block.css('box-sizing'),
          lineHeight = parseInt($block.css('line-height')),
          paddingTop = parseInt($block.css('padding-top')),
          paddingBottom = parseInt($block.css('padding-bottom')),
          contentHeight = height,
          linesCounter = 0;

      if (boxSizing === 'border-box' || boxSizing === 'padding-box') {
        contentHeight = contentHeight - paddingTop - paddingBottom;
      }

      linesCounter = contentHeight / lineHeight;

      if (linesCounter >= base.options.minLines) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * Get the first word of a text
     * @param  {object} $element jQuery DOM object
     * @return {string}          first word
     */
    base.firstWord = function ($element) {
      var text = $element.text(),
          firstWord = text.slice(0, text.indexOf(' '));

      return firstWord;
    };

    /**
     * Wrap a text into a html element
     * @param  {object} $element      jQuery DOM element
     * @param  {string} regex         text regex selection
     * @param  {string} specificClass specific class for this new html element
     * @return {void}
     */
    base.wrapping = function ($element, regex, specificClass) {
      var initialCapsTag = base.options.initialCapsTag,
          initialCapsClass = base.options.initialCapsClass,
          openingTag = '<' + initialCapsTag + ' class="' + initialCapsClass + ' ' + specificClass +'">',
          closingTag = '</span>',
          newHtml = $element.html().replace(regex, openingTag + '$1' + closingTag);

      $element.html(newHtml);
    };

    /**
     * Check the initial word and create an initial cap
     * @param  {object} $element      jQuery DOM object
     * @param  {string} specificClass specific class for this initial cap
     * @return {void}
     */
    base.doInitialCaps = function ($element, specificClass) {
      var firstWord = base.firstWord($element),
          sizeInitialWord = firstWord.length,
          firstChar = firstWord.slice(0, 1),
          firstCharType = $.type(firstChar);

      if (firstCharType === 'int') {

      } else {
        var regex;
        if (sizeInitialWord <= base.options.entireWordMaxSize) {
          regex = /^(\w+)/;
          base.wrapping($element, regex, specificClass);
        } else {
          regex = /^([A-Za-z])/;
          base.wrapping($element, regex, specificClass);
        }
      }
    };

    // run initializer
    base.init();
  };

  $.initialCaps.defaultOptions = {
    containerFirstChild: true,
    onlyFirstChild: false,
    firstElementSpecificClass: true,
    firstElementSpecificClassName: 'initial-caps-first',
    target: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'],
    targetItems: ['p'],
    initialCapsTag: 'span',
    initialCapsClass: 'initial-caps',
    minLines: 4,
    entireWordMaxSize: 2
  };

  $.fn.initialCaps = function (options) {
    return this.each(function () {
      (new $.initialCaps(this, options));
    });
  };

  $('.js-initial-caps').initialCaps();
})(jQuery);
