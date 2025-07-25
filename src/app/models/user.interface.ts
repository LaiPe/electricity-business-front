export interface User {
    readonly id : number,
    username : string,
    email : string,
    firstName : string,
    lastName : string,
    birthDate : string,
    role : string,
    signinDate : string
    banned: boolean
}