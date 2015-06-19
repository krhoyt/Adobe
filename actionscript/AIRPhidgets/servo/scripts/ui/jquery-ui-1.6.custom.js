/*
 * jQuery UI 1.6
 *
 * Copyright (c) 2008 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
;(function($) {

var _remove = $.fn.remove,
	isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);

//Helper functions and ui object
$.ui = {

	version: "1.6",

	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set) { return; }

			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	},

	contains: function(a, b) {
		var safari2 = $.browser.safari && $.browser.version < 522;
	    if (a.contains && !safari2) {
	        return a.contains(b);
	    }
	    if (a.compareDocumentPosition)
	        return !!(a.compareDocumentPosition(b) & 16);
	    while (b = b.parentNode)
	          if (b == a) return true;
	    return false;
	},

	cssCache: {},
	css: function(name) {
		if ($.ui.cssCache[name]) { return $.ui.cssCache[name]; }
		var tmp = $('<div class="ui-gen">').addClass(name).css({position:'absolute', top:'-5000px', left:'-5000px', display:'block'}).appendTo('body');

		//if (!$.browser.safari)
			//tmp.appendTo('body');

		//Opera and Safari set width and height to 0px instead of auto
		//Safari returns rgba(0,0,0,0) when bgcolor is not set
		$.ui.cssCache[name] = !!(
			(!(/auto|default/).test(tmp.css('cursor')) || (/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) ||
			!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
		);
		try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
		return $.ui.cssCache[name];
	},

	hasScroll: function(el, a) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ($(el).css('overflow') == 'hidden') { return false; }

		var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
			has = false;

		if (el[scroll] > 0) { return true; }

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[scroll] = 1;
		has = (el[scroll] > 0);
		el[scroll] = 0;
		return has;
	},

	isOverAxis: function(x, reference, size) {
		//Determines when x coordinate is over "b" element axis
		return (x > reference) && (x < (reference + size));
	},

	isOver: function(y, x, top, left, height, width) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
	},

	keyCode: {
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}

};

// WAI-ARIA normalization
if (isFF2) {
	var attr = $.attr,
		removeAttr = $.fn.removeAttr,
		ariaNS = "http://www.w3.org/2005/07/aaa",
		ariaState = /^aria-/,
		ariaRole = /^wairole:/;

	$.attr = function(elem, name, value) {
		var set = value !== undefined;

		return (name == 'role'
			? (set
				? attr.call(this, elem, name, "wairole:" + value)
				: (attr.apply(this, arguments) || "").replace(ariaRole, ""))
			: (ariaState.test(name)
				? (set
					? elem.setAttributeNS(ariaNS,
						name.replace(ariaState, "aaa:"), value)
					: attr.call(this, elem, name.replace(ariaState, "aaa:")))
				: attr.apply(this, arguments)));
	};

	$.fn.removeAttr = function(name) {
		return (ariaState.test(name)
			? this.each(function() {
				this.removeAttributeNS(ariaNS, name.replace(ariaState, ""));
			}) : removeAttr.call(this, name));
	};
}

//jQuery plugins
$.fn.extend({

	remove: function() {
		// Safari has a native remove event which actually removes DOM elements,
		// so we have to use triggerHandler instead of trigger (#3037).
		$("*", this).add(this).each(function() {
			$(this).triggerHandler("remove");
		});
		return _remove.apply(this, arguments );
	},

	enableSelection: function() {
		return this
			.attr('unselectable', 'off')
			.css('MozUserSelect', '')
			.unbind('selectstart.ui');
	},

	disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},

	scrollParent: function() {

		var scrollParent;
		if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;


	}

});


//Additional selectors
$.extend($.expr[':'], {

	data: function(a, i, m) {
		return $.data(a, m[3]);
	},

	// TODO: add support for object, area
	tabbable: function(a, i, m) {

		var nodeName = a.nodeName.toLowerCase();
		function isVisible(element) {
			return !($(element).is(':hidden') || $(element).parents(':hidden').length);
		}

		return (
			// in tab order
			a.tabIndex >= 0 &&

			( // filter node types that participate in the tab order

				// anchor tag
				('a' == nodeName && a.href) ||

				// enabled form element
				(/input|select|textarea|button/.test(nodeName) &&
					'hidden' != a.type && !a.disabled)
			) &&

			// visible on page
			isVisible(a)
		);

	}

});


// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
function getter(namespace, plugin, method, args) {
	function getMethods(type) {
		var methods = $[namespace][plugin][type] || [];
		return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
	}

	var methods = getMethods('getter');
	if (args.length == 1 && typeof args[0] == 'string') {
		methods = methods.concat(getMethods('getterSetter'));
	}
	return ($.inArray(method, methods) != -1);
}

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];

	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);

		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		// handle getter methods
		if (isMethodCall && getter(namespace, name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args)
				: undefined);
		}

		// handle initialization and non-getter methods
		return this.each(function() {
			var instance = $.data(this, name);

			// constructor
			(!instance && !isMethodCall &&
				$.data(this, name, new $[namespace][name](this, options)));

			// method call
			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};

	// create widget constructor
	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;

		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = namespace + '-' + name;

		this.options = $.extend({},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);

		this.element = $(element)
			.bind('setData.' + name, function(event, key, value) {
				return self._setData(key, value);
			})
			.bind('getData.' + name, function(event, key) {
				return self._getData(key);
			})
			.bind('remove', function() {
				return self.destroy();
			});

		this._init();
	};

	// add widget prototype
	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);

	// TODO: merge getter and getterSetter properties from widget prototype
	// and plugin prototype
	$[namespace][name].getterSetter = 'option';
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName);
	},

	option: function(key, value) {
		var options = key,
			self = this;

		if (typeof key == "string") {
			if (value === undefined) {
				return this._getData(key);
			}
			options = {};
			options[key] = value;
		}

		$.each(options, function(key, value) {
			self._setData(key, value);
		});
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;

		if (key == 'disabled') {
			this.element[value ? 'addClass' : 'removeClass'](
				this.widgetBaseClass + '-disabled');
		}
	},

	enable: function() {
		this._setData('disabled', false);
	},
	disable: function() {
		this._setData('disabled', true);
	},

	_trigger: function(type, event, data) {
		var eventName = (type == this.widgetEventPrefix
			? type : this.widgetEventPrefix + type);
		event = event || $.event.fix({ type: eventName, target: this.element[0] });
		return this.element.triggerHandler(eventName, [event, data], this.options[type]);
	}
};

$.widget.defaults = {
	disabled: false
};


/** Mouse Interaction Plugin **/

$.ui.mouse = {
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if(self._preventClickEvent) {
					self._preventClickEvent = false;
					return false;
				}
			});

		// Prevent text selection in IE
		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);

		// Restore text selection in IE
		($.browser.msie
			&& this.element.attr('unselectable', this._mouseUnselectable));
	},

	_mouseDown: function(event) {
		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		// preventDefault() is used to prevent the selection of text here -
		// however, in Safari, this causes select boxes not to be selectable
		// anymore, so this fix is needed
		if(!$.browser.safari) event.preventDefault();
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;
			this._preventClickEvent = true;
			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 1,
	delay: 0
};

})(jQuery);
/*
 * jQuery UI Slider 1.6
 *
 * Copyright (c) 2008 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.fn.unwrap = $.fn.unwrap || function(expr) {
  return this.each(function(){
     $(this).parents(expr).eq(0).after(this).remove();
  });
};

$.widget("ui.slider", {

	_init: function() {

		var self = this;
		this.element.addClass("ui-slider");
		this._initBoundaries();

		// Initialize mouse and key events for interaction
		this.handle = $(this.options.handle, this.element);
		if (!this.handle.length) {
			self.handle = self.generated = $(self.options.handles || [0]).map(function() {
				var handle = $("<div/>").addClass("ui-slider-handle").appendTo(self.element);
				if (this.id)
					handle.attr("id", this.id);
				return handle[0];
			});
		}

		var handleclass = function(el) {
			this.element = $(el);
			this.element.data("mouse", this);
			this.options = self.options;

			this.element.bind("mousedown", function() {
				if(self.currentHandle) this.blur(self.currentHandle);
				self._focus(this, true);
			});

			this._mouseInit();
		};

		$.extend(handleclass.prototype, $.ui.mouse, {
			_mouseCapture: function() { return true; },
			_mouseStart: function(event) { return self._start.call(self, event, this.element[0]); },
			_mouseDrag: function(event) { return self._drag.call(self, event, this.element[0]); },
			_mouseStop: function(event) { return self._stop.call(self, event, this.element[0]); },
			trigger: function(event) { this._mouseDown(event); }
		});

		$(this.handle)
			.each(function() {
				new handleclass(this);
			})
			.wrap('<a href="#" style="outline:none;border:none;"></a>')
			.parent()
				.bind('click', function() { return false; })
				.bind('focus', function(event) { self._focus(this.firstChild); })
				.bind('blur', function(event) { self._blur(this.firstChild); })
				.bind('keydown', function(event) { if(!self.options.noKeyboard) return self._keydown(event.keyCode, this.firstChild); })
		;

		// Bind the click to the slider itself
		this.element.bind('mousedown.slider', function(event) {

			if($(event.target).is('.ui-slider-handle')) return;

			//Go to the actual clicked posiion, apply a click
			self._click.apply(self, [event]);

			//initiate a handle drag, so we can click+drag somewhere
			 self.currentHandle.data("mouse").trigger(event);

			 //This is for always triggering the change event
			self.firstValue = self.firstValue + 1;

		});

		// Move the first handle to the startValue
		$.each(this.options.handles || [], function(index, handle) {
			self.moveTo(handle.start, index, true);
		});
		if (!isNaN(this.options.startValue))
			this.moveTo(this.options.startValue, 0, true);

		this.previousHandle = $(this.handle[0]); //set the previous handle to the first to allow clicking before selecting the handle
		if(this.handle.length == 2 && this.options.range) this._createRange();

	},

	destroy: function() {

		this.element
			.removeClass("ui-slider ui-slider-disabled")
			.removeData("slider")
			.unbind(".slider");

		if(this.handle && this.handle.length) {
			this.handle
				.unwrap("a");
			this.handle.each(function() {
				var mouse = $(this).data("mouse");
				mouse && mouse._mouseDestroy();
			});
		}

		this.generated && this.generated.remove();

	},

	_start: function(event, handle) {

		var o = this.options;
		if(o.disabled) return false;

		// Prepare the outer size
		this.actualSize = { width: this.element.outerWidth() , height: this.element.outerHeight() };

		// This is a especially ugly fix for strange blur events happening on mousemove events
		if (!this.currentHandle)
			this._focus(this.previousHandle, true);

		this.offset = this.element.offset();

		this.handleOffset = this.currentHandle.offset();
		this.clickOffset = { top: event.pageY - this.handleOffset.top, left: event.pageX - this.handleOffset.left };

		this.firstValue = this.value();

		this._propagate('start', event);
		this._drag(event, handle);
		return true;

	},

	_drag: function(event, handle) {

		var o = this.options;

		var position = { top: event.pageY - this.offset.top - this.clickOffset.top, left: event.pageX - this.offset.left - this.clickOffset.left};
		if(!this.currentHandle) this._focus(this.previousHandle, true); //This is a especially ugly fix for strange blur events happening on mousemove events

		position.left = this._translateLimits(position.left, "x");
		position.top = this._translateLimits(position.top, "y");

		if (o.stepping.x) {
			var value = this._convertValue(position.left, "x");
			value = this._round(value / o.stepping.x) * o.stepping.x;
			position.left = this._translateValue(value, "x");
		}
		if (o.stepping.y) {
			var value = this._convertValue(position.top, "y");
			value = this._round(value / o.stepping.y) * o.stepping.y;
			position.top = this._translateValue(value, "y");
		}

		position.left = this._translateRange(position.left, "x");
		position.top = this._translateRange(position.top, "y");

		if(o.axis != "vertical") this.currentHandle.css({ left: position.left });
		if(o.axis != "horizontal") this.currentHandle.css({ top: position.top });

		//Store the slider's value
		this.currentHandle.data("mouse").sliderValue = {
			x: this._round(this._convertValue(position.left, "x")) || 0,
			y: this._round(this._convertValue(position.top, "y")) || 0
		};

		if (this.rangeElement)
			this._updateRange();
		this._propagate('slide', event);
		return false;

	},

	_stop: function(event) {

		this._propagate('stop', event);

		if (this.firstValue != this.value())
			this._propagate('change', event);

		// This is a especially ugly fix for strange blur events happening on mousemove events
		this._focus(this.currentHandle, true);

		return false;

	},

	_round: function(value) {

		return this.options.round ? parseInt(value,10) : parseFloat(value);

	},

	_setData: function(key, value) {

		$.widget.prototype._setData.apply(this, arguments);

		if (/min|max|steps/.test(key)) {
			this._initBoundaries();
		}

		if(key == "range") {
			value ? this.handle.length == 2 && this._createRange() : this._removeRange();
		}

	},

	_initBoundaries: function() {

		var element = this.element[0], o = this.options;
		this.actualSize = { width: this.element.outerWidth() , height: this.element.outerHeight() };

		$.extend(o, {
			axis: o.axis || (element.offsetWidth < element.offsetHeight ? 'vertical' : 'horizontal'),
			max: !isNaN(parseInt(o.max,10)) ? { x: parseInt(o.max, 10), y: parseInt(o.max, 10) } : ({ x: o.max && o.max.x || 100, y: o.max && o.max.y || 100 }),
			min: !isNaN(parseInt(o.min,10)) ? { x: parseInt(o.min, 10), y: parseInt(o.min, 10) } : ({ x: o.min && o.min.x || 0, y: o.min && o.min.y || 0 })
		});
		//Prepare the real maxValue
		o.realMax = {
			x: o.max.x - o.min.x,
			y: o.max.y - o.min.y
		};
		//Calculate stepping based on steps
		o.stepping = {
			x: o.stepping && o.stepping.x || parseInt(o.stepping, 10) || (o.steps ? o.realMax.x/(o.steps.x || parseInt(o.steps, 10) || o.realMax.x) : 0),
			y: o.stepping && o.stepping.y || parseInt(o.stepping, 10) || (o.steps ? o.realMax.y/(o.steps.y || parseInt(o.steps, 10) || o.realMax.y) : 0)
		};

	},

	_keydown: function(keyCode, handle) {

		if (this.options.disabled)
			return;

		var k = keyCode;
		if(/(33|34|35|36|37|38|39|40)/.test(k)) {
			var o = this.options, xpos, ypos;
			if (/(35|36)/.test(k)) {
				xpos = (k == 35) ? o.max.x : o.min.x;
				ypos = (k == 35) ? o.max.y : o.min.y;
			} else {
				var oper = /(34|37|40)/.test(k) ? "-=" : "+=";
				var step = /(37|38|39|40)/.test(k) ? "_oneStep" : "_pageStep";
				xpos = oper + this[step]("x");
				ypos = oper + this[step]("y");
			}
			this.moveTo({
				x: xpos,
				y: ypos
			}, handle);
			return false;
		}
		return true;

	},

	_focus: function(handle,hard) {

		this.currentHandle = $(handle).addClass('ui-slider-handle-active');

		if (hard)
			this.currentHandle.parent()[0].focus();

	},

	_blur: function(handle) {

		$(handle).removeClass('ui-slider-handle-active');

		if(this.currentHandle && this.currentHandle[0] == handle) {
			this.previousHandle = this.currentHandle;
			this.currentHandle = null;
		};

	},

	_click: function(event) {

		// This method is only used if:
		// - The user didn't click a handle
		// - The Slider is not disabled
		// - There is a current, or previous selected handle (otherwise we wouldn't know which one to move)

		var pointer = [event.pageX, event.pageY];

		var clickedHandle = false;
		this.handle.each(function() {
			if(this == event.target)
				clickedHandle = true;
		});
		if (clickedHandle || this.options.disabled || !(this.currentHandle || this.previousHandle))
			return;

		// If a previous handle was focussed, focus it again
		if (!this.currentHandle && this.previousHandle)
			this._focus(this.previousHandle, true);

		// propagate only for distance > 0, otherwise propagation is done my drag
		this.offset = this.element.offset();

		this.moveTo({
			y: this._convertValue(event.pageY - this.offset.top - this.currentHandle[0].offsetHeight/2, "y"),
			x: this._convertValue(event.pageX - this.offset.left - this.currentHandle[0].offsetWidth/2, "x")
		}, null, !this.options.distance);

	},

	_createRange: function() {

		if(this.rangeElement) return;
		this.rangeElement = $('<div></div>')
			.addClass('ui-slider-range')
			.css({ position: 'absolute' })
			.appendTo(this.element);
		this._updateRange();

	},

	_removeRange: function() {

		this.rangeElement.remove();
		this.rangeElement = null;

	},

	_updateRange: function() {

		var prop = this.options.axis == "vertical" ? "top" : "left";
		var size = this.options.axis == "vertical" ? "height" : "width";

		this.rangeElement.css(prop, (this._round($(this.handle[0]).css(prop)) || 0) + this._handleSize(0, this.options.axis == "vertical" ? "y" : "x")/2);
		this.rangeElement.css(size, (this._round($(this.handle[1]).css(prop)) || 0) - (this._round($(this.handle[0]).css(prop)) || 0));

	},

	_getRange: function() {

		return this.rangeElement ? this._convertValue(this._round(this.rangeElement.css(this.options.axis == "vertical" ? "height" : "width")), this.options.axis == "vertical" ? "y" : "x") : null;

	},

	_handleIndex: function() {

		return this.handle.index(this.currentHandle[0]);

	},

	value: function(handle, axis) {

		if(this.handle.length == 1) this.currentHandle = this.handle;
		if(!axis) axis = this.options.axis == "vertical" ? "y" : "x";

		var curHandle = $(handle != undefined && handle !== null ? this.handle[handle] || handle : this.currentHandle);

		if(curHandle.data("mouse").sliderValue) {
			return this._round(curHandle.data("mouse").sliderValue[axis]);
		} else {
			return this._round(((this._round(curHandle.css(axis == "x" ? "left" : "top")) / (this.actualSize[axis == "x" ? "width" : "height"] - this._handleSize(handle,axis))) * this.options.realMax[axis]) + this.options.min[axis]);
		}

	},

	_convertValue: function(value,axis) {

		return this.options.min[axis] + (value / (this.actualSize[axis == "x" ? "width" : "height"] - this._handleSize(null,axis))) * this.options.realMax[axis];

	},

	_translateValue: function(value,axis) {

		return ((value - this.options.min[axis]) / this.options.realMax[axis]) * (this.actualSize[axis == "x" ? "width" : "height"] - this._handleSize(null,axis));

	},

	_translateRange: function(value,axis) {

		if (this.rangeElement) {
			if (this.currentHandle[0] == this.handle[0] && value >= this._translateValue(this.value(1),axis))
				value = this._translateValue(this.value(1,axis) - this._oneStep(axis), axis);
			if (this.currentHandle[0] == this.handle[1] && value <= this._translateValue(this.value(0),axis))
				value = this._translateValue(this.value(0,axis) + this._oneStep(axis), axis);
		}

		if (this.options.handles) {
			var handle = this.options.handles[this._handleIndex()];
			if (value < this._translateValue(handle.min,axis)) {
				value = this._translateValue(handle.min,axis);
			} else if (value > this._translateValue(handle.max,axis)) {
				value = this._translateValue(handle.max,axis);
			}
		}

		return value;

	},

	_translateLimits: function(value,axis) {

		if (value >= this.actualSize[axis == "x" ? "width" : "height"] - this._handleSize(null,axis))
			value = this.actualSize[axis == "x" ? "width" : "height"] - this._handleSize(null,axis);

		if (value <= 0)
			value = 0;

		return value;

	},

	_handleSize: function(handle,axis) {

		return $(handle != undefined && handle !== null ? this.handle[handle] : this.currentHandle)[0]["offset"+(axis == "x" ? "Width" : "Height")];

	},

	_oneStep: function(axis) {

		return this.options.stepping[axis] || 1;

	},

	_pageStep: function(axis) {

		return /* this.options.paging[axis] ||*/ 10;

	},

	moveTo: function(value, handle, noPropagation) {

		var o = this.options;

		// Prepare the outer size
		this.actualSize = { width: this.element.outerWidth() , height: this.element.outerHeight() };

		//If no handle has been passed, no current handle is available and we have multiple handles, return false
		if (handle == undefined && !this.currentHandle && this.handle.length != 1)
			return false;

		//If only one handle is available, use it
		if (handle == undefined && !this.currentHandle)
			handle = 0;

		if (handle != undefined)
			this.currentHandle = this.previousHandle = $(this.handle[handle] || handle);

		if(value.x !== undefined && value.y !== undefined) {
			var x = value.x, y = value.y;
		} else {
			var x = value, y = value;
		}

		if(x !== undefined && x.constructor != Number) {
			var me = /^\-\=/.test(x), pe = /^\+\=/.test(x);
			if(me || pe) {
				x = this.value(null, "x") + this._round(x.replace(me ? '=' : '+=', ''));
			} else {
				x = isNaN(this._round(x)) ? undefined : this._round(x);
			}
		}

		if(y !== undefined && y.constructor != Number) {
			var me = /^\-\=/.test(y), pe = /^\+\=/.test(y);
			if(me || pe) {
				y = this.value(null, "y") + this._round(y.replace(me ? '=' : '+=', ''));
			} else {
				y = isNaN(this._round(y)) ? undefined : this._round(y);
			}
		}

		if(o.axis != "vertical" && x !== undefined) {
			if(o.stepping.x) x = this._round(x / o.stepping.x) * o.stepping.x;
			x = this._translateValue(x, "x");
			x = this._translateLimits(x, "x");
			x = this._translateRange(x, "x");

			o.animate ? this.currentHandle.stop().animate({ left: x }, (Math.abs(parseInt(this.currentHandle.css("left"),10) - x)) * (!isNaN(parseInt(o.animate,10)) ? o.animate : 5)) : this.currentHandle.css({ left: x });
		}

		if(o.axis != "horizontal" && y !== undefined) {
			if(o.stepping.y) y = this._round(y / o.stepping.y) * o.stepping.y;
			y = this._translateValue(y, "y");
			y = this._translateLimits(y, "y");
			y = this._translateRange(y, "y");
			o.animate ? this.currentHandle.stop().animate({ top: y }, (Math.abs(parseInt(this.currentHandle.css("top"),10) - y)) * (!isNaN(parseInt(o.animate,10)) ? o.animate : 5)) : this.currentHandle.css({ top: y });
		}

		if (this.rangeElement)
			this._updateRange();

		//Store the slider's value
		this.currentHandle.data("mouse").sliderValue = {
			x: this._round(this._convertValue(x, "x")) || 0,
			y: this._round(this._convertValue(y, "y")) || 0
		};

		if (!noPropagation) {
			this._propagate('start', null);
			this._propagate("slide", null);
			this._propagate('stop', null);
			this._propagate('change', null);
		}

	},

	_propagate: function(n, event) {

		$.ui.plugin.call(this, n, [event, this.ui()]);
		this.element.triggerHandler(n == "slide" ? n : "slide"+n, [event, this.ui()], this.options[n]);

	},

	plugins: {},

	ui: function(event) {
		return {
			options: this.options,
			handle: this.currentHandle,
			value: this.options.axis != "both" || !this.options.axis ?
				this._round(this.value(null, this.options.axis == "vertical" ? "y" : "x")) :
				{
					x: this._round(this.value(null, "x")),
					y: this._round(this.value(null, "y"))
				},
			range: this._getRange()
		};
	}

});

$.extend($.ui.slider, {
	getter: "value",
	version: "1.6",
	defaults: {
		animate: false,
		distance: 1,
		handle: ".ui-slider-handle",
		round: true
	}
});

})(jQuery);
