/*
  # إضافة نظام التصويت وصلاحيات المشرفين

  1. جداول جديدة
    - `status_votes`: لتخزين تصويتات المستخدمين على حالات المواقع
    - `admin_actions`: لتتبع إجراءات المشرفين
  
  2. الأمان
    - تفعيل RLS على الجداول الجديدة
    - إضافة سياسات للتصويت والإدارة
*/

-- جدول تصويتات الحالة
CREATE TABLE IF NOT EXISTS status_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id),
  user_id bigint NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- جدول إجراءات المشرفين
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id bigint NOT NULL,
  action_type text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE status_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- سياسات التصويت
CREATE POLICY "Allow users to vote"
  ON status_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to view votes"
  ON status_votes
  FOR SELECT
  TO authenticated
  USING (true);

-- سياسات إجراءات المشرفين
CREATE POLICY "Allow admins to view actions"
  ON admin_actions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to add actions"
  ON admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);