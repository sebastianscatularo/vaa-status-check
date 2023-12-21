import { Config, Context } from "@netlify/functions";

const API_ENDPOINT = 'https://europe-west3-wormhole-message-db-mainnet.cloudfunctions.net/missing-vaas';

export default async (req: Request, context: Context) => {
  if (req.headers.get('accept') !== 'application/json') {
    return Response.redirect('https://wormhole-foundation.github.io/wormhole-dashboard/');
  } else {
    const { id } = context.params;
    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "es-419,es;q=0.9,en;q=0.8",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "Referer": "https://wormhole-foundation.github.io/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });
      const data = await response.json();
      const { messages }: { messages: any[] } = data[id];
  
      const now = Date.now();
      const warn = messages.filter((m: any) => (now - new Date(m.timestamp).getTime()) < 3600000);
      if (warn) {
        return Response.json({ status: 'warning', warn });
      } else {
        return Response.json({ status: 'ok' });
      }
    } catch (error) {
      console.log(error);
      return Response.json({ error: 'Failed fetching data' }, { status: 500 });
    }
  }
};

export const config: Config = {
  path: "/network/:id"
};