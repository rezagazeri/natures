const fs = require('fs');
const {
    DBconnection
} = require('../DB/config');
const Tour = require('../models/modeltours');

const tourData = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

DBconnection();

const importData = async () => {
    try {
        await Tour.create(tourData);
        console.log('data loaded successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
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