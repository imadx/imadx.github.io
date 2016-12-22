document.addEventListener('DOMContentLoaded', function(){

	var initButton = document.getElementById("init_button");
	var canvas = document.getElementById("canvas");

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadContent);
	oReq.open("GET", "content.html");
	oReq.send();

	initButton.addEventListener('click', initButtonHandler);

	function initButtonHandler(){
		initButton.removeEventListener('click', initButtonHandler);
		hideIntro();
		showOff();
		var data = {
			page: "main"
		};
		history.pushState(data, 'Main', '#welcome');
		data = {
			page: "profile"
		};
		history.pushState(data, 'Profile', '#profile');

	}

	function hideIntro(){
		var intro = document.getElementById("starter");
		intro.style.transform =  "translateX(-30%)";
		intro.style.opacity =  "0";


		var intro_side = document.getElementById("information");
		intro_side.style.transform = "translateX(0%)";
		intro_side.style.opacity =  "1";

		var side_picture = document.getElementById("side_picture");
		side_picture.style.transform = "translate(0,0)"

		var contents = document.getElementById("content");
		// contents.style.pointerEvents = "auto";

		initButton.style.pointerEvents = "none";


	}
	function showIntro(){
		var intro = document.getElementById("starter");
		intro.style.transform =  "translateX(0%)";
		intro.style.opacity =  "1";

		var intro_side = document.getElementById("information");
		intro_side.style.transform = "translateX(10%)";
		intro_side.style.opacity =  "0";

		var side_picture = document.getElementById("side_picture");
		side_picture.style.transform = "translate(-20vh,-30vh)"

		var contents = document.getElementById("content");
		contents.style.pointerEvents = "none";


		initButton.addEventListener('click', initButtonHandler);
		initButton.style.pointerEvents = "all";

	}

	window.addEventListener('popstate', function(e) {
		if(e.state.page === "main"){
			showIntro();
			hideShowOff();
		} else {
			showOff();
			hideIntro();
		}
	});

	function loadContent(){
		var content = document.getElementById("content");
		content.innerHTML = this.responseText;
	}

	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;                                                        
	var yDown = null;                                                        

	function handleTouchStart(evt) {                                         
		xDown = evt.touches[0].clientX;                                      
		yDown = evt.touches[0].clientY;                                      
	};                                                

	function handleTouchMove(evt) {
		if ( ! xDown || ! yDown ) {
			return;
		}

		var xUp = evt.touches[0].clientX;                                    
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
			if ( xDiff > 0 ) {
				/* left swipe */ 

			} else {
				/* right swipe */
			}                       
		} else {
			if ( yDiff > 0 ) {
				/* up swipe */ 
			} else { 
				/* down swipe */
			}                                                                 
		}
		/* reset values */
		xDown = null;
		yDown = null;                                             
	};

});
