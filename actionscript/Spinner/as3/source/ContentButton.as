package
{
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.DropShadowFilter;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class ContentButton extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;		
		
		private var label:TextField = null;
		
		public function ContentButton()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function redraw( state:String = null ):void
		{
			var alphas:Array = [1, 1];
			var colors:Array = null;
			var ratios:Array = [0x00, 0xFF];
			var matrix:Matrix = new Matrix();			
			
			matrix.createGradientBox( 80, 47, 90 * ( Math.PI / 180 ) );			
			
			graphics.clear();
			
			if( state == null )
			{	
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginFill( 0x858D98 );
				graphics.drawRoundRectComplex( 0, 0, 80, 47, 8, 8, 0, 0 );
				graphics.endFill();
			}
		}
		
		protected function doAdded( event:Event ):void
		{
			label = new TextField();
			label.filters = [new DropShadowFilter( 1, 90, 0x1C242E, 0.80, 0, 0, 1, BitmapFilterQuality.MEDIUM )];
			label.x = 1;
			label.y = 5;
			label.width = 78;
			label.height = 22;
			label.embedFonts = true;
			label.defaultTextFormat = new TextFormat( "HelveticaNew", 13, 0xE6E7E8, true, null, null, null, null, TextFormatAlign.CENTER );
			label.type = TextFieldType.DYNAMIC;
			label.selectable = false;
			label.text = "Today";
			addChild( label );		
			
			redraw();
			
			addEventListener( MouseEvent.MOUSE_OVER, doMouseOver );
			addEventListener( MouseEvent.MOUSE_DOWN, doMouseDown );
			addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
			addEventListener( MouseEvent.MOUSE_OUT, doMouseOut );
		}
		
		protected function doMouseDown( event:MouseEvent ):void
		{
			redraw( "down" );
		}
		
		protected function doMouseOut( event:MouseEvent ):void
		{
			redraw();
		}
		
		protected function doMouseOver( event:MouseEvent ):void
		{
			redraw( "over" );
		}
		
		protected function doMouseUp( event:MouseEvent ):void
		{
			redraw( "over" );
		}
	}
}