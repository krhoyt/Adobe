// Constant for image size
var IMAGE_SIZE = 180;

// Reference to file reader
var reader = null;

// Called when a file is dropped onto the document body
// Starts reading the file
function doDragDrop( evt )
{
	// Stop normal event handling
	evt.stopPropagation();
	evt.preventDefault();

	// Configure the reader if not already created
	if( reader == null )
	{
		// Listen for when the file is loaded
		reader = new FileReader();
		reader.onload = doReaderLoad;		
	}
	
	// Read in the file that was dropped on the document body
	reader.readAsDataURL( evt.dataTransfer.files[0] );	
}

// Called when a file is dragged over the document body
// Prevents normal event handling
function doDragOver( evt )
{
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

// Called when the image has been loaded
// Manipulates sizing
// Creates a mask
// Composites the sized image with the mask
function doImageLoad( evt )
{
	var context = null;
	var mask = null;
	var photo = null;	
	var place = null;
	var scale = null;
	var sized = null;
	
	// Get canvas used to image sizing
	// Clear what was there before doing anything	
	sized = document.querySelector( '#sized' );
	context = sized.getContext( '2d' );
	context.clearRect( 0, 0, sized.width, sized.height );
	
	// Size the image to fit the inner circle
	// Also centers image
	if( this.height > this.width )
	{
		scale = IMAGE_SIZE / this.width;
		place = Math.round( ( IMAGE_SIZE - ( this.height * scale ) ) / 2 );
		
		context.drawImage( this, 0, place, this.width * scale, this.height * scale );		
	} else {
		scale = IMAGE_SIZE / this.height;
		place = Math.round( ( IMAGE_SIZE - ( this.width * scale ) ) / 2 );
				
		context.drawImage( this, place, 0, this.width * scale, this.height * scale );				
	}	
	
	// Get the canvas used for the mask
	// Clear what was there before doing anything	
	mask = document.querySelector( '#mask' );
	context = mask.getContext( '2d' );		
	context.clearRect( 0, 0, mask.width, mask.height );	
	
	// Use XOR compositing to create a circular hole in the image
	context.globalCompositeOperation = 'xor';	
	context.drawImage( sized, 0, 0 );
	context.fillStyle = 'rgb( 0, 0, 0 )';
	context.beginPath();
	context.arc( IMAGE_SIZE / 2, IMAGE_SIZE / 2, IMAGE_SIZE / 2, 0, Math.PI * 2, true ); 
	context.closePath();
	context.fill();
	
	// Get the canvas used for final display
	// Clear what was there before doing anything		
	photo = document.querySelector( '#photo' );
	context = photo.getContext( '2d' );
	context.clearRect( 0, 0, photo.width, photo.height );	
	
	// Also uses XOR compositing
	// Draw sized image
	// Draw sized image with whole in it
	// The result is seeing on what is where the hole is
	context.globalCompositeOperation = 'xor';		
	context.drawImage( sized, 0, 0 );
	context.drawImage( mask, 0, 0 );
}

// Called when the document has finished loading
// Configures drag and drop
// Configures layout management
function doLoad()
{
	// Configure drag and drop event listeners
	document.body.addEventListener( 'dragover', doDragOver );	
	document.body.addEventListener( 'drop', doDragDrop );
	
	// Configure window resize listener
	// Perform initial layout
	window.onresize = doResize;
	doResize();
}

// Called when the file reader has finished loading the file
// Creates image object to hold image
// Loads image
function doReaderLoad( evt )
{
	var dropped = null;
	var image = null;

	// Create and load image contents from file reader
	dropped = new Image();	
	dropped.onload = doImageLoad;
	dropped.src = evt.target.result
}

// Called when the window is resized
// Used for layout management
// Keeps the circle in the center of the screen
function doResize()
{
	var button = null;
	
	// Use absolute positioning to center the photo button
	button = document.querySelector( '#photo-button' );
	button.style.left = Math.round( ( document.body.offsetWidth - button.offsetWidth ) / 2 ) + 'px';
	button.style.top = Math.round( ( document.body.offsetHeight - button.offsetHeight ) / 2 ) + 'px';
	button.style.visibility = 'visible';
}