import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let statementsRepositoryInMemory: InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase

describe("GetBalanceUseCase", () => {
    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        userRepositoryInMemory = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it("shoult be able get balance", async () => {
        const userCreated = await createUserUseCase.execute({
            name: "Test User",
            email: "teste@teste.com",
            password: "12345"
        })

        const resp = await getBalanceUseCase.execute({ user_id: userCreated.id as string })
        expect(resp.balance).toBe(0)
        expect(resp).toHaveProperty("statement")
        expect(resp.statement).toStrictEqual([])

    })

    it("should not be able get balance with user unexist", async () => {
        await expect(getBalanceUseCase.execute({ user_id: '1005181818' })).rejects.toBeInstanceOf(GetBalanceError)
    })
})