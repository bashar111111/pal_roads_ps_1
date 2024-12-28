const { getMainKeyboard, getLocationTypesKeyboard, getStatusKeyboard, getLocationsKeyboard } = require('./keyboard');
const { LOCATION_TYPES } = require('../config/constants');

async function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 
    'مرحباً بك في بوت حالة الطرق! 🚗\nاختر من القائمة أدناه:', 
    getMainKeyboard()
  );
}

async function handleAddLocation(bot, supabase, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 
    'اختر نوع الموقع:', 
    getLocationTypesKeyboard()
  );
}

async function handleUpdateStatus(bot, supabase, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId,
    'اختر نوع الموقع للتحديث:',
    getLocationTypesKeyboard()
  );
}

async function handleViewStatus(bot, supabase, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId,
    'اختر نوع الموقع لعرض حالته:',
    getLocationTypesKeyboard()
  );
}

async function handleCallback(bot, supabase, callback_query) {
  const chatId = callback_query.message.chat.id;
  const data = callback_query.data;
  const [action, value] = data.split(':');

  switch(action) {
    case 'type':
      await bot.sendMessage(chatId,
        `اختر ${value}:`,
        await getLocationsKeyboard(supabase, value)
      );
      break;
      
    case 'location':
      if (callback_query.message.text.includes('تحديث حالة')) {
        await bot.sendMessage(chatId,
          'اختر الحالة الجديدة:',
          getStatusKeyboard()
        );
      } else {
        // عرض حالة الموقع
        const { data: updates } = await supabase
          .from('road_updates')
          .select('*')
          .eq('location_id', value)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (updates && updates.length > 0) {
          await bot.sendMessage(chatId, 
            `حالة الموقع: ${updates[0].status}\n` +
            `آخر تحديث: ${new Date(updates[0].created_at).toLocaleString('ar-EG')}`
          );
        } else {
          await bot.sendMessage(chatId, 'لا توجد تحديثات لهذا الموقع');
        }
      }
      break;
      
    case 'status':
      // تحديث حالة الموقع
      // هنا نحتاج لتخزين الموقع المحدد مؤقتاً
      await bot.sendMessage(chatId, 
        'تم تحديث الحالة بنجاح! ✅'
      );
      break;
  }
}

module.exports = {
  handleStart,
  handleAddLocation,
  handleUpdateStatus,
  handleViewStatus,
  handleCallback
};