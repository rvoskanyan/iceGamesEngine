export const assignOrderPay = async (req, res) => {
  const params = req.body;
  console.log(params);
  
  const product1 = {
    ID_I: 151342986,
    ID_D: 2145050,
    Amount: 0.01,
    Currency: 'WMR',
    Email: 'razm1998@yandex.ru',
    Date: '2022-04-07T09:54:33.4900000Z',
    Through: '',
    SHA256: '1d80494599d342a539edfd2db2995eb945f3b38bcad717073d6fe41ca8d805d3',
    CartUID: '',
    Agent: 0,
    IP: '78.106.175.90',
    IsMyProduct: false,
    Referer: '',
    Lang: 'ru-RU',
    forward: {
      ID_I: 151342986,
      ID_D: 2145050,
      Amount: 0.01,
      Currency: 'WMR',
      Email: 'razm1998@yandex.ru',
      Date: '2022-04-07T09:54:33.4900000Z',
      Through: '',
      SHA256: '1d80494599d342a539edfd2db2995eb945f3b38bcad717073d6fe41ca8d805d3',
      CartUID: '',
      Agent: 0,
      IP: '78.106.175.90',
      IsMyProduct: false,
      Referer: '',
      Lang: 'ru-RU'
    }
  }
  
  const product2 = {
    ID_I: 151342985,
    ID_D: 1343684,
    Amount: 0.01,
    Currency: 'WMR',
    Email: 'razm1998@yandex.ru',
    Date: '2022-04-07T09:54:33.4900000Z',
    Through: '',
    SHA256: '7214ed209357436831ea5c7925b34799efff0ae4f95c4e8641950a099e43204d',
    CartUID: '',
    Agent: 0,
    IP: '78.106.175.90',
    IsMyProduct: false,
    Referer: '',
    Lang: 'ru-RU',
    forward: {
      ID_I: 151342985,
      ID_D: 1343684,
      Amount: 0.01,
      Currency: 'WMR',
      Email: 'razm1998@yandex.ru',
      Date: '2022-04-07T09:54:33.4900000Z',
      Through: '',
      SHA256: '7214ed209357436831ea5c7925b34799efff0ae4f95c4e8641950a099e43204d',
      CartUID: '',
      Agent: 0,
      IP: '78.106.175.90',
      IsMyProduct: false,
      Referer: '',
      Lang: 'ru-RU'
    }
  }
}