var labels = [
	"ALCOHOLIC/SOLVENT", "DARK FRUIT", "CITRUS FRUIT", "HOPPY", 
	"FLORAL", "SPICY", "HERBAL", "MALTY", 
	"TOFFEE", "BURNT", "SWEET", "SOUR", 
	"BITTER", "ASTRINGENT", "BODY", "LINGER"									
];

var scoring = null;
var startr = null;
var startt = null;

function circle( ctx, x, y, radius )
{
	// init variables
	var thta = 0;
	var xrCtrl = 0;
	var yrCtrl = 0;
	var angle = 0;
	var angleMid = 0;
	var px = 0; 
	var py = 0;
	var cx = 0;
	var cy = 0;
	var yRadius = radius;
	
	// covert 45 degrees to radians for our calculations
	thta = Math.PI / 4;
	
	// calculate the distance for the control point
	xrCtrl = radius / Math.cos( thta / 2 );
	yrCtrl = yRadius / Math.cos( thta / 2 );
	
	// start on the right side of the circle
	angle = 0;
	
	ctx.beginPath();
	ctx.moveTo( x + radius, y );
	
	// this loop draws the circle in 8 segments
	for( var i = 0; i < 8; i++ ) 
	{
		// increment our angles
		angle += thta;
		angleMid = angle - ( thta / 2 );
		
		// calculate our control point
		cx = x + Math.cos( angleMid ) * xrCtrl;
		cy = y + Math.sin( angleMid ) * yrCtrl;
		
		// calculate our end point
		px = x + Math.cos( angle ) * radius;
		py = y + Math.sin( angle ) * yRadius;
		
		// draw the circle segment
		ctx.quadraticCurveTo( cx, cy, px, py );
	}
	
	ctx.stroke();
}

function draw( radius, lineWidth, dotRadius )
{
	var points = null;			
	var coming = null;
	var going = null;
	var current = null;
	var follow = null;
	var context = null;
	var lines = null;
	var chart = null;
	
	coming = false;
	going = false;
	
	context = document.querySelector( '#chart' ).getContext( '2d' );
	context.clearRect( 0, 0, 645, 644 );
	context.strokeStyle = '#241F20';
	context.lineWidth = lineWidth;
	context.lineJoin = 'round';
	context.lineCap = 'round';	
		
	for( var v = 0; v < scoring.length; v++ )
	{
		going = false;
		coming = false;
		current = null;
		follow = null;
		
		// Skip if no value
		if( scoring[v] == 0 )
		{
			continue;	
		} else {
			points = polygon( radius[scoring[v]] );
			current = points[v];
		}
		
		// Something coming?
		if( v == 0 )
		{
			if( scoring[15] == 0 )
			{
				coming = false;
			} else {
				coming = true;
			}
		} else {
			if( scoring[v - 1] == 0 )
			{
				coming = false;
			} else {
				coming = true;
			}
		}
			
		// Something going?
		if( v == 15 )
		{
			if( scoring[0] == 0 )
			{
				going = false;
			} else {
				going = true;
				follow = polygon( radius[scoring[0]] )[0];
			}
		} else {
			if( scoring[v + 1] == 0 )
			{
				going = false;
			} else {
				going = true;
				follow = polygon( radius[scoring[v + 1]] )[v + 1];						
			}
		}
		
		if( !coming && !going )
		{
			context.fillStyle = '#241F20';
			context.strokeStyle = 'rgba( 0, 255, 0, 0 )';
			context.lineWidth = 1;
			circle( context, points[v].x + 322, points[v].y + 322, 20 );
			context.fill();
		} else {
			if( going )
			{
				context.beginPath();
				context.strokeStyle = '#241F20';
				context.lineWidth = lineWidth;				
				context.moveTo( points[v].x + 322, points[v].y + 322 );
				context.lineTo( follow.x + 322, follow.y + 322 );
				context.stroke();
			}
		}
	}

	chart = document.querySelector( '#chart' );

	lines = document.querySelector( '#lines' );
	lines.src = chart.toDataURL()
}

function polygon( radius )
{
	var points = null;
	var angle = null;
	var deg = null;
	var side = null;
	var xx = null;
	var yy = null;
	
	deg = 0;
	side = 0;
	xx = 0;
	yy = 0;
	angle = 360 / 16;
	points = new Array();
	
	while( side <= 16 ) 
	{
		deg = ( ( angle * side ) - 180 ) / 180 * Math.PI;
		xx = radius * Math.sin( deg );
		yy = radius * Math.cos( deg );
		
		points.push( {x: xx, y: yy} );				
		
		side++;
	}
	
	return points.reverse();			
}

function rotation()
{
	var computed = null;
	var wheel = null;
	var transform = null;
	var values = null;
	
	wheel = document.querySelector( '#wheel' );	
	computed = window.getComputedStyle( wheel, null );	
	transform = computed.getPropertyValue( '-webkit-transform' );
	values = transform.split( '(' )[1].split( ')' )[0].split( ',' );
	
	return Math.round( Math.asin( values[1] ) * ( 180 / Math.PI ) );	
}

function spoke()
{
	var angle = null;	
	var result = null;
	var times = null;
	
	angle = rotation();
	
	if( angle > 360 )
	{
		times = Math.floor( angle / 360 );
		angle = angle - ( 360 * times );
	}

	if( angle <= 0 )
	{
		angle = Math.abs( angle );
	} else {
		angle = 360 - angle;	
	}
	
	if( ( angle % 22.5 ) == 0 )
	{
		result = ( angle / 22.5 );		
	} else {
		result = Math.floor( angle / 22.5 );
		result = angle - ( 22.5 * times );
		
		if( result > 11.25 )
		{
			result = Math.ceil( angle / 22.5 );
		} else {
			result = Math.floor( angle / 22.5 );
		}
	}
	
	return result;				
}

function theta( clientX, clientY )
{
	var cartx = clientX;
	var carty = clientY;
	var deg = 180 / Math.PI;
	var radius = 0;
	var result = 0;
	
	radius = Math.sqrt( cartx * cartx + carty * carty );
	result = Math.atan2( carty, cartx ) * deg;
	
	return ( 0 - ( result - 90 ) );			
}

function doHitDown( evt )
{
	var view = null;
	
	document.body.addEventListener( 'mousemove', doHitMove );
	document.body.addEventListener( 'mouseup', doHitUp );
	
	view = document.querySelector( '#view' );
	
	startr = rotation();
	startt = theta( evt.clientX - view.offsetLeft, evt.clientY - view.offsetTop );
}

function doHitEnd()
{
	var wheel = null;
	
	wheel = document.querySelector( '#wheel' );
	wheel.removeEventListener( 'webkitTransitionEnd', doHitEnd );
	wheel.style.removeProperty( '-webkit-transition' );
}

function doHitMove( evt )
{
	var delta = null;
	var dest = null;
	var label = null;
	var flavor = null;
	var wheel = null;
	
	delta = startt - theta( evt.clientX - view.offsetLeft, evt.clientY - view.offsetTop );
	dest = startr - delta;
	label = labels[spoke()];
	
	wheel = document.querySelector( '#wheel' );
	wheel.style.webkitTransform = 'rotate( ' + dest + 'deg )';

	flavor = document.querySelector( '#flavor' );
	flavor.innerHTML = label;
}

function doHitUp( evt ) 
{
	var closest = null;
	var wheel = null;
	
	closest = rotation();
	closest = Math.round( closest / 22.5 ) * 22.5;	
	
	document.body.removeEventListener( 'mousemove', doHitMove );
	document.body.removeEventListener( 'mouseup', doHitUp );

	wheel = document.querySelector( '#wheel' );
	wheel.addEventListener( 'webkitTransitionEnd', doHitEnd );
	wheel.style.setProperty( '-webkit-transition', 'all 1s' );
	wheel.style.webkitTransform = 'rotate( ' + closest + 'deg )';
			
	startr = 0;
	startt = 0;		
}

function doLoad()
{
	var hit = null;
	var ratings = null;
	
	scoring = new Array();
	
	for( var s = 0; s < 16; s++ )
	{
		scoring.push( 0 );	
	}	
	
	hit = document.querySelector( '#hit-area' );
	hit.addEventListener( 'mousedown', doHitDown );
	
	ratings = document.querySelectorAll( '.rating' );
	
	for( var r = 0; r < ratings.length; r++ )
	{
		ratings[r].addEventListener( 'click', doRatingClick );	
	}
	
	window.onresize = doResize;
	doResize();	
}

function doRatingClick( evt )
{
	var value = null;
	
	switch( this.id )
	{
		case 'one':
			value = 1;
			break;	

		case 'two':
			value = 2;		
			break;	
			
		case 'three':
			value = 3;		
			break;	
			
		case 'four':
			value = 4;		
			break;	
			
		case 'five':
			value = 5;		
			break;													
	}
	
	if( scoring[spoke()] == value )
	{
		scoring[spoke()] = 0;
	} else {
		scoring[spoke()] = value;
	}
		
	draw( [0, 63, 125, 187, 250, 309], 12, 20 );

	wheel = document.querySelector( '#wheel' );
	wheel.addEventListener( 'webkitTransitionEnd', doRatingEnd );
	wheel.style.setProperty( '-webkit-transition', 'all 1s' );
	wheel.style.webkitTransform = 'rotate( ' + ( rotation() - 22.5 ) + 'deg )';
}

function doRatingEnd()
{
	var flavor = null;
	var label = null;
	var wheel = null;
	
	wheel = document.querySelector( '#wheel' );
	wheel.removeEventListener( 'webkitTransitionEnd', doRatingEnd );
	wheel.style.removeProperty( '-webkit-transition' );	
	
	label = labels[spoke()];
	
	flavor = document.querySelector( '#flavor' );
	flavor.innerHTML = label;
}

function doResize()
{
	var view = null;
	
	view = document.querySelector( '#view' );	
	view.style.left = Math.round( ( document.body.offsetWidth - view.offsetWidth ) / 2 ) + 'px';
	view.style.top = Math.round( ( document.body.offsetHeight - view.offsetHeight ) / 2 ) + 'px';		
}