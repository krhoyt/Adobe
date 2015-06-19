package renderers
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;

	public class AppleContactItem extends Item
	{
		[Embed( 
			systemFont="Helvetica Neue", 
			fontName="Neue", 
			mimeType="application/x-font", 
			embedAsCFF="false", 
			advancedAntiAliasing="true",
			unicodeRange="U+0020-U+007E")]
		private static var Neue:Class;								
		
		[Embed( 
			systemFont="Helvetica Neue", 
			fontName="NeueBold", 
			mimeType="application/x-font", 
			embedAsCFF="false", 
			advancedAntiAliasing="true",
			unicodeRange="U+0020-U+007E",
			fontWeight="bold")]
		private static var NeueBold:Class;								
		
		private var first:TextField = null;
		private var last:TextField = null;
		
		public function AppleContactItem( data:Object = null )
		{
			super( data );
			init();
		}
		
		private function init():void
		{
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0xFFFFFF );
			graphics.drawRect( 0, 0, 640, 88 );
			graphics.endFill();
			
			graphics.beginFill( 0xE0E0E0 );
			graphics.drawRect( 0, 86, 640, 2 );
			graphics.endFill();
			
			first = new TextField();
			first.x = 17;
			first.y = 16;
			first.embedFonts = true;
			first.antiAliasType = AntiAliasType.ADVANCED;
			first.defaultTextFormat = new TextFormat( "Neue", 40, 0x000000 );
			first.autoSize = TextFieldAutoSize.LEFT;
			first.selectable = false;
			first.type = TextFieldType.DYNAMIC;
			addChild( first );			
			
			last = new TextField();
			last.y = 15;
			last.embedFonts = true;
			last.antiAliasType = AntiAliasType.ADVANCED;
			last.defaultTextFormat = new TextFormat( "NeueBold", 40, 0x000000 );
			last.autoSize = TextFieldAutoSize.LEFT;
			last.selectable = false;
			last.type = TextFieldType.DYNAMIC;
			addChild( last );						
		}
		
		override public function set data( value:Object ):void
		{
			dataProvider = value;
			
			if( value == null )
			{
				first.text = "";
				last.text = "";
			} else {
				if( value.first == null )
				{
					first.text = "";
					last.x = 17;
				} else {
					first.text = value.first;
					last.x = first.x + first.width + 14;					
				}
				
				if( value.last == null )
				{
					last.text = "";
				} else {
					last.text = value.last;
				}				
			}
		}
	}
}