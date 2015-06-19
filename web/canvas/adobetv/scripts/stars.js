$( document ).ready( function() {
	var star_context = document.getElementById( 'stars' ).getContext( '2d' );
	var inner = 0;
	
	star_context.strokeStyle = '#0099FF';
	star_context.fillStyle = '#66FFFF';
	star_context.lineWidth = 5;
		
	for( var s = 0; s < 100; s++ )
	{
		inner = Math.round( Math.random() * 25 );
		
		star( 
			star_context, 
			Math.round( Math.random() * 200 ), 
			Math.round( Math.random() * 200 ), 
			Math.round( Math.random() * 10 ), 
			Math.round( Math.random() * 25 ), 
			inner + Math.round( Math.random() * 25 ), 
			90 
		);		
	}
} );

function star( context, x, y, points, inner, outer, angle ) 
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
		
		context.beginPath();
		context.moveTo( x + ( Math.cos( start ) * outer ), y - ( Math.sin( start ) * outer ) );
		
		// draw lines
		for( n = 1; n <= count; n++ ) 
		{
			dx = x + Math.cos( start + ( step * n ) - halfStep ) * inner;
			dy = y - Math.sin( start + ( step * n ) - halfStep ) * inner;
			context.lineTo( dx, dy );
			
			dx = x + Math.cos( start + ( step * n ) ) * outer;
			dy = y - Math.sin( start + ( step * n ) ) * outer;
			context.lineTo( dx, dy );
		}
		
		context.closePath();
		context.stroke();
		context.fill();
	}
}