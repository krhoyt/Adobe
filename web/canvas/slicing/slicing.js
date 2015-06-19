var ctx = null;
var frame = {
	x: 50,
	y: 75,
	width: 85,
	height: 103
};
var result = null;
var slice = null;

function bounds( viewport )
{
	if( viewport.x < 0 )
	{
		viewport.x = 0;
	}
	
	if( ( viewport.x + viewport.width ) > 300 ) {
		viewport.x = 300 - viewport.width;
	}
	
	if( viewport.y < 0 )
	{
		viewport.y = 0;
	}
	
	if( ( viewport.y + viewport.height ) > 227 ) {
		viewport.y = 227 - viewport.height;
	}
	
	return viewport;		
}

function redraw( mouse )
{
	var pt = null;
	
	if( mouse != null )
	{
		pt = {
			x: mouse.clientX - slice.offsetLeft,
			y: mouse.clientY - slice.offsetTop	
		};
		
		frame.x = pt.x - Math.round( frame.width / 2 );
		frame.y = pt.y - Math.round( frame.height / 2 );
		frame = bounds( frame );		
	}

	ctx.drawImage( document.getElementById( 'bus' ), 0, 0 );
	
	ctx.fillStyle = 'rgba( 255, 255, 255, 0.80 )';
	ctx.fillRect( 0, 0, 300, frame.y );
	ctx.fillRect( 0, frame.y, frame.x, frame.height );
	ctx.fillRect( 0, frame.y + frame.height, 300, 227 - frame.height );
	ctx.fillRect( frame.x + frame.width, frame.y, 300 - frame.width, frame.height );			

	result.clearRect( 0, 0, 132, 150 );
	result.drawImage( document.getElementById( 'bus' ), frame.x, frame.y, frame.width, frame.height, 22, 21, frame.width, frame.height );
	result.drawImage( document.getElementById( 'frame' ), 0, 0 );
}

function doBusLoad()
{
	alert( 'Bus' );
	redraw( null );				
}

function doSliceDown( evt )
{
	redraw( evt );	

	slice.addEventListener( 'mousemove', doSliceMove );
	slice.addEventListener( 'mouseup', doSliceUp );
}

function doSliceMove( evt )
{
	redraw( evt );
}

function doSliceUp()
{
	slice.removeEventListener( 'mousemove', doSliceMove );
	slice.removeEventListener( 'mouseup', doSliceUp );
}

function doWindowLoad()
{
	var bus = null;
	
	slice = document.getElementById( 'slice' );	

	if( slice.getContext )
	{
		ctx = slice.getContext( '2d' );
		result = document.getElementById( 'result' ).getContext( '2d' );

		slice.addEventListener( 'mousedown', doSliceDown );
		
		redraw( null );
	}	
}

window.onload = doWindowLoad;