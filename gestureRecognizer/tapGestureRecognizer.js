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

var TAP_MAX_DURATION = 150;
var TAP_MAX_DURATION_BETWEEN_TAPS = 220
var TAP_MAX_DISTANCE = 20
var TAP_MAX_DISTANCE_BETWEEN_TAPS = 20

var Tap = cc.Class.extend({
	location: null
});

var TapGestureRecognizer = GestureRecognizer.extend(

		function() {

			var _initialPosition = null;
			var _finalPosition = null;
			var _startTime = null;
			var _endTime = null;
			var _timeSinceLastTap = null;
			var _taps = 0;

			function stopGestureRecognition() {
				_taps = 0;
				this._isRecognizing = false;
			}

			return {

				numberOfTapsRequired: 2,
				_onTouchBegan: function(touch, event) {
					this._super(touch, event);
					if (this._isRecognizing && _taps == 0) {
						stopGestureRecognition.call(this);
						return false;
					}

					if (_taps > 0 && Date.now() - _timeSinceLastTap > TAP_MAX_DURATION_BETWEEN_TAPS) {
						stopGestureRecognition.call(this);
						return false;
					}

					_initialPosition = touch.getLocation();

					if (!this._isPositionBetweenBounds(_initialPosition)) {
						return false;
					}

					_startTime = Date.now();

					if (_taps > 0 && _taps < this.numberOfTapsRequired) {
						var distance = this._distanceBetweenPoints(_finalPosition, _initialPosition); //distance between taps
						var duration = _endTime - _startTime; //duration between taps
						if (duration > TAP_MAX_DURATION_BETWEEN_TAPS || distance > TAP_MAX_DISTANCE_BETWEEN_TAPS) {
							stopGestureRecognition.call(this);
						}
					}

					this._isRecognizing = true;
					return true;
				},
				_onTouchEnded: function(touch, event) {
					this._super(touch, event);
					//calculate duration
					_endTime = Date.now();
					var duration = _endTime - _startTime; //duration of tap in milliseconds
					//calculate distance
					_finalPosition = touch.getLocation();
					var distance = this._distanceBetweenPoints(_initialPosition, _finalPosition);

					//tap was successful
					if (duration <= TAP_MAX_DURATION && distance <= TAP_MAX_DISTANCE) {
						_taps++;
						_timeSinceLastTap = Date.now();
						if (_taps == this.numberOfTapsRequired) {
							var tap = new Tap();
							tap.location = _initialPosition;

							this._gestureRecognized(tap);
							if (this._cancelsTouchesInView) {
								this._stopTouchesPropagation(this._createSetWithTouch(touch), 
										event); //cancel touch over other views
							}
							stopGestureRecognition.call(this);
						}
					}
					else {
						stopGestureRecognition.call(this);
					}
				}
			};
		}()
);
