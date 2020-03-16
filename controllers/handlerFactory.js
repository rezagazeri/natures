const catchError = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const ApiFeachers = require('./../utils/apiFeachers');

exports.deleteOne = Model => {
    return catchError(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('can not find  with id', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
};

exports.updateOne = Model => {
    return catchError(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(new AppError('can not find document with id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });
};
exports.getAll = Model => {
    return catchError(async (req, res, next) => {
        let filter = {};
        if (req.params.tourId)
            filter = {
                tours: req.params.tourId
            };
        const feachers = new ApiFeachers(Model.find(filter), req.query)
            .filtering()
            .sort()
            .limitFields()
            .pagination();
        const docs = await feachers.query;
        res.status(200).json({
            statuse: 'success',
            results: docs.length,
            data: {
                data: docs
            }
        });
    });
};

exports.getOne = (Model, populateOptions) => {
    return catchError(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('can not find document with id', 404));
        }
        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
};

exports.createOne = Model => {
    return catchError(async (req, res, next) => {
        const newdoc = req.body;
        const doc = await Model.create(newdoc);
        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
};