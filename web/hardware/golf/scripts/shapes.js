function dashTo( ctx, startx, starty, endx, endy, len, gap )
{
	var seglength = 0;
	var deltax = 0;
	var deltay =0;
	var segs = 0;
	var cx = 0;
	var cy = 0;

	// calculate the legnth of a segment
	seglength = len + gap;
	
	// calculate the length of the dashed line
	deltax = endx - startx;
	deltay = endy - starty;
	delta = Math.sqrt( ( deltax * deltax ) + ( deltay * deltay ) );
	
	// calculate the number of segments needed
	segs = Math.floor( Math.abs( delta / seglength ) );
	
	// get the angle of the line in radians
	radians = Math.atan2( deltay, deltax );
	
	// start the line here
	cx = startx;
	cy = starty;
	
	// add these to cx, cy to get next seg start
	deltax = Math.cos( radians ) * seglength;
	deltay = Math.sin( radians ) * seglength;
	
	ctx.beginPath();
	
	// loop through each seg
	for( var n = 0; n < segs; n++ ) 
	{
		ctx.moveTo( cx, cy );
		ctx.lineTo( cx + Math.cos( radians ) * len, cy + Math.sin( radians ) * len );
		cx += deltax;
		cy += deltay;
	}
	
	// handle last segment as it is likely to be partial
	ctx.moveTo( cx, cy );
	delta = Math.sqrt( ( endx - cx ) * ( endx - cx ) + ( endy - cy ) * ( endy - cy ) );
	
	if( delta > len )
	{
		// segment ends in the gap, so draw a full dash
		ctx.lineTo( cx + Math.cos( radians ) * len , cy + Math.sin( radians ) * len );
	} else if( delta > 0 ) {
		// segment is shorter than dash so only draw what is needed
		ctx.lineTo( cx + Math.cos( radians ) * delta, cy + Math.sin( radians ) * delta );
	}
	
	// move the pen to the end position
	ctx.moveTo( endx, endy );
	ctx.stroke();
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
		ctx.beginPath();
		ctx.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw curves
		for( n = 1; n <= sides; n++ ) 
		{
			cx = x + Math.cos( start + ( step * n ) - ( qtrStep * 3 ) ) * ( inner / Math.cos( qtrStep ) );
			cy = y - Math.sin( start + ( step * n ) - ( qtrStep * 3 ) ) * ( inner / Math.cos( qtrStep ) );
			dx = x + Math.cos( start + ( step * n ) - halfStep ) * inner;
			dy = y - Math.sin( start + ( step * n ) - halfStep ) * inner;
			ctx.quadraticCurveTo( cx, cy, dx, dy );
			
			cx = x + Math.cos( start + ( step * n ) - qtrStep ) * ( inner / Math.cos( qtrStep ) );
			cy = y - Math.sin( start + ( step * n ) - qtrStep ) * ( inner / Math.cos( qtrStep ) );
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			ctx.quadraticCurveTo( cx, cy, dx, dy );
		}
		
		ctx.closePath();
		ctx.stroke();
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
	
		ctx.beginPath();
		ctx.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw lines
		for( n = 1; n <= sides; n++ ) 
		{
			dx = x + Math.cos( start + ( step * n ) - ( qtrStep * 3 ) ) * inner;
			dy = y - Math.sin( start + ( step * n ) - ( qtrStep * 3 ) ) * inner;
			ctx.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) - ( qtrStep * 2 ) ) * inner;
			dy = y - Math.sin( start + ( step * n ) - ( qtrStep * 2 ) ) * inner;
			ctx.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) - qtrStep ) * outer;
			dy = y - Math.sin( start + ( step * n ) - qtrStep ) * outer;
			ctx.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			ctx.lineTo( dx, dy );
		}
		
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
			
		// This is complete overkill... but I had it done already. :)
		if( holeSides > 2 ) 
		{
			ctx.beginPath();
			ctx.lineWidth = 3.5;
			ctx.fillStyle = '#FFFFFF';	
		
			if( holeRadius == undefined ) 
			{
				holeRadius = inner / 3;
			}
			
			step = ( Math.PI * 2 ) / holeSides;
			ctx.moveTo( x + ( Math.cos( start ) * holeRadius ), y - ( Math.sin( start ) * holeRadius ) );
			
			for( n = 1; n <= holeSides; n++ ) 
			{
				dx = x + Math.cos( start + ( step * n ) ) * holeRadius;
				dy = y - Math.sin( start + ( step * n ) ) * holeRadius;
				ctx.lineTo( dx, dy );
			}
			
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}		
	}
}

function drawOval( ctx, x, y, radius, yRadius )
{
	// init variables
	var theta = 0;
	var xrCtrl = 0;
	var yrCtrl = 0;
	var angle = 0;
	var angleMid = 0;
	var px = 0; 
	var py =0;
	var cx = 0;
	var cy = 0;
	
	// if only yRadius is undefined, yRadius = radius
	if( yRadius == undefined ) 
	{
		yRadius = radius;
	}
	
	// covert 45 degrees to radians for our calculations
	theta = Math.PI / 4;
	
	// calculate the distance for the control point
	xrCtrl = radius / Math.cos( theta / 2 );
	yrCtrl = yRadius / Math.cos( theta / 2 );
	
	// start on the right side of the circle
	angle = 0;
	
	ctx.beginPath();
	ctx.moveTo( x + radius, y );
	
	// this loop draws the circle in 8 segments
	for( var i = 0; i < 8; i++ ) 
	{
		// increment our angles
		angle += theta;
		angleMid = angle - ( theta / 2 );
		
		// calculate our control point
		cx = x + Math.cos( angleMid ) * xrCtrl;
		cy = y + Math.sin( angleMid ) * yrCtrl;
		
		// calculate our end point
		px = x + Math.cos( angle ) * radius;
		py = y + Math.sin( angle ) * yRadius;
		
		// draw the circle segment
		ctx.quadraticCurveTo( cx, cy, px, py );
	}
	
	ctx.stroke();
}

function drawPoly( ctx, x, y, sides, radius, angle ) 
{
	// convert sides to positive value
	var count = Math.abs( sides );
	
	// check that count is sufficient to build polygon
	if( count > 2 ) 
	{
		// init vars
		var step = 0;
		var start = 0; 
		var n = 0;
		var dx = 0;
		var dy = 0;
		
		// calculate span of sides
		step = ( Math.PI * 2 ) / sides;
		
		// calculate starting angle in radians
		start = ( angle / 180 ) * Math.PI;
		
		ctx.beginPath();
		ctx.moveTo( x + ( Math.cos( start ) * radius ), y - ( Math.sin( start ) * radius ) );
		
		// draw the polygon
		for( n = 1; n <= count; n++ ) 
		{
			dx = x + Math.cos( start + ( step * n ) ) * radius;
			dy = y - Math.sin( start + ( step * n ) ) * radius;
			ctx.lineTo( dx, dy );
		}
		
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}

function drawRoundRect( ctx, x, y, w, h, cornerRadius ) 
{
	// init vars
	var theta = 0;
	var angle = 0;
	var cx = 0;
	var cy = 0; 
	var px = 0; 
	var py = 0;
	
	// make sure that w + h are larger than 2*cornerRadius
	if( cornerRadius > Math.min( w, h ) / 2 ) 
	{
		cornerRadius = Math.min( w, h ) / 2;
	}
	
	// theta = 45 degrees in radians
	theta = Math.PI / 4;
	
	// draw top line
	ctx.beginPath();
	ctx.moveTo( x + cornerRadius, y );
	ctx.lineTo( x + w - cornerRadius, y );
	
	//angle is currently 90 degrees
	angle = -Math.PI / 2;
	
	// draw tr corner in two parts
	cx = x + w - cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + w - cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	angle += theta;
	
	cx = x + w - cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + w - cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	// draw right line
	ctx.lineTo( x + w, y + h - cornerRadius );
	
	// draw br corner
	angle += theta;
	
	cx = x + w - cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + h - cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + w - cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + h - cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	angle += theta;
	
	cx = x + w - cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + h - cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + w - cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + h - cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	// draw bottom line
	ctx.lineTo( x + cornerRadius, y + h );
	
	// draw bl corner
	angle += theta;
	
	cx = x + cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + h - cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + h - cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	angle += theta;
	
	cx = x + cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + h - cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + h - cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	// draw left line
	ctx.lineTo( x, y + cornerRadius );
	
	// draw tl corner
	angle += theta;
	cx = x + cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	angle += theta;
	
	cx = x + cornerRadius + ( Math.cos( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	cy = y + cornerRadius + ( Math.sin( angle + ( theta / 2 ) ) * cornerRadius / Math.cos( theta / 2 ) );
	px = x + cornerRadius + ( Math.cos( angle + theta ) * cornerRadius );
	py = y + cornerRadius + ( Math.sin( angle + theta ) * cornerRadius );
	ctx.quadraticCurveTo( cx, cy, px, py );
	
	ctx.stroke();
}

function drawStar( ctx, x, y, points, inner, outer, angle ) 
{
	var count = Math.abs( points );
	
	if( count > 2 ) 
	{
		// init vars
		var step = 0;
		var halfStep = 0;
		var start = 0;
		var n = 0;
		var dx = 0;
		var dy = 0;
		
		// calculate distance between points
		step = ( Math.PI * 2 ) / points;
		halfStep = step / 2;
		
		// calculate starting angle in radians
		start = ( angle / 180 ) * Math.PI;
		
		ctx.beginPath();
		ctx.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw lines
		for( n = 1; n <= count; n++ ) 
		{
			dx = x + Math.cos( start + ( step * n ) - halfStep ) * inner;
			dy = y - Math.sin( start + ( step * n ) - halfStep ) * inner;
			ctx.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			ctx.lineTo( dx, dy );
		}
		
		ctx.closePath();
		ctx.stroke();
	}
}

function drawWedge( ctx, x, y, startAngle, arc, radius, yRadius ) 
{
	// move to x,y position
	ctx.beginPath();	
	ctx.moveTo( x, y );
	
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
		
		ctx.lineTo( ax, ay );
		
		// Loop for drawing curve segments
		for( var i = 0; i < segs; i++ ) 
		{
			angle += theta;
			angleMid = angle - ( theta / 2 );
			
			bx = x + Math.cos( angle ) * radius;
			by = y + Math.sin( angle ) * yRadius;
			cx = x + Math.cos( angleMid ) * ( radius / Math.cos( theta / 2 ) );
			cy = y + Math.sin( angleMid ) * ( yRadius / Math.cos( theta / 2 ) );
			
			ctx.quadraticCurveTo( cx, cy, bx, by );
		}
		
		// close the wedge by drawing a line to the center
		ctx.lineTo( x, y );
		ctx.closePath();
		ctx.stroke();
	}
}