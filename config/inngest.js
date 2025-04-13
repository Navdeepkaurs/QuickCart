import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


//function to manage clerk webhooks

//1.Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    }, {
    event: 'clerk/user.created'
},
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        //object that will get stored in database
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }

        // adding it in database
        await connectDB()
        await User.create(userData)
    }
)

//2. function in case user made any updations like image or email
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        //object that will get stored in database
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }

        // adding it in database
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

//3. Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    }, {
    event: 'clerk/user.deleted'
},
    async ({ event }) => {
        const { id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)