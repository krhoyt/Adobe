$( document ).ready( function() {
	
	$( 'img' ).css( 'visibility', 'hidden' );
	
	setInterval( function() {
			var value = null;
			var avg = 0			
			var now = new Date();
			var sday = now.getDate().toString();
			var shour = ( ( now.getHours() % 12 ) ).toString();
			var sminute = now.getMinutes().toString();
			var smonth = ( now.getMonth() + 1 ).toString();;
			
			// Temperature
			if( shtf[9] != undefined )
			{
				if( shtf[9].toPrecision( 3 ).indexOf( "." ) > 0 )
				{
					value = shtf[9].toPrecision( 3 );
				} else {
					value = shtf[9].toPrecision( 4 );
				}
			} else {
				return;	
			}
	
			switch( value.length )
			{
				case 5:
					$( '#htemp' ).css( 'visibility', 'visible' );
					$( '#htemp' ).attr( 'src', 'images/big_' + value.charAt( 0 ) + '.png' );
					
					$( '#ttemp' ).css( 'visibility', 'visible' );
					$( '#ttemp' ).attr( 'src', 'images/big_' + value.charAt( 1 ) + '.png' );				
					
					$( '#otemp' ).css( 'visibility', 'visible' );
					$( '#otemp' ).attr( 'src', 'images/big_' + value.charAt( 2 ) + '.png' );
					
					$( '#tempt' ).css( 'visibility', 'visible' );
					$( '#tempt' ).attr( 'src', 'images/big_' + value.charAt( 4 ) + '.png' );				
					
					break;
					
				case 4:
					$( '#htemp' ).css( 'visibility', 'hidden' );
				
					$( '#ttemp' ).css( 'visibility', 'visible' );
					$( '#ttemp' ).attr( 'src', 'images/big_' + value.charAt( 0 ) + '.png' );				
					
					$( '#otemp' ).css( 'visibility', 'visible' );
					$( '#otemp' ).attr( 'src', 'images/big_' + value.charAt( 1 ) + '.png' );
					
					$( '#tempt' ).css( 'visibility', 'visible' );
					$( '#tempt' ).attr( 'src', 'images/big_' + value.charAt( 3 ) + '.png' );					
					
					break;					
					
				case 3:
					$( '#htemp' ).css( 'visibility', 'hidden' );		
					$( '#ttemp' ).css( 'visibility', 'hidden' );
					
					$( '#otemp' ).css( 'visibility', 'visible' );
					$( '#otemp' ).attr( 'src', 'images/big_' + value.charAt( 0 ) + '.png' );
					
					$( '#tempt' ).css( 'visibility', 'visible' );
					$( '#tempt' ).attr( 'src', 'images/big_' + value.charAt( 2 ) + '.png' );					
					
					break;										
			}			
			
			avg = 0;
			
			for( var t = 0; t < 10; t++ )
			{
				if( shtf[t] == undefined )
				{
					avg = avg + 0;	
				} else {
					avg = avg + shtf[t];
				}
			}
	
			avg = avg / 10;
	
			if( Math.round( avg ) > Math.round( shtf[9] ) )
			{
				$( '#tup' ).css( 'visibility', 'visible' );
				$( '#tlevel' ).css( 'visibility', 'hidden' );
				$( '#tdown' ).css( 'visibility', 'hidden' );
			} else if( Math.round( avg ) < Math.round( shtf[9] ) ) {
				$( '#tup' ).css( 'visibility', 'hidden' );
				$( '#tlevel' ).css( 'visibility', 'hidden' );
				$( '#tdown' ).css( 'visibility', 'visible' );				
			} else {
				$( '#tup' ).css( 'visibility', 'hidden' );
				$( '#tlevel' ).css( 'visibility', 'visible' );
				$( '#tdown' ).css( 'visibility', 'hidden' );				
			}	
			
			// Humidity
			value = Math.round( humidity[9] ).toString();

			switch( value.length )
			{
				case 2:
					$( '#thumid' ).css( 'visibility', 'visible' );
					$( '#thumid' ).attr( 'src', 'images/big_' + value.charAt( 0 ) + '.png' );
					
					$( '#ohumid' ).css( 'visibility', 'visible' );
					$( '#ohumid' ).attr( 'src', 'images/big_' + value.charAt( 1 ) + '.png' );
					
					break;					
					
				case 1:
					$( '#thumid' ).css( 'visibility', 'hidden' );
					
					$( '#ohumid' ).css( 'visibility', 'visible' );
					$( '#ohumid' ).attr( 'src', 'images/big_' + value.charAt( 0 ) + '.png' );				
					
					break;					
			}			
			
			avg = 0;
			
			for( var h = 0; h < 10; h++ )
			{
				if( humidity[h] == undefined )
				{
					avg = avg + 0;	
				} else {
					avg = avg + humidity[h];
				}
			}
	
			avg = avg / 10;
	
			if( Math.round( avg ) > Math.round( humidity[9] ) )
			{
				$( '#hup' ).css( 'visibility', 'visible' );
				$( '#hlevel' ).css( 'visibility', 'hidden' );
				$( '#hdown' ).css( 'visibility', 'hidden' );
			} else if( Math.round( avg ) < Math.round( humidity[9] ) ) {
				$( '#hup' ).css( 'visibility', 'hidden' );
				$( '#hlevel' ).css( 'visibility', 'hidden' );
				$( '#hdown' ).css( 'visibility', 'visible' );				
			} else {
				$( '#hup' ).css( 'visibility', 'hidden' );
				$( '#hlevel' ).css( 'visibility', 'visible' );
				$( '#hdown' ).css( 'visibility', 'hidden' );				
			}			
			
			// Pressure
			avg = 0;
			
			for( var p = 0; p < 10; p++ )
			{
				if( pressure[p] == undefined )
				{
					avg = avg + 0;	
				} else {
					avg = avg + pressure[p];
				}
			}

			avg = avg / 10;

			if( Math.round( avg ) > Math.round( pressure[9] ) )
			{
				$( '#pup' ).css( 'visibility', 'visible' );
				$( '#plevel' ).css( 'visibility', 'hidden' );
				$( '#pdown' ).css( 'visibility', 'hidden' );				
			} else if( Math.round( avg ) < Math.round( pressure[9] ) ) {
				$( '#pup' ).css( 'visibility', 'hidden' );
				$( '#plevel' ).css( 'visibility', 'hidden' );
				$( '#pdown' ).css( 'visibility', 'visible' );				
			} else {
				$( '#pup' ).css( 'visibility', 'hidden' );
				$( '#plevel' ).css( 'visibility', 'visible' );
				$( '#pdown' ).css( 'visibility', 'hidden' );				
			}			
			
			// Meridian
			$( '#ampm' ).css( 'visibility', 'visible' );			
			
			if( now.getHours() < 12 )
			{
				$( '#ampm' ).attr( 'src', 'images/am.png' );
			} else {
				$( '#ampm' ).attr( 'src', 'images/pm.png' );
			}
			
			// Hours
			if( now.hours % 12 == 0 )
			{
				shour = "12";
			}
			
			if( shour.length == 2 )
			{
				$( '#thour' ).css( 'visibility', 'visible' );
				$( '#thour' ).attr( 'src', 'images/small_' + shour.charAt( 0 ) + '.png' );
	
				$( '#ohour' ).css( 'visibility', 'visible' );
				$( '#ohour' ).attr( 'src', 'images/small_' + shour.charAt( 1 ) + '.png' );	
			} else {
				$( '#thour' ).css( 'visibility', 'hidden' );

				$( '#ohour' ).css( 'visibility', 'visible' );
				$( '#ohour' ).attr( 'src', 'images/small_' + shour.charAt( 0 ) + '.png' );	
			}			
			
			// Minutes
			if( sminute.length == 2 )
			{
				$( '#tminute' ).css( 'visibility', 'visible' );
				$( '#tminute' ).attr( 'src', 'images/small_' + sminute.charAt( 0 ) + '.png' );				
				
				$( '#ominute' ).css( 'visibility', 'visible' );
				$( '#ominute' ).attr( 'src', 'images/small_' + sminute.charAt( 1 ) + '.png' );							
			} else {
				$( '#tminute' ).css( 'visibility', 'visible' );
				$( '#tminute' ).attr( 'src', 'images/small_0.png' );				
				
				$( '#ominute' ).css( 'visibility', 'visible' );
				$( '#ominute' ).attr( 'src', 'images/small_' + sminute + '.png' );						
			}					
			
			// Month
			if( smonth.length == 2 )
			{
				$( '#tmonth' ).css( 'visibility', 'visible' );
				$( '#tmonth' ).attr( 'src', 'images/tiny_1.png' );					
				
				$( '#omonth' ).css( 'visibility', 'visible' );
				$( '#omonth' ).attr( 'src', 'images/tiny_' + smonth.charAt( 1 ) + '.png' );	
			} else {
				$( '#tmonth' ).css( 'visibility', 'hidden' );
				
				$( '#omonth' ).css( 'visibility', 'visible' );
				$( '#omonth' ).attr( 'src', 'images/tiny_' + smonth + '.png' );					
			}				
			
			// Day
			if( sday.length == 2 )
			{
				$( '#tday' ).css( 'visibility', 'visible' );
				$( '#tday' ).attr( 'src', 'images/tiny_' + sday.charAt( 0 ) + '.png' );			
				
				$( '#oday' ).css( 'visibility', 'visible' );
				$( '#oday' ).attr( 'src', 'images/tiny_' + sday.charAt( 1 ) + '.png' );					
			} else {
				$( '#tday' ).css( 'visibility', 'hidden' );
				
				$( '#oday' ).css( 'visibility', 'visible' );
				$( '#oday' ).attr( 'src', 'images/tiny_' + sday + '.png' );								
			}												
		},
		1000 
	);
	
} );