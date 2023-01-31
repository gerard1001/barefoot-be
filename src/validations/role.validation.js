import Joi from 'joi';
import roles from '../utils/roles.utils';

const roleValidation = (req, res, next) => {
    const roleSchema = Joi.object({
        email: Joi.string().required().empty().email(),
        role: Joi.valid(...roles)
            .required()
            .empty()
    });

    const result = roleSchema.validate(req.body);
    if (result.error) {
        res.status(400).json({
            message: result.error.details[0].message.replace(/["'`]+/g, '')
        });
    } else {
        next();
    }
};

export default roleValidation;