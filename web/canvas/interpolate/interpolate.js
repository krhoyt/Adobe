var INTERPOLATE_GAP = 5;

var canvas = null;
var context = null;
var follow = null;

function draw()
{
	var check = null;
	var complete = null;
	var fill = null;
	var steps = null;				
	
	canvas.removeEventListener( 'mousemove', doCanvasMove );
	canvas.removeEventListener( 'mouseup', doCanvasUp );
	
	check = document.querySelector( '#check' );
	
	if( check.src.indexOf( 'not' ) >= 0 )
	{
		fill = false;
	} else {
		fill = true;	
	}
	
	complete = new Array();
	
	for( var i = 0; i < follow.length - 1; i++ )
	{
		complete.push( follow[i] );
		
		if( fill )
		{
			steps = interpolate( follow[i], follow[i + 1], INTERPOLATE_GAP );
			
			for( var s = 0; s < steps.length; s++ )
			{
				complete.push( steps[s] );		
			}			
		}
	}
		
	for( var c = 0; c < complete.length; c++ )
	{
		context.fillStyle = 'rgba( 255, 0, 0, 0.5 )';
		context.strokeStyle = 'rgba( 0, 255, 0, 0 )';
		context.lineWidth = 1;			
		
		context.beginPath();
		context.arc( complete[c].x, complete[c].y, 10, 0, Math.PI * 2, true );									
		context.stroke();
		context.fill();		
	}		
}

function interpolate( point1, point2, distance )
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

	for( var s = 0; s < steps; s++ ) 
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

function line()
{
	context.clearRect( 0, 0, canvas.width, canvas.height );
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 3;			
	context.moveTo( follow[0].x, follow[0].y );
	context.beginPath();
	
	for( var p = 0; p < follow.length; p++ )
	{
		context.lineTo( follow[p].x, follow[p].y );		
	}	
	
	context.stroke();						
}

function doCanvasDown( evt )
{
	follow = new Array();
	context.clearRect( 0, 0, canvas.width, canvas.height );
	
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 3;			
	context.moveTo( evt.pageX, evt.pageY );
	context.beginPath();
	
	canvas.addEventListener( 'mousemove', doCanvasMove );
	canvas.addEventListener( 'mouseup', doCanvasUp );					
}

function doCanvasMove( evt )
{
	follow.push( {
		x: evt.pageX,
		y: evt.pageY	
	} );
				
	context.lineTo( evt.pageX, evt.pageY );		
	context.stroke();	
}

function doCanvasUp()
{
	draw();
}

function doCheckDown()
{
	var source = null;
	
	source = this.src;
	
	if( source.indexOf( 'not' ) >= 0 )
	{
		source = source.replace( '.not.up', '.down' );
	} else {
		source = source.replace( '.up', '.not.down' );		
	}

	this.src = source;
}

function doCheckUp()
{
	var source = null;
	
	source = this.src.replace( '.down', '.up' );
	this.src = source;	
	
	line();
	draw();
}

function doLoad()
{
	canvas = document.getElementById( 'paths' );	

	if( canvas.getContext )
	{
		context = canvas.getContext( '2d' );
		canvas.addEventListener( 'mousedown', doCanvasDown ); 
	}
	
	check = document.querySelector( '#check' );
	check.addEventListener( 'mousedown', doCheckDown );
	check.addEventListener( 'mouseup', doCheckUp );
	
	window.onresize = doResize();
	doResize();
}

function doResize()
{
	var field = null;
	
	field = document.querySelector( '#field' );
	
	canvas.width = field.scrollWidth;
	canvas.height = field.scrollHeight;
}