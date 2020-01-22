
// calculates the score
function getScore (obj) {

    if (Object.entries(obj).length === 0 
        && obj.constructor === Object) {

        return 0;
    }
    else {

        const features = getFeatures(obj);
        console.log(features);

        return logithToProb(features);
    }
}

function logithToProb (features) {
    y = (
        features.num_session_agg * FEATURE_WEIGHTS.num_session_agg +
        features.company_name_exists * FEATURE_WEIGHTS.company_name_exists +
        features.phone_exists * FEATURE_WEIGHTS.phone_exists +
        features.firstname_valid * FEATURE_WEIGHTS.firstname_valid  +
        features.lastname_valid * FEATURE_WEIGHTS.lastname_valid +
        features.email_valid * FEATURE_WEIGHTS.email_valid +
        features.email_has_test * FEATURE_WEIGHTS.email_has_test +
        features.email_free_provider * FEATURE_WEIGHTS.email_free_provider +
        features.industry_exists * FEATURE_WEIGHTS.industry_exists +
        features.website_exists * FEATURE_WEIGHTS.website_exists +
        features.title_exists * FEATURE_WEIGHTS.title_exists +
        features.persona_architect * FEATURE_WEIGHTS.persona_architect +
        features.persona_buyer * FEATURE_WEIGHTS.persona_buyer +
        features.persona_other * FEATURE_WEIGHTS.persona_other +
        features.persona_developer * FEATURE_WEIGHTS.persona_developer
    ) - 13.179962;

    p = Math.exp(y) / (1 + Math.exp(y));

    return p ? p : 0;
}

function getFeatures (data) {
    return {
        num_session_agg: getSessionAgg(data.num_session),
        company_name_exists: getIsValuePresent(data.company_name),
        phone_exists: getIsValuePresent(data.phone),
        firstname_valid: getIsNameValid(data.firstname),
        lastname_valid: getIsNameValid(data.lastname),
        email_valid: getIsEmailValid(data.email),
        email_has_test: getIsEmailTest(data.email),
        email_free_provider: getIsEmailFreeDomain(data.email),
        industry_exists: getIsValuePresent(data.industry),
        website_exists: getIsValuePresent(data.website),
        title_exists: getIsValuePresent(data.title),
        persona_architect: getIsPersonaArchitect(data.title),
        persona_buyer: getIsPersonaBuyer(data.title),
        persona_other: getIsPersonaOther(data.title),
        persona_developer: getIsPersonaDeveloper(data.title)
    }
}

function getSessionAgg (numSessionsStr) {

    let numSessions = Number(numSessionsStr);

    if (!numSessionsStr) {
        return 0;
    }
    else if (numSessions > 20) {
        return 7;
    }
    else if (numSessions > 10) {
        return 6;
    }
    else if (numSessions >= 5) {
        return 5;
    }
    else {
        return numSessions;
    }
}

function getIsNameValid (name) {

    let nameLower = name ? 
        name.toLowerCase() : null;

    if (!name
        || nameLower.includes('name')
        || nameLower.includes('test')
        || nameLower.includes('guest')
        || nameLower.includes('n/a')
        || nameLower.includes('http')
        || nameLower.includes('www')
        || nameLower.includes('unknown')
        || nameLower.match(/[0-9]+/)) {
        
        return 0;
    }
    return 1;
}

function getIsEmailValid (email) {
    const regex  = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return email 
        && regex.test(email) ? 1 : 0;
}

function getIsEmailTest (email) {
    return email 
        && ['test', 'guest'].includes(email.toLowerCase()) ? 1 : 0;
}

function getIsEmailFreeDomain (email) {
    const domainMatch = email && email.toLowerCase().match(/(?<=\@).*/);
    return domainMatch 
        && FREE_DOMAINS.includes(domainMatch[0]) ? 1 : 0;
}

function getIsValuePresent (val) {
    return val ? 1 : 0;
}

function getIsPersonaArchitect (title) {
    const architectRoles = ['architect'];
    return title 
        && architectRoles.some( 
            role => title.toLowerCase().includes(role) ) ? 1 : 0;
}

function getIsPersonaBuyer (title) {
    const buyerRoles = ['chief','vice','director','vp','head'];
    const importantTitles = ['cio', 'founder', 'cto', 'ceo', 'coo'];
    return title 
        && (importantTitles.includes(title.toLowerCase())
            || buyerRoles.some( 
                role => title.toLowerCase().includes(role))) ? 1 : 0;
}

function getIsPersonaDeveloper (title) {
    const developerRoles = ['developer','engineer','analyst','scientist','dev'];
    return title 
        && developerRoles.some( 
            role => title.toLowerCase().includes(role)) ? 1 : 0;
}

function getIsPersonaOther (title) {
    return !getIsPersonaArchitect(title)
        && !getIsPersonaBuyer(title)
        && !getIsPersonaDeveloper(title) ? 1 : 0;
}

const FREE_DOMAINS = [
    "aol.com", "att.net", "comcast.net", "facebook.com",
    "gmail.com", "gmx.com", "googlemail.com", "google.com",
    "hotmail.com", "hotmail.co.uk", "mac.com", "me.com",
    "mail.com", "msn.com", "live.com", "sbcglobal.net",
    "verizon.net", "yahoo.com", "yahoo.co.uk", "email.com",
    "fastmail.fm", "games.com", "gmx.net", "hush.com",
    "hushmail.com", "icloud.com", "iname.com", "inbox.com",
    "lavabit.com", "love.com", "outlook.com", "pobox.com",
    "protonmail.ch", "protonmail.com", "tutanota.de", "tutanota.com",
    "tutamail.com", "tuta.io", "keemail.me", "rocketmail.com", 
    "safe-mail.net", "wow.com",  "ygm.com" ,"ymail.com", 
    "zoho.com", "yandex.com", "bellsouth.net", "charter.net",
    "cox.net", "earthlink.net", "juno.com", "btinternet.com",
    "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
    "ntlworld.com", "o2.co.uk", "orange.net", "sky.com",
    "talktalk.co.uk", "tiscali.co.uk", "virgin.net", "wanadoo.co.uk",
    "bt.com", "sina.com", "sina.cn", "qq.com",
    "naver.com", "hanmail.net", "daum.net", "nate.com",
    "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in",
    "yahoo.com.sg", "yahoo.com.ph", "163.com", "yeah.net",
    "126.com", "21cn.com", "aliyun.com", "foxmail.com",
    "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr",
    "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr",
    "neuf.fr", "free.fr", "gmx.de", "hotmail.de",
    "live.de", "online.de", "t-online.de", "web.de",
    "yahoo.de", "libero.it", "virgilio.it", "hotmail.it",
    "aol.it", "tiscali.it", "alice.it", "live.it",
    "yahoo.it", "email.it", "tin.it", "poste.it",
    "teletu.it", "mail.ru", "rambler.ru", "yandex.ru",
    "ya.ru", "list.ru", "hotmail.be", "live.be",
    "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",
    "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar",
    "speedy.com.ar", "arnet.com.ar", "yahoo.com.mx", "live.com.mx",
    "hotmail.es", "hotmail.com.mx", "prodigy.net.mx", "yahoo.ca",
    "hotmail.ca", "bell.net", "shaw.ca", "sympatico.ca",
    "rogers.com", "yahoo.com.br", "hotmail.com.br", "outlook.com.br",
    "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br",
    "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com",
    "globomail.com", "oi.com.br"
];

const FEATURE_WEIGHTS = {
    num_session_agg: 0.183418,
    company_name_exists: 2.187761,
    phone_exists: 0.549358,
    firstname_valid: 1.970357 ,
    lastname_valid: 1.808261,
    email_valid: 5.233426,
    email_has_test: -2.971521,
    email_free_provider: -1.273903,
    industry_exists: 0.697262,
    website_exists: 1.921059,
    title_exists: 0.649097,
    persona_architect: 0.741542,
    persona_buyer: 0.317856,
    persona_other: -0.459862,
    persona_developer: -0.234342
}

module.exports = { getScore };