// Constants
var LINE_HEIGHT = 23;
var MILLIS_PER_DAY = 86400000;
var NOTE_HEIGHT = 43;

// Global variables
var index = null;
var notes = null;

function controls()
{
	var control = null;
	
	if( index == 0 )
	{
		control = document.querySelector( '#previous' );
		control.src = control.src.replace( 'up', 'disabled' );
		control.removeEventListener( 'click', doNotePrevious );
		
		control = document.querySelector( '#next' );
		control.src = control.src.replace( 'disabled', 'up' );
		control.addEventListener( 'click', doNoteNext );				
	}	
	
	if( notes.length == 1 )
	{
		control = document.querySelector( '#previous' );
		control.src = control.src.replace( 'up', 'disabled' );
		control.removeEventListener( 'click', doNotePrevious );		
		
		control = document.querySelector( '#next' );
		control.src = control.src.replace( 'up', 'disabled' );	
		control.removeEventListener( 'click', doNoteNext );			
	}
	
	if( notes.length == 1 && notes[index].modified == false )
	{
		control = document.querySelector( '#plus' );
		control.src = control.src.replace( 'up', 'disabled' );						
		control.removeEventListener( 'click', doNoteAdd );
		
		control = document.querySelector( '#trash' );
		control.src = control.src.replace( 'up', 'disabled' );						
		control.removeEventListener( 'click', doNoteTrash );		
	}
	
	if( ( notes.length == 1 && notes[index].modified == true ) || ( notes.length > 1 ) ) 
	{
		control = document.querySelector( '#trash' );
		control.src = control.src.replace( 'disabled', 'up' );						
		control.addEventListener( 'click', doNoteTrash );					
	}
	
	if( ( index + 1 ) == notes.length && notes.length > 1 )
	{
		control = document.querySelector( '#previous' );
		control.src = control.src.replace( 'disabled', 'up' );
		control.addEventListener( 'click', doNotePrevious );		
		
		control = document.querySelector( '#next' );
		control.src = control.src.replace( 'up', 'disabled' );
		control.removeEventListener( 'click', doNoteNext );				
	}
	
	if( index > 0 && ( index + 1 ) < notes.length )
	{
		control = document.querySelector( '#previous' );
		control.src = control.src.replace( 'disabled', 'up' );
		control.addEventListener( 'click', doNotePrevious );		
		
		control = document.querySelector( '#next' );
		control.src = control.src.replace( 'disabled', 'up' );	
		control.addEventListener( 'click', doNoteNext );				
	}
		
	if( notes[index].modified == false )
	{
		control = document.querySelector( '#export' );
		control.src = control.src.replace( 'up', 'disabled' );	
		control.removeEventListener( 'click', doNoteExport );				
	} else {
		control = document.querySelector( '#export' );
		control.src = control.src.replace( 'disabled', 'up' );
		control.addEventListener( 'click', doNoteExport );				
	}	
}

// Called to format a date for the list of notes
// Mar 29, 2011 2:39 PM
function formatHeaderDate( saved )
{
	var date = null;
	var hours = null;
	var minutes = null;
	var result = null;
	
	// Take milliseconds value and make it a date object
	date = new Date( saved );
	
	// Hour value as unit of 24
	hours = date.getHours();
	
	// Place in 12 hour frame
	if( hours > 12 )
	{
		hours = hours - 12;	
	}
	
	// Make the the minutes value has two places
	minutes = pad( date.getMinutes(), '0', 2 );
	
	result = formatListDate( saved );
	result = result + ' ' + hours;
	result = result + ':' + minutes;
	
	// Manage meridian formatting
	result = result + ' ' + ( date.getHours() >= 12 ? 'PM' : 'AM' );
	
	// Return the formatted string
	return result;
}

// Called to format a date for the list of notes
// Mar 29, 2011
function formatListDate( saved )
{
	var date = null;
	var months = [
		'Jan', 'Feb', 'Mar', 'Apr',
		'May', 'Jun', 'Jul', 'Aug',
		'Sep', 'Oct', 'Nov', 'Dec'
	];	
	var result = null;
	
	// Convert milliseconds into date object
	date = new Date( saved );
	
	// Extract basic date pieces
	result = months[date.getMonth()];
	result = result + ' ' + date.getDate();
	result = result + ', ' + date.getFullYear();
	
	// Return formatted string
	return result;
}

// Called to add characters to the end of a string
// Useful for numeric values that need trailing zeros
function pad( what, filler, size )
{
	var result = null;
	
	// Make sure the provided value is a string
	result = new String( what );
	
	// While the content length is less than provided size
	// Tack on extra provided character to the end
	while( result.length < size )
	{
		result = result + filler;	
	}
	
	// Return the formatted result
	return result;
}

// Called to render a note
// A NULL value results in a new note
function show()
{
	var content = null;
	var count = null;
	var date = null;
	var first = null;
	var labeled = null;
	var list = null;
	var entry = null;
	var saved = null;
	var title = null;
	
	// See if the note value is NULL
	// If so then create a new note
	if( index == null )
	{
		note = {
			saved: new Date().getTime(),
			content: 'New Note',
			modified: false
		};
		
		notes.push( note );
		window.localStorage.notes = JSON.stringify( notes );

		index = 0;

		entry = document.createElement( 'div' );
		entry.className = 'note selected';
		entry.addEventListener( 'click', doNoteClick );
		
		labeled = document.createElement( 'div' );
		labeled.className = 'labeled';
		labeled.innerHTML = note.content;
		entry.appendChild( labeled );

		saved = document.createElement( 'div' );
		saved.className = 'saved';
		saved.innerHTML = formatListDate( note.saved );
		entry.appendChild( saved );

		first = document.querySelector( '#list > div:first-child' );

		list = document.querySelector( '#list' );
		list.insertBefore( entry, first );
	} else {
		entry = document.querySelectorAll( '#list > div' );
		entry[index].className = 'note selected';
		
		content = document.querySelector( '#content' );		
		
		if( notes[index].modified )
		{
			content.value = notes[index].content;			
		} else {
			content.value = '';
		}
	}
	
	// Display the number of records in the storage
	count = document.querySelector( '#count' );
	
	// Manage plural noun based on number of notes
	if( notes.length == 1 ) {
		// Display note count
		count.innerHTML = '1 Note';
	} else {
		count.innerHTML = notes.length + ' Notes';
	}
		
	// Put the title at the top of the pad of paper
	title = document.querySelector( '#title' );
	title.innerHTML = trimTitle( notes[index].content );

	saved = document.querySelector( '#stamp' );
	saved.innerHTML = formatHeaderDate( notes[index].saved );
	
	saved = document.querySelector( '#ago' );
	saved.innerHTML = spread( notes[index].saved );	

	// Update the controls on the screen
	controls();
}

// Called to determine days since message was created
// Performs some basic formatting around plural nouns
function spread( saved )
{
	var message = null;
	var result = null;	
	var today = null;
	
	// Get the time right now
	today = new Date();
	
	// Figure out how many days have elapsed
	// TODO: Change zero to say today
	result = Math.floor( ( today.getTime() - saved ) / MILLIS_PER_DAY );
	
	// Check for plural noun
	if( result == 1 )
	{
		message = 'day';
	} else {
		message = 'days';	
	}
	
	// Return concatenated and formatted duration
	return result + ' ' + message + ' ago';
}

// Called to trim text content to fit note label in listing
// Uses a hidden DIV element for measurement
// Trims regardless of white space in the string
function trimLabel( content )
{
	var cut = null;
	var trim = null;
	
	// Clean up any white space that may exist
	content = content.trim();
	
	// Get ahold of the trim element
	// Fill it with the provided content
	trim = document.querySelector( '#trim' );
	trim.innerHTML = content;
	
	// Return automatically if the content is already small enough
	if( trim.scrollWidth <= trim.clientWidth )
	{
		return content;	
	} else {
		// Put elipsis on end of content
		trim.innerHTML = trim.innerHTML + '...';
	}
	
	// Seed how many characters to cut to size
	cut = 0;
	
	// Trim off characters while the text is longer than the element
	while( trim.scrollWidth > trim.clientWidth )
	{
		cut = cut + 1;		
		trim.innerHTML = content.substr( 0, content.length - cut ).trim() + '...';
	}
	
	// Get the resulting content back out
	// Clear trim element
	content = trim.innerHTML;
	trim.innerHTML = '';
	
	// Return sized content
	return content;
}

// Called to trim content to fit title bar at top of pad
// First trims content without consideration for white space
// Subsequently goes back and trims to next closest
function trimTitle( content )
{
	var cut = null;
	var trim = null;
	
	// Clean up any white space that may exist
	content = content.trim();
	content = content.replace( new RegExp( '\\n', 'g' ), ' ' );
	
	// Get ahold of the trim element
	// Fill it with the provided content
	trim = document.querySelector( '#trim' );
	trim.innerHTML = content;
	
	// Return automatically if the content is already small enough
	if( trim.scrollWidth <= trim.clientWidth )
	{
		return content;	
	} else {
		// Put elipsis on end of content
		trim.innerHTML = trim.innerHTML + '...';
	}
	
	// Seed how many characters to cut to size
	cut = 0;
	
	// Trim off characters while the text is longer than the element
	while( trim.scrollWidth > trim.clientWidth )
	{
		cut = cut + 1;		
		trim.innerHTML = content.substr( 0, content.length - cut ) + '...';
	}
	
	// Reset for clean string now that we know the cut point
	trim.innerHTML = content;
	
	// Get the next space in the content
	cut = trim.innerHTML.indexOf( ' ', content.length - cut );
	
	// If there is no more white space then we are good
	if( cut == -1 )
	{
		content = trim.innerHTML;	
	} else {
		// Trim to next closest white space
		content = content.substr( 0, cut );	
	}
	
	// Add elipsis for appearances
	content = content + '...';
	
	// Clear trim element contents
	trim.innerHTML = '';
	
	// Return sized content
	return content;	
}

// Called when the editable area changes
function doContentKey( evt ) 
{
	var content = null;
	var control = null;
	var note = null;
	var title = null;
	
	content = document.querySelector( '#content' );

	if( content.value.trim().length == 0 )
	{
		notes[index].content = 'New Note';
		notes[index].modified = false;
		
		control = document.querySelector( '#export' );
		control.src = control.src.replace( 'up', 'disabled' );	
		
		if( notes.length == 1 )
		{
			control = document.querySelector( '#plus' );
			control.src = control.src.replace( 'up', 'disabled' );
			control.removeEventListener( 'click', doNoteAdd );
			
			control = document.querySelector( '#trash' );
			control.src = control.src.replace( 'up', 'disabled' );
			control.removeEventListener( 'click', doNoteTrash );
		}
	} else {
		notes[index].content = content.value.trim();
		notes[index].modified = true;
		
		control = document.querySelector( '#export' );
		control.src = control.src.replace( 'disabled', 'up' );		
	
		control = document.querySelector( '#plus' );
		control.src = control.src.replace( 'disabled', 'up' );		
		control.addEventListener( 'click', doNoteAdd );
		
		control = document.querySelector( '#trash' );
		control.src = control.src.replace( 'disabled', 'up' );
		control.addEventListener( 'click', doNoteTrash );
	}
	
	note = document.querySelectorAll( '#list > div' );
	note[index].childNodes[0].innerHTML = trimLabel( notes[index].content );
	
	title = document.querySelector( '#title' );
	title.innerHTML = trimTitle( notes[index].content );
	
	window.localStorage.notes = JSON.stringify( notes );
}

// Called when the body loads
// Responsible for initializing application
function doLoad()
{
	var content = null;
	var extra = null;
	var labeled = null;
	var line = null;
	var list = null;
	var note = null;
	var page = null;
	var ruling = null;
	var saved = null;
	
	// DEBUG: used for clearing dumb local storage mistakes
	// window.localStorage.clear();
	// return;
	
	// First time visitor so create the note storage array
	if( window.localStorage.notes == null )
	{
		notes = new Array();
	} else {
		notes = JSON.parse( window.localStorage.notes );	
	}
	
	// Paper list of notes in the display
	list = document.querySelector( '#list' );
	
	// Check for existing notes
	if( notes.length > 0 )
	{
		// Put any existing notes into the list
		for( var n = 0; n < notes.length; n++ )
		{
			// Note holder
			note = document.createElement( 'div' );
			note.className = 'note';				
			note.addEventListener( 'click', doNoteClick );
			
			// Note label
			labeled = document.createElement( 'div' );
			labeled.className = 'labeled';
			labeled.innerHTML = trimLabel( notes[n].content );
			note.appendChild( labeled );
			
			// Note saved date
			saved = document.createElement( 'div' );
			saved.className = 'saved';
			saved.innerHTML = formatListDate( notes[n].saved );
			note.appendChild( saved );
			
			// Put into list
			list.appendChild( note );					
		}
	}
	
	// Pad list display with blank note entries
	// Useful for when scrolling reveals content under the leather flap in the display
	while( list.childNodes.length < Math.round( ( list.clientHeight * 2 ) / NOTE_HEIGHT ) )
	{
		// Blank note
		note = document.createElement( 'div' );
		note.className = 'note';
	
		// Blank label
		labeled = document.createElement( 'div' );
		labeled.className = 'labeled';
		note.appendChild( labeled );
		
		// Blank saved time stamp
		saved = document.createElement( 'div' );
		saved.className = 'saved';
		note.appendChild( saved );
		
		// Append blank entry to the list
		list.appendChild( note );		
	}
		
	// Note pad page and the holder for the lined rules
	page = document.querySelector( '#page' );
	ruling = document.querySelector( '#ruling' );		
	
	// Create lined rules
	// Shows rules down the note pad page
	while( ruling.childNodes.length < Math.round( ( page.clientHeight * 2 ) / LINE_HEIGHT ) )
	{
		// Create a line
		line = document.createElement( 'div' );
		line.className = 'line';
		
		// Add the line to the page
		ruling.appendChild( line );		
	}	
	
	// Populate the first note now that the display is assembled
	// If there are no notes then create and show a blank one
	// Otherwise render the first note in the local storage
	if( notes.length > 0 )
	{
		index = 0;
	}
	
	// Show the default note at startup
	show();
	
	// Listen to add a new note
	content = document.querySelector( '#plus' );
	content.addEventListener( 'click', doNoteAdd );	
	
	// Handle text area events for updating title
	content = document.querySelector( '#content' );
	content.addEventListener( 'keyup', doContentKey );
	
	// Handle window resizing
	// Perform initial layout
	window.onresize = doResize;
	doResize();	
}

function doNoteAdd()
{
	var list = null;
	var note = null;
	
	note = {
		content: 'New Note',
		saved: new Date().getTime(),
		modified: false
	};
	
	notes.splice( 0, 0, note );
	window.localStorage.notes = JSON.stringify( notes );
	
	index = 0;	
	
	list = document.querySelector( '#list' );
	list.style.webkitTransition = 'padding-top 0.5s linear';
	list.style.MozTransition = 'padding-top 0.5s linear';	
	list.addEventListener( 'webkitTransitionEnd', doNoteEnd );
	list.addEventListener( 'transitionend', doNoteEnd );
	list.style.paddingTop = '42px';
}

function doNoteClick()
{
	var listing = null;
	
	listing = document.querySelectorAll( '#list > div' );
	
	for( var n = 0; n < listing.length; n++ )
	{
		listing[n].className = 'note';
		
		if( listing[n] == this )
		{
			index = n;	
		}
	}

	show();
}

function doNoteEnd()
{
	var entry = null;
	var first = null;
	var labeled = null;
	var list = null;
	var note = null;
	var saved = null;
	var selected = null;
	
	list = document.querySelector( '#list' );
	list.style.webkitTransition = '';
	list.style.MozTransition = '';	
	list.removeEventListener( 'webkitTransitionEnd', doNoteEnd );
	list.removeEventListener( 'transitionend', doNoteEnd );	
	
	selected = document.querySelector( '#list > .selected' );
	selected.className = 'note';	
	
	entry = document.createElement( 'div' );
	entry.className = 'note selected';
	entry.addEventListener( 'click', doNoteClick );	
		
	labeled = document.createElement( 'div' );
	labeled.className = 'labeled';
	labeled.innerHTML = notes[index].content;
	entry.appendChild( labeled );

	saved = document.createElement( 'div' );
	saved.className = 'saved';
	saved.innerHTML = formatListDate( notes[index].saved );
	entry.appendChild( saved );

	first = document.querySelector( '#list > div:first-child' );
	
	list.insertBefore( entry, first );
	list.style.paddingTop = '0px';
	
	show();
}

function doNoteExport()
{
	var data = null;
	
	data = notes[index].content + '\n\n';
	data = data + formatHeaderDate( notes[index].saved ) + '\n';
	
	window.location.href = 'data:application/x-download;charset=utf-8,' + encodeURIComponent( data );	
}

function doNoteNext()
{
	var selected = null;
	
	selected = document.querySelector( '#list > .selected' );
	selected.className = 'note';
	
	index = index + 1;
	show();	
}

function doNotePrevious()
{
	var selected = null;
	
	selected = document.querySelector( '#list > .selected' );
	selected.className = 'note';
	
	index = index - 1;
	show();	
}

function doNoteTrash()
{
	var answer = null;
	var list = null;
	var selected = null;
	
	answer = confirm( 'Are you sure you want to delete this note?' );
	
	if( answer )
	{
		if( notes.length == 1 )
		{
			notes[index].content = 'New Note';
			notes[index].saved = new Date().getTime();
			notes[index].modified = false;
			
			selected = document.querySelector( '#list > div:first-child' );
			selected.childNodes[0].innerHTML = 'New Note';
			selected.childNodes[1].innerHTML = formatListDate( notes[index].saved );
		} else {
			notes.splice( index, 1 );
			
			selected = document.querySelector( '#list > .selected' );
			
			list = document.querySelector( '#list' );
			list.removeChild( selected );
			
			if( index == notes.length )
			{
				index = index - 1;
			}			
		}
		
		window.localStorage.notes = JSON.stringify( notes );		
		
		selected = document.querySelectorAll( '#list > .note' );
		selected[index].className = 'note selected';
		
		show();
	}
}

// Called when the window is resized or a layout is needed
function doResize()
{
	var controls = null;
	var pad = null;
	
	// Determine note pad size
	pad = document.querySelector( '#pad' );

	// Center note controls in note pad page
	controls = document.querySelector( '#controls' );
	controls.style.left = Math.round( ( pad.clientWidth - controls.clientWidth ) / 2 ) + 'px';
}