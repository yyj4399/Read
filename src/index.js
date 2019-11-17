const https = require('https');
const cheerio = require('cheerio')

var url = "https://www.qidian.com/";

var chunks = [];
var size = 0;
https.get(url, function (res) {

  res.on('data', function (chunk) {
    res.on('data', function (chunk) {
      chunks.push(chunk);
      size += chunk.length;
    });
  });

  res.on('end', function () {
    console.log('数据包传输完毕');
    let data = Buffer.concat(chunks, size);
    console.log(data);
    let html = data.toString();
    console.log(html);
  });
})

// console.log('你好啊！my name is dorsey');

const https = require('https');
const cheerio = require('cheerio');

let url = "https://www.qidian.com/";

https.get(url, function (res) {
    let chunks = [],
        size = 0;
    res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
    });

    res.on('end', function () {
        console.log('数据包传输完毕');
        let data = Buffer.concat(chunks, size);
        let html = data.toString();

        let $ = cheerio.load(html);

        let result = [];

        $('.cf').find('dd').each(i => {
            let map = {};
            //  个人基本信息
            map.name = $('.job-info').eq(i).find('h3').attr('title');

            let baseOthersInfo = $('.job-info').eq(i).find('.condition').attr('title');
            baseOthersInfo = baseOthersInfo.split("_");

            map.reward = baseOthersInfo[0];
            map.area = baseOthersInfo[1];
            map.experience = baseOthersInfo[2];

            //  公司信息
            let companyTagDom = $('.company-info').eq(i).find('.temptation').find('span');
            let companyTag = [];
            companyTagDom.each(i => {
                companyTag.push(companyTagDom.eq(i).text());
            });
            let companyInfo = {
                name: $('.company-info').eq(i).find('.company-name a').attr('title'),
                href: $('.company-info').eq(i).find('.company-name a').attr('href'),
                type: $('.company-info').eq(i).find('.industry-link a').text(),
                tag: companyTag.join(',')
            }
            map.company = companyInfo;
            result.push(map);
            map = {};
        });
        console.log(result);
    });
});
