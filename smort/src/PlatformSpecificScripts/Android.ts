export class AndroidHandler {
	public  static IsUsingAndroid(): boolean {
		return  /android/i.test(navigator.userAgent);
	}

	public static PWArunning():boolean{
		return window.matchMedia("(display-mode: standalone)").matches;
	}


	public static AndroidNavBarNeeded ():boolean{
		if( window.innerWidth < 990 && this.IsUsingAndroid()){
			return true
		}
		return false
	}
}