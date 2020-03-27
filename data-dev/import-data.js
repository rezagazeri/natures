const fs = require('fs');
const {
    DBconnection
} = require('./../DB/config');
const User = require('../models/modelusers');
const Tour = require('../models/modeltours');
const Review = require('../models/reviewmodel');



const tourData = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const userData = JSON.parse(
    fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviewData = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);


DBconnection();

const importData = async () => {
    try {
        await Tour.create(tourData);
        await User.create(userData, {
            validateBeforeSave: false
        });
        await Review.create(reviewData);
        console.log('data loaded successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Tour.deleteMany();
        await Review.deleteMany();


        console.log('data deleted successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}