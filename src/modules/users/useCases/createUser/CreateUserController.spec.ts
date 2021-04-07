import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
const baseURL = "/api/v1"

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })
    
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    })

    it("shoud be able create a new user", async () => {
        const response = await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email:"tes@test.com",
            password: "1234"
        })

        expect(response.status).toBe(201)
    })
    it("should not be able create a user with same email", async () => {
        await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email:"tes@test.com",
            password: "1234"
        })

        const response = await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email:"tes@test.com",
            password: "1234"
        })
        expect(response.status).toBe(400)

    })
})