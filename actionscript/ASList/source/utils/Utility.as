package utils
{
	public class Utility
	{
		public function Utility() {;}
		
		public static function pad( what:String, withwhat:String, front:Boolean, until:Number ):String
		{
			while( what.length < until )
			{
				if( front )
				{
					what = withwhat + what;
				} else {
					what = what + withwhat;
				}
			}
			
			return what;
		}
	}
}