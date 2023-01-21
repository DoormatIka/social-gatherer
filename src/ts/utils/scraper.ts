// twitch title       | class   = h2.gBAboc
// twitch tags        | class[] = div.eUxEWt
// twitch pfp (src)   | class[] = img.tw-image-avatar (very last index)
// twitch genre       | class   = span.hfMGmo
// twitch offline     | class   = p.jiQuvm (not working)
// twitch name        | class   = h1.CoreText-sc-1txzju1-0

// twitch container   | class   = div.bhLqhW

/* no API option for the class

IM GONNA USE A FUCKING SCRAPER INSTEAD OF THE API I SWEAR TO GOD

const blacklist = [
    'googlesyndication.com',
    'adservice.google.com',
]

async function main() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    page.setRequestInterception(true);

    page.on("request", request => {
        const url = request.url();
        const req = request.resourceType();

        if (
            blacklist.some(domain => url.includes(domain)) ||
            req === "font" || req === "image" || req === "media"
        ) {
            request.abort();
        } else {
            request.continue();
        }
    });
    
    const moist = await getData("https://www.twitch.tv/moistcr1tikal", page);
    console.log(moist);
    const osu   = await getData("https://www.twitch.tv/osulive", page);
    console.log(osu);

    await browser.close();
}
*/
/*
async function getData(twitch: string, page: Page) {
    await page.goto(twitch, { waitUntil: "load" });
    await page.waitForSelector("img.tw-image-avatar");

    const twitch_title = await page.$("h2.gBAboc");
    const image_avatar = await page.$$("img.tw-image-avatar");

    return {
        title: await twitch_title?.evaluate(s => s.innerText),
        avatar: await image_avatar.at(-1)?.evaluate(s => s.src),
        isOnline: twitch_title ? true : false
    }
}
*/

// main().then(() => {})