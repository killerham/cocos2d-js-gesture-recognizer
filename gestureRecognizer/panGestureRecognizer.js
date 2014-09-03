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

var Pan = cc.Class.extend({
	location: null,
	delta: null
});

var PanGestureRecognizer = GestureRecognizer.extend(

		function() {

			return {
				_onTouchBegan: function(touch, event) {
					this._super(touch, event);
					if (this._isRecognizing) {
						this._isRecognizing = false;
						return false;
					}

					var currentLocation = touch.getLocation();
					if (!this._isPositionBetweenBounds(currentLocation)) {
						return false;
					}

					this._isRecognizing = true;
					return true;
				},
				_onTouchMoved: function(touch, event) {
					this._super(touch, event);
					var pan = new Pan();
					pan.location = touch.getLocation();
					pan.delta = touch.getDelta();
					this._gestureRecognized(pan);
				},
				_onTouchEnded: function(touch, event) {
					this._super(touch, event);
					this._stopTouchesPropagation(
							this._createSetWithTouch(touch), 
							event); //cancel touch over other views
				}

			};
		}()
);
