/****************************************************************************
 Copyright (c) 2014 Hamed Saadat
 Copyright (c) 2014 hyperPad.com

 http://www.hyperPad.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var GestureRecognizer = cc.Layer.extend(

		function() {

			var _selector = null;
			var _target = null;
			var _eventListener = null;
			var _location = null;

			return {
				_isRecognizing: false,
				cancelsTouchesInView: false,
				ctor: function() {
					this._super();
					this._isRecognizing = false;
					this.cancelsTouchesInView = false;
				},
				onEnter: function() {
					this._super();
					this._registerEventListener();
				},
				setTarget: function(target, selector) {
					_target = target;
					_selector = selector;

				},
				onExit: function() {
					this._super();
					cc.eventManager.removeListener(_eventListener);  
					_selector = null;
					_target = null;
					_eventListener = null;
				},
				_gestureRecognized: function(gesture) {
					_location = gesture.location;
					if (_target != undefined && _selector != undefined) {
						_selector.call(_target, gesture); //call selector
					}
				},
				locationInView: function(view) {
					var worldPoint = this.parent.convertToWorldSpace(_location);
					return view.convertToNodeSpace(worldPoint);
				},
				_stopTouchesPropagation: function(touches, event) {
					event.stopPropagation();
				},
				_isPositionBetweenBounds: function(pos) {
					return cc.rectContainsPoint(this.parent.getBoundingBox(), pos);
				},
				_distanceBetweenPoints: function(p1, p2) {
					var deltaX = p2.x - p1.x;
					var deltaY = p2.y - p1.y;
					return Math.abs(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
				},
				_createSetWithTouch: function(pTouch) {
					var set = new Set();
					set.add(pTouch);
					return set;
				},
				_registerEventListener: function() {
					_eventListener = cc.EventListener.create({
						event: cc.EventListener.TOUCH_ONE_BY_ONE,
						onTouchBegan: function (touch, event) {
							return event.getCurrentTarget()._onTouchBegan(touch, event);
						},
						onTouchMoved: function (touch, event) {
							return event.getCurrentTarget()._onTouchMoved(touch, event);
						},
						onTouchEnded: function (touch, event) {	
							return event.getCurrentTarget()._onTouchEnded(touch, event);
						}
					});
					cc.eventManager.addListener(_eventListener, this);
				},
				_onTouchBegan: function(touch, event) {
				},
				_onTouchMoved: function(touch, event) {

				},
				_onTouchEnded: function(touch, event) {

				}

			};
		}()
);
