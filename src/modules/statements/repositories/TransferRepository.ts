import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ITransferRepository } from "./ITransferRepository";


class TransferRepository implements ITransferRepository {
  private repository: Repository<Transfer>

  constructor() {
    this.repository = getRepository(Transfer)
  }

  async create(sender_id: string): Promise<Transfer> {
    const transfer = this.repository.create({
      sender_id
    })

    const transferCreated =  await this.repository.save(transfer)

    return transferCreated

  }

}

export { TransferRepository }
