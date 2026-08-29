export interface SmortTokenPayload {
    id: string,
    username: string,
    sub: string, 
    email: string,  
    role: number,    
    timeCreated: Date
}