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

    public static async SendApiRequestPutAsync(apiUrl:string, headers:any){
        const options = {
            method: 'Put',
            headers: headers
        }
       return await fetch(apiUrl, options);
    }

    public static async SendApiRequestPutWithBodyAsync(apiUrl:string, body:any, headers:any){
        const options = {
            method: 'Put',
            headers: headers,
            body: JSON.stringify(body)
        }
       return await fetch(apiUrl, options);
    }

    public static async SendApiRequestWithHeaderDeleteAsync(apiUrl:string, headers:any):Promise<any> {
        const options = {
            method: 'DELETE',
            headers: headers
        }
       return await fetch(apiUrl, options);
    }


}