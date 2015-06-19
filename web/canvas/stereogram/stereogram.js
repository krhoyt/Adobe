var cvs = null;
var ctx = null;	
var images = null;
var loaded = 0;
var sizing = null;

$( document ).ready( function() {
	// Update image when channel selection is changed
	$( 'input' ).change( blend );
	
	// Establish canvas references
	cvs = document.getElementById( 'canvas' );
	ctx = cvs.getContext( '2d' );		
	
	// Load the original
	// Start isolating channels
	images = new Array();
	
	images[0] = new Image();
	images[0].onload = function() {
		var blue = null;
		var green = null;
		var pixels = null;
		var red = null;
		
		// Sizing adds depth
		// Target sizes for channels
		// Red, green, blue
		sizing = new Array();
		sizing = [
			{
				width: images[0].width,
				height: images[0].height
			}, {
				width: Math.round( images[0].width + ( images[0].width * 0.01 ) ),
				height: Math.round( images[0].height + ( images[0].height * 0.01 ) )
			}, {
				width: Math.round( images[0].width + ( images[0].width * 0.02 ) ),
				height: Math.round( images[0].height + ( images[0].height * 0.02 ) )
			} 
		];
		
		channels();
	};
	images[0].src = 'image.jpg';
} );

// Screen images together for final product
function blend()
{
	// Do not worry about loading after first pass
	if( loaded != 2 )
	{
		loaded = loaded + 1;
	}
	
	// Blend based on selected channels
	if( loaded == 2 )
	{		
		$( 'input:checked' ).each( function( index, value ) {
			var color = 0;
			
			// Figure out what the first channel should be
			if( index == 0 )
			{
				if( $( this ).attr( 'id' ) == 'red' )
				{
					images[4] = images[1];					
				} else if( $( this ).attr( 'id' ) == 'green' ) {
					images[4] = images[2];					
				} else {
					images[4] = images[3];					
				}
			} else {
				// Add follow-on channels
				if( $( this ).attr( 'id' ) == 'red' )
				{
					color = 1;					
				} else if( $( this ).attr( 'id' ) == 'green' ) {
					color = 2;					
				} else {
					color = 3;					
				}				
				
				// Screen blend
				images[4] = Pixastic.process( images[4], 'blend', {
					amount: 1,
					mode: 'screen',
					image: images[color]
				} );				
			}
		} );
		
		// Clear out the existing image
		// Put the new one on the screen
		$( '#composite' ).empty();
		$( '#composite' ).append( images[4] );
	}
}

// Extract the red, green and blue channels
function channels()
{
	var blue = null;	
	var green = null;
	var offscreen = null;
	var pixels = null;
	var red = null;
	
	// Clear what is already there
	// Size for original image
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	canvas.width = sizing[0].width;
	canvas.height = sizing[0].height;
	
	// Draw the original to get the pixels
	ctx.drawImage( images[0], 0, 0 );
	pixels = ctx.getImageData( 0, 0, sizing[0].width, sizing[0].height );
	
	// Create pixel data holders (not images) for each channel 
	red = ctx.createImageData( sizing[0].width, sizing[0].height );
	green = ctx.createImageData( sizing[0].width, sizing[0].height );
	blue = ctx.createImageData( sizing[0].width, sizing[0].height );
	
	// Separate the colors
	for( var p = 0; p < pixels.data.length; p += 4 )
	{
		// Red channel
		red.data[p + 0] = pixels.data[p + 0];
		red.data[p + 1] = 0;
		red.data[p + 2] = 0;
		red.data[p + 3] = 255;
		
		// Green channel
		green.data[p + 0] = 0;
		green.data[p + 1] = pixels.data[p + 1];
		green.data[p + 2] = 0;
		green.data[p + 3] = 255;
		
		// Blue channel
		blue.data[p + 0] = 0;
		blue.data[p + 1] = 0;
		blue.data[p + 2] = pixels.data[p + 2];
		blue.data[p + 3] = 255;						
	}
	
	// Create the actual image elements 
	// Uses the separated pixel data
	
	// Firefox 3.6 does not allow clipping with putImageData()
	// Make full version on in-memory canvas, clip with drawImage()
	// https://bugzilla.mozilla.org/show_bug.cgi?id=564332
	offscreen = document.createElement( 'canvas' );
	offscreen.width = sizing[0].width;
	offscreen.height = sizing[0].height;
	offscreen.getContext( '2d' ).putImageData( red, 0, 0 );
	
	// Red image
	// ctx.putImageData( red, -5, 0 );
	ctx.drawImage( offscreen, -5, 0 );
	images[1] = new Image();
	images[1].onload = scale;
	images[1].src = cvs.toDataURL();
		
	// Green image
	ctx.putImageData( green, 0, 0 );
	images[2] = new Image();
	images[2].onload = scale;
	images[2].src = cvs.toDataURL();

	// Blue image
	ctx.putImageData( blue, 0, 0 );
	images[3] = new Image();
	images[3].onload = scale;
	images[3].src = cvs.toDataURL();	
}

// Scale images to simulate depth
function scale()
{
	loaded = loaded + 1;
	
	// Make sure all the images have been processed
	if( loaded == 3 )
	{
		// Reset for blend
		loaded = 0;
		
		// Scale green image
		canvas.width = sizing[1].width;
		canvas.height = sizing[1].height;
		ctx.drawImage( images[2], 5, 0, canvas.width, canvas.height );
		images[2].onload = blend;
		images[2].src = cvs.toDataURL();
		
		// Scale blue image
		canvas.width = sizing[2].width;
		canvas.height = sizing[2].height;
		ctx.drawImage( images[3], 5, 0, canvas.width, canvas.height );
		images[3].onload = blend;
		images[3].src = cvs.toDataURL();		
	}
}