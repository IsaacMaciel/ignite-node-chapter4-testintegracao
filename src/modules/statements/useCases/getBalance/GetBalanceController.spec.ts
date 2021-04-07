import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
let token: string
const baseURL = "/api/v1/"
const baseStatementURL = "/api/v1/statements"

describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email:"tes@test.com",
            password: "1234"
        })
        const authResponse = await request(app).post(`${baseURL}/sessions`).send({
            email:"tes@test.com",
            password: "1234"
        })
        token = authResponse.body.token
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    })

    it("should be able get balance info", async () => {
        const response = await request(app).get(`${baseStatementURL}/balance`).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            statement: [],
            balance:0
        })
    })

    it("should not be able get balance info without token", async () => {
        const response = await request(app).get(`${baseStatementURL}/balance`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBeTruthy()
    })
})