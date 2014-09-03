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

var SWIPE_MAX_DURATION = 300;
var SWIPE_MIN_DISTANCE = 60;

var SwipeGestureRecognizerDirection = {
		SwipeGestureRecognizerDirectionRight: 1 << 0,
		SwipeGestureRecognizerDirectionLeft: 1 << 1,
		SwipeGestureRecognizerDirectionUp: 1 << 2,
		SwipeGestureRecognizerDirectionDown: 1 << 3
};

var Swipe = cc.Class.extend({
	location: null,
	swipeGestureRecognizerDirection: null
});

var SwipeGestureRecognizer = GestureRecognizer.extend(

		function() {

			var _initialPosition = null;
			var _startTime = null;

			function checkSwipeDirection(p1, p2, swipe) {
				var right = p2.x - p1.x >= SWIPE_MIN_DISTANCE;
				var left = p1.x - p2.x >= SWIPE_MIN_DISTANCE;
				var down = p1.y - p2.y >= SWIPE_MIN_DISTANCE;
				var up = p2.y - p1.y >= SWIPE_MIN_DISTANCE;

				if (right) {
					if ((this.direction & SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionRight) == 
						SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionRight) {
						swipe.direction = SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionRight;
						return true;
					}
				}
				else if (left) {
					if ((this.direction & SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionLeft) == 
						SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionLeft) {
						swipe.direction = SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionLeft;
						return true;
					}
				}
				else if (up) {
					if ((this.direction & SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionUp) == 
						SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionUp) {
						swipe.direction = SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionUp;
						return true;
					}
				}
				else if (down) {
					if ((this.direction & SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionDown) == 
						SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionDown) {
						swipe.direction = SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionDown;
						return true;
					}
				}

				return false;
			}

			return {
				direction: SwipeGestureRecognizerDirection.SwipeGestureRecognizerDirectionRight, 
				minimumPressDuration: 0.2,
				ctor: function() {
					this._super();
				},
				_onTouchBegan: function(touch, event) {
					this._super(touch, event);
					if (this._isRecognizing) {
						this._isRecognizing = false;
						return false;
					}

					_initialPosition = touch.getLocation();
					if (!this._isPositionBetweenBounds(_initialPosition)){
						return false;
					}

					_startTime = Date.now();

					this._isRecognizing = true;
					return true;
				},
				_onTouchEnded: function(touch, event) {
					this._super(touch, event);
					var finalPosition = touch.getLocation();

					if (!this._isPositionBetweenBounds(finalPosition)) {
						this._isRecognizing = false;
						return;
					}

					//distance between initial and final point of touch
					var distance = this._distanceBetweenPoints(_initialPosition, finalPosition);

					var currentTime = Date.now();

					var duration = currentTime - _startTime;

					//check that minimum distance has been reached
					//check that maximum duration hasn't been reached
					//check if the direction of the swipe is correct
					var swipe = new Swipe();
					swipe.location = _initialPosition;
					if (distance >= SWIPE_MIN_DISTANCE && 
							duration <= SWIPE_MAX_DURATION && 
							checkSwipeDirection.call(this, _initialPosition, finalPosition, swipe)) {

						this._gestureRecognized(swipe);
						if (this._cancelsTouchesInView) {
							this._stopTouchesPropagation(this._createSetWithTouch(touch), event); //cancel touch over other views
						}
					}

					this._isRecognizing = false;
				}

			};
		}()
);
