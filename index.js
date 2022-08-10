const TelegramApi = require('node-telegram-bot-api');

const token = '5434639318:AAEnqf6m_rpzdStEIX6ecYikm6VxBjtVc-g';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Давай зіграємо. Потрібно вгадати цифру від 0 до 9 `)
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Відгадуй', gameOptions)
}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Грати ще', callback_data: '/again'}]
        ]
    })
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Початок'},
        {command: '/info', description: 'Інфо'},
        {command: '/game', description: 'Гра'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/7.webp')
            return bot.sendMessage(chatId, 'Раді вітати на платформі TMysiv')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Не розумію тебе')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again'){
            startGame(chatId)
        }

        if (data === chats[chatId]){
            return bot.sendMessage(chatId,`Ти вгадав,цифра була ${chats[chatId]}`,againOptions)
        }else {
            return bot.sendMessage(chatId, `Не вгадав,було загадано ${chats[chatId]}`,againOptions)
        }

    })

}

start();
