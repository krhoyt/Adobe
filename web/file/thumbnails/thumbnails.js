// Constants
var THUMBNAIL_HEIGHT = 100;
var THUMBNAIL_WIDTH = 100;

// Track files to load
var files = null;
var index = null;

// Called to resize images
// Iterates over dropped files
function resize()
{
	var reader = null;	
	
	// Initialize counter on first pass
	// Increment on subsequent passes
	if( index == null )
	{
		index = 0;
	} else {
		index = index + 1;		
	}
			
	// So long as there are dropped files to read
	if( index < files.length )
	{
		// Start reading file for current iteration		
		reader = new FileReader();
		reader.addEventListener( 'load', doReaderLoad );
		reader.readAsDataURL( files[index] );			
	} else {
		// Clear tracking for future drops
		files = null;
		index = null;	
	}
}

// Called when files are dragged over the document
// Shows copy indicator per operation system
function doDragOver( evt ) 
{
	// Stop default handling
	evt.stopPropagation();
	evt.preventDefault();
	
	// Show operation indicator
	evt.dataTransfer.dropEffect = 'copy';
}

// Called when files are dropped onto the document
// Kicks off image resizing
function doDrop( evt )
{		
	// Stop default handling
	evt.stopPropagation();
    evt.preventDefault();
	
	// Keep a reference to the dropped files
	files = evt.dataTransfer.files;
	
	// Start loading and resizing
	resize();
}
		
// Called when the full size image has loaded
// Full size image is not displayed to user
// Gives us initial data and sizing information
function doImageLoad()
{
	var canvas = null;
	var context = null;
	var image = null;
	var ratio = null;
	var scaleHeight = null;
	var scaleWidth = null;
	
	// Clean up event listener from image element
	this.removeEventListener( 'load', doImageLoad );
	
	// Determine how to scale the image
	// Prevents image distortion
	// Respects horizontal and vertical orientation
	// Clips to fit in a square thumnail
	if( this.width > this.height )
	{
		ratio = this.width / this.height;
		
		scaleHeight = THUMBNAIL_HEIGHT;
		scaleWidth = Math.round( THUMBNAIL_WIDTH * ratio );	
	} else {
		ratio = this.height / this.width;	
		
		scaleWidth = THUMBNAIL_WIDTH;		
		scaleHeight = Math.round( THUMBNAIL_HEIGHT * ratio );		
	}
	
	// Get a reference to the canvas for image manipulation
	// Size for square thumbnail clipping
	canvas = document.querySelector( '#work' );
	canvas.width = THUMBNAIL_WIDTH;
	canvas.height = THUMBNAIL_HEIGHT;	
	
	// Reference to context for image sizing
	context = canvas.getContext( '2d' );					

	// Draw the loaded image at a smaller size
	// Center image to fit square for clipping
	context.drawImage( 
		this, 
		Math.round( ( THUMBNAIL_WIDTH - scaleWidth ) / 2 ), 
		Math.round( ( THUMBNAIL_HEIGHT - scaleHeight ) / 2 ), 
		scaleWidth, 
		scaleHeight );

	// Create a new thumbnail image holder
	// Size the image
	// Pull canvas content as Base64 encoded image data
	image = document.createElement( 'img' );
	image.width = THUMBNAIL_WIDTH;
	image.height = THUMBNAIL_HEIGHT;
	image.src = canvas.toDataURL();
	
	// Add thumbnail to the document
	document.body.appendChild( image );	
	
	// Resize the subsequent image
	resize();		
}
		
// Called when the window has loaded all content
// Configures drag and drop operation listeners
function doLoad()
{
	document.addEventListener( 'dragover', doDragOver );
	document.addEventListener( 'drop', doDrop );	
}

// Called when a dropped image file has been read
// Creates and image holder for the full size image
function doReaderLoad( evt ) 
{
	var dropped = null;
	
	// Remove event listener from file reader
	this.removeEventListener( 'load', doReaderLoad );			
				
	// Create image holder
	// Listen for when the data has loaded
	// High resolution files take time
	// Load the image file data as read
	dropped = new Image();
	dropped.addEventListener( 'load', doImageLoad );
	dropped.src = evt.target.result;
}

// Listen for the document to finish loading
window.addEventListener( 'load', doLoad );