// Constructor
function Header( contents, position )
{
	// Constants
	this.BIG_ENDIAN = 19789;
	this.MARK = 42;
	this.OFFSET = 8;
	
	// Properties
	this.position = 0;
	this.start = 0;
	
	// Variables
	var mark = 0;
	var offset = 0;
	var endian = 0;
	
	// Work
	this.start = position;
	this.position = position;
	
	endian = short( contents, endian, this.position );
	this.position = this.position + 2;
	
	if( endian == this.BIG_ENDIAN )
	{
		exifinfo.endian = 'big';
	} else {
		exifinfo.endian = 'little';
	}
	
	mark = short( contents, exifinfo.endian, this.position );
	this.position = this.position + 2;
	
	offset = integer( contents, exifinfo.endian, this.position );
	this.position = this.position + 4;
	
	if( mark != this.MARK || offset != this.OFFSET )
	{
		alert( 'Error' );
	}	
}