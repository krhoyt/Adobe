package renderers
{
	import flash.display.Sprite;
	
	public class Item extends Sprite
	{
		public var dataProvider:Object = null;
		
		public function Item( data:Object = null )
		{
			super();
			dataProvider = data;
		}
		
		// Populate/alter to reflect data here
		public function set data( value:Object ):void
		{
			dataProvider = value;
		}
		
		public function get data():Object 
		{
			return dataProvider;
		}
	}
}