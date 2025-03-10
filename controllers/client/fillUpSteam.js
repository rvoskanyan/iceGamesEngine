import FillUp from "../../models/FillUp.js";
import fetch from "node-fetch";
import Review from "../../models/Review.js";

export const fillUpSteamPage = async (req, res) => {
  const successFillUps = await FillUp.find({status: 'success'}).select(['amount']).lean();
  const countFillUps = successFillUps.length;
  const amount = successFillUps.reduce((accum, fillUp) => accum + fillUp.amount, 0);
  const countReviews = await Review.countDocuments({active: true, status: 'taken', target: 'FillUpSteam'});
  const reviews = await Review
    .find({status: 'taken', target: 'FillUpSteam', active: true})
    .limit(2)
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
    const review = await Review.findOne({user: person._id, target: 'FillUpSteam'}).select(['_id']).lean();
    
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
  
  res.render('fillUpSteam', {
    title: 'ICE GAMES — Пополнение баланса Steam аккаунта',
    metaDescription: '⚡️Быстрое пополнение баланса кошелька Steam в 2023 году. ✔️Пополнение от 100 рублей. ✔️Оплата любым удобным способом: банковские карты, СПБ, Yandex Pay, Tinkoff Pay. ✔️Низкая комиссия. ✔️Зачисление в течение 2х минут. ⌚️Поддержка 24/7',
    breadcrumbs: [{
      name: 'Пополнить Steam',
      current: true,
    }],
    canAddReview,
    reviewExists,
    countFillUps,
    amount,
    seconds,
    reviews,
    countReviews,
  });
}

export const checkStatus = async (req, res) => {
  try {
    const fillUpId = req.query.fillUpId;
    const fillUp = await FillUp.findById(fillUpId);
    let status = '';
    
    if (!fillUp) {
      res.redirect('/fill-up-steam');
    }
    
    if (fillUp.status === 'pending') {
      const response = await fetch(`https://steam.kupikod.com/api/v3/partner-order/${fillUp.orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
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
          name: 'Пополнить Steam',
          path: 'fill-up-steam',
        },
        {
          name: 'Статус пополнения',
          current: true,
        }
      ],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/fill-up-steam');
  }
}

export const fillUpTurkeySteamPage = (req, res) => {
  res.render('fillUpSteamTurkey', {
    title: 'ICE GAMES — Пополнение баланса Steam турецкого аккаунта',
    metaDescription: '⚡️Быстрое пополнение баланса турецкого кошелька Steam в 2023 году. ✔️Пополнение от 100 рублей. ✔️Оплата любым удобным способом: банковские карты, СПБ, Yandex Pay, Tinkoff Pay. ✔️Низкая комиссия. ✔️Зачисление в течение 2х минут. ⌚️Поддержка 24/7',
    breadcrumbs: [
      {
        name: 'Пополнить Steam',
        path: 'fill-up-steam',
      },
      {
        name: 'Турецкий аккаунт',
        current: true,
      }
    ],
  });
}

export const fillUpKazakhstanSteamPage = async (req, res) => {
  const successFillUps = await FillUp.find({status: 'success'}).select(['amount']).lean();
  const countFillUps = successFillUps.length;
  const amount = successFillUps.reduce((accum, fillUp) => accum + fillUp.amount, 0);
  const countReviews = await Review.countDocuments({active: true, status: 'taken', target: 'FillUpSteam'});
  
  const reviews = await Review
    .find({status: 'taken', target: 'FillUpSteam', active: true})
    .limit(2)
    .sort({createdAt: -1})
    .populate({
      path: 'user',
      select: ['login'],
    })
    .lean();
    
  const responseRate = await fetch('https://steam-api.kupikod.com/api/v3/partner-kzt', { headers: {
    'Content-Type': 'application/json',
    'token': 'icegame.store_q4L4Re1u1hIjQIgPBWqiDYZfzheIRmHEwAzX',
  }});
  
  const { rubKzt } = await responseRate.json();
    
  let seconds = new Date().getHours() + new Date().getMinutes();

  let canAddReview = false;
  let reviewExists = false;
  
  if (req.session.isAuth) {
    const person = res.locals.person;
    
    [canAddReview, reviewExists] = await checkCanAddReview(person);
  }
  
  async function checkCanAddReview(person) {
    const review = await Review.findOne({user: person._id, target: 'FillUpSteam'}).select(['_id']).lean();
    
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
  
  res.render('fillUpSteam', {
    title: 'ICE GAMES — Пополнение баланса Steam аккаунта',
    metaDescription: '⚡️Быстрое пополнение баланса кошелька Steam в 2023 году. ✔️Пополнение от 100 рублей. ✔️Оплата любым удобным способом: банковские карты, СПБ, Yandex Pay, Tinkoff Pay. ✔️Низкая комиссия. ✔️Зачисление в течение 2х минут. ⌚️Поддержка 24/7',
    breadcrumbs: [
      {
        name: 'Пополнить Steam',
        path: 'fill-up-steam',
      },
      {
        name: 'Казахстанский аккаунт',
        current: true,
      }
    ],
    isKazakhstan: true,
    rate: (1 / parseFloat(rubKzt)).toFixed(2),
    canAddReview,
    reviewExists,
    countFillUps,
    amount,
    seconds,
    reviews,
    countReviews,
  });
}