function doLoad()
{
	// Dynamically position drop zone
	// Set initial position on load
	window.onresize = layout;
	layout();
	
	document
		.querySelector( '#moe' )
		.addEventListener( 'click', function( evt ) {
			alert( 'Click' );
		} );
	
	// Enable drag over DOM element
	document
		.querySelector( '#landing-pad' )
		.addEventListener( 'dragover', function( evt ) {
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy';
		} );
	
	// Catch drop over DOM element
	document
		.querySelector( '#landing-pad' )
		.addEventListener( 'drop', function( evt ) {
			var reader = null;
			
			evt.stopPropagation();
    		evt.preventDefault();
			
			// Read the dropped files contents			
			reader = new FileReader();
			reader.onload = function( ev ) {
				var dropped = null;
				var image = null;
				
				// Create an image object of the dropped file
				// Put image into canvas for access to pixel data
				dropped = new Image();
				dropped.onload = function( e ) {
					var canvas = null;
					var context = null;
					var picture = null;
					
					// Setup canvas handling for access to pixel data
					canvas = document.querySelector( '#pixels' );
					context = canvas.getContext( '2d' );					
					
					canvas.width = e.target.width;
					canvas.height = e.target.height;
					
					context.drawImage( e.target, 0, 0 );
					
					image = context.getImageData( 0, 0, e.target.width, e.target.height );
					
					// Remove any previously generated picture element
					// If a previous generation has taken place
					picture = document.querySelector( '#picture-frame' );
					
					if( picture != null )
					{
						document.body.removeChild( picture );
					}
								
					// Process pixel data to build CSS image
					process( image );
				};
				dropped.src = ev.target.result;
			};
			reader.readAsDataURL( evt.dataTransfer.files[0] );
		} );	
}

// Dynamically position the drop area
// Centers in the middle of the window
function layout() 
{
	var drop = null;
	
	drop = document.querySelector( '#landing-pad' );
	drop.style.left = 
		( window.outerWidth - drop.offsetWidth ) / 2;
}

// Parses a CSS pixel value to a JavaScript numeric value
function pixelToNumber( value )
{
	return parseInt( value.slice( 0, value.length - 2 ) ); 
}

// Process an images pixel data 
// Builds a duplicate image with CSS
function process( image ) 
{
	var alpha = null;
	var blue = null;
	var element = null;
	var green = null;
	var pixel = null;
	var red = null;
	var row = null;
	
	// For performance testing
	var end = null;
	var start = new Date();
	
	// Create the picture frame
	element = document.createElement( 'div' );
	element.id = 'picture-frame';
	element.style.width = image.width;
	element.style.height = image.height;
	element.style.position = 'absolute';
	element.style.left = 40;
	element.style.bottom = 15;
	
	// Build the picture by crawling pixels
	for( var r = 0; r < image.height; r++ )
	{
		for( var c = 0; c < image.width; c++ )
		{
			// Get the RGB color values for the current pixel
			red = image.data[( ( r * ( image.width * 4 ) ) + ( c * 4 ) )];
			green = image.data[( ( r * ( image.width * 4 ) ) + ( c * 4 ) ) + 1];
			blue = image.data[( ( r * ( image.width * 4 ) ) + ( c * 4 ) ) + 2];
			
			// Divide to ratio of maximum value
			alpha = image.data[( ( r * ( image.width * 4 ) ) + ( c * 4 ) ) + 3];
			alpha = alpha / 255;			
			
			// Reduce elements to be created
			if( pixel != null )
			{
				// If existing color matches upcoming color
				// Do not create new element
				// Make existing element longer
				if( pixel.style.backgroundColor == ( 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')' ) ) 
				{
					// Watch for bleed on element reduction
					if( row == r )
					{
						pixel.style.width = pixelToNumber( pixel.style.width ) + 1;
						continue;
					}
				}				
			}

			// Build the pixel
			pixel = document.createElement( 'div' );
			
			// Style the pixel
			pixel.style.width = 1;
			pixel.style.height = 1;
			pixel.style.position = 'absolute';
			pixel.style.left = c;
			pixel.style.top = r;
			pixel.style.backgroundColor = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
			
			// Add the pixel to the picture
			element.appendChild( pixel );
			
			// Watch for bleed on element reduction
			row = r;		
		}
	}
			
	// Add the picture to the document
	document.body.appendChild( element );
	
	// Performance testing
	// How long to complete assembly and rendering
	end = new Date();
	console.log( ( end.getTime() - start.getTime() ) / 1000 );
	
	console.log( element.childNodes.length );
}