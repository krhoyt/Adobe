function dashTo( ctx, startx, starty, endx, endy, len, gap )
{
	var seglength = 0;
	var deltax = 0;
	var deltay = 0;
	var segs = 0;
	var cx = 0;
	var cy = 0;

	// Calculate the legnth of a segment
	seglength = len + gap;
	
	// Calculate the length of the dashed line
	deltax = endx - startx;
	deltay = endy - starty;
	delta = Math.sqrt( ( deltax * deltax ) + ( deltay * deltay ) );
	
	// Calculate the number of segments needed
	segs = Math.floor( Math.abs( delta / seglength ) );
	
	// Get the angle of the line in radians
	radians = Math.atan2( deltay, deltax );
	
	// Start the line here
	cx = startx;
	cy = starty;
	
	// Add these to offset to get next segment start
	deltax = Math.cos( radians ) * seglength;
	deltay = Math.sin( radians ) * seglength;
	
	ctx.graphics.clear();
	ctx.graphics.setStrokeStyle( 2 );
	ctx.graphics.beginStroke( '#6688AA' );
	
	// Loop through each segment
	for( var n = 0; n < segs; n++ ) 
	{
		ctx.graphics
			.moveTo( cx, cy )
			.lineTo( cx + Math.cos( radians ) * len, cy + Math.sin( radians ) * len );
		cx += deltax;
		cy += deltay;
	}
	
	// Handle last segment as it is likely to be partial
	ctx.graphics.moveTo( cx, cy );
	delta = Math.sqrt( ( endx - cx ) * ( endx - cx ) + ( endy - cy ) * ( endy - cy ) );
	
	if( delta > len )
	{
		// Segment ends in the gap, so draw a full dash
		ctx.graphics.lineTo( cx + Math.cos( radians ) * len , cy + Math.sin( radians ) * len );
	} else if( delta > 0 ) {
		// Segment is shorter than dash so only draw what is needed
		ctx.graphics.lineTo( cx + Math.cos( radians ) * delta, cy + Math.sin( radians ) * delta );
	}
	
	// move the pen to the end position
	ctx.graphics.moveTo( endx, endy );
	ctx.graphics.endStroke();
}

function drawBurst( ctx, x, y, sides, inner, outer, angle )
{
	if( sides > 2 ) 
	{
		// init vars
		var step = 0;
		var halfStep = 0;
		var qtrStep = 0;
		var start = 0;
		var n = 0;
		var dx = 0;
		var dy = 0; 
		var cx = 0; 
		var cy = 0;
		
		// calculate length of sides
		step = ( Math.PI * 2 ) / sides;
		halfStep = step / 2;
		qtrStep = step / 4;
		
		// calculate starting angle in radians
		start = ( angle / 180 ) * Math.PI;
		ctx.graphics.clear();
		ctx.graphics.setStrokeStyle( 2 );
		ctx.graphics.beginFill( '#DBE4EB' );
		ctx.graphics.beginStroke( '#6688AA' );
		ctx.graphics.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw curves
		for( n = 1; n <= sides; n++ ) 
		{
			cx = x + Math.cos( start + ( step * n ) - ( qtrStep * 3 ) ) * ( inner / Math.cos( qtrStep ) );
			cy = y - Math.sin( start + ( step * n ) - ( qtrStep * 3 ) ) * ( inner / Math.cos( qtrStep ) );
			dx = x + Math.cos( start + ( step * n ) - halfStep ) * inner;
			dy = y - Math.sin( start + ( step * n ) - halfStep ) * inner;
			ctx.graphics.quadraticCurveTo( cx, cy, dx, dy );
			
			cx = x + Math.cos( start + ( step * n ) - qtrStep ) * ( inner / Math.cos( qtrStep ) );
			cy = y - Math.sin( start + ( step * n ) - qtrStep ) * ( inner / Math.cos( qtrStep ) );
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			ctx.graphics.quadraticCurveTo( cx, cy, dx, dy );
		}
		
		ctx.graphics.closePath();
		ctx.graphics.endFill();
		ctx.graphics.endStroke();
	}
}

function drawGear( ctx, x, y, sides, inner, outer, angle, holeSides, holeRadius )
{
	if( sides > 2 ) 
	{
		// init vars
		var step = 0;
		var qtrStep = 0;
		var start = 0; 
		var n = 0;
		var dx = 0;
		var dy = 0;
		
		// calculate length of sides
		step = ( Math.PI * 2 ) / sides;
		qtrStep = step / 4;
		
		// calculate starting angle in radians
		start = ( angle / 180 ) * Math.PI;		
	
		ctx.graphics.clear();	
		ctx.graphics.beginFill( '#DBE4EB' );
		ctx.graphics.setStrokeStyle( 2 );
		ctx.graphics.beginStroke( '#6688AA' );
		ctx.graphics.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw lines
		for( n = 1; n <= sides; n++ ) 
		{
			dx = x + Math.cos( start + ( step * n ) - ( qtrStep * 3 ) ) * inner;
			dy = y - Math.sin( start + ( step * n ) - ( qtrStep * 3 ) ) * inner;
			ctx.graphics.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) - ( qtrStep * 2 ) ) * inner;
			dy = y - Math.sin( start + ( step * n ) - ( qtrStep * 2 ) ) * inner;
			ctx.graphics.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) - qtrStep ) * outer;
			dy = y - Math.sin( start + ( step * n ) - qtrStep ) * outer;
			ctx.graphics.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			ctx.graphics.lineTo( dx, dy );
		}
		
		ctx.graphics.closePath();
		ctx.graphics.endStroke();
		ctx.graphics.endFill();
			
		// This is complete overkill... but I had it done already. :)
		if( holeSides > 2 ) 
		{
			ctx.graphics.beginFill( '#FFFFFF' );
			ctx.graphics.setStrokeStyle( 2 );
			ctx.graphics.beginStroke( '#6688AA' );
		
			if( holeRadius == undefined ) 
			{
				holeRadius = inner / 3;
			}
			
			step = ( Math.PI * 2 ) / holeSides;
			ctx.graphics.moveTo( x + ( Math.cos( start ) * holeRadius ), y - ( Math.sin( start ) * holeRadius ) );
			
			for( n = 1; n <= holeSides; n++ ) 
			{
				dx = x + Math.cos( start + ( step * n ) ) * holeRadius;
				dy = y - Math.sin( start + ( step * n ) ) * holeRadius;
				ctx.graphics.lineTo( dx, dy );
			}
			
			ctx.graphics.closePath();
			ctx.graphics.endStroke();
			ctx.graphics.endFill();
		}		
	}
}

function drawWedge( ctx, x, y, startAngle, arc, radius, yRadius ) 
{
	// move to x,y position
	ctx.graphics.clear();
	ctx.graphics.beginFill( '#DBE4EB' );
	ctx.graphics.setStrokeStyle( 2 );
	ctx.graphics.beginStroke( '#6688AA' );	
	ctx.graphics.moveTo( x, y );
	
	// if yRadius is undefined, yRadius = radius
	if( yRadius == undefined ) 
	{
		yRadius = radius;
	}
	
	// Init vars
	var segAngle = 0;
	var theta = 0; 
	var angle = 0;
	var angleMid = 0; 
	var segs = 0;
	var ax = 0;
	var ay = 0;
	var bx = 0; 
	var by = 0;
	var cx = 0;
	var cy = 0;
	
	// limit sweep to reasonable numbers
	if( Math.abs( arc ) > 360 ) 
	{
		arc = 360;
	}
	
	// Flash uses 8 segments per circle, to match that, we draw in a maximum
	// of 45 degree segments. First we calculate how many segments are needed
	// for our arc.
	segs = Math.ceil( Math.abs( arc ) / 45 );
	
	// Now calculate the sweep of each segment.
	segAngle = arc / segs;
	
	// The math requires radians rather than degrees. To convert from degrees
	// use the formula (degrees/180)*Math.PI to get radians.
	theta = -( segAngle / 180 ) * Math.PI;
	
	// convert angle startAngle to radians
	angle = -( startAngle / 180 ) * Math.PI;
	
	// draw the curve in segments no larger than 45 degrees.
	if( segs > 0 ) 
	{
		// draw a line from the center to the start of the curve
		ax = x + Math.cos( startAngle / 180 * Math.PI ) * radius;
		ay = y + Math.sin( -startAngle / 180 * Math.PI ) * yRadius;
		
		ctx.graphics.lineTo( ax, ay );
		
		// Loop for drawing curve segments
		for( var i = 0; i < segs; i++ ) 
		{
			angle += theta;
			angleMid = angle - ( theta / 2 );
			
			bx = x + Math.cos( angle ) * radius;
			by = y + Math.sin( angle ) * yRadius;
			cx = x + Math.cos( angleMid ) * ( radius / Math.cos( theta / 2 ) );
			cy = y + Math.sin( angleMid ) * ( yRadius / Math.cos( theta / 2 ) );
			
			ctx.graphics.quadraticCurveTo( cx, cy, bx, by );
		}
		
		// close the wedge by drawing a line to the center
		ctx.graphics.lineTo( x, y );
		ctx.graphics.closePath();
		ctx.graphics.endStroke();
		ctx.graphics.endFill();
	}
}