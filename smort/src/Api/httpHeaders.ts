export class httpHeaders {
    public static httpHeaderJsonWithToken(token: string | null) {
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            'Accept': 'text/plain'
        }
    }
    public static httpHeaderWithToken(token: string | null) {
        return {
            "Authorization": `Bearer ${token}`,
            "responseType": "text",
        }
    }
}
