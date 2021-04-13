import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO = { sender_id?: string } & StatementEntity;

type StatementEntity = Pick<
  Statement,
  "user_id" | "description" | "amount" | "type" | "transfer_id"
>;
