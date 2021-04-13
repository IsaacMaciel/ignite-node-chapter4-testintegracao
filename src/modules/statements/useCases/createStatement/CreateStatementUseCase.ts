import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferRepository } from "../../repositories/ITransferRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("TransferRepository")
    private transferRepository: ITransferRepository
  ) {}

  async execute({
    user_id,
    type,
    amount,
    description,
    sender_id,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type !== "deposit") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    if (sender_id) {
      const transfer = await this.transferRepository.create(sender_id);
      return await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description,
        transfer_id: transfer.id,
      });
    }

    return await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
    });
  }
}
