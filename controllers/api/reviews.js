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
        const {limit = 5, skip = 0, productId = null} = req.query;
        const filter = {active: true, status: 'taken'};

        productId && (filter.product = productId);

        const countReviews = await Review.countDocuments(filter);
        // const reviews = await Review
        //     .find(filter)
        //     .skip(skip)
        //     .limit(limit)
        //     .select(['text', 'eval'])
        //     .populate([
        //         {
        //             path: 'product',
        //             select: ['name', 'alias'],
        //         },
        //         {
        //             path: 'user',
        //             select: ['login'],
        //         },
        //     ])
        //     .sort({createdAt: -1})
        //     .lean(); Сокрашаем DublicateUse
        const reviews = getReview(filter, skip, limit, {})

        res.json({
            success: true,
            isLast: +skip + +limit >= countReviews,
            reviews,
        });
    } catch (e) {
        console.log(e);
        res.json({
            error: true,
        });
    }
}

// Для получение отзывов от всех игр или конкретно на сайт
export const getReviewsGameOrService = async (req, res) => {
    try {
        let {page, type} = req.query;
        page -= 1
        const filter = {active: true, status: 'taken', is_our: type === 'our'}
        const limit = 6;
        const countReviews = await Review.countDocuments(filter)
        const pages = Math.ceil(countReviews / limit)
        console.log(pages, countReviews, filter)
        if (page > pages) throw 'Not Found'
        const reviews = await getReview(filter, page * limit, limit, {})
        res.json({
            pages,
            limit,
            reviews,
            type
        })
    } catch (e) {
        console.log(e);
        res.json({
            error: true
        })
    }
}

export const createOurReview = async (req, res) => {
    try {
        if (!req.session.isAuth) {
            throw new Error('No auth')
        }
        const user = res.locals.person
        const text = req.body.text
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
            is_our: true
        });
        await review.save()

        return res.json({
            success: true
        })

    } catch (e) {
        console.log(e);
        res.json({
            error: true,
        });
    }
}