var exif = null;
var reader = null;
var space = null;
var start = null;
var step = null;

function dump( set, name ) 
{
	var holder = null;
	var label = null;
	var line = null;
	var meta = null;
	var value = null;
	
	meta = document.querySelector( '#metadata' );
	
	console.log( name + ' has ' + set.entries.length + ' entries.' );

	holder = document.createElement( 'div' );
	holder.className = 'meta-header';
	holder.innerHTML = name;
	meta.appendChild( holder );

	for( var p = 0; p < set.entries.length; p++ )
	{
		// Bogus data in Altitude Reference tag
		if( set.entries[p].tag != null )
		{
			if( set.entries[p].tag.id == 5 )
			{
				continue;
			}			
		}	
			
		line = document.createElement( 'div' );
		line.className = 'meta-line';
		
		label = document.createElement( 'div' );
		label.className = 'meta-label';
		
		value = document.createElement( 'div' );
		value.className = 'meta-value';
		
		if( set.entries[p].tag == null )
		{
			console.log( 'Unknown tag: ' + set.entries[p].data );
			label.innerHTML = 'Unknown tag';
		} else {
			console.log(  set.entries[p].tag.name + ': ' + set.entries[p].data );
			label.innerHTML = set.entries[p].tag.name;
		}
		
		value.innerHTML = set.entries[p].data;			
	
		line.appendChild( label );
		line.appendChild( value );
		
		meta.appendChild( line );
	}
	
	console.log( '===' );
}

function doLoad()
{
	var form = null;
	var handle = null;
	
	form = document.querySelector( '#select-form' );
	form.onchange = doFileChange;	
	
	handle = document.querySelector( '#handle' );
	handle.onmousedown = doHandleDown;
	
	window.onresize = doResize;
}

function doFileChange()
{
	if( reader == null ) 
	{
		reader = new FileReader();
		reader.onload = doReaderLoad;
	}
	
	reader.readAsBinaryString( this.files[0] );
}

function doHandleDown( evt )
{
	var overflow = null;
	
	overflow = document.querySelector( '#scroll-view' ).scrollHeight - 
		document.querySelector( '#scroll-view' ).offsetHeight + 20;
	space = document.querySelector( '#scroll-view' ).offsetHeight - 
		document.querySelector( '#handle' ).offsetHeight;
	
	step = overflow / space;
	start = evt.pageY;
	space = space + 24;
	
	console.log( 'Overflow: ' + overflow );
	console.log( 'Scroll space: ' + space );
	console.log( 'Step: ' + step );
	
	document.body.addEventListener( 'mousemove', doHandleMove );
	document.body.addEventListener( 'mouseup', doHandleUp );	
}

function doHandleMove( evt )
{
	var handle = null;
	var offset = null;
	var position = null;
	
	handle = document.querySelector( '#handle' );			
	
	offset = evt.pageY - start;
	position = 25 + offset;
	
	if( offset >= 0 && position <= space )
	{
		handle.style.top = position + 'px';
		document.querySelector( '#metadata' ).style.top = 0 - ( offset * step );
	}
}

function doHandleUp()
{
	document.body.removeEventListener( 'mousemove', doHandleMove );
	document.body.removeEventListener( 'mouseup', doHandleUp );	
}

function doReaderLoad( evt )
{
	var thumb = null;
	
	// Other little API tidbits discovered during development
	// alert( 'Changed: ' + this.files[0] );
	// alert( 'Loaded ' + evt.loaded + ' of ' + evt.total );
	// alert( evt.target.result.charCodeAt( 0 ) );
	
	// The power house - parse the image
	exif = new ExifInfo( evt.target.result );
	
	// List out the data
	if( exif.set.primary ) { dump( exif.set.primary, 'Primary' ); }
	if( exif.set.exif ) { dump( exif.set.exif, 'Exif' ); }				
	if( exif.set.gps ) { dump( exif.set.gps, 'GPS' ); }						
	if( exif.set.thumbnail ) { dump( exif.set.thumbnail, 'Thumbnail' ); }												
	if( exif.set.interop ) { dump( exif.set.interop, 'Interoperability' ); }																

	document.querySelector( '#handle' ).style.visibility = 'visible';

	thumb = new Image();
	thumb.onload = doThumbnailLoaded;
	thumb.src = 'data:image/jpeg;base64,' + btoa( exif.thumbnail );
}

function doResize()
{
	var thumb = null;
	
	thumb = document.querySelector( '.thumbnail' );
	
	if( thumb != null )
	{
		thumb.style.left = 	Math.round( ( ( document.body.offsetWidth - 310 ) - thumb.width ) / 2 );
		thumb.style.top = Math.round( ( document.body.offsetHeight - thumb.height ) / 2 );		
	}
}

function doThumbnailLoaded()
{
	var outer = null;
	var ratio = null;
	
	outer = document.querySelector( '#outer-border' );	
	ratio = ( outer.offsetHeight - 110 - 45 ) / this.height;

	this.height = this.height * ratio;
	this.width = this.width * ratio;
	
	this.className = 'thumbnail';
	document.body.appendChild( this );

	doResize();
}