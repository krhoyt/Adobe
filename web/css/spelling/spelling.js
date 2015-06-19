var BUBBLE_BANDS = 20;
var GENERATE_RATE = 800;
var ROTATION = 45;
var VERTICAL_STOPS = 10;
var WOBBLE = 25;

var current = null;
var lesson = [
	'also', 'always', 'children', 'draw', 'each', 
	'small', 'such', 'walk', 'want', 'which', 
	'called', 'lunch', 'wanted', 'church', 'research'
];
var letters = null;
var timeout = null;

function configureBanner()
{
	var banner = null;
	
	// current = Math.floor( Math.random() * lesson.length );
	current = 0;
	
	banner = document.querySelector( '#banner' );
	banner.style.top = Math.round( ( document.body.scrollHeight - banner.scrollHeight ) / 2 ) + 'px';	
	banner.addEventListener( 'webkitTransitionEnd', doBannerEnd );
	
	banner = document.querySelector( '#prompt' );
	banner.addEventListener( 'click', doBannerClick );
	banner.innerHTML = lesson[current];	
}

function generateBands()
{
	var band = null;
	var bubble = null;
	var column = null;
	var rotate = null;
	var step = null;
	var stops = null;
	var tilt = null;
	
	bubble = document.createElement( 'div' );
	bubble.className = 'bubble';
	bubble.innerHTML = 'X';
	bubble.style.opacity = 0;
	document.body.appendChild( bubble );
	
	// Balloon @ 150px : 185 x 85
	// alert( bubble.scrollHeight + 'x' + bubble.scrollWidth );
		
	column = Math.round( document.body.scrollWidth / BUBBLE_BANDS );
	
	stops = 100 / VERTICAL_STOPS;
	step = ( document.body.scrollHeight + ( 2 * bubble.scrollHeight ) ) / VERTICAL_STOPS;
	
	for( var b = 1; b < ( BUBBLE_BANDS - 1 ); b++ )
	{	
		band = '@-webkit-keyframes band' + b + ' { ';
	
		for( var s = 0; s <= VERTICAL_STOPS; s++ )
		{
			tilt = Math.round( Math.random() * WOBBLE );
			
			if( Math.random() > 0.50 )
			{
				tilt = 0 - tilt;	
			}
			
			rotate = Math.round( Math.random() * ROTATION );
			
			if( Math.random() > 0.50 )
			{
				rotate = 0 - rotate;	
			}
			
			band = band + 
				Math.round( s * stops ) + '% { ' +
				'bottom: ' + ( Math.round( step * s ) - bubble.scrollHeight ) + 'px; ' +
				'left: ' + ( ( column * b ) + tilt ) + 'px; ' +
				'-webkit-transform: rotate( ' + rotate + 'deg ); ' +
				'} ';		
		}
		
		band = band + '}';	
		
		document.styleSheets[0].insertRule( band, document.styleSheets[0].cssRules.length );		
	}	
	
	document.body.removeChild( bubble );	
}

function generateLetters()
{
	letters = '';

	for( var w = 0; w < lesson.length; w++ )
	{
		for( var c = 0; c < lesson[w].length; c++ )
		{
			if( letters.indexOf( lesson[w].charAt( c ) ) == -1 ) 
			{
				letters = letters + lesson[w].charAt( c );				
			}
		}
	}	
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

function doBannerClick()
{
	var banner = null;
	
	banner = document.querySelector( '#banner' );
	banner.style.top = ( 0 - ( banner.scrollHeight + 40 ) ) + 'px';
}

function doBannerEnd()
{
	var banner = null;
	
	banner = document.querySelector( '#banner' );
	
	if( pixels( banner.style.top ) < 0 )
	{
		timeout = setTimeout( doBubble, Math.round( Math.random() * GENERATE_RATE ) );		
	}
}

function doBubble()
{
	var band = null;
	var blue = null;
	var bubble = null;
	var green = null;
	var red = null;
	var word = null;
	
	clearTimeout( timeout );
	timeout = null;
	
	word = document.querySelector( '#word' );	
	
	if( word.innerHTML == lesson[current] )
	{				
		return;
	}
	
	red = Math.round( Math.random() * 255 );
	blue = Math.round( Math.random() * 255 );
	green = Math.round( Math.random() * 255 );		
	
	band = Math.ceil( Math.random() * ( BUBBLE_BANDS - 2 ) );
	// console.log( band );
	
	bubble = document.createElement( 'div' );
	bubble.className = 'bubble';
	bubble.style.color = 'rgb( ' + red + ', ' + green + ', ' + blue + ' )';
	bubble.innerHTML = letters.charAt( Math.floor( Math.random() * letters.length ) );
	bubble.addEventListener( 'webkitAnimationEnd', doBubbleEnd );
	bubble.addEventListener( 'click', doBubbleClick );
	bubble.style.setProperty( '-webkit-animation-name', 'band' + band );
	bubble.style.setProperty( '-webkit-animation-duration', '10s' );
	bubble.style.setProperty( '-webkit-animation-timing-function', 'linear' );	
	
	document.body.insertBefore( bubble, word );
	
	timeout = setTimeout( doBubble, Math.round( Math.random() * GENERATE_RATE ) );		
}

function doBubbleClick()
{
	var a = null;
	var angle = null;
	var b = null;
	var bubble = null;
	var c = null;
	var d = null;
	var scale = null;
	var transform = null;
	var values = null;
	var word = null;
	
	transform = window.getComputedStyle( this, null ).getPropertyValue( '-webkit-transform' );
	values = transform.split( '(' )[1].split( ')' )[0].split( ',' );
	
	a = values[0];
	b = values[1];
	c = values[2];
	d = values[3];
	
	scale = Math.sqrt( a * a + b * b );
	angle = Math.round( Math.atan2( b, a ) * ( 180 / Math.PI ) );

	bubble = document.createElement( 'div' );
	bubble.className = 'popped';
	bubble.style.color = window.getComputedStyle( this, null ).getPropertyValue( 'color' );
	bubble.style.bottom =  window.getComputedStyle( this, null ).getPropertyValue( 'bottom' );
	bubble.style.left =  window.getComputedStyle( this, null ).getPropertyValue( 'left' );
	bubble.style.setProperty( '-webkit-transform', 'rotate( ' + angle + 'deg )' );
	bubble.style.webkitTransition = 'bottom 0.60s linear';
	bubble.addEventListener( 'webkitTransitionEnd', doBubbleFall );	
	bubble.innerHTML = this.innerHTML;

	/*
	bubble.removeEventListener( 'webkitAnimationEnd', 'doBubbleEnd' );
	bubble.removeEventListener( 'click', 'doBubbleClick' );	
	bubble.style.setProperty( '-webkit-animation-name', '' );
	bubble.style.setProperty( '-webkit-animation-duration', '' );
	bubble.style.setProperty( '-webkit-animation-timing-function', '' );			
	*/
	
	this.removeEventListener( 'click', doBubbleClick );
	this.removeEventListener( 'webkitAnimationEnd', doBubbleEnd );
	
	word = document.querySelector( '#word' );
	document.body.removeChild( this );
	document.body.insertBefore( bubble, word );
	
	bubble.style.setProperty( 'bottom', ( 0 - bubble.scrollHeight ) + 'px' );	
}

function doBubbleEnd()
{
	var banner = null;
	var bubbles = null;
	var word = null;
	
	this.removeEventListener( 'click', doBubbleClick );
	this.removeEventListener( 'webkitAnimationEnd', doBubbleEnd );
		
	document.body.removeChild( this );
	
	word = document.querySelector( '#word' );
	
	if( word.innerHTML == lesson[current] )
	{
		bubbles = document.querySelectorAll( '.bubble' );
		
		console.log( bubbles.length );
		
		if( bubbles.length == 0 )
		{
			if( ( current + 1 ) == lesson.length )
			{
				current = 0;	
			} else {
				current = current + 1;	
			}
			
			banner = document.querySelector( '#prompt' );
			banner.innerHTML = lesson[current];
			
			word.innerHTML = '';
		}
	}	
}

function doBubbleFall()
{
	var banner = null;
	var guessed = null;
	var letter = null;
	var message = null;	
	var word = null;
	
	word = document.querySelector( '#word' );
	
	letter = this.innerHTML;
	guessed = word.innerHTML;
	
	if( letter == lesson[current].charAt( guessed.length ) )
	{
		word.innerHTML = word.innerHTML + this.innerHTML;		
	}

	if( word.innerHTML == lesson[current] )
	{
		message = document.querySelector( '#prompt' );
		message.innerHTML = 'You did it!';
		
		banner = document.querySelector( '#banner' );
		banner.style.top = Math.round( ( document.body.clientHeight - ( banner.scrollHeight + 40 ) ) / 2 ) + 'px';
	}

	this.removeEventListener( 'webkitTransitionEnd', doBubbleEnd );
	document.body.removeChild( this );	
}

function doLoad()
{	
	configureBanner();
	generateBands();	
	generateLetters();
}