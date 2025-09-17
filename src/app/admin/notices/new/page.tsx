import NoticeForm from "@/components/admin/notices/NoticeForm";

export const dynamic = "force-dynamic";

export default function NewNoticePage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>새 공지 등록</h1>
      <NoticeForm mode="create" />
    </div>
  );
}
