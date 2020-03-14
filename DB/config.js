const mongoose = require('mongoose');
const dotEnv = require('dotenv');

dotEnv.config({
    path: './config.env'
});
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

exports.DBconnection = async () => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('db connected....');
    } catch (error) {
        console.log(error);
    }
};