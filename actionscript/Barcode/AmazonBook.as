package
{
	public class AmazonBook extends Book
	{
		public var group:String = null;
		public var details:String = null;
		public var rating:Number = 0;
		
		public function get asin():String 
		{
			return isbn;
		}
		
		public function set asin( value:String ):void
		{
			isbn = value;
		}		
	}
}