package renderers
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;

	public class JobTitleItem extends Item
	{
		[Embed( 
			systemFont="Helvetica Neue", 
			fontName="Neue", 
			mimeType="application/x-font", 
			embedAsCFF="false", 
			advancedAntiAliasing="false",
			unicodeRange="U+0020-U+007E")]
		private static var Neue:Class;								
				
		private var title:TextField = null;
		
		public function JobTitleItem( data:Object = null )
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
			
			title = new TextField();
			title.x = 20;
			title.y = 16;
			title.embedFonts = true;
			// title.antiAliasType = AntiAliasType.ADVANCED;
			title.defaultTextFormat = new TextFormat( "Neue", 40, 0x000000 );
			title.autoSize = TextFieldAutoSize.LEFT;
			title.selectable = false;
			title.type = TextFieldType.DYNAMIC;
			addChild( title );			
		}
		
		override public function set data( value:Object ):void
		{
			dataProvider = value;
			
			if( value == null )
			{
				title.text = "";
			} else {
				title.text = value.toString();
				
				if( ( title.x + title.width ) > 618 )
				{
					while( ( title.x + title.width ) > 575 )
					{
						title.text = title.text.substr( 0, title.text.length - 1 );
					}
					
					title.appendText( "..." );
				}
			}
		}
	}
}