const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { v4: uuidv4 } = require('uuid');

// ==========================================
// الثوابت وإعدادات نتفلكس والبروكسي
// ==========================================
const PROXIES = {
    "http": "http://het95yha52718u9-country-iq:cwf2pqqblvu5ci5@rp.scrapegw.com:6060",
    "https": "http://het95yha52718u9-country-iq:cwf2pqqblvu5ci5@rp.scrapegw.com:6060"
};

const IDENTITY_COOKIES = {
    "gsid": "31793dad-378b-4b3f-a31d-6830273a78f5",
    "NetflixId": "v%3D3%26ct%3DBgjHlOvcAxKrAsPHtSnrZ9GKORSMuemrTl8covHfrSmMHg1VM44L77Jrwx2uMz07p6sVGf_wgQ347NiE9t-E6u6b1UIjzpLBZj3RK-K12h2a9fOSlqkzKuknBnpr9jq_r_CA258gC-GIMbcVrrpesjVwF_PFBsXdBEvXRpBITMlUtc9t8ZYnmXJhc-UYji_EIctXdNnTV58Q5z2C4uu0_UeYZdSjHfJ7kaWwoiTq4gXly5kgGIL3lYyLGIuI64ektCOwtw56c3xeAxi347qIWa9yUJu98ag5MFObpYDnt7dtyb_t1sWrLejZLVFlmRH3O1tvrGNQ1Gg1YWtu8M2UyONPETTUIk03-XuwOeq38x38W5yhRkQERjLBXMxxfEE2riISV__maFrywZ0aM2XKOy121xIUGAYiDgoMWP4bq858s_MFPNW8",
    "nfvdid": "BQFmAAEBEFG3E8P1gRYF0CWTHucUHvRAr4WoXZoXMCJsHpmZWCwV23Wvz4jL7B_S3wcmhclGbFwicS-7sV38gw0R4uqceBim1JQ-_tiQJZ0wUNES6bl9Yw%3D%3D",
    "SecureNetflixId": "v%3D3%26mac%3DAQEAEQABABQrKG3XWM4a01dvho67JcWEdpgOEh3Iqnw.%26dt%3D1786546366150"
};

const USER_AGENTS = [
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; Pixel 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36"
];

const SERVICE_NETFLIX = "nf";
const COUNTRY_IRAQ = "47";
const httpAgent = new HttpsProxyAgent(PROXIES.http);

// ==========================================
// إعدادات البوتات والمستخدمين (مرتبطة بمتغيرات البيئة)
// ==========================================
let BOTS_CONFIG = [
    {
        "bot_token": process.env.BOT_TOKEN_1 || "",
        "user_id": parseInt(process.env.USER_ID_1 || "6491999046"),
        "name": "عقيل",
        "providers": {
            "smsbower": {
                "name": "🌐 SMSBower",
                "base_url": "https://smsbower.page/stubs/handler_api.php",
                "wallet_url": "https://smsbower.page/api/payment/getActualWalletAddress",
                "min_deposit": 1.5,
                "api_key": process.env.SMSBOWER_API_KEY_1 || ""
            },
            "grizzly": {
                "name": "🐻 GrizzlySMS",
                "base_url": "https://api.grizzlysms.com/stubs/handler_api.php",
                "wallet_url": "https://api.grizzlysms.com/public/crypto/wallet",
                "min_deposit": 3.0,
                "api_key": process.env.GRIZZLY_API_KEY_1 || ""
            }
        }
    },
    {
        "bot_token": process.env.BOT_TOKEN_2 || "",
        "user_id": parseInt(process.env.USER_ID_2 || "643309456"),
        "name": "نبيل",
        "providers": {
            "smsbower": {
                "name": "🌐 SMSBower",
                "base_url": "https://smsbower.page/stubs/handler_api.php",
                "wallet_url": "https://smsbower.page/api/payment/getActualWalletAddress",
                "min_deposit": 1.5,
                "api_key": process.env.SMSBOWER_API_KEY_2 || ""
            }
        }
    },
    {
        "bot_token": process.env.BOT_TOKEN_3 || "",
        "user_id": parseInt(process.env.USER_ID_3 || "7668986550"),
        "name": "فلوس سجى",
        "providers": {
            "smsbower": {
                "name": "🌐 SMSBower",
                "base_url": "https://smsbower.page/stubs/handler_api.php",
                "wallet_url": "https://smsbower.page/api/payment/getActualWalletAddress",
                "min_deposit": 1.5,
                "api_key": process.env.SMSBOWER_API_KEY_3 || ""
            }
        }
    },
    {
        "bot_token": process.env.BOT_TOKEN_4 || "",
        "user_id": parseInt(process.env.USER_ID_4 || "1949168120"),
        "name": "حسين",
        "providers": {
            "smsbower": {
                "name": "🌐 SMSBower",
                "base_url": "https://smsbower.page/stubs/handler_api.php",
                "wallet_url": "https://smsbower.page/api/payment/getActualWalletAddress",
                "min_deposit": 1.5,
                "api_key": process.env.SMSBOWER_API_KEY_4 || ""
            }
        }
    }
];

// ==========================================
// الدوال المساعدة لـ Netflix API
// ==========================================
function cleanToken(token) {
    if (!token) return null;
    let t = token.replace(/\\|\//g, (m) => m === '\\' ? '' : '/').replace(/\\u002B/g, '+').replace(/\\u003D/g, '=').replace(/\\\+/g, '+');
    try {
        return decodeURIComponent(t);
    } catch (e) {
        return t;
    }
}

function extractFromDict(data) {
    if (data && typeof data === 'object') {
        if ('serverState' in data && 'serverScreenUpdate' in data) {
            return [cleanToken(data['serverState']), cleanToken(data['serverScreenUpdate'])];
        }
        for (let key in data) {
            let [s, sc] = extractFromDict(data[key]);
            if (s && sc) return [s, sc];
        }
    } else if (Array.isArray(data)) {
        for (let item of data) {
            let [s, sc] = extractFromDict(item);
            if (s && sc) return [s, sc];
        }
    }
    return [null, null];
}

function smartExtract(text) {
    if (!text) return [null, null];
    try {
        let data = JSON.parse(text);
        let [s, sc] = extractFromDict(data);
        if (s && sc) return [s, sc];
    } catch (e) {}

    let stateMatch = text.match(/"serverState"\s*:\s*"([^"]+)"/);
    let screenMatch = text.match(/"serverScreenUpdate"\s*:\s*"([^"]+)"/);

    let state = stateMatch ? cleanToken(stateMatch[1]) : null;
    let screen = screenMatch ? cleanToken(screenMatch[1]) : null;
    return [state, screen];
}

function getGhostHeaders() {
    let ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    return {
        "User-Agent": ua,
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

async function humanDelay(minSec = 1.0, maxSec = 2.0) {
    let ms = Math.floor((Math.random() * (maxSec - minSec) + minSec) * 1000);
    await new Promise(r => setTimeout(r, ms));
}

// ==========================================
// الدوال المساعدة لسيرفرات الـ SMS
// ==========================================
async function getCurrentBalance(baseUrl, apiKey) {
    if (!apiKey) return [0.0, "0.00$"];
    try {
        let response = await axios.get(baseUrl, {
            params: { "api_key": apiKey, "action": "getBalance" },
            timeout: 5000
        });
        let resText = String(response.data).trim();

        let balVal = parseFloat(resText);
        if (!isNaN(balVal) && !resText.includes("ACCESS_BALANCE")) {
            return [balVal, `${balVal.toFixed(2)}$`];
        }

        if (response.data && typeof response.data === 'object' && "balance" in response.data) {
            balVal = parseFloat(response.data["balance"]);
            return [balVal, `${balVal.toFixed(2)}$`];
        }

        if (resText.startsWith("ACCESS_BALANCE:")) {
            let balanceStr = resText.split(":")[1];
            balVal = parseFloat(balanceStr);
            return [balVal, `${balVal.toFixed(2)}$`];
        }
    } catch (e) {
        console.error("Error reading balance:", e.message);
    }
    return [0.0, "0.00$"];
}

async function getWalletAddress(provInfo, amount) {
    let walletUrl = provInfo["wallet_url"];
    let apiKey = provInfo["api_key"];
    if (!apiKey) return "0x1380bc7f76c1dd0fa1f0a0633cfbc15dd0ab8b4";
    let networksToTry = ["bsc", "bep20", "binancesmartchain"];

    for (let net of networksToTry) {
        try {
            let response = await axios.get(walletUrl, {
                params: { "api_key": apiKey, "coin": "usdt", "network": net },
                timeout: 10000
            });

            let resJson = response.data;
            if (resJson && typeof resJson === 'object') {
                let address = resJson.address || resJson.wallet_address || resJson.wallet || resJson.url || (resJson.data && typeof resJson.data === 'object' ? resJson.data.address : null);
                if (address && String(address).startsWith("0x")) {
                    return String(address);
                }
            }

            let resText = String(response.data).trim();
            if (resText.startsWith("0x") && resText.length >= 40) {
                return resText;
            }
        } catch (e) {
            console.error(`Error trying network ${net}:`, e.message);
        }
    }
    return "0x1380bc7f76c1dd0fa1f0a0633cfbc15dd0ab8b4";
}

async function fetchRealApiPrices(baseUrl, apiKey, country = COUNTRY_IRAQ) {
    if (!apiKey) return {};
    try {
        let response = await axios.get(baseUrl, {
            params: {
                "api_key": apiKey,
                "action": "getPricesV2",
                "service": SERVICE_NETFLIX,
                "country": country
            },
            timeout: 5000
        });
        let resJson = response.data;
        let pricesDict = resJson && resJson[country] ? resJson[country][SERVICE_NETFLIX] || {} : {};

        let filteredPrices = {};
        for (let p in pricesDict) {
            try {
                if (parseFloat(p) === 0.071) continue;
            } catch (e) {}
            filteredPrices[p] = pricesDict[p];
        }
        return filteredPrices;
    } catch (e) {
        console.error("Error fetching API prices:", e.message);
        return {};
    }
}

async function cancelOrder(baseUrl, apiKey, activationId) {
    if (!apiKey) return false;
    try {
        let res8 = await axios.get(baseUrl, {
            params: { 'api_key': apiKey, 'action': 'setStatus', 'id': activationId, 'status': 8 },
            timeout: 4000
        });
        let text8 = String(res8.data).trim();
        if (text8.startsWith("ACCESS_CANCEL") || text8 === "1") return true;
    } catch (e) {}

    try {
        let resNeg = await axios.get(baseUrl, {
            params: { 'api_key': apiKey, 'action': 'setStatus', 'id': activationId, 'status': -1 },
            timeout: 4000
        });
        let textNeg = String(resNeg.data).trim();
        if (textNeg.startsWith("ACCESS_CANCEL") || textNeg === "1") return true;
    } catch (e) {}

    return false;
}

async function cancelAllActiveOrders(baseUrl, apiKey) {
    if (!apiKey) return;
    try {
        let res = await axios.get(baseUrl, {
            params: { 'api_key': apiKey, 'action': 'getActiveActivations' },
            timeout: 4000
        });
        let data = res.data;
        if (data && typeof data === 'object' && Array.isArray(data["activeActivations"])) {
            for (let act of data["activeActivations"]) {
                let actId = act.activationId || act.id;
                if (actId) {
                    cancelOrder(baseUrl, apiKey, actId).catch(() => {});
                }
            }
        }
    } catch (e) {}
}

// ==========================================
// فئة إدارة البوت الموحد (SingleBotHandler)
// ==========================================
class SingleBotHandler {
    constructor(config) {
        this.botToken = config["bot_token"];
        this.allowedUserId = config["user_id"];
        this.userName = config["name"];
        this.providers = config["providers"];
        
        if (!this.botToken) {
            console.warn(`⚠️ تحذير: التوكن الخاص بالبوت (${this.userName}) غير موجود في متغيرات البيئة!`);
            return;
        }

        this.bot = new TelegramBot(this.botToken, { polling: true });
        this.userActiveOrders = {};
        this.userStates = {};
        this.selectedProvider = {}; 
        this.lastBalances = {};
        this.activeSearchIds = {};
        this.activeSearchMsgs = {};
        this.userSessions = {};
        
        this._setupHandlers();
    }

    _getProvider(chatId) {
        let provKey = this.selectedProvider[chatId] || "smsbower";
        return this.providers[provKey] || Object.values(this.providers)[0];
    }

    start() {
        if (!this.botToken) return;
        setInterval(() => this._balanceMonitor(), 15000);
        console.log(`🤖 تم تشغيل بوت المستخدم: ${this.userName}`);
    }

    async _balanceMonitor() {
        try {
            let prov = this._getProvider(this.allowedUserId);
            let [numVal, textVal] = await getCurrentBalance(prov["base_url"], prov["api_key"]);
            
            let lastBal = this.lastBalances[prov["name"]];
            if (lastBal === undefined) {
                this.lastBalances[prov["name"]] = numVal;
                return;
            }
            
            if (numVal > lastBal) {
                this.lastBalances[prov["name"]] = numVal;
                try {
                    await this.bot.sendMessage(
                        this.allowedUserId,
                        `🎉 **تم استلام الأموال بنجاح (${prov['name']})!**\n💰 رصيدك الحالي أصبح: **${textVal}**`,
                        { parse_mode: "Markdown" }
                    );
                } catch (e) {}
            } else if (numVal < lastBal) {
                this.lastBalances[prov["name"]] = numVal;
            }
        } catch (e) {}
    }

    async _mainKeyboard(chatId) {
        let prov = this._getProvider(chatId);
        let [, balanceText] = await getCurrentBalance(prov["base_url"], prov["api_key"]);
        let inlineKeyboard = [];
        
        let keys = Object.keys(this.providers);
        if (keys.length > 1) {
            let provButtons = [];
            for (let pKey of keys) {
                let pVal = this.providers[pKey];
                let prefix = ((this.selectedProvider[chatId] || "smsbower") === pKey) ? "✅ " : "";
                provButtons.push({ text: `${prefix}${pVal.name}`, callback_data: `select_prov_${pKey}` });
            }
            inlineKeyboard.push(provButtons);
        }

        inlineKeyboard.push([{ text: `👤 ${this.userName} | [${prov.name}] 💰 الرصيد: ${balanceText}`, callback_data: "get_balance" }]);
        inlineKeyboard.push([{ text: "🇮🇶 ⚡ شراء سريع (زين 0.079$)", callback_data: "buy_fast_079" }]);
        inlineKeyboard.push([{ text: "🇮🇶 🔄 صيد مستمر (زين 0.079$ فقط)", callback_data: "buy_continuous_079" }]);
        inlineKeyboard.push([{ text: "🇮🇶 🔄 صيد مستمر (زين أو آسيا 0.079$)", callback_data: "buy_continuous_both_079" }]);
        inlineKeyboard.push([{ text: "🇮🇶 📱 عرض باقي أسعار العراق", callback_data: "show_prices" }]);
        inlineKeyboard.push([{ text: "💳 إيداع الأموال (USDT - BSC)", callback_data: "deposit_bsc" }]);

        return { reply_markup: { inline_keyboard: inlineKeyboard } };
    }

    async _handleEmailSubmission(message) {
        let email = message.text.trim();
        let chatId = message.chat.id;
        let msgStatus = await this.bot.sendMessage(chatId, "⏳ جاري إرسال الرابط للإيميل عبر البروكسي...");
        
        try {
            let client = axios.create({
                httpsAgent: httpAgent,
                proxy: false,
                timeout: 15000,
                headers: IDENTITY_COOKIES
            });
            let ghostHeaders = getGhostHeaders();

            let respInit = await client.get('https://www.netflix.com/iq/login', { headers: ghostHeaders });
            let freshFlwssn = uuidv4();
            let match = respInit.data.match(/"flwssn"\s*:\s*"([^"]+)"/);
            if (match) freshFlwssn = match[1];

            await humanDelay(1.0, 2.0);

            let h1 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSWebInitSignup", "x-netflix.request.client.context": '{"appstate":"foreground"}' };
            let p1 = {
                "operationName": "CLCSWebInitSignup", 
                "variables": {
                    "inputNode": "WELCOME", 
                    "locale": "ar-IQ", 
                    "inputFields": [
                        {"name": "flwssn", "value": {"stringValue": freshFlwssn}}, 
                        {"name": "email", "value": {"stringValue": email}}, 
                        {"name": "userLoginId", "value": {"stringValue": email}},
                        {"name": "countryIsoCode", "value": {"stringValue": "IQ"}},
                        {"name": "countryCode", "value": {"stringValue": "IQ"}},
                        {"name": "recaptchaError", "value": {"stringValue": "RESPONSE_TIMED_OUT"}}, 
                        {"name": "recaptchaResponseTime", "value": {"stringValue": String(Math.floor(Math.random() * 1800) + 2100)}}, 
                        {"name": "recaptchaSiteKey", "value": {"stringValue": "6LdqW_EqAAAAAO87Fb_kcZfNzs0IqJRcKiJDYpUv"}}, 
                        {"name": "recaptchaToken", "value": {}}
                    ]
                }, 
                "extensions": {"persistedQuery": {"id": "59134b11-7416-42ca-abb7-6d1f318975fe", "version": 102}}
            };
            let res1 = await client.post('https://www.netflix.com/graphql', p1, { headers: h1 });
            let [state1, screen1] = smartExtract(JSON.stringify(res1.data));
            if (!state1) {
                await this.bot.editMessageText(`❌ فشل الخطوة 1:\n\`${JSON.stringify(res1.data).substring(0, 200)}\``, { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" });
                return;
            }

            await humanDelay(1.2, 2.2);

            let h2 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"emailRegisterSendLink","action":"Submitted","appstate":"foreground"}' };
            let p2 = {
                "operationName": "CLCSScreenUpdate", 
                "variables": {
                    "format": "HTML", 
                    "imageFormat": "PNG", 
                    "locale": "ar-IQ", 
                    "serverState": state1, 
                    "serverScreenUpdate": screen1, 
                    "inputFields": [
                        {"name": "email", "value": {"stringValue": email}}, 
                        {"name": "userLoginId", "value": {"stringValue": email}},
                        {"name": "countryIsoCode", "value": {"stringValue": "IQ"}},
                        {"name": "countryCode", "value": {"stringValue": "IQ"}},
                        {"name": "pipcConsent", "value": {"booleanValue": false}}, 
                        {"name": "emailConsent", "value": {"booleanValue": false}}, 
                        {"name": "recaptchaError", "value": {"stringValue": "RESPONSE_TIMED_OUT"}}, 
                        {"name": "recaptchaResponseTime", "value": {"intValue": Math.floor(Math.random() * 1800) + 2100}}
                    ]
                }, 
                "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}
            };
            let res2 = await client.post('https://www.netflix.com/graphql', p2, { headers: h2 });
            let res2Text = JSON.stringify(res2.data);
            
            if (res2.status === 200 && res2Text.includes('CLCSScreenUpdateTransition')) {
                await this.bot.editMessageText(
                    `🎉 **تم إرسال الرابط بنجاح!**\n\n📧 الإيميل: \`${email}\`\n\n⚠️ *ملاحظة:* إذا لم يصلك الرابط خلال دقيقة، تأكد من عدم استخدام بريد مؤقت وهمي واستخدم Gmail أو Hotmail.\n\n🔗 انسخ الرابط السحري وأرسله هنا.`, 
                    { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" }
                );
            } else {
                await this.bot.editMessageText(
                    `⚠️ **فشل الإرسال في الخطوة 2:**\n\`\`\`text\n${res2Text.substring(0, 300)}\n\`\`\``, 
                    { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" }
                );
            }
        } catch (e) {
            await this.bot.editMessageText(`❌ خطأ:\n\`${e.message}\``, { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" });
        }
    }

    async _execute_golden_path(message, magic_link) {
        let phone_number = message.text.trim();
        let chatId = message.chat.id;
        let msgStatus = await this.bot.sendMessage(chatId, "⏳ جاري تنفيذ المسار الذهبي...");

        try {
            let client = axios.create({
                httpsAgent: httpAgent,
                proxy: false,
                timeout: 15000,
                headers: IDENTITY_COOKIES,
                maxRedirects: 5
            });
            let ghostHeaders = getGhostHeaders();

            await this.bot.editMessageText("🔄 1/7: فتح الرابط السحري...", { chat_id: chatId, message_id: msgStatus.message_id });
            let res0 = await client.get(magic_link, { headers: ghostHeaders });
            let flwssn = uuidv4();

            let [state0, screen0] = smartExtract(JSON.stringify(res0.data));
            if (!state0 && res0.request && res0.request.res && res0.request.res.responseUrl && res0.request.res.responseUrl.includes("serverState=")) {
                try {
                    let urlObj = new URL(res0.request.res.responseUrl);
                    state0 = decodeURIComponent(urlObj.searchParams.get("serverState"));
                } catch(err) {}
            }

            if (!state0) {
                await this.bot.editMessageText("❌ الرابط تالف أو منتهي الصلاحية.", { chat_id: chatId, message_id: msgStatus.message_id });
                return;
            }

            await humanDelay();

            await this.bot.editMessageText("🔄 2/7: تأكيد التسجيل...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h1 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"PASSWORDLESS_REGISTRATION","action":"Submitted","appstate":"foreground"}' };
            let p1 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state0, "serverScreenUpdate": screen0, "inputFields": []}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            await client.post('https://www.netflix.com/graphql', p1, { headers: h1 });

            await humanDelay();

            await this.bot.editMessageText("🔄 3/7: تهيئة الخطة (InitSignup)...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h2 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSWebInitSignup", "x-netflix.request.client.context": '{"appstate":"foreground"}' };
            let p2 = {"operationName": "CLCSWebInitSignup", "variables": {"inputNode": "WELCOME", "locale": "ar-IQ", "inputFields": [{"name": "flwssn", "value": {"stringValue": flwssn}}]}, "extensions": {"persistedQuery": {"id": "59134b11-7416-42ca-abb7-6d1f318975fe", "version": 102}}};
            let res2 = await client.post('https://www.netflix.com/graphql', p2, { headers: h2 });
            let [state2, screen2] = smartExtract(JSON.stringify(res2.data));
            if (!state2) {
                await this.bot.editMessageText(`❌ فشل في التهيئة (WebInitSignup):\n${JSON.stringify(res2.data).substring(0, 300)}`, { chat_id: chatId, message_id: msgStatus.message_id });
                return;
            }

            await humanDelay();

            await this.bot.editMessageText("🔄 4/7: المرور ببوابة سياق الخطة...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h3 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"planSelectionContext","action":"Submitted","appstate":"foreground"}' };
            let p3 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state2, "serverScreenUpdate": screen2, "inputFields": []}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            let res3 = await client.post('https://www.netflix.com/graphql', p3, { headers: h3 });
            let [state3, screen3] = smartExtract(JSON.stringify(res3.data));
            if (!state3) {
                await this.bot.editMessageText(`❌ فشل في بوابة Context:\n${JSON.stringify(res3.data).substring(0, 300)}`, { chat_id: chatId, message_id: msgStatus.message_id });
                return;
            }

            await humanDelay();

            await this.bot.editMessageText("🔄 5/7: اختيار الخطة 3108...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h4 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"planSelection","action":"Submitted","appstate":"foreground"}' };
            let p4 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state3, "serverScreenUpdate": screen3, "inputFields": [{"name": "planChoice", "value": {"stringValue": "3108"}}]}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            let res4 = await client.post('https://www.netflix.com/graphql', p4, { headers: h4 });
            let [state4, screen4] = smartExtract(JSON.stringify(res4.data));
            if (!state4) {
                await this.bot.editMessageText(`❌ فشل في اختيار الخطة:\n${JSON.stringify(res4.data).substring(0, 300)}`, { chat_id: chatId, message_id: msgStatus.message_id });
                return;
            }

            await humanDelay();

            await this.bot.editMessageText("🔄 6/7: المرور ببوابة اختيار الدفع...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h5 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"paymentPicker","action":"Submitted","appstate":"foreground"}' };
            let p5 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state4, "serverScreenUpdate": screen4, "inputFields": []}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            let res5 = await client.post('https://www.netflix.com/graphql', p5, { headers: h5 });
            let [state5, screen5] = smartExtract(JSON.stringify(res5.data));
            if (!state5) {
                await this.bot.editMessageText(`❌ فشل في بوابة الدفع:\n${JSON.stringify(res5.data).substring(0, 300)}`, { chat_id: chatId, message_id: msgStatus.message_id });
                return;
            }

            await humanDelay();

            await this.bot.editMessageText("📲 7/7: حقن الرقم وإرسال الكود...", { chat_id: chatId, message_id: msgStatus.message_id });
            let h6 = { ...ghostHeaders, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"ENTER_DCB","action":"Submitted","appstate":"foreground"}' };
            let p6 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state5, "serverScreenUpdate": screen5, "inputFields": [{"name": "phoneNumber", "value": {"stringValue": phone_number}}, {"name": "countryCode", "value": {"stringValue": "IQ"}}, {"name": "countryIsoCode", "value": {"stringValue": "IQ"}}, {"name": "paymentSubtype", "value": {"stringValue": "NA"}}, {"name": "partnerIntegrationUrl", "value": {"stringValue": "https://www.netflix.com/signup?serverCallback={serverCallback}"}}, {"name": "iAgree", "value": {"booleanValue": true}}]}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            let res6 = await client.post('https://www.netflix.com/graphql', p6, { headers: h6 });
            let res6Text = JSON.stringify(res6.data);

            if (res6.status === 200 && res6Text.includes('PAYMENTS_MFA_ENTER_CODE')) {
                let [state6, screen6] = smartExtract(res6Text);
                this.userSessions[chatId] = { "client": client, "headers": ghostHeaders, "state": state6, "screen": screen6 };
                await this.bot.sendMessage(chatId, `🎯 **تم إرسال الـ SMS بنجاح!**\nالرقم: \`+964${phone_number}\`\n\n💬 أرسل الكود (OTP):`, { parse_mode: "Markdown" });
                this.userStates[chatId] = "waiting_for_otp";
            } else {
                await this.bot.editMessageText(`❌ **الضربة الأخيرة فشلت.** الرد:\n\`\`\`text\n${res6Text.substring(0, 500)}\n\`\`\``, { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" });
            }

        } catch (e) {
            await this.bot.editMessageText(`❌ **خطأ برمجي:**\n${e.message}`, { chat_id: chatId, message_id: msgStatus.message_id });
        }
    }

    async _processOtp(message) {
        let otpCode = message.text.trim();
        let chatId = message.chat.id;
        
        if (!this.userSessions[chatId]) {
            await this.bot.reply_to(message, "❌ الجلسة مفقودة.");
            return;
        }
            
        let userData = this.userSessions[chatId];
        let client = userData["client"];
        let headers = userData["headers"];
        let state = userData["state"];
        let screen = userData["screen"];
        
        let msgStatus = await this.bot.reply_to(message, "⏳ تأكيد الكود...");
        
        try {
            let h7 = { ...headers, "content-type": "application/json", "x-netflix.context.operation-name": "CLCSScreenUpdate", "x-netflix.request.client.context": '{"appView":"otpCodeEntry","action":"Submitted","appstate":"foreground"}' };
            let p7 = {"operationName": "CLCSScreenUpdate", "variables": {"format": "HTML", "imageFormat": "PNG", "locale": "ar-IQ", "serverState": state, "serverScreenUpdate": screen, "inputFields": [{"name": "mfaCode", "value": {"stringValue": otpCode}}]}, "extensions": {"persistedQuery": {"id": "bf08eba4-da1b-4e3b-92e4-ceb2b7c1c27d", "version": 102}}};
            let res7 = await client.post('https://www.netflix.com/graphql', p7, { headers: h7 });
            
            await this.bot.editMessageText(`الاستجابة النهائية:\n\`\`\`text\n${JSON.stringify(res7.data).substring(0, 500)}\n\`\`\``, { chat_id: chatId, message_id: msgStatus.message_id, parse_mode: "Markdown" });
            delete this.userSessions[chatId];
            delete this.userStates[chatId];
            
        } catch (e) {
            await this.bot.editMessageText(`❌ خطأ:\n${e.message}`, { chat_id: chatId, message_id: msgStatus.message_id });
        }
    }

    async _buyNumberAutoFailover(chatId, startPrice, timeoutSeconds = 5, autoFailover = true, allowAsia = false) {
        let prov = this._getProvider(chatId);

        let [currentBalVal, currentBalText] = await getCurrentBalance(prov["base_url"], prov["api_key"]);
        this.lastBalances[prov["name"]] = currentBalVal;
        
        if (currentBalVal < parseFloat(startPrice)) {
            await this.bot.sendMessage(
                chatId,
                `⚠️ **عذراً، لا يمكن شراء الرقم لأن رصيدك غير كافٍ!**\n\n` +
                `💵 **سعر الرقم المطلوب:** \`${startPrice}$\`\n` +
                `💰 **رصيدك الحالي بالموقع:** \`${currentBalText}\`\n\n` +
                `يرجى شحن رصيدك عبر زر الإيداع ثم المحاولة مجدداً.`,
                { parse_mode: "Markdown" }
            );
            return;
        }

        if (this.activeSearchMsgs[chatId]) {
            try {
                await this.bot.deleteMessage(chatId, this.activeSearchMsgs[chatId]);
            } catch (e) {}
        }

        let searchId = Date.now();
        this.activeSearchIds[chatId] = searchId;
        
        if (this.userActiveOrders[chatId]) {
            let oldOrder = this.userActiveOrders[chatId];
            let oldAct = oldOrder["id"];
            let oldMsgId = oldOrder["msg_id"];
            let oldProv = oldOrder["prov"] || prov;
            
            if (oldMsgId) {
                try {
                    await this.bot.deleteMessage(chatId, oldMsgId);
                } catch (e) {}
            }
            cancelOrder(oldProv["base_url"], oldProv["api_key"], oldAct).catch(() => {});
            delete this.userActiveOrders[chatId];
        }
            
        cancelAllActiveOrders(prov["base_url"], prov["api_key"]);

        let cancelSearchMarkup = {
            reply_markup: { inline_keyboard: [[{ text: "❌ إلغاء البحث", callback_data: "stop_search" }]] }
        };

        let targetNetworksDesc = allowAsia ? "زين (96478) أو آسيا (96477)" : "زين (96478)";
        let statusMsg;

        if (autoFailover) {
            statusMsg = await this.bot.sendMessage(
                chatId, 
                `🇮🇶 ⚡ [${prov.name}] جاري التصفية والشراء السريع لأرقام زين بسعر \`${startPrice}$\`...`,
                cancelSearchMarkup
            );
            let pricesDict = await fetchRealApiPrices(prov["base_url"], prov["api_key"], COUNTRY_IRAQ);
            var sortedPrices = Object.keys(pricesDict).map(Number).sort((a, b) => a - b);
            var availablePrices = sortedPrices.filter(p => p >= parseFloat(startPrice));
            if (availablePrices.length === 0) availablePrices = [parseFloat(startPrice)];
        } else {
            statusMsg = await this.bot.sendMessage(
                chatId, 
                `🇮🇶 🔍 [${prov.name}] جاري الصيد المستمر لأرقام ${targetNetworksDesc} بسعر \`${startPrice}$\`...`,
                cancelSearchMarkup
            );
            var availablePrices = [parseFloat(startPrice)];
        }

        this.activeSearchMsgs[chatId] = statusMsg.message_id;

        let success = false;
        let phoneNumber = "";
        let activationId = "";
        let finalPrice = startPrice;

        for (let currentPrice of availablePrices) {
            if (this.activeSearchIds[chatId] !== searchId) return;

            finalPrice = currentPrice;
            
            if (autoFailover) {
                try {
                    await this.bot.editMessageText(
                        `🇮🇶 ⚡ [${prov.name}] جاري الفحص عند السعر \`${currentPrice}$\` (العراق 🇮🇶)...`,
                        { chat_id: chatId, message_id: statusMsg.message_id, reply_markup: cancelSearchMarkup.reply_markup, parse_mode: "Markdown" }
                    );
                } catch (e) {}
            }
            
            let startTime = Date.now();
            let currentTimeout = autoFailover ? (timeoutSeconds * 1000) : 300000;
            
            while (Date.now() - startTime < currentTimeout) {
                if (this.activeSearchIds[chatId] !== searchId) return;

                let params = {
                    "api_key": prov["api_key"],
                    "action": "getNumber",
                    "service": SERVICE_NETFLIX,
                    "country": COUNTRY_IRAQ,
                    "minPrice": currentPrice,
                    "maxPrice": currentPrice
                };
                
                if (!allowAsia) {
                    params["operator"] = "zain";
                }
                    
                try {
                    let response = await axios.get(prov["base_url"], { params, timeout: 2500 });
                    let resText = String(response.data).trim();

                    if (resText.startsWith("ACCESS_NUMBER:")) {
                        let parts = resText.split(":");
                        let actId = parts[1];
                        let pNum = parts[2];

                        let isValid = false;
                        if (allowAsia) {
                            if (pNum.startsWith("96478") || pNum.startsWith("96477")) isValid = true;
                        } else {
                            if (pNum.startsWith("96478")) isValid = true;
                        }

                        if (isValid) {
                            activationId = actId;
                            phoneNumber = pNum;
                            success = true;
                            break;
                        } else {
                            cancelOrder(prov["base_url"], prov["api_key"], actId).catch(() => {});
                            if (autoFailover) break;
                        }
                    } else {
                        await new Promise(r => setTimeout(r, 100));
                    }
                } catch (e) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }
            
            if (success) break;
        }

        if (this.activeSearchIds[chatId] !== searchId) {
            if (success && activationId) {
                cancelOrder(prov["base_url"], prov["api_key"], activationId).catch(() => {});
            }
            return;
        }

        delete this.activeSearchMsgs[chatId];

        if (success) {
            let cancelMarkup = {
                reply_markup: { inline_keyboard: [[{ text: "❌ إلغاء الرقم واسترداد الرصيد", callback_data: `cancel_num_${activationId}` }]] }
            };

            let msg = `🇮🇶 **تم شراء الرقم بنجاح (العراق 🇮🇶) من [${prov.name}]**\n\n` +
                      `💵 **السعر:** \`${finalPrice}$\`\n` +
                      `📞 **الرقم:**\n\`${phoneNumber}\`\n\n` +
                      `⏳ جاري انتظار وصول كود نتفلكس...`;
            try {
                await this.bot.deleteMessage(chatId, statusMsg.message_id);
            } catch (e) {}
            
            let sentNumMsg = await this.bot.sendMessage(chatId, msg, { ...cancelMarkup, parse_mode: "Markdown" });
            this.userActiveOrders[chatId] = { "id": activationId, "prov": prov, "msg_id": sentNumMsg.message_id };

            this._checkForSms(chatId, activationId, prov);
        } else {
            try {
                await this.bot.deleteMessage(chatId, statusMsg.message_id);
            } catch (e) {}
            await this.bot.sendMessage(chatId, `🇮🇶 ❌ **تعذر العثور على أرقام متاحة بسعر \`${startPrice}$\` في [${prov.name}].** يرجى المحاولة لاحقاً.`);
        }
    }

    async _checkForSms(chatId, activationId, prov) {
        let startTime = Date.now();
        while (Date.now() - startTime < 600000) {
            await new Promise(r => setTimeout(r, 2000));
            if (!this.userActiveOrders[chatId] || this.userActiveOrders[chatId]["id"] !== activationId) break;
                
            try {
                let response = await axios.get(prov["base_url"], {
                    params: { 'api_key': prov["api_key"], 'action': 'getStatus', 'id': activationId },
                    timeout: 4000
                });
                let res = String(response.data).trim();

                if (res.startsWith("STATUS_OK:")) {
                    let code = res.split(":")[1].replace(/['"]/g, "").trim();
                    if (this.userActiveOrders[chatId]) delete this.userActiveOrders[chatId];
                    await this.bot.sendMessage(chatId, `\`${code}\``, { parse_mode: "Markdown" });
                    break;
                } else if (res === "STATUS_CANCEL") {
                    if (this.userActiveOrders[chatId]) delete this.userActiveOrders[chatId];
                    await this.bot.sendMessage(chatId, "❌ تم إلغاء العملية من قبل الموقع.");
                    break;
                } else if (!res.startsWith("STATUS_") && res !== "STATUS_WAIT_CODE") {
                    await this.bot.sendMessage(chatId, `⚠️ تنبيه فني من الموقع:\n\`${res}\``, { parse_mode: "Markdown" });
                    break;
                }
            } catch (e) {}
        }
    }

    _setupHandlers() {
        this.bot.onText(/\/start|\/menu/, async (msg) => {
            let chatId = msg.chat.id;
            if (msg.from.id !== this.allowedUserId) {
                await this.bot.sendMessage(chatId, "عذراً، هذا البوت مخصص لشخص محدد فقط ❌");
                return;
            }

            delete this.userStates[chatId];
            let welcomeText = `مرحباً يا بطل (${this.userName})! 🚀\n\n` +
                              "1️⃣ أرسل الإيميل لبدء التسجيل.\n" +
                              "2️⃣ أرسل الرابط السحري (`netflix.com/epr...`)\n" +
                              "3️⃣ أرسل رقم هاتفك.\n" +
                              "4️⃣ أرسل كود التأكيد.\n\n" +
                              "📌 **شراء وصيد الأرقام المباشر:**";

            let kb = await this._mainKeyboard(chatId);
            await this.bot.sendMessage(chatId, welcomeText, { ...kb, parse_mode: "Markdown" });
        });

        this.bot.on('message', async (msg) => {
            if (!msg.text || msg.from.id !== this.allowedUserId) return;
            let chatId = msg.chat.id;
            let text = msg.text.trim();

            if (text.startsWith('/')) return;

            if (this.userStates[chatId] === "waiting_for_otp") {
                await this._processOtp(msg);
                return;
            }

            if (text.includes("netflix.com/epr")) {
                await this.bot.reply_to(msg, "✅ تم التقاط الرابط بنجاح!\n\n📱 أرسل رقم هاتفك العراقي (بدون صفر، مثال: 7701234567):");
                this.userStates[chatId] = { step: "waiting_for_phone", magic_link: text };
                return;
            }

            let currentState = this.userStates[chatId];
            if (currentState && typeof currentState === 'object' && currentState.step === "waiting_for_phone") {
                let magicLink = currentState.magic_link;
                delete this.userStates[chatId];
                this._execute_golden_path(msg, magicLink);
                return;
            }

            if (text.includes("@") && !text.includes("netflix.com")) {
                this._handleEmailSubmission(msg);
                return;
            }

            if (currentState === "waiting_for_amount") {
                let prov = this._getProvider(chatId);
                let minDep = prov.min_deposit || 1.5;
                
                let amount = parseFloat(text);
                if (isNaN(amount) || amount < minDep) {
                    await this.bot.sendMessage(chatId, `⚠️ عذراً، الحد الأدنى للإيداع في **${prov.name}** هو **${minDep}$** أو أكثر. يرجى إدخال مبلغ صالح:`, { parse_mode: "Markdown" });
                    return;
                }
                
                delete this.userStates[chatId];
                await this.bot.sendMessage(chatId, `⏳ جاري جلب محفظة الإيداع بقيمة **${amount}$** عبر شبكة USDT BSC...`);
                
                let walletAddress = await getWalletAddress(prov, amount);
                let [, currentBal] = await getCurrentBalance(prov["base_url"], prov["api_key"]);

                let markup = { reply_markup: { inline_keyboard: [[{ text: "🔙 القائمة الرئيسية", callback_data: "main_menu" }]] } };

                await this.bot.sendMessage(
                    chatId,
                    `💳 **عنوان المحفظة للإيداع المباشر [${prov.name}]:**\n\n` +
                    `💰 **رصيدك الحالي بالموقع:** \`${currentBal}\`\n` +
                    `🌐 **الشبكة:** \`USDT (BSC - BEP20)\`\n` +
                    `💵 **المبلغ المطلوب:** \`${amount}$\`\n\n` +
                    `\`${walletAddress}\`\n\n` +
                    `⚠️ *قم بالتحويل وسيتم تحديث رصيدك تلقائياً عند تأكيد الشبكة.*`,
                    { ...markup, parse_mode: "Markdown" }
                );
            }
        });

        this.bot.on('callback_query', async (call) => {
            let chatId = call.message.chat.id;
            if (call.from.id !== this.allowedUserId) {
                try { await this.bot.answerCallbackQuery(call.id, { text: "هذا البوت ليس مخصصاً لك!", show_alert: true }); } catch (e) {}
                return;
            }

            let prov = this._getProvider(chatId);

            if (call.data.startsWith("select_prov_")) {
                let provKey = call.data.split("select_prov_")[1];
                this.selectedProvider[chatId] = provKey;
                let newProv = this._getProvider(chatId);
                try { await this.bot.answerCallbackQuery(call.id, { text: `تم التبديل إلى: ${newProv.name}` }); } catch (e) {}
                
                let kb = await this._mainKeyboard(chatId);
                try {
                    await this.bot.editMessageText(
                        `مرحباً بك يا **${this.userName}** في بوت أرقام نتفلكس 🎬\n\n` +
                        `• تم تغيير المزود الحالي إلى: **${newProv.name}**`,
                        { chat_id: chatId, message_id: call.message.message_id, ...kb.reply_markup, parse_mode: "Markdown" }
                    );
                } catch (e) {}
            } else if (call.data === "stop_search") {
                this.activeSearchIds[chatId] = null;
                delete this.activeSearchMsgs[chatId];
                try {
                    await this.bot.answerCallbackQuery(call.id, { text: "تم إلغاء عملية البحث." });
                    await this.bot.deleteMessage(chatId, call.message.message_id);
                } catch (e) {}
                await this.bot.sendMessage(chatId, "⏹️ **تم إلغاء البحث بنجاح.**", { parse_mode: "Markdown" });
            } else if (call.data === "deposit_bsc") {
                this.userStates[call.from.id] = "waiting_for_amount";
                let minDep = prov.min_deposit || 1.5;
                let markup = { reply_markup: { inline_keyboard: [[{ text: "🔙 إلغاء والعودة للقائمة", callback_data: "main_menu" }]] } };
                
                try {
                    await this.bot.editMessageText(
                        `💳 **إيداع الأموال (USDT - BSC) [${prov.name}]:**\n\n` +
                        `الحد الأدنى للإيداع هو **${minDep}$** أو أكثر.\n` +
                        `أرسل الآن في رسالة نصية المبلغ المراد إيداعه (مثال: \`${Math.floor(minDep)}\` أو \`5\`):`,
                        { chat_id: chatId, message_id: call.message.message_id, ...markup.reply_markup, parse_mode: "Markdown" }
                    );
                } catch (e) {}
            } else if (call.data === "main_menu") {
                delete this.userStates[call.from.id];
                let kb = await this._mainKeyboard(chatId);
                try {
                    await this.bot.editMessageText(
                        `مرحباً بك يا **${this.userName}** في بوت أرقام نتفلكس 🎬\n\n` +
                        "• اختر الخدمة المطلوبة من القائمة أدناه:",
                        { chat_id: chatId, message_id: call.message.message_id, ...kb.reply_markup, parse_mode: "Markdown" }
                    );
                } catch (e) {}
            } else if (call.data === "buy_fast_079") {
                try { await this.bot.answerCallbackQuery(call.id, { text: `🇮🇶 جاري الشراء السريع من [${prov.name}]...` }); } catch (e) {}
                this._buyNumberAutoFailover(chatId, 0.079, 5, true, false);
            } else if (call.data === "buy_continuous_079") {
                try { await this.bot.answerCallbackQuery(call.id, { text: `🇮🇶 جاري صيد زين (0.079$) من [${prov.name}]...` }); } catch (e) {}
                this._buyNumberAutoFailover(chatId, 0.079, 5, false, false);
            } else if (call.data === "buy_continuous_both_079") {
                try { await this.bot.answerCallbackQuery(call.id, { text: `🇮🇶 جاري صيد (زين أو آسيا 0.079$) من [${prov.name}]...` }); } catch (e) {}
                this._buyNumberAutoFailover(chatId, 0.079, 5, false, true);
            } else if (call.data === "show_prices") {
                try { await this.bot.answerCallbackQuery(call.id, { text: `⏳ جاري جلب أسعار العراق من [${prov.name}]...` }); } catch (e) {}
                let realPrices = await fetchRealApiPrices(prov["base_url"], prov["api_key"], COUNTRY_IRAQ);
                
                if (!realPrices || Object.keys(realPrices).length === 0) {
                    await this.bot.sendMessage(chatId, `🇮🇶 ❌ تعذر جلب أسعار العراق من [${prov.name}] حالياً.`);
                    return;
                }

                let inlineKeyboard = [];
                let sortedPrices = Object.keys(realPrices).map(Number).sort((a, b) => a - b);
                
                for (let priceVal of sortedPrices) {
                    let priceStr = String(priceVal);
                    let count = realPrices[priceStr] || 0;
                    let buttonText = `🇮🇶 💵 السعر: ${priceStr}$  |  📦 المتاح: ${count} قطعة`;
                    inlineKeyboard.push([{ text: buttonText, callback_data: `buy_at_${priceStr}` }]);
                }
                inlineKeyboard.push([{ text: "🔙 القائمة الرئيسية", callback_data: "main_menu" }]);

                try {
                    await this.bot.editMessageText(
                        `🇮🇶 **أسعار العراق المتاحة في [${prov.name}]:**\n\nاختر السعر المطلوب للشراء المباشر:`,
                        { chat_id: chatId, message_id: call.message.message_id, reply_markup: { inline_keyboard: inlineKeyboard }, parse_mode: "Markdown" }
                    );
                } catch (e) {}
            } else if (call.data.startsWith("buy_at_")) {
                let selectedPrice = parseFloat(call.data.split("buy_at_")[1]);
                this._buyNumberAutoFailover(chatId, selectedPrice, 5, false, false);
            } else if (call.data.startsWith("cancel_num_")) {
                let activationId = call.data.split("cancel_num_")[1];
                try { await this.bot.answerCallbackQuery(call.id, { text: "جاري إلغاء الرقم واسترداد الرصيد..." }); } catch (e) {}
                
                if (this.userActiveOrders[chatId] && this.userActiveOrders[chatId]["id"] === activationId) {
                    delete this.userActiveOrders[chatId];
                }

                try {
                    await this.bot.deleteMessage(chatId, call.message.message_id);
                } catch (e) {}

                await cancelOrder(prov["base_url"], prov["api_key"], activationId);
                await new Promise(r => setTimeout(r, 300));
                let [, textVal] = await getCurrentBalance(prov["base_url"], prov["api_key"]);

                await this.bot.sendMessage(
                    chatId, 
                    `❌ **تم إلغاء الرقم واسترداد المبلغ إلى رصيدك بنجاح!**\n💰 رصيدك الحالي أصبح: **${textVal}**`, 
                    { parse_mode: "Markdown" }
                );
            } else if (call.data === "get_balance") {
                let [, balanceText] = await getCurrentBalance(prov["base_url"], prov["api_key"]);
                try {
                    await this.bot.answerCallbackQuery(call.id, { text: `رصيدك الحالي في [${prov.name}] هو: ${balanceText}`, show_alert: true });
                } catch (e) {}
            }
        });
    }
}

// ==========================================
// تشغيل كافة البوتات بالتوازي
// ==========================================
console.log("🚀 جاري تشغيل بوتات نتفلكس والأرقام المدمجة (Node.js) بالتوازي...");
for (let config of BOTS_CONFIG) {
    if (config.bot_token) {
        let handler = new SingleBotHandler(config);
        handler.start();
    } else {
        console.warn(`⚠️ تم تخطي تشغيل بوت (${config.name}) لعدم توفر التوكن الخاص به.`);
    }
}
console.log("✅ تمت التهيئة والتشغيل بنجاح عبر Railway.");
