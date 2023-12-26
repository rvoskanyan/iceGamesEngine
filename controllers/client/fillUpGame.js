import FillUp from "../../models/FillUp.js";
import fetch from "node-fetch";
import Review from "../../models/Review.js";
import Genshin from "../../models/Genshin.js";

export const fillUpGamePage = async (req, res) => {
  const genshinProducts = await Genshin.find().select(['name', 'productID', 'price']).lean();
  const successFillUps = await FillUp.find({status: 'success'}).select(['amount']).lean();
  const countFillUps = successFillUps.length;
  const amount = successFillUps.reduce((accum, fillUp) => accum + fillUp.amount, 0);
  const countReviews = await Review.countDocuments({active: true, status: 'taken', target: 'fillUpGame'});
  const reviews = await Review
    .find({status: 'taken', target: 'fillUpGame', active: true})
    .limit(5)
    .sort({createdAt: -1})
    .populate({
      path: 'user',
      select: ['login'],
    })
    .lean();
  let seconds = new Date().getHours() + new Date().getMinutes();
  let canAddReview = false;
  let reviewExists = false;

  if (req.session.isAuth) {
    const person = res.locals.person;

    [canAddReview, reviewExists] = await checkCanAddReview(person);
  }

  async function checkCanAddReview(person) {
    const review = await Review.findOne({user: person._id, target: 'fillUpGame'}).select(['_id']).lean();

    if (review) {
      return [false, true];
    }

    const fillUp = await FillUp.findOne({user: person._id, type: 'steam', status: 'success'}).select(['_id']).lean();

    if (fillUp) {
      return [true, false];
    }

    return [false, false];
  }

  seconds = seconds >= 60 ? 17 : seconds;

  res.render('fillUpGame', {
    title: 'Пополнение Genshin Impact: купить примогемы, кристаллы, благословение полой луны',
    metaDescription: 'Быстрый и удобный донат в Genshin Impact. На нашем сайте Вы можете купить примогемы, благословение полой луны. Моментальная доставка. Оплата по СБП.',
    breadcrumbs: [{
      name: 'Пополнение игр',
      current: true,
    }],
    canAddReview,
    reviewExists,
    countFillUps,
    amount,
    seconds,
    reviews,
    countReviews,
    genshinProducts,
  });
}

export const checkStatus = async (req, res) => {
  try {
    const fillUpId = req.query.fillUpId;
    const fillUp = await FillUp.findById(fillUpId);
    let status = '';

    if (!fillUp) {
      res.redirect('/fill-up-game');
    }

    if (fillUp.status === 'pending') {
      const response = await fetch(`https://genshin-pay.kupikod.com/api/orders/${fillUp.orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': 'cc00453a85e8911a715c961d6067e364',
        },
      });

      const stateData = await response.json();

      if (stateData.state !== 'pending') {
        try {
          fillUp.codeOrderError = stateData.status;
          fillUp.status = stateData.state;
          await fillUp.save();
        } catch (e) {
          console.log(e);
          fillUp.status = 'pending'
        }
      }
    }

    switch (fillUp.status) {
      case 'paymentAwaiting': {
        status = 'Ожидает оплаты';
        break;
      }
      case 'pending': {
        status = 'Идет пополнение кошелька';
        break;
      }
      case 'success': {
        status = 'Кошелек успешно пополнен';
        break;
      }
      default: status = 'Ошибка при пополнении, обратитесь в поддержку';
    }

    res.render('checkFillUpStatus', {
      fillUp,
      status,
      showActions: fillUp.status === 'paymentAwaiting' || fillUp.status === 'pending',
      noIndex: true,
      noIndexGoogle: true,
      breadcrumbs: [
        {
          name: 'Пополнение игр',
          path: 'fill-up-game',
        },
        {
          name: 'Статус пополнения',
          current: true,
        }
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/fill-up-game');
  }
}
