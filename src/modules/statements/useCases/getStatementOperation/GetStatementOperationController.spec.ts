import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
let token: string
const baseURL = "/api/v1/"
const baseStatementURL = "/api/v1/statements"

describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()

        await request(app).post(`${baseURL}/users`).send({
            name: "TESTE",
            email: "tes@test.com",
            password: "1234"
        })
        const authResponse = await request(app).post(`${baseURL}/sessions`).send({
            email: "tes@test.com",
            password: "1234"
        })
        token = authResponse.body.token
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    })

    it("should be able get specific balance info", async () => {
        const depositResponse = await request(app).post(`${baseStatementURL}/deposit`).set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 500,
            description: "Deposit"
        })
        const balance_id = depositResponse.body.id

        const response = await request(app).get(`${baseStatementURL}/${balance_id}`).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toMatchObject({
            id: response.body.id,
            user_id: response.body.user_id,
            description: response.body.description,
            amount:response.body.amount,
            type: response.body.type,
            created_at: response.body.created_at,
            updated_at: response.body.updated_at
        })

        expect(response.status).toBe(200)

    })

})