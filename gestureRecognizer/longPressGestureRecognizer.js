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

var LongPress = cc.Class.extend({
	location: null
});

var LongPressGestureRecognizer = GestureRecognizer.extend(

		function() {

			var _currentLocation = null;
			var _currentTouch = null;
			var _currentEvent = null;

			function stopGestureRecognition() {
				if (!this._isRecognizing) {
					return;
				}

				_currentTouch = null;
				_currentEvent = null;
				this.unschedule(this.timerDidEnd);
				this._isRecognizing = false;
			}

			return {

				minimumPressDuration: 0.2,
				timerDidEnd: function(dt) {
					var longPress = new LongPress();
					longPress.location = _currentLocation;

					this._gestureRecognized(longPress);
					if (this.cancelsTouchesInView) {
						this._stopTouchesPropagation(
								this.createSetWithTouch(currTouch), 
								currEvent); //cancel touch over other views
					}

					stopGestureRecognition.call(this);
				},
				_onTouchBegan: function(touch, event) {
					this._super(touch, event);
					if (this._isRecognizing) {
						stopGestureRecognition.call(this);
						return false;
					}

					_currentLocation = touch.getLocation();
					if (!this._isPositionBetweenBounds(_currentLocation)) {
						return false;
					}

					_currentEvent = event;
					_currentTouch = touch;

					this.scheduleOnce(this.timerDidEnd, this.minimumPressDuration);

					this._isRecognizing = true;
					return true;
				},
				_onTouchEnded: function(touch, event) {
					this._super(touch, event);
					stopGestureRecognition.call(this);
				},
				onExit: function() {
					this._super();
					_currentLocation = null;
					_currentTouch = null;
					_currentEvent = null;
				}

			};
		}()
);
