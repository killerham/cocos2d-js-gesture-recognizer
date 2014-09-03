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

var PINCH_THRESHOLD = 2.0;

var PinchRecognizerType = {
		PinchGestureRecognizerTypeClose: 1 << 0,
		PinchGestureRecognizerTypeOpen: 1 << 1	
};

var Pinch = cc.Class.extend({
	location: null,
	type: null
});

var PinchGestureRecognizer = GestureRecognizer.extend(

		function() {

			var _touchNumber = 0;
			var _lastDistance = 0;
			var _touches = null;

			return {
				ctor: function() {
					this._super();
				},
				onEnter: function() {
					this._super();
					_touches = [];
				},
				_onTouchBegan: function(touch, event) {
					this._super(touch, event);
					if (this._isRecognizing || 
							!this._isPositionBetweenBounds(touch.getLocation())) {
						return false;
					}

					_touchNumber++;
					// TODO: this doesn't retain the touches. Thus making the gesture not work.
					_touches.push(touch);

					//start recognizing after that 2 fingers are touching
					if (_touchNumber == 2) {
						this._isRecognizing = true;
					}

					return true;
				},
				_onTouchMoved: function(touch, event) {
					this._super(touch, event);
					if (!this._isRecognizing) {
						return;
					}

					var touch1 = _touches[0];
					var touch2 = _touches[1];
					var delta1 = touch1.getDelta();
					var delta2 = touch2.getDelta();

					if ((Math.abs(delta1.x) < PINCH_THRESHOLD && 
							Math.abs(delta1.y) < PINCH_THRESHOLD) || 
							(Math.abs(delta2.x) < PINCH_THRESHOLD && 
									Math.abs(delta2.y) < PINCH_THRESHOLD)) {
						return;
					}

					var distance = this._distanceBetweenPoints(
							touch1.getLocation(), 
							touch2.getLocation());
					if (!this._lastDistance) {
						this._lastDistance = distance;
						return;
					}

					var pinch = new Pinch();

					//decide type of pinch
					if (lastDistance <= distance) {
						pinch.type = PinchGestureRecognizerTypeOpen;
					}
					else {
						pinch.type = PinchGestureRecognizerTypeClose;
					}

					if ((delta1.x > 0 && delta2.x < 0) || 
							(delta1.x < 0 && delta2.x > 0) || 
							(delta1.y > 0 && delta2.y < 0) || 
							(delta1.y < 0 && delta2.y > 0)) {
						this._gestureRecognized(pinch);
					}
				},
				_onTouchEnded: function(touch, event) {
					this._super(touch, event);
					this._isRecognizing = false;
					_lastDistance = 0;
					_touchNumber--;
					_touches.splice(_touches.indexOf(touch), 1);

					//cancel touch over other views if necessary
					if (this._cancelsTouchesInView) {
						this._stopTouchesPropagation(this._createSetWithTouch(touch), event);
					}
				},
				onExit: function() {
					this._super();
					_touches = null;
				}
			};
		}()
);
