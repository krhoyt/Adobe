package
{
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class Years extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;								
		
		public function Years()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function createTextField( label:String ):TextField
		{
			var now:Date = new Date();
			var field:TextField = new TextField();
			
			field.x = 9;
			field.width = 73;
			field.embedFonts = true;
			
			if( now.fullYear == parseInt( label ) )
			{
				field.defaultTextFormat = new TextFormat( "HelveticaNew", 25, 0x0160F2, true, null, null, null, null, TextFormatAlign.CENTER );				
			} else {
				field.defaultTextFormat = new TextFormat( "HelveticaNew", 25, 0x000000, true, null, null, null, null, TextFormatAlign.CENTER );				
			}			
			
			field.type = TextFieldType.DYNAMIC;
			field.selectable = false;
			field.text = label;
			
			return field;
		}				
		
		protected function doAdded( event:Event ):void
		{
			var now:Date = new Date();
			var wheel:Number = ( ( now.fullYear - 1982 + 1 ) * 43 ) + 207;
			var field:TextField = null;
			
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 0, 0, 3, wheel );
			graphics.endFill();
			
			graphics.beginFill( 0xFAFEFF );
			graphics.drawRect( 3, 0, 81, wheel );
			graphics.endFill();
			
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 84, 0, 3, wheel );
			graphics.endFill();			
			
			for( var y:Number = 0; y <= ( now.fullYear - 1982 ); y++ )
			{
				field = createTextField( ( 1982 + y ).toString() );
				field.y = 107 + ( y * 43 );
				addChild( field );
			}			
		}
	}
}