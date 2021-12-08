module.exports = {
  search: search,
  channel: channel
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function search(browser, query) {
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/results?search_query=' + encodeURI(query));
  let html = await page.content();
  let videoData = await page.$$eval('a#video-title', (titleLinkEls) => {
    return titleLinkEls.map((titleLinkEl) => {
      let label = titleLinkEl.getAttribute('aria-label')
      let regex = /\s(\S*)\sviews/mg;
      let result = regex.exec(label)
      let views = null
      let years = null
      let minutes = null
      let seconds = null
      if (result && result.length > 1) {
        views = result[1].replace(/\,/g, '')
      }
      regex = /\s(\S*)\syear/mg;
      result = regex.exec(label)
      if (result && result.length > 1) {
        years = result[1]
      }
      regex = /\s(\S*)\sminute/mg;
      result = regex.exec(label)
      if (result && result.length > 1) {
        minutes = result[1]
      }
      regex = /\s(\S*)\ssecond/mg;
      result = regex.exec(label)
      if (result && result.length > 1) {
        seconds = result[1]
      }
      return {
        ariaLabel: titleLinkEl.getAttribute('aria-label'),
        title: titleLinkEl.getAttribute('title'),
        link: 'https://youtube.com' + titleLinkEl.getAttribute('href'),
        views: views,
        years: years,
        minutes: minutes,
        seconds: seconds,
      };
    });
  });
  return videoData;
};

async function channel(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  const [button] = await page.$x("//button[contains(., 'I agree')]");
  if (button) {
    try {
      await button.click();
      await page.waitForSelector("#container");
    } catch (error) {
      console.error(error)
    }
  }
  // scroll
  while (true) {
    let videos = await page.$$eval('a#video-title', (titleLinkEls) => {
      return titleLinkEls.length
    });
    const selector = 'a#video-title';
    await page.evaluate((selector) => {
      let elements = document.querySelectorAll(selector);
      let element = elements[elements.length - 1];
      if (element) {
        element.scrollIntoView();
      }
    }, selector);
    await page.waitFor(2000);
    let newVideos = await page.$$eval('a#video-title', (titleLinkEls) => {
      return titleLinkEls.length
    });
    if (videos >= newVideos) {
      break;
    }
  }
  let videoData = await page.$$eval('a#video-title', (titleLinkEls) => {
    return titleLinkEls.map((titleLinkEl) => {
      return {
        ariaLabel: titleLinkEl.getAttribute('aria-label'),
        title: titleLinkEl.getAttribute('title'),
        link: 'https://youtube.com' + titleLinkEl.getAttribute('href')
      };
    });
  });

  return videoData;
};
