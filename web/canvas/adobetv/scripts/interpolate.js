function interpolate( start, end, distance )
{
	var xabs = Math.abs( start.x - end.x );
	var yabs = Math.abs( start.y - end.y );	
	var xdiff = end.x - start.x;
	var ydiff = end.y - start.y;

	var length = Math.sqrt( ( Math.pow( xabs, 2 ) + Math.pow( yabs, 2 ) ) );
	var steps = length / distance;
	var xstep = xdiff / steps;
	var ystep = ydiff / steps;

	var newx = 0;
	var newy = 0;
	var result = new Array();

	for( var s = 0; s < steps; s++ ) 
	{
		newx = start.x + ( xstep * s );
		newy = start.y + ( ystep * s );
            
		result.push( {
			x: newx,
			y: newy	
		} );
	}

	return result;  		
}