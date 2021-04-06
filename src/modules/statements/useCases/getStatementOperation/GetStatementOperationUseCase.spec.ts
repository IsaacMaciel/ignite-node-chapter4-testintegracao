import { User } from "../../../users/entities/User"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let statementsRepositoryInMemory: InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let userCreated: User

describe("GetStatementOperationUseCase", () => {

    beforeAll(async () => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        userRepositoryInMemory = new InMemoryUsersRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)

        userCreated = await createUserUseCase.execute({
            name: "Test User",
            email: "teste@teste.com",
            password: "12345"
        })
    })

    it("should be able get a statemnt by id", async () => {
        const resp = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            amount: 500,
            type: 'deposit' as any,
            description: "Deposit"
        })

        const respStatement = await getStatementOperationUseCase.execute({
            user_id: userCreated.id as string,
            statement_id: resp.id as string
        })

        expect(respStatement).toHaveProperty("id")
        expect(respStatement).toHaveProperty("user_id")
        expect(respStatement.type).toMatch('deposit')

    })

    it("should not be able get a statement with id wrong", async () => {
        await expect(getStatementOperationUseCase.execute({
            user_id: userCreated.id as string,
            statement_id: '15181818'
        })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })

    it("should not be able get a statement when user non exist", async () => {
        await expect(getStatementOperationUseCase.execute({
            user_id: '1518191919',
            statement_id: '15181818'
        })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })


})