import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user; // remetente
    const { user_id: destiny_id} = request.params
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    if (destiny_id && type === 'transfer') {
      const statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description,
        sender_id: String(sender_id)
      });
      return response.status(201).json(statement);
    }

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,

    });
    return response.status(201).json(statement);

  }
}
