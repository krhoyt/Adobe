// Additional global
var exifinfo = {
	endian: 'big'
};

// Constructor
function ExifInfo( contents )
{
	// Constants
	this.SOI_MARKER = [255, 216];
	this.APP1_MARKER = [255, 225];
	this.EXIF_HEADER = [69, 120, 105, 102, 0, 0];
	
	// Properties
	this.header = null;
	this.set = null;	
	this.thumbnail = null;
	this.position = 0;
	
	// Methods
	this.validate = validate;
	this.hasSOIMarker = hasSOIMarker;
	this.hasAppMarker = hasAppMarker;
	this.hasExifHeader = hasExifHeader;
	this.compare = compare;
	this.read = read;
	this.readThumbnail = readThumbnail
	
	// Work
	if( !this.validate( contents ) ) 
	{
		alert( 'Invalid contents' );
		return;
	}
	
	this.header = new Header( contents, this.position );
	this.read( contents );
	this.readThumbnail( contents );
}

function compare( contents, data )
{
	var byte = null;
	
	if( arguments.length == 3 )
	{
		this.position = arguments[2];
	}
	
	for( var i = 0; i < data.length; i++ ) 
	{
		byte = contents.charCodeAt( this.position );
		
		if( byte != data[i] )
		{ 
			alert( 'Not a match' );
			return false;
		}
		
		this.position = this.position + 1;
	}	
	
	// alert( 'Match' );
	return true;	
}

function hasAppMarker( contents )
{
	return this.compare( contents, this.APP1_MARKER );
}

function hasExifHeader( contents )
{
	return this.compare( contents, this.EXIF_HEADER );	
}

function hasSOIMarker( contents )
{
	return this.compare( contents, this.SOI_MARKER );	
}

function read( contents )
{
	var pointer = 0;
	var tags = new Tags();
	
	this.set = new Set();
	this.set.primary = new IFD( contents, tags.PRIMARY, this.header.position, this.header.start );

	pointer = this.set.primary.entries[this.set.primary.entries.length - 1].follow;
	pointer = integer( contents, exifinfo.endian, pointer ) + this.header.start;

	if( pointer != 0 )
	{
		this.set.thumbnail = new IFD( contents, tags.THUMBNAIL, pointer, this.header.start );
	}
	
	if( this.set.primary.ExifIFDPointer )
	{
		pointer = new Number( this.set.primary.ExifIFDPointer ) + this.header.start;
		this.set.exif = new IFD( contents, tags.EXIF, pointer, this.header.start );
		delete this.set.primary.ExifIFDPointer;
	}
	
	if( this.set.primary.GPSInfoIFDPointer ) 
	{
		pointer = new Number( this.set.primary.GPSInfoIFDPointer ) + this.header.start;
		this.set.gps = new IFD( contents, tags.GPS, pointer, this.header.start );
		delete this.set.primary.GPSInfoIFDPointer;
	}	
	
	if( this.set.exif && this.set.exif.InteroperabilityIFDPointer ) 
	{
		pointer = new Number( this.set.exif.InteroperabilityIFDPointer ) + this.header.start;
		this.set.interop = new IFD( contents, tags.INTEROP, pointer, this.header.start );
		delete this.set.exif.InteroperabilityIFDPointer;
	}	
}

function readThumbnail( contents )
{
	var pointer = null;
	
	if( this.set.thumbnail &&
		this.set.thumbnail.JPEGInterchangeFormat &&
		this.set.thumbnail.JPEGInterchangeFormatLength ) {
				
		pointer = new Number( this.set.thumbnail.JPEGInterchangeFormat ) + this.header.start;
				
		this.thumbnail = contents.slice( pointer, pointer + new Number( this.set.thumbnail.JPEGInterchangeFormatLength ) );
		
		delete this.set.thumbnail.JPEGInterchangeFormat;
		delete this.set.thumbnail.JPEGInterchangeFormatLength;
	}	
}

function validate( contents )
{
	var size = null;
	
	if( !this.hasSOIMarker( contents ) || !this.hasAppMarker( contents ) ) 
	{
		alert( 'Not a JPEG' );
		return false;
	}

	size = short( contents, exifinfo.endian, this.position );
	this.position = this.position + 2;
			
	if( !this.hasExifHeader( contents ) ) 
	{
		alert( 'No Exif Header' );
		return false;
	}

	return true;
}