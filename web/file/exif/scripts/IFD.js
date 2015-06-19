// Constructor
function IFD( contents, tags, offset, start )
{
	// Properties
	this.entries = null;
	this.count = 0;
	this.tags = null;
	
	// Methods
	this.readEntries = readEntries;
	
	// Work
	this.tags = tags;
	
	this.count = short( contents, exifinfo.endian, offset );	
	offset = offset + 2;
	
	this.readEntries( contents, offset, start );
}

function readEntries( contents, offset, start )
{
	var entry = null;
	
	this.entries = new Array();	
	
	for( var i = 0; i < this.count; i++ ) 
	{
		entry = new Entry( contents, this.tags, offset, start );
				
		if( entry.data != null ) 
		{
			this[entry.name] = entry.data;
		}
				
		this.entries.push( entry );
		offset = entry.follow;
	}
}