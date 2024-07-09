const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
require('dotenv').config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Handle /start command from Telegram users
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
    # How to play Clover ⚡️
    
    💰 Tap to earn
    Tap the screen and collect coins.
    
    ⛏ Mine
    Upgrade cards that will give you passive income opportunities.
    
    ⏰ Profit per hour
    The exchange will work for you on its own, even when you are not in the game for 3 hours. Then you need to log in to the game again.
    
    📈 LVL
    The more coins you have on your balance, the higher the level of your exchange is and the faster you can earn more coins.
    
    👥 Friends
    Invite your friends and you’ll get bonuses. Help a friend move to the next leagues and you'll get even more bonuses.
    
    🪙 Token listing
    At the end of the season, a token will be released and distributed among the players. Dates will be announced in our announcement channel. Stay tuned!
    
    
    To get this guide, type /help.`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Play', callback_data: 'play' }]
        ]
      }
    });
});

bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === 'play') {
    const userData = {
      id: callbackQuery.from.id,
      username: callbackQuery.from.username,
      firstName: callbackQuery.from.first_name,
      lastName: callbackQuery.from.last_name,
      // Add more fields as needed
    };

    // Store user data in JSON file or database
    storeUserData(userData);

    // Reply to user
    bot.sendMessage(message.chat.id, 'Welcome! Your data has been stored.');
  }
});

// Function to store user data in JSON file
function storeUserData(userData) {
  const filePath = path.join(__dirname, 'users.json');
  let currentData = [];
  try {
    currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }

  currentData.push(userData);

  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
}

// Example endpoint to trigger bot interaction
app.get('/api/bot/start', (req, res) => {
  // Here you might initiate interaction with the bot, or return data if already stored
  res.json({ message: 'Bot interaction triggered' });
});

// Example endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
