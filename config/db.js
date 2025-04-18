//Mongo Db confgure 
import mongoose from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null } // use same data connection while refreshes
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.conn) {
        const opts = {
            bufferCommands: false
        }

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`, opts).then(mongoose => {
            return mongoose
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB