import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("CreateUserUseCase", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it("should be able create a new User", async () => {

        const userCreated = await createUserUseCase.execute({
            name: "Test User",
            email: "teste@teste.com",
            password: "12345"
        })

        expect(userCreated).toHaveProperty("id")

    })
    it("should not be able create a user with email exist", async () => {
        await createUserUseCase.execute({
            name: "Test User",
            email: "teste@teste.com",
            password: "12345"
        })

        await expect(createUserUseCase.execute({
            name: "Test User2",
            email: "teste@teste.com",
            password: "12345"
        })).rejects.toBeInstanceOf(CreateUserError)

    })

    it("should not be able create a user without all the data filed in", async () => {
        const user = new User()

        Object.assign(user, {
            name: "Test User",
            email: "teste@teste.com",
        })
        await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(Error)

    })
})