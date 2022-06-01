import fetch from "node-fetch";
import crypto from "crypto";

export const getToken = async () => {
  const seller_id = 951647;
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const sign = crypto.createHash('sha256').update(`B67D8EB8089C426F9A562CB08FB16151${timestamp}`).digest('hex');
  const responseToken = await fetch('https://api.digiseller.ru/api/apilogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      seller_id,
      timestamp,
      sign,
    }),
  });
  return await responseToken.json();
}