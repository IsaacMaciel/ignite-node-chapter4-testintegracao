import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransfers1618003561804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transfers",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "sender_id", type: "uuid" },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys:[
          {
            name: 'recipient',
            columnNames: ['sender_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL'
          },
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transfers')
  }
}
