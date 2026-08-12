import { AdminFormPage } from "@/components/admin/admin-page";
import { TagForm } from "@/components/admin/tags/tag-form";
import { useTags } from "@/hooks/useTags";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
export default function AddTagPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(router.query.returnTo, "/admin/tags");
  const { addTag, loading } = useTags();
  return (
    <AdminFormPage
      title="Cadastrar tag"
      description="Adicione uma descoberta por QR."
      backHref={returnTo}
      backLabel="Voltar para tags"
    >
      <TagForm
        loading={loading}
        onSubmit={async (value) => {
          if (await addTag(value)) await router.push(returnTo);
        }}
      />
    </AdminFormPage>
  );
}
