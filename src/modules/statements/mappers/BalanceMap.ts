import { Statement } from "../entities/Statement";
import { Transfer } from "../useCases/getBalance/GetBalanceUseCase";

export class BalanceMap {
  static toDTO({statement,transfers, balance}: { statement: Statement[], transfers?: Transfer[] ,balance: number}) {
    const parsedStatement = statement.map(({
      id,
      receiver_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        receiver_id: receiver_id ? receiver_id : undefined,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      transfers,
      balance: Number(balance)
    }
  }
}
