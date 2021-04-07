import request from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database/'

let connection: Connection
let token: string
const baseURL = "/api/v1"

describe("Show User Profile Controller", () => {
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

    it("should be able to get profile info", async () => {
        const response = await request(app).get(`${baseURL}/profile`).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toMatchObject({
            id: response.body.id,
            name: response.body.name,
            email: response.body.email,
            created_at: response.body.created_at,
            updated_at: response.body.updated_at
        })
    })
    
    it("shout not be able to get profile without token", async () => {
        const response = await request(app).get(`${baseURL}/profile`)
        
        expect(response.status).toBe(401)
    })
})