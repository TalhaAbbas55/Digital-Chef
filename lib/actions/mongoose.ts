import mongoose from 'mongoose';

let isConnected = false;

export const  connectToDatabase = async () => {
    mongoose.set('strictQuery',true); // this is to prevent unknown queries

    if(!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not found');
    }

    if(isConnected) {
        return console.log('=> using existing database connection, data base already connected');
    }


    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('=> using new database connection');
    } catch (error) {
        console.log('=> error while connecting to database');
        console.log(error);
    }
};