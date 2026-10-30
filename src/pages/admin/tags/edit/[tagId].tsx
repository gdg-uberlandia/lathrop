import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { TagForm } from "@/components/admin/tags/tag-form";
import { Tag } from "@/contracts/tag";
import { useTags } from "@/hooks/useTags";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function EditTagPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(router.query.returnTo, "/admin/tags");
  const { fetchTag, updateTag, loading } = useTags();
  const [tag, setTag] = useState<Tag | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (typeof router.query.tagId !== "string") return;
    setResolved(false);
    void fetchTag(router.query.tagId)
      .then(setTag)
      .finally(() => setResolved(true));
  }, [fetchTag, router.query.tagId]);
  return (
    <AdminFormPage
      title="Editar tag"
      description="Atualize a descoberta."
      backHref={returnTo}
      backLabel="Voltar para tags"
    >
      {!resolved ? (
        <AdminLoadingState />
      ) : !tag ? (
        <AdminEmptyState
          title="Tag não encontrada"
          description="O registro pode ter sido removido."
        />
      ) : (
        <TagForm
          key={tag.id}
          tag={tag}
          loading={loading}
          onSubmit={async (value) => {
            if (await updateTag(value)) await router.push(returnTo);
          }}
        />
      )}
    </AdminFormPage>
  );
}
