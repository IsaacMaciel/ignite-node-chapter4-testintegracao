import { Transfer } from "../entities/Transfer";


interface ITransferRepository {
  create(sender_id: string): Promise<Transfer>
}

export { ITransferRepository }
