import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
const baseURL = "/api/v1"

describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    })

    it("should be able autenticated", async () => {
        await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email:"tes@test.com",
            password: "1234"
        })
        const response = await request(app).post(`${baseURL}/sessions`).send({
            email:"tes@test.com",
            password: "1234"
        })

        expect(response.body).toHaveProperty("token")
    })

    it("should not be able to autenticate when email or password are wrong", async() => {
        const response1 = await request(app).post(`${baseURL}/sessions`).send({
            email:"tes@test.com",
            password: "123455"
        })

        const response2 = await request(app).post(`${baseURL}/sessions`).send({
            email:"tes@tes5t.com",
            password: "1234"
        })

        expect(response1.status).toBe(401)
        expect(response2.status).toBe(401)

    })
})