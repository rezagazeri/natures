const catchError = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

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
            return next(new AppError('can not find model with id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });
};