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

// إعداد البروكسي العراقي
const PROXY_URL = process.env.PROXY_URL || "socks5://14a960b9eca06:21dd78f1a2@181.215.144.223:12324";
const agent = new SocksProxyAgent(PROXY_URL, {
  shouldLookup: false
});

// ترويسات متصفح Chrome حقيقية
const REAL_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept": "*/*",
  "Accept-Language": "ar-IQ,ar;q=0.9,en-US;q=0.8,en;q=0.7",
  "Origin": "https://www.netflix.com",
  "Referer": "https://www.netflix.com/iq/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "x-netflix.context.app-version": "v09ea4ac1",
  "x-netflix.context.form-factor": "desktop",
  "x-netflix.context.hawkins-version": "5.26.0",
  "x-netflix.context.is-inapp-browser": "false",
  "x-netflix.context.ui-flavor": "akira"
};

class NetflixSession {
  constructor() {
    this.jar = new CookieJar();
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

function extractTokens(data) {
  if (data && typeof data === 'object') {
    if (data.serverState && data.serverScreenUpdate) {
      return [cleanToken(data.serverState), cleanToken(data.serverScreenUpdate)];
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        const [s, sc] = extractTokens(item);
        if (s && sc) return [s, sc];
      }
    } else {
      for (const key of Object.keys(data)) {
        const [s, sc] = extractTokens(data[key]);
        if (s && sc) return [s, sc];
      }
    }
  }
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const stateMatch = text.match(/"serverState"\s*:\s*"([^"]+)"/);
  const screenMatch = text.match(/"serverScreenUpdate"\s*:\s*"([^"]+)"/);
  return [stateMatch ? cleanToken(stateMatch[1]) : null, screenMatch ? cleanToken(screenMatch[1]) : null];
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "مرحباً يا بطل! 🚀\n\n✉️ أرسل الإيميل الآن لبدء إرسال الرابط.");
});

bot.on('message', async (msg) => {
  const text = msg.text ? msg.text.trim() : '';
  if (!text.includes('@') || text.includes('netflix.com') || text.startsWith('/')) {
    return;
  }

  const email = text;
  const chatId = msg.chat.id;
  const statusMsg = await bot.sendMessage(chatId, "⏳ جاري بدء الاتصال عبر البروكسي...");

  try {
    const session = new NetflixSession();
    const reqHeaders = {
      ...REAL_HEADERS,
      "x-netflix.request.toplevel.uuid": uuidv4(),
      "x-netflix.request.id": uuidv4().replace(/-/g, '')
    };

    // 1. فتح الصفحة الرئيسية لجلب كوكيز نظيفة وجديدة بالكامل
    console.log(`[+] بدء جلسة جديدة للإيميل: ${email}`);
    await session.get('https://www.netflix.com/iq/', { headers: reqHeaders });
    
    let freshFlwssn = await session.getCookieValue('flwssn');
    if (!freshFlwssn) {
      await session.get('https://www.netflix.com/iq/login', { headers: reqHeaders });
      freshFlwssn = await session.getCookieValue('flwssn');
    }

    if (!freshFlwssn) {
      console.error("[-] فشل في سحب تذكرة flwssn");
      return bot.editMessageText("❌ البروكسي لم يستجب أو تم حظر الـ IP من نتفليكس.", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    await sleep(1500);

    // 2. تهيئة التسجيل (InitSignup)
    const h1 = {
      ...reqHeaders,
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
          { name: "recaptchaResponseTime", value: { stringValue: String(Math.floor(Math.random() * 1000) + 2000) } },
          { name: "recaptchaSiteKey", value: { stringValue: "6LdqW_EqAAAAAO87Fb_kcZfNzs0IqJRcKiJDYpUv" } },
          { name: "recaptchaToken", value: {} }
        ]
      },
      extensions: { persistedQuery: { id: "59134b11-7416-42ca-abb7-6d1f318975fe", version: 102 } }
    };

    const res1 = await session.post('https://www.netflix.com/graphql', p1, { headers: h1 });
    const [state1, screen1] = extractTokens(res1.data);
    
    console.log("[1] WebInitSignup State:", state1 ? "OK" : "FAILED");
    if (!state1) {
      return bot.editMessageText(`❌ فشل في المرحلة 1:\n\`\`\`json\n${JSON.stringify(res1.data).slice(0, 300)}\n\`\`\``, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    }

    await sleep(1500);

    // 3. طلب إرسال الرابط (emailRegisterSendLink)
    const h2 = {
      ...reqHeaders,
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
          { name: "recaptchaResponseTime", value: { intValue: Math.floor(Math.random() * 1000) + 2000 } }
        ]
      },
      extensions: { persistedQuery: { id: "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", version: 102 } }
    };

    const res2 = await session.post('https://www.netflix.com/graphql', p2, { headers: h2 });
    const [state2, screen2] = extractTokens(res2.data);
    
    console.log("[2] emailRegisterSendLink State:", state2 ? "OK" : "FAILED");
    if (!state2) {
      return bot.editMessageText(`❌ فشل في المرحلة 2:\n\`\`\`json\n${JSON.stringify(res2.data).slice(0, 300)}\n\`\`\``, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    }

    await sleep(1500);

    // 4. تأكيد وصول شاشة الرابط المرسل (emailRegisterLinkSent)
    const h3 = {
      ...reqHeaders,
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
    const resRaw = JSON.stringify(res3.data || {});
    console.log("[3] Final Response:", resRaw);

    // فحص دقيق: هل وافقت نتفليكس على شاشة الانتقال أم تطلب كابتشا/تحقق؟
    if (resRaw.includes('CLCSScreenUpdateTransition') || resRaw.includes('emailRegisterLinkSent') || resRaw.includes('serverScreenUpdate')) {
      bot.editMessageText(`🎉 **تم طلب إرسال الرابط!**\n\n📧 الإيميل: \`${email}\`\n\n📌 رد السيرفر:\n\`\`\`json\n${resRaw.slice(0, 250)}\n\`\`\``, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    } else {
      bot.editMessageText(`⚠️ **حظر الحماية:** نتفليكس أسقطت الطلب.\n\`\`\`json\n${resRaw.slice(0, 300)}\n\`\`\``, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: "Markdown"
      });
    }

  } catch (error) {
    console.error("[-] Error:", error.message);
    bot.editMessageText(`❌ خطأ في التنفيذ:\n${error.message}`, {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });
  }
});
