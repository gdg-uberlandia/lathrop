import { deleteNotice } from "@/back-features/notices";
import { isPushEnabled } from "@/back-features/push-config";
import { createNoticeDeleteHandler } from "@/utils/api/notice-delete-handler";
import { requireAdmin } from "@/utils/api/require-admin";

export const config = { api: { bodyParser: false } };
export default createNoticeDeleteHandler({
  authorize: requireAdmin,
  enabled: isPushEnabled,
  remove: deleteNotice,
});
