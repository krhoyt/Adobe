package
{
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class Months extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;				
		
		private var jan:TextField = null;
		private var feb:TextField = null;
		private var mar:TextField = null;
		private var apr:TextField = null;
		private var may:TextField = null;
		private var jun:TextField = null;
		private var jul:TextField = null;
		private var aug:TextField = null;
		private var sep:TextField = null;
		private var oct:TextField = null;
		private var nov:TextField = null;
		private var dec:TextField = null;		
		
		public function Months()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function createTextField( label:String ):TextField
		{
			var months:Array = [
				"January", "February", "March", "April",
				"May", "June", "July", "August",
				"September", "October", "November", "December"
			];
			var now:Date = new Date();
			var field:TextField = new TextField();
			
			field.width = 157;
			field.embedFonts = true;

			if( months[now.month] == label )
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
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 0, 0, 3, 723 );
			graphics.endFill();
			
			graphics.beginFill( 0xFAFEFF );
			graphics.drawRect( 3, 0, 159, 723 );
			graphics.endFill();
			
			graphics.beginFill( 0xCBCCE0 );
			graphics.drawRect( 162, 0, 3, 723 );
			graphics.endFill();			
			
			jan = createTextField( "January" );
			jan.y = 107;
			addChild( jan );
			
			feb = createTextField( "February" );
			feb.y = 150;
			addChild( feb );													
			
			mar = createTextField( "March" );
			mar.y = 193;
			addChild( mar );																
			
			apr = createTextField( "April" );
			apr.y = 236;
			addChild( apr );																			
			
			may = createTextField( "May" );
			may.y = 279;
			addChild( may );
			
			jun = createTextField( "June" );
			jun.y = 322;
			addChild( jun );																						
			
			jul = createTextField( "July" );
			jul.y = 365;
			addChild( jul );																									
			
			aug = createTextField( "August" );
			aug.y = 408;
			addChild( aug );
			
			sep = createTextField( "September" );
			sep.y = 451;
			addChild( sep );																												
			
			oct = createTextField( "October" );
			oct.y = 494;
			addChild( oct );
			
			nov = createTextField( "November" );
			nov.y = 537;
			addChild( nov );
			
			dec = createTextField( "December" );
			dec.y = 580;
			addChild( dec );																															
		}
	}
}