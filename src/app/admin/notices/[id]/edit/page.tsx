import NoticeForm from "@/components/admin/notices/NoticeForm";
import Link from "next/link";
import { headers } from "next/headers";
import NoticeDeleteButton from "@/components/admin/notices/NoticeDeleteButton";

export const dynamic = "force-dynamic";

async function getNotice(id: string) {
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = `${proto}://${host}`;
  const cookie = h.get("cookie") || "";

  const res = await fetch(`${base}/api/notices/${id}`, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditNoticePage({ params }: { params: { id: string } }) {
  const notice = await getNotice(params.id);

  if (!notice) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <p>공지사항을 불러오지 못했습니다.</p>
        <Link href="/admin/notices" style={{ color: "#111827" }}>목록으로</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>공지 수정</h1>
        <NoticeDeleteButton id={notice.id} />
      </div>
      <NoticeForm
        mode="edit"
        initial={{
          ...(notice as any),
          title: notice.title,
          content: notice.content,
          isImportant: notice.isImportant,
          isPublished: notice.isPublished,
        }}
      />
      <div>
        <Link href="/admin/notices" style={{ color: "#111827" }}>목록으로</Link>
      </div>
    </div>
  );
}
