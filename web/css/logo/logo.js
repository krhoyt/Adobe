// Called when document is fully loaded
// Configures layout management
function doLoad()
{
	window.onresize = doResize;
	doResize();	
}

// Called when window is resized
// Also called when layout is otherwise needed
function doResize()
{
	var logo = null;
	
	// Get the element containing the logo
	// Center the logo element on the screen
	logo = document.querySelector( '#logo' );
	logo.style.position = 'absolute';
	logo.style.left = Math.round( ( document.body.offsetWidth - logo.offsetWidth ) / 2 );
	logo.style.top = Math.round( ( document.body.offsetHeight - logo.offsetHeight ) / 2 );		
}