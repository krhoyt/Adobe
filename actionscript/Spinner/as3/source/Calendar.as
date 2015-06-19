package
{
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BevelFilter;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BitmapFilterType;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class Calendar extends Sprite
	{
		[Embed( source="/System/Library/Fonts/HelveticaLight.ttf", fontName="HelveticaLight", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true" )]
		private static var HelveticaLight:Class;				
		
		private var today:InnerButton = null;
		private var inset:Shape = null;
		private var spinner:Spinner = null;
		private var label:String = null;
		private var title:TextField = null;
		
		public function Calendar( label:String )
		{
			super();
			this.label = label;
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		protected function doAdded( event:Event ):void
		{
			title = new TextField();
			title.filters = [new DropShadowFilter( 1, 90, 0x282E35, 0.80, 0, 0, 1, BitmapFilterQuality.MEDIUM )];
			title.width = 320;
			title.height = 35;
			title.embedFonts = true;
			title.defaultTextFormat = new TextFormat( "HelveticaLight", 22, 0xFFFFFF, null, null, null, null, null, TextFormatAlign.CENTER );
			title.type = TextFieldType.DYNAMIC;
			title.selectable = false;
			title.text = label;
			addChild( title );					
			
			inset = new Shape();
			inset.y = 40;
			inset.graphics.lineStyle( 1, 0x00FF00, 0 );
			inset.graphics.beginFill( 0x566272 );
			inset.graphics.drawRoundRect( 0, 0, 320, 300, 8, 8 );
			inset.graphics.endFill();
			
			inset.filters = [
				new GlowFilter( 0x000000, 0.80, 6, 6, 1, BitmapFilterQuality.MEDIUM, true, false ),
				new BevelFilter( 1, 270, 0xFFFFFF, 0.60, 0x252B32, 1, 0, 0, 1, BitmapFilterQuality.MEDIUM, BitmapFilterType.INNER )
			];
			addChild( inset );
			
			today = new InnerButton();
			today.x = 234;
			today.y = 46;
			today.addEventListener( MouseEvent.CLICK, doTodayClick );
			addChild( today );
			
			spinner = new Spinner();
			spinner.x = 6;
			spinner.y = 83;
			spinner.addEventListener( SpinnerEvent.SPINNER_STOPPED, doSpinnerStopped );
			addChild( spinner );
		}
		
		protected function doSpinnerStopped( event:SpinnerEvent ):void
		{
			var dispatch:CalendarEvent = new CalendarEvent( CalendarEvent.DATE_CHANGED );
			
			dispatch.date = spinner.getDate();
			
			dispatchEvent( dispatch );
		}
		
		protected function doTodayClick( event:MouseEvent ):void
		{
			spinner.setDate( new Date() );
		}
		
		public function get date():Date
		{
			return new Date( spinner.getDate().time );
		}
		
		public function set date( value:Date ):void
		{
			spinner.setDate( new Date( value.time ) );
		}
	}
}