const { isAdmin } = require('../utils/adminUtils');
const { getAdminKeyboard, getLocationManagementKeyboard } = require('./keyboard');

async function handleAdminPanel(bot, supabase, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!await isAdmin(bot, chatId, userId)) {
    return bot.sendMessage(chatId, 'عذراً، هذا الأمر متاح للمشرفين فقط');
  }

  await bot.sendMessage(chatId, 
    '👨‍💼 لوحة تحكم المشرف\nاختر الإجراء المطلوب:',
    getAdminKeyboard()
  );
}

async function handleLocationRequests(bot, supabase, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!await isAdmin(bot, chatId, userId)) {
    return;
  }

  const { data: requests } = await supabase
    .from('location_requests')
    .select('*')
    .eq('status', 'pending');

  if (!requests || requests.length === 0) {
    return bot.sendMessage(chatId, 'لا توجد طلبات إضافة مواقع جديدة');
  }

  for (const request of requests) {
    await bot.sendMessage(chatId,
      `طلب إضافة موقع جديد:\n` +
      `الاسم: ${request.name}\n` +
      `من المستخدم: ${request.user_id}`,
      getLocationManagementKeyboard(request.id)
    );
  }
}

async function handleLocationApproval(bot, supabase, requestId, approved, adminId) {
  const { data: request } = await supabase
    .from('location_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (!request) return;

  if (approved) {
    await supabase.from('locations').insert([{
      name: request.name,
      chat_id: request.chat_id,
      type: request.type
    }]);
  }

  await supabase.from('location_requests').update({
    status: approved ? 'approved' : 'rejected',
    processed_by: adminId
  }).eq('id', requestId);

  // تسجيل إجراء المشرف
  await supabase.from('admin_actions').insert([{
    admin_id: adminId,
    action_type: approved ? 'approve_location' : 'reject_location',
    target_id: requestId,
    details: { location_name: request.name }
  }]);

  await bot.sendMessage(request.chat_id,
    approved 
      ? `✅ تمت الموافقة على إضافة الموقع: ${request.name}`
      : `❌ تم رفض طلب إضافة الموقع: ${request.name}`
  );
}

module.exports = {
  handleAdminPanel,
  handleLocationRequests,
  handleLocationApproval
};