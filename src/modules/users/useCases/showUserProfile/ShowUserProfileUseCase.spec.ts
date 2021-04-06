import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let userRepositoryInMemory: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe("ShowUserProfileUseCase", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })

    it("should be able to get user info", async () => {
        const userCreated = await createUserUseCase.execute({
            name: "Test User",
            email: "teste@teste.com",
            password: "12345"
        })
        const id = userCreated.id as string

        const user = await showUserProfileUseCase.execute(id)

        expect(user).toHaveProperty("id")
    })

    it("should not be able to get user info with unexist ID", async () => {
        await expect(showUserProfileUseCase.execute('1518181185191')).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})