import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
let token: string
const baseURL = "/api/v1/"
const baseStatementURL = "/api/v1/statements"

describe("Create Statement Controller", () => {
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

    it("should be able deposit value", async () => {

        const response = await request(app).post(`${baseStatementURL}/deposit`).set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 500,
            description: "Deposit"
        })

        expect(response.body).toMatchObject({
            id: response.body.id,
            user_id: response.body.user_id,
            description: response.body.description,
            amount: response.body.amount,
            type: response.body.type,
            created_at: response.body.created_at,
            updated_at: response.body.updated_at
        })

        expect(response.status).toBe(201)
    })

    it("should not  be able deposit value without token", async () => {
        const response = await request(app).post(`${baseStatementURL}/deposit`).send({
            amount: 500,
            description: "Deposit"
        })

        expect(response.body.message).toBeTruthy()
        expect(response.status).toBe(401)
    })
    
    it("should not  be able withdraw value without token", async () => {

        const response = await request(app).post(`${baseStatementURL}/withdraw`).send({
            amount: 500,
            description: "Deposit"
        })

        expect(response.body.message).toBeTruthy()
        expect(response.status).toBe(401)
    })

    it("should be able withdraw value", async () => {
        const response = await request(app).post(`${baseStatementURL}/withdraw`).set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 400,
            description: "Withdraw"
        })

        expect(response.body).toMatchObject({
            id: response.body.id,
            user_id: response.body.user_id,
            description: response.body.description,
            amount: response.body.amount,
            type: response.body.type,
            created_at: response.body.created_at,
            updated_at: response.body.updated_at
        })

        expect(response.status).toBe(201)
    })

    it("should not be able withdraw with insuficient founds", async () => {
        const response = await request(app).post(`${baseStatementURL}/withdraw`).set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 500,
            description: "Withdraw"
        })

        expect(response.body.message).toBeTruthy()

        expect(response.status).toBe(400)
    })
})