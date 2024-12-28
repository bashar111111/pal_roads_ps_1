// أنواع المواقع
exports.LOCATION_TYPES = {
  CITY: 'مدينة',
  TOWN: 'بلدة',
  VILLAGE: 'قرية',
  STREET: 'شارع',
  CHECKPOINT: 'حاجز',
  INSPECTION: 'نقطة تفتيش'
};

// حالات الطرق
exports.ROAD_STATUS = {
  OPEN: 'مفتوح',
  CLOSED: 'مغلق',
  INSPECTION: 'يوجد تفتيش',
  SECURITY: 'نشاط أمني'
};

// حالات طلبات إضافة المواقع
exports.LOCATION_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};