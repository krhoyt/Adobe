var points = new Array();
var index = -1;	

$( document ).ready( function() {
	
	var canvas = document.getElementById( 'canvas' );
	var ctx = null;

	if( canvas.getContext )
	{
		ctx = canvas.getContext( '2d' );
		
		points.push( { x: 25, y: 75, width: 4, height: 4 } );
		points.push( { x: 125, y: 75, width: 4, height: 4 } );
		points.push( { x: 80, y: 25, width: 4, height: 4 } );
		points.push( { x: 25, y: 175, width: 4, height: 4 } );
		points.push( { x: 125, y: 175, width: 4, height: 4 } );
		points.push( { x: 35, y: 150, width: 4, height: 4 } );	
		points.push( { x: 115, y: 150, width: 4, height: 4 } );											
		
		$( '#canvas' ).mousedown( function( evt ) {
			var pt = {
				x: evt.clientX - canvas.offsetLeft,
				y: evt.clientY - canvas.offsetTop	
			}
			
			for( var p = 0; p < points.length; p++ )
			{
				
				if( pt.x >= ( points[p].x - 10 ) && 
					pt.x <= ( points[p].x + points[p].width + 10 ) &&
					pt.y >= ( points[p].y - 10 ) &&
					pt.y <= ( points[p].y + points[p].height + 10 ) ) {
					
					index = p;
					
					$( '#canvas' ).mousemove( function( evt ) {
						points[index].x = evt.clientX - canvas.offsetLeft;
						points[index].y = evt.clientY - canvas.offsetTop;
			
						redraw( ctx );
			
					} );
					
					break;
				}				
				
			}
		} ).mouseup( function( evt ) {
			$( '#canvas' ).unbind( 'mousemove' );			
			index = -1;
		} );
		
		redraw( ctx );
	}
	
} );

function bezier( context )
{
	context.strokeStyle = '#CCCCCC';
	context.beginPath();  		
	context.moveTo( points[3].x + 2, points[3].y + 2 );  
	context.lineTo( points[5].x + 2, points[5].y + 2 );  
	context.stroke();  	
	  
	context.beginPath();  		  
	context.moveTo( points[4].x + 2, points[4].y + 2 );  
	context.lineTo( points[6].x + 2, points[6].y + 2 );    
	context.stroke();  		
	
	context.strokeStyle = 'black';
	context.beginPath();  	
	context.moveTo( points[3].x + 2, points[3].y + 2 );
	context.bezierCurveTo( points[5].x, points[5].y, points[6].x, points[6].y, points[4].x, points[4].y );
	context.stroke();	
	
	context.fillStyle = '#315EA0';
	context.fillRect( points[3].x, points[3].y, points[3].width, points[3].height );
	context.fillRect( points[4].x, points[4].y, points[4].width, points[4].height );
	
	context.fillStyle = '#EF3700';	
	context.fillRect( points[5].x, points[5].y, points[5].width, points[5].height );
	context.fillRect( points[6].x, points[6].y, points[6].width, points[6].height );		
}

function quadratic( context )
{
	context.strokeStyle = '#CCCCCC';
	context.beginPath();  		
	context.moveTo( points[0].x + 2, points[0].y + 2 );  
	context.lineTo( points[2].x + 2, points[2].y + 2 );  
	context.stroke();  	
	  
	context.beginPath();  		  
	context.moveTo( points[1].x + 2, points[1].y + 2 );  
	context.lineTo( points[2].x + 2, points[2].y + 2 );    
	context.stroke();  		
	
	context.strokeStyle = 'black';
	context.beginPath();  	
	context.moveTo( points[0].x + 2, points[0].y + 2 );
	context.quadraticCurveTo( points[2].x + 2, points[2].y + 2, points[1].x + 2, points[1].y + 2 );  
	context.stroke();	
	
	context.fillStyle = '#315EA0';
	context.fillRect( points[0].x, points[0].y, points[0].width, points[0].height );
	context.fillRect( points[1].x, points[1].y, points[1].width, points[1].height );
	
	context.fillStyle = '#EF3700';	
	context.fillRect( points[2].x, points[2].y, points[2].width, points[2].height );	
}

function redraw( context )
{
	context.clearRect( 0, 0, 300, 300 );	
	
	quadratic( context );
	bezier( context );	
}