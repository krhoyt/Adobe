function measure()
{
	var band = null;
	var moon = null;
	var sun = null;
	
	// Get a reference to the sun
	sun = document.querySelector( '#sun' );
	
	// Create the keyframe rule as a string
	band = '@-webkit-keyframes sun { ' +
		'from { ' +
		'left: 0px; ' + 
		'top: 0px; ' + 
		'opacity: 1; ' + 		
		'} ' + 
		'to { ' +
		'left: ' + 
		( window.innerWidth - sun.clientWidth ) + 'px; ' +
		'top: 0px; ' +
		'opacity: 0; ' + 		
		'} ' + 
		'}';

	// Append the rule to the stylesheet
	document.styleSheets[0].insertRule( band, document.styleSheets[0].cssRules.length );
	
	// Apply the animation style
	sun.style.webkitAnimation = 'sun 8s linear 15 alternate';
	
	// Do the same as above for the moon
	// The moon has inverse opacity
	moon = document.querySelector( '#moon' );
	
	band = '@-webkit-keyframes moon { ' +
		'from { ' +
		'left: 0px; ' + 
		'top: 0px; ' + 
		'opacity: 0; ' + 		
		'} ' + 
		'to { ' +
		'left: ' + 
		( window.innerWidth - moon.clientWidth ) + 'px; ' +
		'top: 0px; ' +
		'opacity: 1; ' + 		
		'} ' + 
		'}';

	document.styleSheets[0].insertRule( band, document.styleSheets[0].cssRules.length );
	
	moon.style.webkitAnimation = 'moon 8s linear 15 alternate';	
}

function doDawn()
{
	var sky = null;
	
	sky = document.querySelector( '#between' );
	sky.removeEventListener( 'webkitTransitionEnd', doDawn );
	sky.removeEventListener( 'transitionend', doDawn );	
	sky.style.opacity = 0;
	
	sky = document.querySelector( '#day' );
	sky.addEventListener( 'webkitTransitionEnd', doDay );
	sky.addEventListener( 'transitionend', doDay );	
	sky.style.opacity = 1;		
	
	console.log( 'Day' );
}

function doDay()
{
	var sky = null;
	
	sky = document.querySelector( '#day' );
	sky.removeEventListener( 'webkitTransitionEnd', doDay );	
	sky.removeEventListener( 'transitionend', doDay );		
	sky.style.opacity = 0;
	
	sky = document.querySelector( '#between' );
	sky.addEventListener( 'webkitTransitionEnd', doDusk );
	sky.addEventListener( 'transitionend', doDusk );	
	sky.style.opacity = 1;		
	
	console.log( 'Dusk' );
}

function doDusk()
{
	var sky = null;
	
	sky = document.querySelector( '#between' );
	sky.removeEventListener( 'webkitTransitionEnd', doDusk );
	sky.removeEventListener( 'transitionend', doDusk );	
	sky.style.opacity = 0;
	
	sky = document.querySelector( '#night' );
	sky.addEventListener( 'webkitTransitionEnd', doNight );
	sky.addEventListener( 'transitionend', doNight );	
	sky.style.opacity = 1;	
	
	console.log( 'Night' );
}

function doNight()
{
	var sky = null;
	
	sky = document.querySelector( '#night' );
	sky.removeEventListener( 'webkitTransitionEnd', doNight );
	sky.removeEventListener( 'transitionend', doNight );	
	sky.style.opacity = 0;
	
	sky = document.querySelector( '#between' );
	sky.addEventListener( 'webkitTransitionEnd', doDawn );
	sky.addEventListener( 'transitionend', doDawn );
	sky.style.opacity = 1;		
	
	console.log( 'Dawn' );
}

function doWindowLoad()
{
	plant();
	measure();
	doDay();
}

window.onload = doWindowLoad;