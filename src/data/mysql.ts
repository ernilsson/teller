import {createPool, Pool} from "mysql";

export interface MySQLConfiguration {
    host: string
    user: string
    password: string
}

export const init = (config: MySQLConfiguration): Pool => {
    try {
        const pool = createPool({
            connectionLimit: 5,
            host: config.host,
            user: config.user,
            password: config.password,
            database: "teller",
        })
        console.info("Created connection pool")
        return pool
    } catch (error) {
        console.error("Failed to create connection pool: ", error)
        throw new Error("Failed to create connection pool")
    }
}