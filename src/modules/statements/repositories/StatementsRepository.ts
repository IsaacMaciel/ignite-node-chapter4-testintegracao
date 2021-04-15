import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";
import { Transfer } from '../useCases/getBalance/GetBalanceUseCase'

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    receiver_id,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      receiver_id
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[], transfers: Transfer[] }
    >
  {
    const statement = await this.repository.find({
      where: [{ user_id }, { receiver_id: user_id}]
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || (operation.type === "transfer" && operation.receiver_id === user_id) )  {
        return acc + Number(operation.amount);
      }
      else {
        return acc - Number(operation.amount);
      }
    }, 0)

    const transfers = statement.filter(data => !!data.receiver_id).map( statement => {
      return {
        id: String(statement.id),
        sender_id: statement.user_id,
        amount: statement.amount,
        description: statement.description,
        type: statement.type,
        created_at: statement.created_at,
        updated_at: statement.updated_at
      }
    })


    if (with_statement) {
      return {
        statement : statement.filter(data => !(!!data.receiver_id)),
        transfers,
        balance
      }
    }

    return { balance }
  }
}
