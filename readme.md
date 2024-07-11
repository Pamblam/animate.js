# Animate.js

There are probably 1,000 Javascript libraries called "animate.js" but this isn't a Javascript library. What if I told you you don't need a big ass library to do complex animations in the browser. This tiny 1.3 KB function is all you need.

## Usage

Grab a copy of the code from [here](animate.js), or the minified code from [here](animate.min.js).

### Demo

```js
import {animate} from './animate.js';

// Fade an element out
await animate({
	element: document.getElementById('header'),
	style_property: 'opacity',
	start_value: 1, 
	end_value: 0
});
```

### Options

The function takes an options object, which can have the following properties:

 - `element`: The HTML element to anmimate.
 - `style_property`: The style property to animate.
 - `start_value`: The initial numeric value at the begining of the animation. If not provided the function will attempt to use the computed style_property.
 - `end_value`: The final numeric value at the end of the animation.
 - `unit`: If a string is provided, it is appended to the end of the calculated numeric value and set as a CSS property. If a function is provided, the function is passed the calculated numberic value and is expedcted to return the CSS preoperty value at that frame. If not provided, the property will be assigned a number.
 - `duration`: The duration of the animation, in milliseconds. The default value is 250.
 - `algo`: Optional. The easing algorithm to use. See Below.

### Easings

Easings are based on the same [Robert Penner algorithms](http://www.robertpenner.com/easing) used by jQuery.

`linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInQuint`, `easeOutQuint`, `easeInOutQuint`, `easeInExpo`, `easeOutExpo`, `easeInOutExpo`, `easeInSine`, `easeOutSine`, `easeInOutSine`, `easeInCirc`, `easeOutCirc`, `easeInOutCirc`, `easeInElastic`, `easeOutElastic`, `easeInOutElastic`, `easeInBack`, `easeOutBack`, `easeInOutBack`, `easeInBounce`, `easeOutBounce`, `easeInOutBounce`