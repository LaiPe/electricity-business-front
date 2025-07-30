export interface User {
    readonly id : number,
    username : string,
    email : string,
    first_name : string,
    last_name : string,
    birth_date : string,
    role : string,
    signin_date : string
    banned: boolean
}