// Constants
var ARROW_HIDDEN = 0;
var BAR_HIDDEN = -150;
var MARKER_HEIGHT = 40;
var MARKER_PATH = 'small.dot.png';
var MARKER_WIDTH = 40;
var THUMBNAIL = 75;

// Prepopulated points of interest for markers
// Could come from server call or local file
var poi = [
	{id: 1000, latitude: 39.594429, longitude: -104.877913, title: 'Stanley Pappas', photos: [
		'stanleys.lobby.jpg', 'stanleys.seating.jpg', 'stanleys.humidor.jpg'
	]},
	{id: 1001, latitude: 39.746662, longitude: -105.010071, title: 'Pepsi Center', photos: [
		'pepsi.day.jpg', 'pepsi.night.jpg'
	]},
	{id: 1002, latitude: 39.746118, longitude: -105.017323, title: 'Mile High Stadium', photos: [
		'stadium.mountains.jpg', 'stadium.city.jpg'
	]},
	{id: 1003, latitude: 39.744666, longitude: -104.987599, title: 'Brown Palace', photos: [
		'brown.interior.jpg', 'brown.exterior.jpg'
	]},
	{id: 1004, latitude: 39.732208, longitude: -105.009127, title: 'Denver Water', photos: new Array()},		
];

// Global variables
// File reader
// Currently selected marker
// Touch or mouse events
var reader = null;
var selected = null;
var touch = null;

// Called to add point of interest markers to map
function addMarkers()
{
	var camera = null;
	var graphic = null;
	var layer = null;
	var point = null;
	var symbol = null;

	// Iterate through points of interest
	for( var p = 0; p < poi.length; p++ )
	{
		// Place point of interest on map
		point = new esri.geometry.Point( poi[p].longitude, poi[p].latitude );
		point = esri.geometry.geographicToWebMercator( point );		

		// Create a marker symbol to go on map layer
		symbol = new esri.symbol.PictureMarkerSymbol( MARKER_PATH, MARKER_WIDTH, MARKER_HEIGHT );

		// Crate a graphic to hold the marker symbol
		// Pass along reference to point of interest
		graphic = new esri.Graphic( point, symbol );
		graphic.setAttributes( {
			id: poi[p].id
		} );		

		// Create a layer to go on the map
		// Add graphic to layer
		layer = new esri.layers.GraphicsLayer();
		layer.add( graphic );
		
		// Listin for a click on that layer
		dojo.connect( layer, 'onClick', doLayerClick );

		// Add layer to the map
		map.addLayer( layer );	
	}	
}

// Called to start the resizing of the image
// Image could be selected locally or via camera
function resizeImage( content )
{
	var capture = null;
	
	// Load the image content into a working image space	
	capture = document.querySelector( '#capture' );
	capture.addEventListener( 'load', doCaptureLoad );
	capture.src = content;	
}

// Set the selected point of interest
function setSelected( id )
{
	var found = false;
	
	// Look for a match in the existing points
	for( var p = 0; p < poi.length; p++ )
	{
		if( poi[p].id == id )
		{
			found = true;
			break;	
		}
	}
	
	// Set selected to index of match if found
	if( found )
	{
		selected = p;	
	} else {
		selected = null;	
	}
}

// Called to update the photos in the detail bar
// Removes existing graphic assets first
function updatePhotos( photos )
{
	var camera = null;
	var images = null;
	
	// Get all the images in the detail bar
	// Not the camera image used to trigger capture
	images = document.querySelectorAll( '#photos>img:not(#camera)' );

	// Remove the images
	for( var p = 0; p < images.length; p++ )
	{
		images[p].parentNode.removeChild( images[p] );	
	}
	
	// Get all the canvas elements in the detail bar
	// Not the camera image used to trigger capture
	// Canvas used alternatively to image on devices
	images = document.querySelectorAll( '#photos>canvas:not(#camera)' );

	// Remove the canvas elements
	for( var p = 0; p < images.length; p++ )
	{
		images[p].parentNode.removeChild( images[p] );	
	}	
	
	// Get a reference to the camera icon
	camera = document.querySelector( '#camera' );
	
	// Insert the provided images before the camera icon
	// Keeps the camera icon last on the list
	for( p = 0; p < photos.length; p++ )
	{
		images = new Image();
		images.src = photos[p];
		camera.parentNode.insertBefore( images, camera );
	}	
}

// Called to update the detail bar title
function updateTitle( title )
{
	var element = null;
	
	// Set the title via HTML content
	element = document.querySelector( '#title' );
	element.innerHTML = title;	
}

// Called when the camera icon has been pressed
// Adapts image capture to fit device being used
function doCameraDown()
{
	var file = null;
	
	// Look for the presence of PhoneGap
	// If not PhoneGap then load from local
	if( !navigator.camera )
	{
		// Trigger file selection dialog
		file = document.querySelector( '#file' );
		file.addEventListener( 'change', doCameraSuccess );
		file.click();
	} else {
		// Launch device camera for image capture
		// Large variety of options are available
		// Some are device dependent so read the documentation
		navigator.camera.getPicture( doCameraSuccess, doCameraError, {
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			correctOrientation: true,
			saveToPhotoAlbum: true
		} );		
	}	
}

// There has been an error accessing the device camera
// Camera not available if device is connected to USB
function doCameraError( error )
{
	// Bad programmer just dumps error to console
	console.log( 'Camera error: ' + error );		
}

// Called to load the image data for processing
// Called by both local file selection and PhoneGap
function doCameraSuccess( content )
{
	var capture = null;
	var url = null;
	
	// Store path of selected file
	// Taken by camera or local
	poi[selected].photos.push( url );	
	
	// Look for PhoneGap
	// Read local file or send along image path
	if( !navigator.camera )
	{
		this.removeEventListener( 'change', doCameraSuccess );
		
		// Read the contents of the file
		// Path cannot be loaded in browser due to security
		// User must also explicitly select the image in the browser
		reader = new FileReader();
		reader.addEventListener( 'load', doReaderLoad );
		reader.readAsBinaryString( this.files[0] );
	} else {
		resizeImage( content );	
	}
}

// Called when the image bytes have been loaded
// Resizes and crops image content to fit thumbnail
// Displays thumbnail in detail bar
function doCaptureLoad()
{
	var camera = null;
	var canvas = null;
	var context = null;
	var offsetX = null;
	var offsetY = null;
	var picture = null;
	var ratio = null;
	var targetWidth = null;
	var targetHeight = null;
		
	// Fit along shortest edge of the image
	if( this.width >= this.height )
	{
		// Image is horizontal
		ratio = this.width / this.height;
		
		// Maintain image aspect ratio
		targetWidth = Math.round( THUMBNAIL * ratio );
		targetHeight = THUMBNAIL;
	
		// Center image in thumbnail space
		// This is effectively a crop
		offsetX = 0 - Math.round( ( targetWidth - THUMBNAIL ) / 2 );
		offsetY = 0;
	} else {
		// Image is vertical
		ratio = this.height / this.width;
		
		targetWidth = THUMBNAIL;
		targetHeight = Math.round( THUMBNAIL * ratio );		

		offsetX = 0;
		offsetY = 0 - Math.round( ( targetHeight - THUMBNAIL ) / 2 );		
	}
	
	// Create a canvas element to scale image onto
	canvas = document.createElement( 'canvas' );
	canvas.width = 75;
	canvas.height = 75;
	
	// Scale content onto canvas from image element
	context = canvas.getContext( '2d' );	
	context.drawImage( this, offsetX, offsetY, targetWidth, targetHeight );	
	
	// Place the new photo before the camera icon
	// Could aos put scaled canvas content into image element
	// More efficient but device browsers are not current
	// Feature functionality does not exist on many devices
	// canvas.toDataURL()
	camera = document.querySelector( '#camera' );	
	camera.parentNode.insertBefore( canvas, camera );
	
	// Clean up
	this.removeEventListener( 'load', doCaptureLoad );
}

// Called when the map is panned or zoomed
// Repositions detail bar if necessary
function doChangeEnd()
{
	var arrow = null;
	var bar = null;
	var point = null;
	
	// Is the detail bar present in the display
	if( selected != null )
	{
		// Get the position on the map from the selected point of interest
		// Get relative screen coordinates
		point = new esri.geometry.Point( poi[selected].longitude, poi[selected].latitude );
		point = esri.geometry.geographicToWebMercator( point );	
		point = map.toScreen( point );			
	
		// Slide arrow horizonally to screen coordinates
		arrow = document.querySelector( '#arrow' );
		arrow.style.left = ( point.x - Math.round( arrow.width / 2 ) ) + 'px';
	
		// Align detail bar vertically with screen coordinates
		bar = document.querySelector( '#bar' );	
		bar.style.top = ( point.y - bar.clientHeight ) + 'px';
	}
}

// Called when a graphic layer is clicked
// Show, hide or reposition detail bar accordingly
function doLayerClick( evt )
{
	var arrow = null;
	var bar = null;
	var point = null;

	// Reference to detail bar
	bar = document.querySelector( '#bar' );

	// If detail bar is not already displayed
	// Display it
	if( selected == null )
	{
		// Record selected marker
		setSelected( evt.graphic.attributes.id );
		
		// Get screen coordinates for position of detail bar
		point = new esri.geometry.Point( poi[selected].longitude, poi[selected].latitude );
		point = esri.geometry.geographicToWebMercator( point );	
		point = map.toScreen( point );
	
		// Update the detail bar internals
		updateTitle( poi[selected].title );
		updatePhotos( poi[selected].photos );
	
		// Move arrow indicator horizontally
		arrow = document.querySelector( '#arrow' );
		arrow.style.left = ( point.x - Math.round( arrow.width / 2 ) ) + 'px';
	
		// Position bar vertically
		bar.style.top = ( point.y - bar.clientHeight ) + 'px';		
	} else {
		// If there is a marker already selected
		// And it is the same one as previously selected
		// Clear the selection
		if( poi[selected].id == evt.graphic.attributes.id )
		{
			// Slide arrow horizontally back to zero position
			arrow = document.querySelector( '#arrow' );
			arrow.style.left = ARROW_HIDDEN + 'px';					
				
			// Slide detail bar vertically off top of screen
			bar = document.querySelector( '#bar' );
			bar.style.top = BAR_HIDDEN + 'px';	
		
			// Clear selection
			selected = null;			
		} else {
			// If there is a marker already selected
			// And this is a different marker selection
			// Update reference to newly selected marker
			setSelected( evt.graphic.attributes.id );
			
			// Get the screen coordinates of the selected marker
			point = new esri.geometry.Point( poi[selected].longitude, poi[selected].latitude );			
			point = esri.geometry.geographicToWebMercator( point );	
			point = map.toScreen( point );			
			
			// Update the detail bar with selected marker details
			updateTitle( poi[selected].title );
			updatePhotos( poi[selected].photos );		
			
			// Move arrow horizontally to screen coordinates
			arrow = document.querySelector( '#arrow' );
			arrow.style.left = ( point.x - Math.round( arrow.width / 2 ) ) + 'px';			
			
			// Move bar vertically to screen coordinates
			bar.style.top = ( point.y - bar.clientHeight ) + 'px';			
		}
	}
}

// Called when a local file has been read
// Calls out to resize the image based on file contents
function doReaderLoad( evt )
{
	var capture = null;
	
	// Call to resize the image contents
	// Base64 encoding of image data
	// Will display an image when assigned to image source attribute
	resizeImage( 'data:image/jpeg;base64,' + btoa( evt.target.result ) );	

	// Clean up the file reader
	reader.removeEventListener( 'load', doReaderLoad );
	reader = null;
	
	// Clean up the file selection process
	capture = document.querySelector( '#capture' );
	capture.removeEventListener( 'change', doCameraSuccess );
}