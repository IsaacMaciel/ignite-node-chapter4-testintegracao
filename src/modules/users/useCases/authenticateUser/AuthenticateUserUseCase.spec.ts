import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import {hash} from 'bcryptjs'
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let userRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe("AuthenticateUserUseCase", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
    })

    it("should be able get token with user and pass is correct", async () => {
        const passwordHash = await hash('1234',8)
        await userRepositoryInMemory.create({
            name: "test",
            email: "test@test.com",
            password: passwordHash
        })

       const response = await authenticateUserUseCase.execute({
            email: "test@test.com",
            password: "1234"
        })

        expect(response).toHaveProperty("token")
    })

    it("should not be able get token with user and pass wrong", async () => {
        const passwordHash = await hash('1234',8)
        await userRepositoryInMemory.create({
            name: "test",
            email: "test@test.com",
            password: passwordHash
        })

       await expect(authenticateUserUseCase.execute({
            email: "test@test.com",
            password: "12348"
        })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

    })
})