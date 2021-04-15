import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import {OperationType} from '../../entities/Statement'


export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user; // remetente
    const { user_id: receiver_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");
    const type = !!receiver_id ?  splittedPath[splittedPath.length - 2] as OperationType : splittedPath[splittedPath.length - 1] as OperationType

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      receiver_id
    });
    return response.status(201).json(statement);
  }
}
