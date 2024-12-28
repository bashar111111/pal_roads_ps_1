require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const { handleStart, handleAddLocation, handleUpdateStatus, handleViewStatus, handleCallback } = require('./handlers/interactions');
const { handleAdminPanel, handleLocationRequests, handleLocationApproval } = require('./handlers/adminHandlers');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// الأوامر الرئيسية
bot.onText(/\/start/, (msg) => handleStart(bot, msg));
bot.onText(/\/admin/, (msg) => handleAdminPanel(bot, supabase, msg));

// معالجة الأزرار
bot.on('message', (msg) => {
  if (msg.text === '📍 إضافة موقع جديد') {
    handleAddLocation(bot, supabase, msg);
  } else if (msg.text === '🔄 تحديث حالة موقع') {
    handleUpdateStatus(bot, supabase, msg);
  } else if (msg.text === '📋 عرض حالة موقع') {
    handleViewStatus(bot, supabase, msg);
  }
});

// معالجة الأزرار التفاعلية
bot.on('callback_query', async (query) => {
  const data = query.data;
  
  if (data.startsWith('admin:')) {
    const action = data.split(':')[1];
    if (action === 'requests') {
      await handleLocationRequests(bot, supabase, query.message);
    }
  } else if (data.startsWith('approve:') || data.startsWith('reject:')) {
    const [action, requestId] = data.split(':');
    await handleLocationApproval(
      bot, 
      supabase, 
      requestId, 
      action === 'approve',
      query.from.id
    );
  } else {
    handleCallback(bot, supabase, query);
  }
});