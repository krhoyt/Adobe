package com.adobe.barcode
{
	public class Line
	{
		public var type:Boolean = false;
		public var count:int = 0;
		
		public function Line( type:Boolean, count:int )
		{
			this.type = type;
			this.count = count;
		}
		
		public function toString():String
		{
			return count.toString() + "," + type.toString();
		}
	}
}