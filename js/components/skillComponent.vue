<template>
	<div class="skill-component-div" :title="'Relative skill measure for ' + skill + ' as of upwork.com'" @mouseover="animate(1000)">
		<svg viewBox="0 0 200 200">
			<circle fill="none" stroke="#eee" stroke-width="10" cx="100"  cy="100" r="85"/>
			<path :id="skill" fill="none" stroke="#00a859" stroke-width="20" :d="arc_d"/>
		</svg>
		<img :src="getImageSource(image)" :width="image_width" :height="image_height" :alt="skill">
		<span class="score">{{score}}<small>5.00</small></span>
		<span class="ranking" :class="formatRanking(ranking)" :title="ranking + ' as of upWork.com' ">{{ranking}}</span>
		<span class="date">{{date}}</span>
	</div>
</template>
<script>

export default {

	props: ['skill', 'image', 'imagewidth', 'imageheight', 'score', 'ranking', 'date'],
	data: function(){
		return {
			arc_d : this.describeArc(100, 100, 85, 0, 360*(this.score/5.0)),
			image_height: undefined,
			image_width: undefined,

			animating: false,
			_random: 0
		};
	},
	methods: {
		getImageSource: function(_img){
			return '/img/icons/' + _img;
		},
		formatRanking: function(_ranking_txt){
			return _ranking_txt.replace(' ', '').replace('Top', 'class').replace('%','');
		},
		animate: function(_duration) {

			if(this.animating){
				return;
			}
			this._random = Math.floor(Math.random()*8);
			this.animating = true;
			let vm = this;
			let start = performance.now();

			requestAnimationFrame(function animate(time) {
				let timeFraction = (time - start) / _duration;
				if (timeFraction > 1) timeFraction = 1;

				let progress = vm.timingFunction(timeFraction);
				vm.setAnimations(progress);

				if (timeFraction < 1) {
					requestAnimationFrame(animate);
				} else {
					vm.animating = false;
				}

			});
		},
		setAnimations: function(_progress){
			let _score = this.score;
			let _angle = 360 * (_score * ((1.05-Math.abs(_progress-0.5)/10))/5.0);
			if(_angle > 359) _angle = 359;

			this.arc_d = this.describeArc(100, 100, 85, 0, _angle);
		},
		timingFunction: function(t){
			let _ret = (1-t) * (1-t) * (1-t) * Math.sin(t*(this._random + 3));
			return _ret;
		},

        // arc drawing methods are an adapted variation of https://stackoverflow.com/a/24569190/4513747
        polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
        	let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        	return {
        		x: centerX + (radius * Math.cos(angleInRadians)),
        		y: centerY + (radius * Math.sin(angleInRadians))
        	};
        },
        // arc drawing methods are an adapted variation of https://stackoverflow.com/a/24569190/4513747
        describeArc: function(x, y, radius, startAngle, endAngle){
        	let start = this.polarToCartesian(x, y, radius, endAngle);
        	let end = this.polarToCartesian(x, y, radius, startAngle);

        	let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        	let d = [
        	"M", start.x, start.y, 
        	"A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        	].join(" ");

        	return d;       
        }
    },
    mounted: function(){

    	console.log('[imadx.github.io] skill-component created...', this.skill);

    	if(this.imagewidth >= this.imageheight) {
    		this.image_width = 80;
    	} else {
    		this.image_height = 70;
    	}
    }
}

</script>