const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { v4: uuidv4 } = require('uuid');

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ خطأ: يرجى إضافة BOT_TOKEN في Variables داخل منصة Railway!");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const PROXY_URL = process.env.PROXY_URL || "socks5://14a960b9eca06:21dd78f1a2@181.215.144.223:12324";
const agent = new SocksProxyAgent(PROXY_URL);

const INITIAL_COOKIES = [
  "gsid=31793dad-378b-4b3f-a31d-6830273a78f5",
  "NetflixId=v%3D3%26ct%3DBgjHlOvcAxKrAsPHtSnrZ9GKORSMuemrTl8covHfrSmMHg1VM44L77Jrwx2uMz07p6sVGf_wgQ347NiE9t-E6u6b1UIjzpLBZj3RK-K12h2a9fOSlqkzKuknBnpr9jq_r_CA258gC-GIMbcVrrpesjVwF_PFBsXdBEvXRpBITMlUtc9t8ZYnmXJhc-UYji_EIctXdNnTV58Q5z2C4uu0_UeYZdSjHfJ7kaWwoiTq4gXly5kgGIL3lYyLGIuI64ektCOwtw56c3xeAxi347qIWa9yUJu98ag5MFObpYDnt7dtyb_t1sWrLejZLVFlmRH3O1tvrGNQ1Gg1YWtu8M2UyONPETTUIk03-XuwOeq38x38W5yhRkQERjLBXMxxfEE2riISV__maFrywZ0aM2XKOy121xIUGAYiDgoMWP4bq858s_MFPNW8",
  "nfvdid=BQFmAAEBEFG3E8P1gRYF0CWTHucUHvRAr4WoXZoXMCJsHpmZWCwV23Wvz4jL7B_S3wcmhclGbFwicS-7sV38gw0R4uqceBim1JQ-_tiQJZ0wUNES6bl9Yw%3D%3D",
  "SecureNetflixId=v%3D3%26mac%3DAQEAEQABABQrKG3XWM4a01dvho67JcWEdpgOEh3Iqnw.%26dt%3D1786546366150"
];

const USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Pixel 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36"
];

// إنشاء جلسة مخصصة تدير الكوكيز والبروكسي بدون تعارض
class NetflixSession {
  constructor() {
    this.jar = new CookieJar();
    for (const cookie of INITIAL_COOKIES) {
      this.jar.setCookieSync(`${cookie}; Domain=.netflix.com; Path=/`, 'https://www.netflix.com');
    }

    this.client = axios.create({
      httpAgent: agent,
      httpsAgent: agent,
      timeout: 25000,
      validateStatus: () => true
    });

    this.client.interceptors.request.use(async (config) => {
      const url = config.url.startsWith('http') ? config.url : `https://www.netflix.com${config.url}`;
      const cookieStr = await this.jar.getCookieString(url);
      if (cookieStr) {
        config.headers['Cookie'] = cookieStr;
      }
      return config;
    });

    this.client.interceptors.response.use(async (response) => {
      const setCookies = response.headers['set-cookie'];
      if (setCookies) {
        const cookies = Array.isArray(setCookies) ? setCookies : [setCookies];
        const url = response.config.url.startsWith('http') ? response.config.url : `https://www.netflix.com${response.config.url}`;
        for (const c of cookies) {
          try {
            await this.jar.setCookie(c, url);
          } catch (e) {}
        }
      }
      return response;
    });
  }

  async get(url, options = {}) {
    return this.client.get(url, options);
  }

  async post(url, data, options = {}) {
    return this.client.post(url, data, options);
  }

  async getCookieValue(key) {
    const cookies = await this.jar.getCookies('https://www.netflix.com');
    const target = cookies.find(c => c.key === key);
    return target ? target.value : null;
  }
}

function cleanToken(token) {
  if (!token) return null;
  const t = token.replace(/\\\//g, '/').replace(/\\u002B/g, '+').replace(/\\u003D/g, '=').replace(/\\\+/g, '+');
  try {
    return decodeURIComponent(t);
  } catch (e) {
    return t;
  }
}

function extractFromDict(data) {
  if (data && typeof data === 'object') {
    if (data.serverState && data.serverScreenUpdate) {
      return [cleanToken(data.serverState), cleanToken(data.serverScreenUpdate)];
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        const [s, sc] = extractFromDict(item);
        if (s && sc) return [s, sc];
      }
    } else {
      for (const key of Object.keys(data)) {
        const [s, sc] = extractFromDict(data[key]);
        if (s && sc) return [s, sc];
      }
    }
  }
  return [null, null];
}

function smartExtract(data) {
  if (typeof data === 'object') {
    const [s, sc] = extractFromDict(data);
    if (s && sc) return [s, sc];
  }
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const stateMatch = text.match(/"serverState"\s*:\s*"([^"]+)"/);
  const screenMatch = text.match(/"serverScreenUpdate"\s*:\s*"([^"]+)"/);
  const state = stateMatch ? cleanToken(stateMatch[1]) : null;
  const screen = screenMatch ? cleanToken(screenMatch[1]) : null;
  return [state, screen];
}

function getGhostHeaders() {
  return {
    "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    "accept": "*/*",
    "accept-language": "ar-IQ,ar;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": "https://www.netflix.com",
    "x-netflix.context.app-version": "v09ea4ac1",
    "x-netflix.context.form-factor": "phone",
    "x-netflix.context.hawkins-version": "5.26.0",
    "x-netflix.context.is-inapp-browser": "false",
    "x-netflix.context.ui-flavor": "akira",
    "x-netflix.request.toplevel.uuid": uuidv4(),
    "x-netflix.request.id": uuidv4().replace(/-/g, '')
  };
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const humanDelay = () => sleep(Math.floor(Math.random() * 1000) + 1000);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "مرحباً يا بطل! 🚀\n\n✉️ أرسل الإيميل الآن لإرسال رابط التسجيل مباشرة.");
});

bot.on('message', async (msg) => {
  const text = msg.text ? msg.text.trim() : '';
  if (!text.includes('@') || text.includes('netflix.com') || text.startsWith('/')) {
    return;
  }

  const email = text;
  const chatId = msg.chat.id;
  const statusMsg = await bot.sendMessage(chatId, "⏳ جاري إرسال الرابط للإيميل عبر السيرفر...");

  try {
    const session = new NetflixSession();
    const ghostHeaders = getGhostHeaders();

    await session.get('https://www.netflix.com/iq/login', { headers: ghostHeaders });
    const freshFlwssn = await session.getCookieValue('flwssn');

    if (!freshFlwssn) {
      return bot.editMessageText("❌ فشل سحب تذكرة flwssn. تأكد من اتصال البروكسي.", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    await humanDelay();

    // الخطوة 1: تهيئة التسجيل
    const h1 = {
      ...ghostHeaders,
      "content-type": "application/json",
      "x-netflix.context.operation-name": "CLCSWebInitSignup",
      "x-netflix.request.client.context": '{"appstate":"foreground"}'
    };
    const p1 = {
      operationName: "CLCSWebInitSignup",
      variables: {
        inputNode: "WELCOME",
        locale: "ar-IQ",
        inputFields: [
          { name: "flwssn", value: { stringValue: freshFlwssn } },
          { name: "email", value: { stringValue: email } },
          { name: "userLoginId", value: { stringValue: email } },
          { name: "countryCode", value: { stringValue: "IQ" } },
          { name: "countryIsoCode", value: { stringValue: "IQ" } },
          { name: "recaptchaError", value: { stringValue: "RESPONSE_TIMED_OUT" } },
          { name: "recaptchaResponseTime", value: { stringValue: String(Math.floor(Math.random() * (3900 - 2100 + 1)) + 2100) } },
          { name: "recaptchaSiteKey", value: { stringValue: "6LdqW_EqAAAAAO87Fb_kcZfNzs0IqJRcKiJDYpUv" } },
          { name: "recaptchaToken", value: {} }
        ]
      },
      extensions: { persistedQuery: { id: "59134b11-7416-42ca-abb7-6d1f318975fe", version: 102 } }
    };

    const res1 = await session.post('https://www.netflix.com/graphql', p1, { headers: h1 });
    const [state1, screen1] = smartExtract(res1.data);
    if (!state1) {
      return bot.editMessageText(`❌ فشل الخطوة الأولى:\n${JSON.stringify(res1.data).slice(0, 200)}`, {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    await humanDelay();

    // الخطوة 2: طلب إرسال الرابط
    const h2 = {
      ...ghostHeaders,
      "content-type": "application/json",
      "x-netflix.context.operation-name": "CLCSScreenUpdate",
      "x-netflix.request.client.context": '{"appView":"emailRegisterSendLink","action":"Submitted","appstate":"foreground"}'
    };
    const p2 = {
      operationName: "CLCSScreenUpdate",
      variables: {
        format: "HTML",
        imageFormat: "PNG",
        locale: "ar-IQ",
        serverState: state1,
        serverScreenUpdate: screen1,
        inputFields: [
          { name: "userLoginId", value: { stringValue: email } },
          { name: "email", value: { stringValue: email } },
          { name: "countryCode", value: { stringValue: "IQ" } },
          { name: "countryIsoCode", value: { stringValue: "IQ" } },
          { name: "pipcConsent", value: { booleanValue: false } },
          { name: "emailConsent", value: { booleanValue: false } },
          { name: "recaptchaError", value: { stringValue: "RESPONSE_TIMED_OUT" } },
          { name: "recaptchaResponseTime", value: { intValue: Math.floor(Math.random() * (3900 - 2100 + 1)) + 2100 } }
        ]
      },
      extensions: { persistedQuery: { id: "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", version: 102 } }
    };

    const res2 = await session.post('https://www.netflix.com/graphql', p2, { headers: h2 });
    const [state2, screen2] = smartExtract(res2.data);
    if (!state2) {
      return bot.editMessageText(`❌ فشل الخطوة الثانية:\n${JSON.stringify(res2.data).slice(0, 200)}`, {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    await humanDelay();

    // الخطوة 3: تأكيد إرسال الرابط
    const h3 = {
      ...ghostHeaders,
      "content-type": "application/json",
      "x-netflix.context.operation-name": "CLCSScreenUpdate",
      "x-netflix.request.client.context": '{"appView":"emailRegisterLinkSent","action":"Submitted","appstate":"foreground"}'
    };
    const p3 = {
      operationName: "CLCSScreenUpdate",
      variables: {
        format: "HTML",
        imageFormat: "PNG",
        locale: "ar-IQ",
        serverState: state2,
        serverScreenUpdate: screen2,
        inputFields: [
          { name: "userLoginId", value: { stringValue: email } },
          { name: "email", value: { stringValue: email } },
          { name: "countryCode", value: { stringValue: "IQ" } },
          { name: "countryIsoCode", value: { stringValue: "IQ" } }
        ]
      },
      extensions: { persistedQuery: { id: "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", version: 102 } }
    };

    const res3 = await session.post('https://www.netflix.com/graphql', p3, { headers: h3 });
    const resText = typeof res3.data === 'string' ? res3.data : JSON.stringify(res3.data);

    if (res3.status === 200 && resText.includes('CLCSScreenUpdateTransition')) {
      bot.editMessageText(`🎉 **تم إرسال الرابط بنجاح!**\n\n📧 الإيميل: \`${email}\`\nافحص صندوق الوارد أو البريد العشوائي (Spam).`, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    } else {
      bot.editMessageText(`⚠️ **فشل الإرسال:**\n\`\`\`text\n${resText.slice(0, 300)}\n\`\`\``, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    }

  } catch (error) {
    bot.editMessageText(`❌ خطأ:\n${error.message}`, {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });
  }
});
