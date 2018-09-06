import * as firebase from 'firebase';
import { token, user } from '../config/token';
import firebaseConfig from '../config/firebase';
import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule';
import axios from 'axios';
import cheerio from 'cheerio';
import dateFormat from 'dateformat';

firebase.initializeApp(firebaseConfig);
const minestronebot = firebase.firestore();
const users = minestronebot.collection('minestronebot').doc('users');
let userList = [];

const bot = new TelegramBot(token.telegram, { polling: true });

/**
 * inicia os listeners do bot Telegram para incluir ou remover um membro.
 */
const startBotsListeners = () => {
  /**
   * responsavel por incluir membro
   */
  bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    saveNewUser(chatId);

    bot.sendMessage(
      chatId,
      `Oi, amizo! \nQue bom que você curte o Minestrone. \u{1F35C} \n\nIremos te avisar se a cada dia o restaurante vai servir esta deliciosa refeição. Fique ligado em mim! \n\nAh!! E caso queira deixar de receber estes reports é só digitar, a qualquer momento, o comando /leave e voilà, vou parar de encher o teu saco. \n\nBom, por enquanto é isso. Até mais!!`
    );
    console.log('==> Amizo novo:', chatId);
  });

  /**
   * responsavel por remover membro
   */
  bot.onText(/\/leave/, (msg, match) => {
    const chatId = msg.chat.id;

    deleteUser(chatId);

    bot.sendMessage(
      chatId,
      `Poxa amizo!!! \nUma pena que está nos deixando. \u{2639} \n\nBom mas não tem problema. Quando quiser é só assinar novamente com o comando /start ok? \n\nAbração e até mais!!`
    );

    console.log('==> Amizo foi embora:', chatId);
  });

  /**
   * apenas loga as mensagens recebidas pelo bot
   */
  bot.on('message', msg => {
    // const chatId = msg.chat.id;
    // console.log('==> Mensagem recebida: \n', msg);
  });
};

/**
 * informa se a aplicação está ativa, a cada 30 min.
 */
const showAlive = () => {
  // console.log('\n\n::: APP started. :::\n==> Hey Im alive!!', dateFormat(new Date(), 'd/mm/yyyy, h:MM:ss TT'));

  setInterval(() => {
    console.log('==> Hey Im alive!!', dateFormat(new Date(), 'd/mm/yyyy, h:MM:ss TT'));
  }, 1800000);
};

/**
 * envia mensagem para os membros.
 * @param {cheerio} $
 */
const sendMessage = $ => {
  const minestroneMessage = $('.main .blog-posts .date-outer .MsoNormal:contains("COZIDO ESPECIAL")')
    .first()
    .text()
    ? 'Hoje tem Minestrone hein! \u{1F389}\u{1F60D}\u{1F35C}'
    : 'Hoje não tem Minestrone. \u{1F61E}\u{1F62D}';

  for (let i = 0; i < userList.length; i++) {
    bot.sendMessage(userList[i], minestroneMessage);
  }
};

/**
 * envia mensagem para o membro admin informando que algo não está correto com a aplicação.
 */
const sendMessageErr = () => {
  console.error('==> Falha ao acessar site.');
  bot.sendMessage(
    user.reginaldoMorais,
    'Oi, não consegui acessar o site do Broto. \u{1F613} \nPode dar uma olhada pra mim, por favor? \n\nVlw!! \u{1F44D}'
  );
};

/**
 * crawler que recupera as informações e dispara as mensagens aos membros.
 */
const getBroto = () => {
  const pageToVisit = 'http://restaurantebdf.blogspot.com.br';
  // const pageToVisit2 = 'http://restaurantebdf.blogspot.com.br/2017/08/broto-de-feijao-03082017-quinta-feira-1.html';

  console.log('\n================ Run now!');
  console.log('Visiting page', pageToVisit);

  axios
    .get(pageToVisit)
    .then(response => {
      console.log('Status code:', response.status);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        console.log('==> Page title:', $('title').text());
        console.log(
          '==> Date:',
          $('.main .blog-posts .date-header')
            .first()
            .text()
        );
        console.log(
          '==> Title:',
          $('.main .blog-posts .date-outer .MsoNormal:contains("COZIDO ESPECIAL")')
            .first()
            .text() || 'Hoje não tem Minestrone.'
        );

        const todayDay = dateFormat(new Date(), 'd');
        const hasPostToday =
          $(`.main .blog-posts .date-header`)
            .first()
            .text()
            .indexOf(todayDay) > 0
            ? true
            : false;

        if (hasPostToday) {
          sendMessage($);
        } else {
          console.log('==> Ainda não foi atualizado. Vou tentar de novo mais tarde.');
          setTimeout(() => getBroto(), 900000);
        }
      } else {
        sendMessageErr();
      }

      console.log('================ Finished!\n\n');
    })
    .catch(error => {
      sendMessageErr();
      console.error('==> error \n', error);
      console.log('================ Finished!\n\n');
    });
};

const deleteUser = chatId => {
  userList = userList.filter(user => {
    return user != chatId;
  });

  users.set({ id: userList });
};

const saveNewUser = chatId => {
  if (!userList.includes(chatId)) {
    userList.push(chatId);
    users.set({ id: userList });
  }
};

const startBot = () => {
  users.get().then(doc => {
    userList = doc.data().id;
    startBotsListeners();

    // setInterval(() => console.error('userList ', userList), 1000);
  });
};

/**
 * inicia a aplicação.
 */
const startApp = () => {
  showAlive();
  const job = schedule.scheduleJob('10 11 * * 0-5', () => getBroto());
  console.log('==> Job scheduled.');

  startBot();

  // para testar execucao
  if (process.env.BROTO) setInterval(() => getBroto(), 5000);
  if (process.env.DEBUGGER) console.log('==>', job);
};

startApp();
