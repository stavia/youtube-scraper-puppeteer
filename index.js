const puppeteer = require('puppeteer');
const yargs = require('yargs');
const scraper = require('./scraper');

const argv = yargs
    .command('search [query]', 'Search youtube links', {
        query: {
            description: 'the search query',
            alias: 'q',
            type: 'string',
        }
    })
    .command('channel', 'Scrapes a youtube channel to get all video links', {
        channel: {
            description: 'the URL of the video channel. For example: https://www.youtube.com/c/nprmusic/videos',
            alias: 'c',
            type: 'string',
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv._.includes('search')) {
    try {
        (async () => {
            if (!argv.query) {
                console.log("A search query is required");
                process.exit(1);
            }

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
            if (!argv.channel) {
                console.log("A channel is required");
                process.exit(1);
            }

            const browser = await puppeteer.launch({ headless: true });
            let results = await scraper.channel(browser, argv.channel);
            console.log(JSON.stringify(results));
            await browser.close();
        })()
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

