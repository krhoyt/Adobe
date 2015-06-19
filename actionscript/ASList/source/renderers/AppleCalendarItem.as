package renderers
{
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import images.PurpleDot;
	import utils.Utility;

	public class AppleCalendarItem extends Item
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
		
		private var dot:PurpleDot = null;
		private var meridian:TextField = null;
		private var subtitle:TextField = null;		
		private var time:TextField = null;
		private var title:TextField = null;		
		
		public function AppleCalendarItem( data:Object = null )
		{
			super( data );
			init();
		}
		
		private function init():void
		{
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0xFFFFFF );
			graphics.drawRect( 0, 0, 640, rowHeight );
			graphics.endFill();
			
			graphics.beginFill( 0xE0E0E0 );
			graphics.drawRect( 0, rowHeight - 2, 640, 2 );
			graphics.endFill();
			
			dot = new PurpleDot();
			dot.x = 20;
			dot.y = 36;
			dot.visible = false;
			addChild( dot );
			
			time = new TextField();
			time.y = 31;
			time.width = 127;
			time.height = 64;
			time.embedFonts = true;
			time.antiAliasType = AntiAliasType.ADVANCED;
			time.defaultTextFormat = new TextFormat( "NeueBold", 28, 0x000000, null, null, null, null, null, TextFormatAlign.RIGHT );
			time.selectable = false;
			time.type = TextFieldType.DYNAMIC;
			addChild( time );										
			
			meridian = new TextField();
			meridian.x = 132;
			meridian.y = 34;
			meridian.embedFonts = true;
			meridian.antiAliasType = AntiAliasType.ADVANCED;
			meridian.defaultTextFormat = new TextFormat( "Neue", 24, 0x808080 );
			meridian.autoSize = TextFieldAutoSize.LEFT;
			meridian.selectable = false;
			meridian.type = TextFieldType.DYNAMIC;
			addChild( meridian );
			
			title = new TextField();
			title.x = 207;
			title.y = 7;
			title.embedFonts = true;
			title.antiAliasType = AntiAliasType.ADVANCED;
			title.defaultTextFormat = new TextFormat( "NeueBold", 36, 0x000000 );
			title.autoSize = TextFieldAutoSize.LEFT;
			title.selectable = false;
			title.type = TextFieldType.DYNAMIC;
			addChild( title );			
			
			subtitle = new TextField();
			subtitle.x = 207;
			subtitle.y = 51;
			subtitle.embedFonts = true;
			subtitle.antiAliasType = AntiAliasType.ADVANCED;
			subtitle.defaultTextFormat = new TextFormat( "Neue", 28, 0x808080 );
			subtitle.autoSize = TextFieldAutoSize.LEFT;
			subtitle.selectable = false;
			subtitle.type = TextFieldType.DYNAMIC;
			addChild( subtitle );									
		}
		
		override public function set data( value:Object ):void
		{
			var hour:Number = 0;
			var minutes:Number = -1;
			
			dataProvider = value;
			
			if( value == null )
			{
				dot.visible = false;
				time.text = "";
				meridian.text = "";
				title.text = "";
				subtitle.text = "";
			} else {
				dot.visible = true;
				
				hour = data.time.hours;
				
				if( hour >= 12 )
				{
					hour = hour - 12;
					meridian.text = "PM";
				} else {
					meridian.text = "AM";
				}
				
				if( hour == 0 )
				{
					hour = 12;
				}
				
				minutes = data.time.minutes;
				
				if( minutes == 0 )
				{
					minutes = -1;
				}
				
				time.text = 
					hour.toString() + 
					( minutes >= 0 ? ( ":" + Utility.pad( minutes.toString(), "0", true, 2 ) ) : "" );
				
				title.text = data.title;
				
				if( data.subtitle == null )
				{
					title.y = 23;
					subtitle.text = "";
				} else {
					title.y = 7;
					subtitle.text = data.subtitle;
				}				
			}
		}		
	}
}