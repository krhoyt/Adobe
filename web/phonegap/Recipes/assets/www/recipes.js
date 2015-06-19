var CARD_HEIGHT = 380;
var CARD_WIDTH = 620;
var SWIPE_LEFT = 'left';
var SWIPE_MAX = 100;
var SWIPE_RIGHT = 'right';

var index = null;
var recipes = [
	{
		title: 'Chicken Enchiladas',
		caption: 'Chicken enchiladas baked in a cheesy white sauce.',
		serving: null,
		yield: '12 enchiladas',
		instructions: 'Thaw completely. Bake uncovered at 350 degrees for about 25 minutes or until bubbly.',
		picture: 'enchiladas.jpg'
	}, {
		title: 'Honey-Dijon Glazed Ham',
		caption: 'Also great for kabobs with pineapple chunks.',
		serving: '5 slices fresh pineapple',
		yield: '6 servings',
		instructions: 'Place ham steak on grill, basting occasionally with glaze, until steak is marked by grill and well warmed through. Ham can also be cut into chunks and threaded alternately on skewers with chunks of pineapple, then grilled.',
		picture: 'honey-ham.jpg'
	}, {
		title: 'Manicotti',
		caption: 'A great meatless entree.',
		serving: 'spaghetti sauce,parmesan cheese',
		yield: '8-10 servings',
		instructions: 'Pour sauce over bottom of ungreased baking dish. Lay stuffed manicotti noodles on top of sauce and top with leftover sauce. Then top with Parmesan cheese and bake at 425 degrees for 30-35 minutes.',
		picture: 'manicotti.jpg'
	}, {
		title: 'Meatballs',
		caption: 'A great thing to have on hand!',
		serving: null,
		yield: '20 medium meatballs',
		instructions: 'Thaw meatballs completely and place in a 350 degree oven for 30 minutes. Remove from pan and allow to cool.',
		picture: 'meatballs.jpg'
	}, {
		title: 'Parmesan Garlic Chicken',
		caption: 'A quick, kid-friendly dinner.',
		serving: null,
		yield: '6 servings',
		instructions: 'Thaw completely. Unwrap desired number of chicken breasts and place in a greased baking dish. Bake at 400 degrees for 45-60 minutes until chicken is tender and no longer pink.',
		picture: 'parmesan-chicken.jpg'
	}, {
		title: 'Smothered Baked Breakfast Burritos',
		caption: 'Great for brunch with a southwestern flair!',
		serving: 'lettuce,tomato,sour cream,avocados',
		yield: '12 servings',
		instructions: 'TBD',
		picture: 'breakfast-burrito.jpg'		
	}
];
var start = null;
var touch = null;

function card( recipe )
{
	var details = null;
	var footer = null;
	var paper = null;
	var picture = null;
	var view = null;
	
	view = document.createElement( 'div' );
	view.className = 'card';
	view.addEventListener( touch ? 'touchstart' : 'mousedown', doSwipeStart );		
	
	paper = document.createElement( 'div' );
	paper.className = 'paper';
	view.appendChild( paper );

	picture = new Image();
	picture.onload = function() {
		this.style.top = Math.round( ( this.parentElement.clientHeight - this.height ) / 2 ) + 'px';
	}
	picture.src = recipe.picture;
	paper.appendChild( picture );

	footer = document.createElement( 'div' );
	footer.className = 'footer';
	footer.innerHTML = recipe.title;
	paper.appendChild( footer );

	details = document.querySelector( '#details' );
	view.style.left = document.body.clientWidth + 'px';
	document.body.insertBefore( view, details );	
}

function pixels( value )
{
	var result = null;
	
	result = value.toString();
	
	if( result.indexOf( 'px' ) >= 0 )
	{
		result = parseFloat( result.substr( 0, result.length - 2 ) );
	} else {
		result = parseFloat( result );
	}
	
	return result;
}

function slide( direction )
{
	var cards = null;
	
	cards = document.querySelectorAll( '.card' );

	if( direction == SWIPE_LEFT )
	{
		cards[index].style.webkitTransition = 'left 0.8s ease-in-out';
		cards[index].addEventListener( 'webkitTransitionEnd', doTransitionEnd );
		cards[index].style.left = ( 0 - document.body.clientWidth ) + 'px';		
		
		if( index == ( cards.length - 1 ) )
		{
			index = 0;
		} else {
			index = index + 1;
		}			

		cards[index].style.opacity = 1;
		cards[index].style.webkitTransition = 'left 0.8s ease-in-out';
		cards[index].addEventListener( 'webkitTransitionEnd', doTransitionEnd );
		cards[index].style.left = '0px';
	} else {
		cards[index].style.webkitTransition = 'left 0.8s ease-in-out';
		cards[index].addEventListener( 'webkitTransitionEnd', doTransitionEnd );
		cards[index].style.left = document.body.clientWidth + 'px';		
		
		if( index == 0 )
		{
			index = ( cards.length - 1 );
		} else {
			index = index - 1;
		}		
	
		cards[index].style.left = ( 0 - document.body.clientWidth ) + 'px';
		
		// TODO: Why does it work if this is HERE?
		console.log( 0 - document.body.clientWidth );
		
		cards[index].style.opacity = 1;
		cards[index].style.webkitTransition = 'left 0.8s ease-in-out';
		cards[index].addEventListener( 'webkitTransitionEnd', doTransitionEnd );
		cards[index].style.left = '0px';		
	}	
}

function doDetailsDone()
{
	var cards = null;
	var details = null;
	
	details = document.querySelector( '#details' );
	details.style.webkitTransition = 'top 0.8s ease-in-out';
	details.addEventListener( 'webkitTransitionEnd', doDetailsEnd );
	details.style.top = document.body.clientHeight + 'px';	
	
	cards = document.querySelectorAll( '.card' );	
	cards[index].style.webkitTransition = 'top 0.8s ease-in-out';
	cards[index].addEventListener( 'webkitTransitionEnd', doDetailsEnd );
	cards[index].style.top = '0px';
}

function doDetailsEnd()
{
	var cards = null;
	var details = null;
	
	details = document.querySelector( '#details' );
	details.style.webkitTransition = '';
	details.removeEventListener( 'webkitTransitionEnd', doDetailsEnd );	
	
	cards = document.querySelectorAll( '.card' );
	cards[index].style.webkitTransition = '';
	cards[index].removeEventListener( 'webkitTransitionEnd', doDetailsEnd );	
}

function doLoad()
{
	var details = null;
	var view = null;		

	touch = ( 'ontouchstart' in document.documentElement ) ? true : false;		
	
	for( var r = 0; r < recipes.length; r++ )
	{
		card( recipes[r] );				
	}
	
	view = document.querySelector( '.card:first-child' );
	view.style.opacity = 1;
	view.style.left = '0px';
	
	index = 0;
	
	details = document.querySelector( '#details' );
	details.addEventListener( touch ? 'touchend' : 'click', doDetailsDone );
	
	window.onresize = doResize;
	doResize();	
}

function doResize()
{
	var notecard = null;
	
	notecard = document.querySelector( '#notecard' );
	notecard.style.left = Math.round( ( document.body.clientWidth - notecard.clientWidth - 20 ) / 2 ) + 'px';
	notecard.style.top = Math.round( ( document.body.clientHeight - notecard.clientHeight - 20 ) / 2 ) + 'px';	

	for( var r = 0; r < document.styleSheets[0].cssRules.length; r++ )
	{
		if( document.styleSheets[0].cssRules[r].selectorText == '.card' )
		{
			document.styleSheets[0].cssRules[r].style.setProperty( 'width', document.body.clientWidth + 'px' );
			document.styleSheets[0].cssRules[r].style.setProperty( 'height', document.body.clientHeight + 'px' );
		}
		
		if( document.styleSheets[0].cssRules[r].selectorText == '.paper' )
		{
			document.styleSheets[0].cssRules[r].style.setProperty( 'left', Math.round( ( document.body.clientWidth - CARD_WIDTH ) / 2 ) + 'px' );
			document.styleSheets[0].cssRules[r].style.setProperty( 'top', Math.round( ( document.body.clientHeight - CARD_HEIGHT ) / 2 ) + 'px' );
		}		
		
		if( document.styleSheets[0].cssRules[r].selectorText == '#details' )
		{
			document.styleSheets[0].cssRules[r].style.setProperty( 'width', document.body.clientWidth + 'px' );
			document.styleSheets[0].cssRules[r].style.setProperty( 'height', document.body.clientHeight + 'px' );
			document.styleSheets[0].cssRules[r].style.setProperty( 'top', document.body.clientHeight + 'px' );						
		}
	}
}

function doSwipeEnd( evt ) 
{
	var cards = null;
	var details = null;
	var field = null;
	
	this.removeEventListener( touch ? 'touchmove' : 'mousemove', doSwipeMove );
	this.removeEventListener( touch ? 'touchend' : 'mouseup', doSwipeEnd );

	start = null;
	
	field = document.querySelector( '#title' );
	field.innerHTML = recipes[index].title;
	
	field = document.querySelector( '#caption' );
	field.innerHTML = recipes[index].caption;
	
	field = document.querySelector( '#serving' );
	field.innerHTML = recipes[index].serving == null ? 'No serving suggestions' : 'Serve with ' + recipes[index].serving.replace( /,/g, ', ' );	
	
	field = document.querySelector( '#yield' );
	field.innerHTML = 'Yields ' + recipes[index].yield;
	
	field = document.querySelector( '#instructions' );
	field.innerHTML = recipes[index].instructions;		
	
	details = document.querySelector( '#details' );
	details.style.webkitTransition = 'top 0.8s ease-in-out';
	details.addEventListener( 'webkitTransitionEnd', doDetailsEnd );
	details.style.top = '0px';	
	
	cards = document.querySelectorAll( '.card' );	
	cards[index].style.webkitTransition = 'top 0.8s ease-in-out';
	cards[index].addEventListener( 'webkitTransitionEnd', doDetailsEnd );
	cards[index].style.top = ( 0 - document.body.clientHeight ) + 'px';	
}

function doSwipeMove( evt )
{
	var current = null;
	var distance = null;
	
	evt.preventDefault();

	current = touch ? evt.touches[0] : evt;

	distance = Math.sqrt( 
		Math.pow( ( current.screenX - start.screenX ), 2 ) +
		Math.pow( ( current.screenY - start.screenY ), 2 )
	);
	
	if( distance > SWIPE_MAX )
	{
		this.removeEventListener( touch ? 'touchmove' : 'mousemove', doSwipeMove );
		this.removeEventListener( touch ? 'touchend' : 'mouseup', doSwipeEnd );			
		
		if( start.screenX > current.screenX )
		{
			slide( SWIPE_LEFT );	
		} else {
			slide( SWIPE_RIGHT );	
		}	

		start = null;
	}
}

function doSwipeStart( evt )
{
	evt.preventDefault();

	start = touch ? evt.touches[0] : evt;
	
	this.addEventListener( touch ? 'touchmove' : 'mousemove', doSwipeMove );
	this.addEventListener( touch ? 'touchend' : 'mouseup', doSwipeEnd );	
}

function doTransitionEnd()
{
	this.style.webkitTransition = '';
	this.removeEventListener( 'webkitTransitionEnd', doTransitionEnd );			
	
	if( pixels( this.style.left ) == 0 )
	{
		this.style.webkitTransition = '';
		this.style.left = '0px';	
	} else {
		this.style.left = document.body.clientWidth + 'px';
		this.style.opacity = 0;	
	}
}