var CANVAS_BACKGROUND = '#808080';
var CIRCLE_RADIUS = 10;
var DEFAULT_COLOR = '#EBEBEB';
var DEFAULT_FONT = '16px Arial';
var DEFAULT_SHADOW = '#4f4f4f';
var DEFAULT_TEXT = 'Drag and drop an image into the browser.';
var IMAGE_LANDSCAPE = 'landscape';
var IMAGE_PORTRAIT = 'portrait';
var SIZING_LANDSCAPE = 0.55;
var SIZING_PORTRAIT = 0.80;

var canvas = null;
var context = null;
var down = null;
var dropped = null;
var end = null;
var reader = null;
var rotation = null;
var start = null;

function clear( ctx, width, height )
{
	ctx.fillStyle = CANVAS_BACKGROUND;
	ctx.fillRect( 0, 0, width, height );	
}

function redraw()
{
	var bounds = null;
	var centerx = null;
	var centery = null;
	var footer = null;
	var rotate = null;
	var rotatec = null;
	var scale = null;
	var translatex = null;
	var translatey = null;
	
	clear( context, canvas.width, canvas.height );
	
	if( dropped == null )
	{
		context.shadowColor = DEFAULT_SHADOW;
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.shadowBlur = 0;			
		context.font = DEFAULT_FONT;
		context.fillStyle = DEFAULT_COLOR;
		context.textAlign = 'center';
		context.fillText( 
			DEFAULT_TEXT, 
			Math.round( window.innerWidth / 2 ),
			Math.round( window.innerHeight / 2 )
		);
	} else {	
		context.shadowColor = DEFAULT_SHADOW;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 5;
		context.shadowBlur = 15;		
		
		footer = document.querySelector( '#footer' );		
		scale = document.querySelector( '#scale' );
		
		if( rotation != null )
		{	
			rotate = document.querySelector( '#rotate' );
			rotatec = rotate.getContext( '2d' );
			clear( rotatec, rotate.width, rotate.height );
		
			rotatec.save();
			rotatec.translate( window.innerWidth / 2, 
				( window.innerHeight - footer.clientHeight ) / 2
			);
			rotatec.rotate( rotation );
			rotatec.drawImage( 
				scale, 
				0 - ( scale.width / 2 ), 
				0 - ( scale.height / 2 ) 
			);
			rotatec.restore();	
		
			centerx = scale.width / 2;
			centery = scale.height / 2;
			translatex = centerx + ( 0 - centerx ) * Math.cos( rotation ) + ( 0 - centery ) * Math.sin( rotation );
			translatey = centery - ( 0 - centerx ) * Math.sin( rotation ) + ( 0 - centery ) * Math.cos( rotation );		
			
			bounds = {
				x: Math.round( ( window.innerWidth / 2 ) - ( scale.width / 2 ) - translatex ),
				y: Math.round( ( ( window.innerHeight - footer.clientHeight ) / 2 ) - ( scale.height / 2 ) + translatey ),
				width: Math.round( ( window.innerWidth / 2 ) + ( scale.width / 2 ) + translatex ),
				height: Math.round( ( ( window.innerHeight - footer.clientHeight ) / 2 ) + ( scale.height / 2 ) - translatey )
			};
			
			bounds.width = bounds.width - bounds.x;
			bounds.height = bounds.height - bounds.y;		
		
			context.drawImage( 
				rotate, 
				bounds.x, 
				bounds.y, 
				bounds.width, 
				bounds.height, 
				bounds.x, 
				bounds.y, 
				bounds.width, 
				bounds.height 
			);
		} else {
			context.drawImage( 
				scale,
				Math.round( ( window.innerWidth - scale.width ) / 2 ),
				Math.round( ( ( window.innerHeight - footer.clientHeight ) - scale.height ) / 2 ) );				
		}
	}
	
	if( start != null )
	{
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 1;
		context.shadowBlur = 0;			
		
		context.strokeStyle = '#ffffff';
		context.beginPath();
		context.arc( start.x, start.y, CIRCLE_RADIUS, 0, Math.PI * 2, true );
		context.stroke();
		
		context.beginPath();
		context.arc( start.x, start.y, 1.5, 0, Math.PI * 2, true );
		context.stroke();		
	}
	
	if( end != null )
	{
		if( !down )
		{
			context.beginPath();
			context.arc( end.x, end.y, CIRCLE_RADIUS, 0, Math.PI * 2, true );
			context.stroke();			
		}		
		
		context.beginPath();
		context.moveTo( start.x, start.y );
		context.lineTo( end.x, end.y );
		context.stroke();		
		
		context.beginPath();
		context.arc( end.x, end.y, 1.5, 0, Math.PI * 2, true );
		context.stroke();					
	}
}

function doApplyClick()
{
	var adjacent = null;
	var opposite = null;
	
	if( start != null && end != null )
	{
		opposite = Math.max( start.y, end.y ) - Math.min( start.y, end.y );
		adjacent = Math.max( start.x, end.x ) - Math.min( start.x, end.x );
		
		rotation = Math.tan( opposite / adjacent );
		// alert( Math.tan( opposite / adjacent ) * ( 180 / Math.PI ) );	
		
		start = null;
		end = null;
		down = null;
		
		redraw();		
	} else {
		alert( 'No slope was provided.' );
	}
}

function doCanvasDown( evt )
{
	var bounds = null;
	var footer = null;
	var scale = null;
	
	footer = document.querySelector( '#footer' );		
	scale = document.querySelector( '#scale' );
	
	bounds = {
		x: Math.round( ( window.innerWidth - scale.width ) / 2 ),
		y: Math.round( ( ( window.innerHeight - footer.clientHeight ) - scale.height ) / 2 ),
		width: scale.width,
		height: scale.height
	};				
	
	bounds.width = bounds.x + bounds.width;
	bounds.height = bounds.y + bounds.height;
	
	if( evt.clientX >= bounds.x && evt.clientX <= bounds.width &&
		evt.clientY >= bounds.y && evt.clientY <= bounds.height ) {
		start = {
			x: evt.clientX,
			y: evt.clientY
		};
		end = null;
		down = true;
		
		canvas.addEventListener( 'mousemove', doCanvasMove );
		canvas.addEventListener( 'mouseup', doCanvasUp );
	
		redraw();				
	}
}

function doCanvasDrag( evt )
{
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

function doCanvasDrop( evt )
{
	evt.stopPropagation();
    evt.preventDefault();	
	
	if( reader == null )
	{
		reader = new FileReader();
		reader.onload = doReaderLoad;
	}
	
	dropped = null;
	clear( context, canvas.width, canvas.height );
		
	reader.readAsDataURL( evt.dataTransfer.files[0] );	
}

function doCanvasMove( evt )
{
	end = {
		x: evt.clientX,
		y: evt.clientY
	};
	
	redraw();	
}

function doCanvasUp( evt )
{
	var distance = null;
	
	distance = Math.sqrt( Math.pow( evt.clientX - start.x, 2 ) + Math.pow( evt.clientY - start.y, 2 ) );
	
	canvas.removeEventListener( 'mousemove', doCanvasMove );
	canvas.removeEventListener( 'mouseup', doCanvasUp );
	
	down = false;
	
	if( distance < CIRCLE_RADIUS )
	{
		start = null;
		end = null;
	} else {
		end = {
			x: evt.clientX,
			y: evt.clientY
		};			
	}
	
	redraw();
}

function doClearClick()
{
	var button = null;
	var footer = null;
	
	canvas.removeEventListener( 'mousedown', doCanvasDown );
	
	button = document.querySelector( '#clear' );
	button.removeEventListener( 'click', doClearClick );
	
	button = document.querySelector( '#apply' );
	button.removeEventListener( 'click', doApplyClick );			
	
	dropped = null;
	start = null;
	end = null;
	down = null;
	rotation = null;
	
	footer = document.querySelector( '#footer' );
	footer.style.bottom = ( 0 - footer.clientHeight ) + 'px';	
	
	redraw();
}

function doImageLoad()
{
	var button = null;
	var footer = null;
	var ratio = null;
	var scale = null;
	var scaleContext = null;
	var scaleHeight = null;
	var scaleWidth = null;
	
	canvas.addEventListener( 'mousedown', doCanvasDown );
	
	button = document.querySelector( '#clear' );
	button.addEventListener( 'click', doClearClick );
	
	button = document.querySelector( '#apply' );
	button.addEventListener( 'click', doApplyClick );		
	
	if( dropped.width > dropped.height )
	{
		ratio = dropped.height / dropped.width;
	
		scaleWidth = Math.round( canvas.width * SIZING_LANDSCAPE )	
		scaleHeight = Math.round( scaleWidth * ratio );
	} else {
		ratio = dropped.width / dropped.height;	
		
		scaleHeight = Math.round( canvas.height * SIZING_PORTRAIT );			
		scaleWidth = Math.round( scaleHeight * ratio );	
	}

	scale = document.querySelector( '#scale' );
	scaleContext = scale.getContext( '2d' );

	clear( scaleContext, scale.width, scale.height );

	scale.width = scaleWidth;
	scale.height = scaleHeight;

	scaleContext.drawImage( dropped, 0, 0, scaleWidth, scaleHeight );	

	footer = document.querySelector( '#footer' );
	footer.style.bottom = '0px';

	start = null;
	end = null;
	down = null;
	rotation = null;

	redraw();
}

function doLoad()
{
	canvas = document.querySelector( '#level' );
	canvas.addEventListener( 'dragover', doCanvasDrag );
	canvas.addEventListener( 'drop', doCanvasDrop );
	
	context = canvas.getContext( '2d' );
	
	doResize();
}

function doReaderLoad( evt )
{
	if( dropped == null )
	{
		dropped = new Image();
		dropped.onload = doImageLoad;			
	}
	
	dropped.src = evt.target.result;	
}

function doResize()
{
	var rotate = null;
	
	rotate = document.querySelector( '#rotate' );
	rotate.width = window.innerWidth;
	rotate.height = window.innerHeight;
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;	
	
	redraw();
}

window.onload = doLoad;
window.onresize = doResize;