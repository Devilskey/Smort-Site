export class Setting {
    private static UrlHref = window.location.hostname;


    public static Console() {
        if(!this.IsPartOfNetwork()){
            return;
        }
        console.log = () => {}
        console.error = () => {}
        console.warn = () => {}
        console.info = () => {}
    }

    private static IsPartOfNetwork():boolean {
        if (this.UrlHref.includes("smorthub.nl") ||
            this.UrlHref.includes("devilskey.nl")) {
                return true;
        }
        return false;
    }

}  