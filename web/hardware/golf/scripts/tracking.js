function redraw( context )
{
	context.clearRect( 0, 0, 300, 300 );	
	context.fillStyle = '#AABBCC';
	context.fillRect( 0, 0, 200, 150 );
	context.fillStyle = '#FFFFFF';
	context.fillRect( 5, 5, 190, 140 );
	
	context.lineWidth = 1;			
	context.strokeStyle = '#666666';
	context.fillStyle = '#CCCCCC';

	context.fillRect( points[0].x, points[0].y, points[0].width, points[0].height );
	context.strokeRect( points[0].x - 0.5, points[0].y - 0.5, points[0].width + 1, points[0].height + 1 );		
					  	
	context.fillRect( points[1].x, points[1].y, points[1].width, points[1].height );
	context.strokeRect( points[1].x - 0.5, points[1].y - 0.5, points[1].width + 1, points[1].height + 1 );
	
	context.strokeStyle = '#6688AA';
	context.lineWidth = 2;			
	dashTo( context, points[0].x + 4, points[0].y + 4, points[1].x + 4, points[1].y + 4, 6, 7 );
	context.stroke();
}

function coordinate( evt, target )
{
	return {
		x: evt.pageX - $( target ).offset().left,
		y: evt.pageY - $( target ).offset().top
	};
}