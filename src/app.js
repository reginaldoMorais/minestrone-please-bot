import { token } from '../config/token';
import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule';
import request from 'request';
import cheerio from 'cheerio';
import dateFormat from 'dateformat';
import { user } from '../config/token';

const bot = new TelegramBot(token.telegram, { polling: true });

const showAlive = () => {
  console.log('\n\n::: APP started. :::\n==> Hey Im alive!!', dateFormat(new Date(), 'd/mm/yyyy, h:MM:ss TT'));

  setInterval(() => {
    console.log('==> Hey Im alive!!', dateFormat(new Date(), 'd/mm/yyyy, h:MM:ss TT'));
  }, 1800000);
};

const sendMessage = $ => {
  const hasMinestrone = $('.main .blog-posts .date-outer .MsoNormal:contains("MINESTRONE")').first().text()
    ? 'Hoje tem Minestrone hein! \u{1F389}\u{1F60D}\u{1F35C}'
    : 'Hoje não tem Minestrone. \u{1F61E}\u{1F62D}';

  bot.sendMessage(user.reginaldoMorais, hasMinestrone);
};

const sendMessageErr = () => {
  console.log('==> Falha ao acessar site.');
  bot.sendMessage(
    user.reginaldoMorais,
    'Oi, não consegui acessar o site do Broto. \u{1F613} \nPode dar uma olhada pra mim, por favor? \n\nVlw!! \u{1F44D}'
  );
};

const getBroto = () => {
  const pageToVisit = 'http://restaurantebdf.blogspot.com.br';
  // const pageToVisit2 = 'http://restaurantebdf.blogspot.com.br/2017/08/broto-de-feijao-03082017-quinta-feira-1.html';

  console.log('\n================ Run now!');
  console.log('Visiting page', pageToVisit);

  request(pageToVisit, (error, response, body) => {
    if (error) {
      console.log('Error:', error);
    }

    console.log('Status code:', response.statusCode);

    if (response.statusCode === 200) {
      const $ = cheerio.load(body);

      console.log('==> Page title:', $('title').text());
      console.log('==> Date:', $('.main .blog-posts .date-header').first().text());
      console.log(
        '==> Title:',
        $('.main .blog-posts .date-outer .MsoNormal:contains("MINESTRONE")').first().text() ||
          'Hoje não tem Minestrone.'
      );

      const todayDay = dateFormat(new Date(), 'd');
      const hasPostToday = $(`.main .blog-posts .date-header`).first().text().indexOf(todayDay) > 0 ? true : false;

      if (hasPostToday) {
        sendMessage($);
      } else {
        console.log('==> Ainda não foi atualizado. Vou tentar de novo mais tarde.');
        setTimeout(() => getBroto(), 15000);
      }
    } else {
      sendMessageErr();
    }
    console.log('================ Finished!\n\n');
  });
};

const startApp = () => {
  showAlive();
  const job = schedule.scheduleJob('10 11 * * 0-5', () => getBroto());
  console.log('==> Job scheduled.');
  if (process.env.DEBUGGER) console.log('==>', job);
};

startApp();
