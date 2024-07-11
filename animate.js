/**
 * Animate any quantifiable CSS value
 * @version 1.10012
 * @param element: The HTML element to anmimate
 * @param style_property: The style property to animate
 * @param start_value: The initial numeric value at the begining of the animation. If not provided the function will attempt to use the computed style_property.
 * @param end_value: The final numeric value at the end of the animation.
 * @param unit: If a string is provided, it is appended to the end of the calculated numeric value and set as a CSS property. If a function is provided, the function is passed the calculated numberic value and is expedcted to return the CSS preoperty value at that frame.
 * @param duration: The duration of the animation, in milliseconds
 * @param algo: Optional. The easing algorithm to use. Options are: linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint, easeInExpo, easeOutExpo, easeInOutExpo, easeInSine, easeOutSine, easeInOutSine, easeInCirc, easeOutCirc, easeInOutCirc, easeInElastic, easeOutElastic, easeInOutElastic, easeInBack, easeOutBack, easeInOutBack, easeInBounce, easeOutBounce, easeInOutBounce
 * @returns Promise
 */
export function animate({ element, style_property, start_value = null, end_value, unit = '', duration = 250, algo = 'linear' }) {
	return new Promise((resolve) => {

		let baseEasings = {};

		["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach((name, i)=>{
			baseEasings[name] = function(p){
				return Math.pow(p, i + 2);
			};
		});
		
		Object.assign(baseEasings, {
			Sine: function ( p ) {
				return 1 - Math.cos( p * Math.PI / 2 );
			},
			Circ: function ( p ) {
				return 1 - Math.sqrt( 1 - p * p );
			},
			Elastic: function( p ) {
				return p === 0 || p === 1 ? p :
					-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
			},
			Back: function( p ) {
				return p * p * ( 3 * p - 2 );
			},
			Bounce: function ( p ) {
				var pow2,
					bounce = 4;
				while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
				return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
			}
		});
		
		let easings = {
			linear: function(p){ return p; }
		};
		
		Object.keys(baseEasings).forEach(name=>{
			let easeIn = baseEasings[name];
			easings["easeIn"+name] = easeIn;
			easings["easeOut"+name] = function( p ) {
				return 1 - easeIn( 1 - p );
			};
			easings["easeInOut" + name] = function( p ) {
				return p < 0.5 ?
					easeIn( p * 2 ) / 2 :
					1 - easeIn( p * -2 + 2 ) / 2;
			};
		});

		if (undefined === start_value || undefined === unit) {
			let sv = getComputedStyle(element).getPropertyValue(style_property);
			let [_, _start_value, _unit] = sv.match(/^(\d+)(.*)/);
			if (!unit) unit = (_unit || '');
			if (unit === _unit && !start_value) start_value = +_start_value;
			if (!start_value) throw new Error("Unable to determine start value in " + unit);
		}

		if (!easings[algo]) {
			throw new Error("unknown algo " + algo);
		}

		let start_time = Date.now();
		let diff = Math.abs(start_value - end_value);

		(function frame() {
			requestAnimationFrame(() => {
				let time_passed = Date.now() - start_time;
				let percent = Math.min(1, time_passed / duration);
				let position_change = diff * easings[algo](percent);
				let position;
				if(start_value < end_value){
					position = percent === 1 ?
						Math.max(start_value - position_change, end_value) :
						Math.min(start_value + position_change, end_value) ;
				}else{
					position = percent === 1 ?
						Math.min(start_value + position_change, end_value) :
						Math.max(start_value - position_change, end_value) ;
				}
				let value = 'function' === typeof unit ?
					unit(position) :
					`${position}${unit}` ;
				element.style[style_property] = value;
				percent == 1 ? resolve() : frame();
			});
		})();
	});
}