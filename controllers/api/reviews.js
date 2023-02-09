import Review from "../../models/Review.js";


function getReview(filter, skip, limit, {
    select = ['text', 'eval'],
    populate = [
        {
            path: 'product',
            select: ['name', 'alias'],
        },
        {
            path: 'user',
            select: ['login'],
        },
    ],
    sort = {createdAt: -1}
}) {
    return Review.find(filter).skip(skip).limit(limit).select(select).populate(populate).sort(sort).lean()
}

export const getReviews = async (req, res) => {
    try {
        const {limit = 5, skip = 0, productId = null, type} = req.query;
        const filter = {active: true, status: 'taken', type: type};
        productId && (filter.product = productId);

        const countReviews = await Review.countDocuments(filter);
        const pages = Math.ceil(countReviews / limit);
        if(skip > countReviews) throw 'Not Found'

        const data = await getReview(filter, skip, limit, {})
        
        res.json({
            pages,
            limit,
            data,
            type,
        })
    } catch (error) {
        console.log(error);
        res.json({
            error: true
        })
    }
}

export const createReview = async (req, res) => {
    try {
        if (!req.session.isAuth) {
            throw new Error('No auth')
        }
        const user = res.locals.person
        const {type, productId, text} = req.body
        const validErrors = []
        const evalValue = parseInt(req.body.eval);

        // Надо бы это вынести в utils ?
        if (!evalValue || evalValue < 1 || evalValue > 5) {
            validErrors.push('eval');
        }

        if (!text || typeof text !== 'string') {
            validErrors.push('text');
        }

        if (validErrors.length) {
            return res.json({
                error: true,
                validErrors,
            });
        }

        let review = new Review({
            user: user._id,
            eval: evalValue,
            text,
            type,
            product: productId // если productId === undefined, то в базе будет null
        });
        await review.save();
        return res.json({
            success: true
        });

    } catch (e) {
        console.log(e);
        res.json({
            error: true,
        });
    }
}