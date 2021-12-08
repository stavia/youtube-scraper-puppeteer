const puppeteer = require('puppeteer');
const yargs = require('yargs');
const scraper = require('./scraper');

const argv = yargs
    .command('search query', 'Search youtube links')
    .command('channel query', 'Scrapes a youtube channel to get all video links. For example: https://www.youtube.com/c/nprmusic/videos')
    .help()
    .alias('help', 'h')
    .argv;

if (argv._.includes('search')) {
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: true });
            let results = await scraper.search(browser, argv.query);
            console.log(JSON.stringify(results));
            await browser.close();
        })()
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

if (argv._.includes('channel')) {
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: true });
            let results = await scraper.channel(browser, argv.query);
            console.log(JSON.stringify(results));
            await browser.close();
        })()
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

