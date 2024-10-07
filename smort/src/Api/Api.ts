export class Api {

    public static async SendApiRequestPostAsync(apiUrl:string, body:any, headers:any):Promise<any> {
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }
        return await fetch(apiUrl, options);
    }

    public static async SendApiRequestWithHeaderGetAsync(apiUrl:string, headers:any):Promise<any> {
        const options = {
            method: 'GET',
            headers: headers
        }
       return await fetch(apiUrl, options);
    }

    public static async SendApiRequestGetAsync(apiUrl:string):Promise<any> {
        const options = {
            method: 'GET',
        }
       return await fetch(apiUrl, options);
    }

    public static SendApiRequestPut(){
        
    }

    public static SendApiRequestDelete(){
        
    }

}