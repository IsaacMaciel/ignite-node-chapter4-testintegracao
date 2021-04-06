import { User } from "../../../users/entities/User"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let statementsRepositoryInMemory: InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase
let userCreated: User


describe("CreateStatementUseCase", () => {
    beforeAll( async () => {
         statementsRepositoryInMemory = new InMemoryStatementsRepository()
         userRepositoryInMemory = new InMemoryUsersRepository()
         createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory,statementsRepositoryInMemory)
         getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory,userRepositoryInMemory)
         createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)

         userCreated = await createUserUseCase.execute({
             name: "Teste",
             email: "test@test.com",
             password:"12345"
         })
    })

    it("should be able deposit value", async () => {
        const resp = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            amount: 500,
            type: 'deposit' as any,
            description: "Deposit"
        })

        const respBalance = await getBalanceUseCase.execute({user_id: userCreated.id as string})

        expect(resp).toHaveProperty("id")
        expect(resp).toHaveProperty("user_id")
        expect(resp.type).toMatch('deposit')
        expect(respBalance.balance).toBe(500)

    })

    it("should be able withdraw value", async () => {
        const resp = await createStatementUseCase.execute({
            user_id: userCreated.id as string,
            amount: 500,
            type: 'withdraw' as any,
            description: "Withdraw"
        })

        const respBalance = await getBalanceUseCase.execute({user_id: userCreated.id as string})

        expect(resp).toHaveProperty("id")
        expect(resp).toHaveProperty("user_id")
        expect(resp.type).toMatch('withdraw')
        expect(respBalance.balance).toBe(0)

    })

    it("should not be able to use statement with user unexist", async () => {
        await expect(createStatementUseCase.execute({
            user_id: '151515151',
            amount: 500,
            type: 'withdraw' as any,
            description: "Withdraw"
        })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("should not be able withdraw value when the value is bigger than balance", async () => {
        await expect(createStatementUseCase.execute({
            user_id: userCreated.id as string,
            amount: 500,
            type: 'withdraw' as any,
            description: "Withdraw"
        })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

})