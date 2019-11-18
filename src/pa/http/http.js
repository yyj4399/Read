'use strict';

const https = require('https');
const http = require('http');

export default class Http {
  constructor(url) {
    this.get(url);
  }
  static get(url) {
    return new Http();
  }
  get(url) {
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
  }
}