import { Accounts, Transfers } from "@prisma/client"

type DriveFileType = {
    id:string,
    name:string,
    mimeType:string,
    size:number
}

interface tranferWithAccountsType extends Transfers {
    fromAccount: Partial<Accounts>,
    toAccount:Partial<Accounts>
}