import Parser from 'rss-parser';

export const parseFeed = async () => {
    const parser = new Parser();
    const feed = await parser.parseURL('https://kentcdodds.com/blog/rss.xml');
    return feed;
}