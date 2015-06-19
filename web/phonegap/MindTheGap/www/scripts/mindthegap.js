var BRICKS_MAXIMUM = -25;
var BRICKS_MINIMUM = -195;
var BRICKS_SPACE = -170;
var BRICKS_STARTING = -220;
var FREQUENCY_ACCEL = 100;
var FREQUENCY_TIMER = 500;
var LEGS_CENTER = 107;
var LEGS_HIDDEN = -254;
var LEGS_MINIMUM = -2;
var LEGS_MAXIMUM = 216;
var LEGS_SPACE = 218;
var PLAY_UP = 'assets/play.png';
var PLAY_DOWN = 'assets/play.down.png';
var NUMBER_ONE = 'assets/one.png';
var NUMBER_THREE = 'assets/three.png';
var NUMBER_TWO = 'assets/two.png';
var SEGMENTS_HORIZONTAL = 8;
var SEGMENTS_VERTICAL = 8;
var STATE_END = 2;
var STATE_MOVING = 1;
var STATE_READY = 3;
var STATE_START = 0;

var count = null;
var latest = null;
var playID = null;
var state = null;
var watchID = null;

var hmax = null;
var hmin = null;
var hrange = null;		

var vmax = null;
var vmin = null;
var vrange = null;

document.addEventListener( 'deviceready', doDeviceReady, false );

function end()
{
	count = count + 1;
	
	switch( count )
	{
		case 1:
			$( '#splat' )
				.css( 'visibility', 'visible' )
				.css( 'opacity', 1 );		
			break;
		case 3:
			$( '#underground' ).css( 'visibility', 'hidden' );
			$( '#background' ).css( 'top', BRICKS_STARTING + 'px' );	
			
			$( '#legs' ).css( 'left', LEGS_CENTER + 'px' );
			$( '#legs' ).css( 'bottom', LEGS_HIDDEN + 'px' );					
			
			$( '#play' )
				.attr( 'src', PLAY_UP )
				.css( 'opacity', 1 );
			break;
		case 4:
			$( '#splat' ).css( 'opacity', 0 );
			break;
		case 5:
			$( '#play' )
				.bind( 'touchstart', doPlayDown )
				.bind( 'touchend', doPlayUp );
			break;
		case 6:
			$( '#splat' ).css( 'visibility', 'hidden' );
			break;
		case 7:
			state = STATE_READY;
			break;
	}		
}

function move()
{
	var hposition = 0;
	var vposition = 0;
	
	vposition = ( ( ( latest.x - vmin ) / vrange ) * BRICKS_SPACE ) + BRICKS_MAXIMUM;
	hposition = ( ( latest.y - hmin ) / hrange ) * LEGS_SPACE;		

	if( vposition > BRICKS_MAXIMUM )
	{
		vposition = BRICKS_MAXIMUM;
		$( '#underground' ).css( 'visibility', 'visible' );
	
		count = 0;
		state = STATE_END;
	} else if( vposition < BRICKS_MINIMUM ) {
		vposition = BRICKS_MINIMUM;
	} 
	
	if( hposition < LEGS_MINIMUM )
	{
		hposition = LEGS_MINIMUM;
	} else if( hposition > LEGS_MAXIMUM ) {
		hposition = LEGS_MAXIMUM;
	} 		
	
	$( '#background' ).css( 'top', vposition );	
	$( '#legs' ).css( 'left', hposition );		
}

function play()
{
	if( state == STATE_START ) {
		start();
	} else if( state == STATE_MOVING ) {
		move();
	} else if( state == STATE_END ) {
		end();
	}
}

function sample()
{
	var segment = 0;
	
	segment = 2 / SEGMENTS_VERTICAL;
	vmax = latest.x + segment;			
	vmin = latest.x - segment;			
	vrange = segment * 2;	
	
	segment = 2 / SEGMENTS_HORIZONTAL;
	hmax = latest.y + segment;			
	hmin = latest.y - segment;			
	hrange = segment * 2;
}

function start()
{
	count = count + 1;
	
	switch( count )
	{
		case 1:
			$( '#play' )
				.attr( 'src', NUMBER_THREE )
				.css( 'opacity', 1 );
			break;
		case 2:
			$( '#play' ).css( 'opacity', 0 );
			break;
		case 3:
			$( '#play' )
				.attr( 'src', NUMBER_TWO )
				.css( 'opacity', 1 );
			break;
		case 4:
			$( '#play' ).css( 'opacity', 0 );
			break;
		case 5:
			$( '#play' )
				.attr( 'src', NUMBER_ONE )
				.css( 'opacity', 1 );
			sample();
			break;
		case 6:
			$( '#play' ).css( 'opacity', 0 );
			break;
		case 7:
			$( '#background' ).css( 'top', '-175px' ); 	
			$( '#legs' ).css( 'bottom', '-134px' );
			break;
		case 9:
			state = STATE_MOVING;
			break;
	}	
}

function doAcceleration( acceleration )
{
	latest = {
		x: acceleration.x,
		y: acceleration.y
	};
}

function doDeviceReady()
{
	var options = {
		frequency: FREQUENCY_ACCEL
	};	
	
	state = STATE_READY;
	
	$( '#play' )
		.bind( 'touchstart', doPlayDown )
		.bind( 'touchend', doPlayUp );
		
	watchID = navigator.accelerometer.watchAcceleration( 
		doAcceleration,
		doError, 
		options 
	);		
	
	playID = setInterval( play, FREQUENCY_TIMER );	
}

function doError()
{		
	alert( 'Acceleration Error' );	
}

function doPlayDown()
{
	$( '#play' ).attr( 'src', PLAY_DOWN );	
}

function doPlayUp()
{
	$( '#play' )
		.unbind( 'touchstart' )
		.unbind( 'touchend' )		
		.attr( 'src', PLAY_UP )
		.css( 'opacity', 0 );
	
	count = 0;		
	state = STATE_START;	
}