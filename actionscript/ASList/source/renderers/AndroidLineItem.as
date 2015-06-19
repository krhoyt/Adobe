package renderers
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	
	public class AndroidLineItem extends Item
	{
		[Embed( 
			systemFont="Droid Sans", 
			fontName="Droid", 
			mimeType="application/x-font", 
			embedAsCFF="false", 
			advancedAntiAliasing="false",
			unicodeRange="U+0020-U+007E")]
		private static var Droid:Class;								
		
		private var label:TextField = null;
		
		public function AndroidLineItem( data:Object = null )
		{
			super( data );
			init();
		}
		
		private function init():void
		{
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0x000000 );
			graphics.drawRect( 0, 0, 480, 97 );
			graphics.endFill();
			
			graphics.beginFill( 0x424142 );
			graphics.drawRect( 0, 96, 480, 1 );
			graphics.endFill();
			
			label = new TextField();
			label.x = 37;
			label.y = 28;
			label.embedFonts = true;
			label.defaultTextFormat = new TextFormat( "Droid", 34, 0xFFFFFF );
			label.autoSize = TextFieldAutoSize.LEFT;
			label.selectable = false;
			label.type = TextFieldType.DYNAMIC;
			addChild( label );			
		}
		
		override public function set data( value:Object ):void
		{
			dataProvider = value;
			
			if( value == null )
			{
				label.text = "";
			} else {
				label.text = value.toString();
				
				if( ( label.x + label.width ) > 458 )
				{
					while( ( label.x + label.width ) > 415 )
					{
						label.text = label.text.substr( 0, label.text.length - 1 );
					}
					
					label.appendText( "..." );
				}
			}
		}
	}
}