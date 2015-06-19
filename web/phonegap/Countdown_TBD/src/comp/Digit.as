package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	import images.Background;
	import images.Shadow;
	
	public class Digit extends Sprite
	{
		[Embed( 
			source="../fonts/DroidSans.ttf", 
			fontName="DroidSans", 
			mimeType="application/x-font", 
			embedAsCFF="false", 
			advancedAntiAliasing="true", 
			unicodeRange="U+0020-U+007E" )]
		private static var DroidSans:Class;		
		
		private var background:Background = null;
		private var shadow:Shadow = null;
		private var masking:Shape = null;
		private var field:TextField = null;
		private var spin:TextField = null;
		
		public function Digit()
		{
			super();
			init();
		}
		
		private function init():void
		{
			background = new Background();
			addChild( background );
			
			field = new TextField();
			field.y = 3;
			field.width = 75;
			field.height = 120;
			field.embedFonts = true;
			field.defaultTextFormat = new TextFormat( "DroidSans", 96, 0x000000, null, null, null, null, null, TextFormatAlign.CENTER );
			field.type = TextFieldType.DYNAMIC;
			field.selectable = false;
			field.text = "X";
			field.antiAliasType = AntiAliasType.ADVANCED;
			addChild( field );
			
			spin = new TextField();
			spin.y = -123;
			spin.width = 75;
			spin.height = 120;
			spin.embedFonts = true;
			spin.defaultTextFormat = new TextFormat( "DroidSans", 96, 0x000000, null, null, null, null, null, TextFormatAlign.CENTER );
			spin.type = TextFieldType.DYNAMIC;
			spin.selectable = false;
			spin.text = "X";
			spin.antiAliasType = AntiAliasType.ADVANCED;
			addChild( spin );			
			
			shadow = new Shadow();
			addChild( shadow );
						
			masking = new Shape();
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRect( 0, 0, 77, 120 );
			masking.graphics.endFill();
			addChild( masking );
			
			mask = masking;
		}
		
		protected function doComplete():void
		{
			field.text = spin.text;
			field.y = spin.y;
			spin.y = -123;
		}
		
		public function get value():Number
		{
			var result:Number = -1;
			
			if( field.text != "X" )
			{
				result = parseInt( field.text );
			}
			
			return result; 
		}
		
		public function set value( digit:Number ):void
		{
			if( value == -1 )
			{
				field.text = digit.toString();
				spin.text = digit.toString();
				return;
			}
			
			if( value != digit )
			{
				spin.text = digit.toString();
				
				TweenLite.to( field, 0.65, {
					y: 126
				} );
				
				TweenLite.to( spin, 0.65, {
					y: 3,
					onComplete: doComplete
				} );				
			}
		}
	}
}