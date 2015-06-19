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
	
	public class Days extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;						
		
		public function Days()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function createTextField( label:String ):TextField
		{
			var now:Date = new Date();
			var field:TextField = new TextField();
			
			field.width = 43;
			field.embedFonts = true;
			
			if( now.date == parseInt( label ) )
			{
				field.defaultTextFormat = new TextFormat( "HelveticaNew", 25, 0x0160F2, true, null, null, null, null, TextFormatAlign.RIGHT );				
			} else {
				field.defaultTextFormat = new TextFormat( "HelveticaNew", 25, 0x000000, true, null, null, null, null, TextFormatAlign.RIGHT );				
			}			
			
			field.type = TextFieldType.DYNAMIC;
			field.selectable = false;
			field.text = label;
			
			return field;
		}		
		
		protected function doAdded( event:Event ):void
		{
			var field:TextField = null;
			
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 0, 0, 3, 1540 );
			graphics.endFill();
			
			graphics.beginFill( 0xFAFEFF );
			graphics.drawRect( 3, 0, 46, 1540 );
			graphics.endFill();
			
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 49, 0, 3, 1540 );
			graphics.endFill();			
			
			for( var d:Number = 0; d < 31; d++ )
			{
				field = createTextField( ( d + 1 ).toString() );
				field.y = 107 + ( d * 43 );
				addChild( field );
			}
		}
	}
}