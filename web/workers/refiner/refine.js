self.addEventListener( 'message', function( evt ) {
	var day = null;
	var hour = null;
	var latitude = null;
	var longitude = null;
	var minute = null;
	var month = null;
	var parts = null;
	var records = null;
	var results = null;
	var second = null;
	var year = null;
	
	switch( evt.data.action )
	{
		case 'COUNT_RECORDS':
			records = evt.data.content.split( '\r' );
			self.postMessage( {
				action: evt.data.action,
				count: records.length	
			} );		
			break;	
			
		case 'GIST_RECORDS':
			records = evt.data.content.split( '\r' );
			results = {
				action: evt.data.action,
				records: new Array()	
			};
			
			for( var r = 0; r < records.length; r = r + Math.floor( records.length / evt.data.resolution ) )
			{
				parts = records[r].split( ',' );
				
				latitude = parts[3].substring( 0, parts[3].length - 7 );
				latitude = latitude + ' ' + parts[3].substring( parts[3].length - 6, parts[3].length );
				latitude = degrees( parts[4] + ' ' + latitude );
				
				longitude = parts[5].substring( 0, parts[5].length - 7 );
				longitude = longitude + ' ' + parts[5].substring( parts[5].length - 6, parts[5].length );
				longitude = degrees( parts[6] + ' ' + longitude );				
				
				day = new Number( parts[9].substr( 0, 2 ) );
				month = new Number( parts[9].substr( 2, 2 ) ) - 1;
				year = new Number( parts[9].substr( 4, 2 ) ) + 2000;

				hour = new Number( parts[1].substr( 0, 2 ) );
				minute = new Number( parts[1].substr( 2, 2 ) );
				second = new Number( parts[1].substr( 4, 2 ) );

				results.records.push( {
					latitude: latitude,
					longitude: longitude,
					knots: parts[7],
					mph: parts[7] * 1.15078,
					angle: parts[8],
					datetime: new Date( year, month, day, hour, minute, second )
				} );
			}
			
			self.postMessage( results );
			break;
			
	}
} );

// http://rumkin.com/tools/gps/degrees.php
function degrees( value )
{
	var c = null;
	var d = 0;
    var good = '0123456789.';
	var factor = 1;
	var oldc = null;
    var sign = 1;
    var vv = '';	
    
    oldc = ' ';
    
	for( var i = 0; i < value.length; i++ )
    {
       	c = value.charAt( i ).toUpperCase();
	
		if( c == 'W' || c == 'S' || c == '-' )
		{
	    	sign = -1;
		}
	
		if( good.indexOf( c ) < 0 )
		{
	    	c = ' ';
		}
		
		if( oldc != ' ' || c != ' ' )
		{
	    	vv += c;
	    	oldc = c;
        }	
    }

    value = new Array();
    value = vv.split( ' ' );
    
    for( i = 0; i < value.length; i++ )
    {
		d += value[i] * factor;
		factor /= 60;
    }
    
    return d * sign;
}