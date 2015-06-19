var DASH_GAP = 4;
var INTERPOLATE_GAP = 2;
var SOLID_DASH = 8;

var canvas = null;
var fade = null;
var pattern = 0;
var paths = null;
var planes = new Array();
var tracing = null;

$( document ).ready( function() {
	paths = document.getElementById( 'paths' ).getContext( '2d' );
	
	canvas = document.getElementById( 'fade' );	
	fade = document.getElementById( 'fade' ).getContext( '2d' );	
	
	$( window ).resize( layout );
	layout();			
	
	pattern = setInterval( update, 50 );
} );

function clear( context )
{
	context.clearRect( 0, 0, window.innerWidth, window.innerHeight );	
}

function createPlane()
{
	var aircraft = 0;
	var now = null;
	var plane = null;
	
	now = new Date();
	
	plane = {
		id: now.getTime(),
		path: generatePath(),
		state: 'autopilot'
	};
	
	aircraft = Math.random();
	
	if( aircraft >= 0 && aircraft < 0.33 ) 
	{
		plane.aircraft = 'cessna';
		plane.translate = '-32px,-22px';
	} else if( aircraft >= 0.33 && aircraft < 0.66 ) {
		plane.aircraft = 'mitchell';	
		plane.translate = '-32px,-26px';		
	} else {
		plane.aircraft = 'airbus';	
		plane.translate = '-32px,-28px';
	}
	
	planes.push( plane );
	
	$( '<div></div>' )
		.attr( 'id', plane.id )
		.addClass( plane.aircraft )
		.addClass( 'plane' )
		.css( 'left', plane.path[0].x + 'px' )
		.css( 'top', plane.path[0].y + 'px' )
		.mousedown( doPlaneDown )
		.appendTo( 'body' );
}

function dashedPath( context, coordinates )
{
	var current = 0;
	var jump = 0;
	
	clear( context );
	
	context.beginPath();	
	context.strokeStyle = 'rgb( 255, 255, 255 )';			
	context.lineWidth = 4;	
	
	while( current < ( coordinates.length - 1 ) )
	{
		jump = seekPoint( coordinates, current, SOLID_DASH );
		
		context.moveTo( coordinates[current].x, coordinates[current].y );
		context.lineTo( coordinates[jump].x, coordinates[jump].y );

		current = seekPoint( coordinates, jump, SOLID_DASH );		
	}
	
	context.stroke();	
}

function drawPath( context, coordinates )
{
	clear( context );
	
	context.moveTo( coordinates[0].x, coordinates[0].y );	
		
	context.beginPath();	
	context.strokeStyle = 'rgb( 144, 189, 70 )';
	context.lineWidth = 1;	

	for( var c = 0; c < coordinates.length; c++ )
	{
		context.lineTo( coordinates[c].x, coordinates[c].y );
	}
	
	context.stroke();
}

function generatePath()
{
	var end = null;
	var points = new Array();
	var side = Math.round( Math.random() * 100 );
	var start = null;
		
	if( side >= 0 && side < 25 )
	{
		start = {
			x: Math.round( Math.random() * window.innerWidth ),
			y: -70
		};

		end = {
			x: Math.round( Math.random() * window.innerWidth ),
			y: window.innerHeight + 70
		};
	} else if( side >= 25 && side < 50 ) {
		start = {
			x: window.innerWidth + 70,
			y: Math.round( Math.random() * window.innerHeight )
		};		
		
		end = {
			x: -70,
			y: Math.round( Math.random() * window.innerHeight )
		};				
	} else if( side >= 50 && side < 75 ) {
		start = {
			x: Math.round( Math.random() * window.innerWidth ),
			y: window.innerHeight + 70	
		};

		end = {
			x: Math.round( Math.random() * window.innerWidth ),
			y: -70	
		};		
	} else if( side >= 75 && side <= 100 ) {
		start = {
			x: -70,
			y: Math.round( Math.random() * window.innerHeight )
		};				
	
		end = {
			x: window.innerWidth + 70,
			y: Math.round( Math.random() * window.innerHeight )
		};						
	}
	
	return lineInterpolate( start, end, 1 );
}

function layout()
{
	$( '#paths' )
		.attr( 'width', window.innerWidth )
		.attr( 'height', window.innerHeight );
		
	$( '#fade' )
		.attr( 'width', window.innerWidth )
		.attr( 'height', window.innerHeight );			
}

function lineDistance( point1, point2 )
{
	var xs = 0;
	var ys = 0;
	
	xs = point2.x - point1.x;
	xs = xs * xs;
	
	ys = point2.y - point1.y;
	ys = ys * ys;		
	
	return Math.sqrt( xs + ys );		
}

function lineInterpolate( point1, point2, distance )
{
	var xabs = Math.abs( point1.x - point2.x );
	var yabs = Math.abs( point1.y - point2.y );	
	var xdiff = point2.x - point1.x;
	var ydiff = point2.y - point1.y;

	var length = Math.sqrt( ( Math.pow( xabs, 2 ) + Math.pow( yabs, 2 ) ) );
	var steps = length / distance;
	var xstep = xdiff / steps;
	var ystep = ydiff / steps;

	var newx = 0;
	var newy = 0;
	var result = new Array();

	for( var s = 1; s < steps; s++ ) 
	{
		newx = point1.x + ( xstep * s );
		newy = point1.y + ( ystep * s );
            
		result.push( {
			x: newx,
			y: newy	
		} );
	}

	return result;  	
}

function seekPoint( coordinates, start, distance )
{
	var result = 0;
	
	while( result < distance )
	{
		if( start == ( coordinates.length - 1 ) )
		{
			break;
		}
		
		result = result + lineDistance( coordinates[start], coordinates[start + 1] );
		start = start + 1;
	}

	return start;	
}

function update()
{
	var ahead = null;
	var angle = 0;
	var current = null;
	
	if( planes.length == 0 && tracing == null )
	{
		createPlane();
	}	
	
	for( var p = 0; p < planes.length; p++ )
	{
		planes[p].path.splice( 0, 1 );
		
		if( planes[p].path.length == 0 )
		{
			$( '#' + planes[p].id ).remove();
			planes.splice( p, 1 );
		} else {
			if( planes[p].state == 'custom' )
			{
				drawPath( paths, planes[p].path );
			}
			
			$( '#' + planes[p].id )
				.css( 'left', planes[p].path[0].x + 'px' )
				.css( 'top', planes[p].path[0].y + 'px' );
			
			if( planes[p].path.length > 1 )
			{
				current = planes[p].path[0];
				ahead = planes[p].path[1];
				
				angle = Math.atan2( ( ahead.y - current.y ), ( ahead.x - current.x ) );	
				angle = ( angle * ( 180 / Math.PI ) ) + 90;
	
				$( '#' + planes[p].id )
					.css( '-moz-transform', 'translate(' + planes[p].translate + ') rotate(' + angle + 'deg)' )
					.css( '-webkit-transform', 'translate(' + planes[p].translate + ') rotate(' + angle + 'deg)' );							
			}					
		}
	}	
}

function doDocumentMove( evt )
{
	var fill = null;
	var point = {
		x: evt.pageX,
		y: evt.pageY
	};
	var previous = null;

	if( tracing.path.length > 0 )
	{
		previous = {
			x: tracing.path[tracing.path.length - 1].x,
			y: tracing.path[tracing.path.length - 1].y
		};
		
		if( lineDistance( previous, point ) > DASH_GAP )
		{
			fill = lineInterpolate( previous, point, INTERPOLATE_GAP );
			
			for( var f = 0; f < fill.length; f++ )
			{
				tracing.path.push( fill[f] );
			}
		}
	}
	
	tracing.path.push( point );
	dashedPath( paths, tracing.path );								
}

function doDocumentUp()
{
	var img = null;
	
	$( document )
		.unbind( 'mousemove' )
		.unbind( 'mouseup' );
	
	tracing.state = 'custom';
	planes.push( tracing );

	drawPath( fade, tracing.path );
	img = $( '<img/>' )
		.attr( 'id', 'path' + tracing.id )
		.attr( 'src', canvas.toDataURL() )
		.css( 'opacity', 0 )
		.addClass( 'path' )
		.prependTo( 'body' );		
	
	dashedPath( fade, tracing.path );		
	clear( paths );

	$( img ).animate( {
		opacity: 1
	}, 
	400 );
	
	$( canvas ).animate( {
		opacity: 0
	}, 
	400,
	function() {
		clear( fade );
		$( canvas ).css( 'opacity', 1 );
		$( '#path' + tracing.id ).remove();
		tracing = null;			
	} );		
}

function doPlaneDown( evt )
{
	var id = $( this ).attr( 'id' );
	
	for( var p = 0; p < planes.length; p++ )
	{
		if( planes[p].id == id )
		{
			tracing = planes[p];
			planes.splice( p, 1 );
			
			tracing.state = 'active';			
			tracing.path = new Array();
			tracing.path.push( {
				x: evt.pageX,
				y: evt.pageY
			} );
			
			break;
		}
	}
	
	$( document )
		.mousemove( doDocumentMove )
		.mouseup( doDocumentUp );
}