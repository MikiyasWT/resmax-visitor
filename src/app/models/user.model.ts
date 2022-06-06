
export interface User {
    id: number,
    username: string,
    password:string,
    name: string,
    contact_number: string,
    email: string,
    address: string,
    created: Date,
    role: number,
    status:number
        
}

export interface Login {
    contact_number: string,
    password:string,
    token:string
}

    