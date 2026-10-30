import assert from "node:assert/strict";
import test from "node:test";
import {
  adminNavigationItems,
  getAdminNavigationItems,
} from "../components/admin/admin-navigation";

test("disabled push hides notices while preserving the other admin sections", () => {
  const items = getAdminNavigationItems(false);
  assert.equal(
    items.some((item) => item.url === "/admin/notices"),
    false,
  );
  assert.deepEqual(
    items,
    adminNavigationItems.filter((item) => item.url !== "/admin/notices"),
  );
});
test("enabled push exposes notices in admin navigation", () => {
  assert.deepEqual(getAdminNavigationItems(true), adminNavigationItems);
});
