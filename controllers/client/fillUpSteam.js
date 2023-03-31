import FillUp from "../../models/FillUp.js";

export const fillUpSteamPage = (req, res) => {
  res.render('fillUpSteam', {
    title: 'ICE GAMES — Пополнить баланс Steam',
    metaDescription: 'Здесь Вы сможете быстро и просто пополнить баланс Вашего аккаунта Steam',
    breadcrumbs: [{
      name: 'Пополнить Steam',
      current: true,
    }],
  });
}

export const checkStatus = async (req, res) => {
  try {
    const fillUpId = req.query.fillUpId;
    const fillUp = await FillUp.findById(fillUpId);
    
    if (!fillUp) {
      res.redirect('/fill-up-steam');
    }
    
    res.render('checkFillUpStatus', {
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