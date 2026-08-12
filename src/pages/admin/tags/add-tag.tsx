import { AdminFormPage } from "@/components/admin/admin-page";
import { TagForm } from "@/components/admin/tags/tag-form";
import { useTags } from "@/hooks/useTags";
import { useRouter } from "next/router";
export default function AddTagPage() {
  const router = useRouter();
  const { addTag, loading } = useTags();
  return (
    <AdminFormPage
      title="Cadastrar tag"
      description="Adicione uma descoberta por QR."
      backHref="/admin/tags"
      backLabel="Voltar para tags"
    >
      <TagForm
        loading={loading}
        onSubmit={async (value) => {
          if (await addTag(value)) await router.push("/admin/tags");
        }}
      />
    </AdminFormPage>
  );
}
