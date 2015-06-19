package
{
	import com.greensock.TweenLite;
	
	import flash.display.GradientType;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BevelFilter;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BitmapFilterType;
	import flash.geom.Matrix;
	import flash.geom.Rectangle;
	
	public class Spinner extends Sprite
	{
		private var bezel:Bezel = null;
		private var day:Days = null;
		private var month:Months = null;
		private var border:Shape = null;
		private var bottom:Shape = null;
		private var masking:Shape = null;
		private var top:Shape = null;
		private var dials:Sprite = null;
		private var dragging:Sprite = null;
		private var dhit:Sprite = null;
		private var mhit:Sprite = null;
		private var yhit:Sprite = null;
		private var tween:TweenLite = null;
		private var year:Years = null;
		
		public function Spinner()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		public function getDate():Date
		{
			var m:Number = Math.abs( month.y ) / 43;
			var y:Number = ( Math.abs( year.y ) / 43 ) + 1982;
			var d:Number = ( Math.abs( day.y ) / 43 ) + 1;
			
			return new Date( y, m, d, 0, 0, 0 );
		}
		
		public function setDate( value:Date ):void
		{
			TweenLite.to( month, 0.50, {
				y: 0 - ( value.month * 43 )
			} );

			TweenLite.to( day, 0.50, {
				y: 0 - ( ( value.date - 1 ) * 43 )
			} );			
		
			TweenLite.to( year, 0.50, {
				y: 0 - ( ( value.fullYear - 1982 ) * 43 )
			} );
		}
		
		protected function doAdded( event:Event ):void
		{
			var alphas:Array = [0.50, 0];
			var colors:Array = [0x000000, 0x000000];
			var ratios:Array = [0x00, 0xFF];
			var matrix:Matrix = new Matrix();
			var now:Date = new Date();
			
			border = new Shape();
			border.filters = [new BevelFilter( 1, 270, 0xFFFFFF, 0.60, 0x353D4D, 1, 0, 0, 1, BitmapFilterQuality.MEDIUM, BitmapFilterType.INNER )];
			border.graphics.lineStyle( 1, 0x00FF00, 0 );
			border.graphics.beginFill( 0x000000 );
			border.graphics.drawRoundRect( 0, 0, 308, 251, 8, 8 );
			border.graphics.endFill();
			addChild( border );
			
			masking = new Shape();
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRoundRect( 1, 1, 306, 249, 8, 8 );
			masking.graphics.endFill();
			addChild( masking );
			
			dials = new Sprite();
			dials.mask = masking;
			addChild( dials );
			
			month = new Months();
			month.x = 1;
			month.y = 0 - ( now.month * 43 );
			dials.addChild( month );
			
			day = new Days();
			day.x = 167;
			day.y = 0 - ( ( now.date - 1 ) * 43 );			
			dials.addChild( day );
			
			year = new Years();
			year.x = 220;
			year.y = 0 - ( ( now.fullYear - 1982 ) * 43 );			
			dials.addChild( year );
			
			matrix.createGradientBox( 306, 53, 90 * ( Math.PI / 180 ) );
			
			top = new Shape();
			top.x = 1;
			top.y = 1;
			top.graphics.lineStyle( 1, 0x00FF00, 0 );
			top.graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
			top.graphics.drawRect( 0, 0, 306, 53 );
			top.graphics.endFill();
			dials.addChild( top );
			
			matrix.createGradientBox( 306, 53, 270 * ( Math.PI / 180 ) );			
			
			bottom = new Shape();
			bottom.x = 1;
			bottom.y = 197;
			bottom.graphics.lineStyle( 1, 0x00FF00, 0 );
			bottom.graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
			bottom.graphics.drawRect( 0, 0, 306, 53 );
			bottom.graphics.endFill();
			dials.addChild( bottom );
			
			bezel = new Bezel();
			bezel.x = 1;
			bezel.y = 97;
			addChild( bezel );
			
			mhit = new Sprite();
			mhit.graphics.lineStyle( 1, 0x00FF00, 0 );
			mhit.graphics.beginFill( 0x00FF00, 0 );
			mhit.graphics.drawRect( 0, 0, 166, 251 );
			mhit.graphics.endFill();
			mhit.addEventListener( MouseEvent.MOUSE_DOWN, doMonthDown );
			addChild( mhit );
			
			dhit = new Sprite();
			dhit.x = 167;
			dhit.graphics.lineStyle( 1, 0x00FF00, 0 );
			dhit.graphics.beginFill( 0x00FF00, 0 );
			dhit.graphics.drawRect( 0, 0, 52, 251 );
			dhit.graphics.endFill();
			dhit.addEventListener( MouseEvent.MOUSE_DOWN, doDayDown );
			addChild( dhit );		
			
			yhit = new Sprite();
			yhit.x = 220;
			yhit.graphics.lineStyle( 1, 0x00FF00, 0 );
			yhit.graphics.beginFill( 0x00FF00, 0 );
			yhit.graphics.drawRect( 0, 0, 87, 251 );
			yhit.graphics.endFill();
			yhit.addEventListener( MouseEvent.MOUSE_DOWN, doYearDown );
			addChild( yhit );					
		}
		
		protected function doDayDown( event:MouseEvent ):void
		{
			dragging = day;
			
			if( tween != null )
			{
				tween.kill();
			}
			
			day.startDrag( false, new Rectangle( 167, 0, 0, 0 - ( day.height - masking.height ) + 1 ) );
			stage.addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
		}		
		
		protected function doMonthDown( event:MouseEvent ):void
		{
			dragging = month;
			
			if( tween != null )
			{
				tween.kill();
			}			
			
			month.startDrag( false, new Rectangle( 1, 0, 0, 0 - ( month.height - masking.height ) + 1 ) );
			stage.addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
		}
		
		protected function doYearDown( event:MouseEvent ):void
		{
			dragging = year;
			
			if( tween != null )
			{
				tween.kill();
			}			
			
			year.startDrag( false, new Rectangle( 220, 0, 0, 0 - ( year.height - masking.height ) + 1 ) );
			stage.addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
		}		
		
		protected function doMouseUp( event:MouseEvent ):void
		{
			var offset:Number = dragging.y;
			var rows:Number = Math.round( offset / 43 );
			
			dragging.stopDrag();			
			stage.removeEventListener( MouseEvent.MOUSE_UP, doMouseUp );
			
			tween = TweenLite.to( dragging, 0.50, {
				y: rows * 43,
				onComplete: doSnapComplete
			} );			
		}
		
		protected function doSnapComplete():void
		{
			tween = null;
			dispatchEvent( new SpinnerEvent( SpinnerEvent.SPINNER_STOPPED ) );
		}
	}
}