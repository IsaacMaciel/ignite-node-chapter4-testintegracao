import { inject, injectable } from "tsyringe";
import { TransferRepository } from "../../repositories/TransferRepository";

@injectable()
class CreateTransferUseCase {

  constructor(
    @inject('TransferRepository')
    private transferRepository: TransferRepository
    ){}

  async execute(sender_id: string): Promise<void>{
    await this.transferRepository.create(sender_id)
  }
}

export { CreateTransferUseCase }
