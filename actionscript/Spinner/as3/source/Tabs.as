package
{
	import flash.display.Sprite;
	import flash.events.Event;
	
	public class Tabs extends Sprite
	{
		private var content:ContentButton = null;
		
		public function Tabs()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		protected function doAdded( event:Event ):void
		{
			content = new ContentButton();
			addChild( content );
		}
	}
}