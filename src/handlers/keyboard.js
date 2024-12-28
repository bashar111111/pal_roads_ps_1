// إضافة للملف الحالي...

function getAdminKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📝 طلبات إضافة المواقع', callback_data: 'admin:requests' }],
        [{ text: '📊 إحصائيات', callback_data: 'admin:stats' }],
        [{ text: '🗑 إدارة المواقع', callback_data: 'admin:locations' }]
      ]
    }
  };
}

function getLocationManagementKeyboard(requestId) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ موافقة', callback_data: `approve:${requestId}` },
          { text: '❌ رفض', callback_data: `reject:${requestId}` }
        ]
      ]
    }
  };
}

module.exports = {
  // ... الدوال الموجودة مسبقاً
  getAdminKeyboard,
  getLocationManagementKeyboard
};