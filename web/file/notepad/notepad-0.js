// File reader reference
// Scoped for use across functions
var reader = null;

// Called to read a file
// Used by direct file selection
// Also used by drag and drop
function read( file )
{

}

// Called when a file is directly selected
// Calls to read the selected file
function doFileChange()
{

}

// Called when the document has finished loading
// Configures event listeners
// Performs initial layout management
function doLoad()
{

}

// Called when the file has finished being read
// Populates the text area with the file data
function doReaderLoad()
{

}

// Called when the browser window is resized
// Performs layout of notepad in center of window
function doResize()
{
	var panel = null;
	
	// Position the notepad panel in the center of the window
	panel = document.querySelector( '#panel' );
	panel.style.left = Math.round( ( document.body.offsetWidth - panel.offsetWidth ) / 2 );
	panel.style.top = Math.round( ( document.body.offsetHeight - panel.offsetHeight ) / 2 );
}

// Called when the save button is clicked
// Tells browser to download the data in the text area
function doSaveClick()
{
	
}