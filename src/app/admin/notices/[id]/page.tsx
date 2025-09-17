import Link from "next/link";
import { headers } from "next/headers";

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

export default async function AdminNoticeDetailPage({ params }: { params: { id: string } }) {
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
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{notice.title}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/admin/notices/${notice.id}/edit`} style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}>편집</Link>
          <Link href="/admin/notices" style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}>목록</Link>
        </div>
      </div>

      <div style={{ color: "#6b7280", fontSize: 14, display: "flex", gap: 12 }}>
        <span>{notice.isImportant ? "중요 공지" : "일반 공지"}</span>
        <span>{notice.isPublished ? "공개" : "비공개"}</span>
        <span>조회수 {notice.viewCount}</span>
        <span>작성자 {notice.author?.name ?? notice.author?.email ?? "-"}</span>
        <span>{new Date(notice.createdAt).toLocaleString()}</span>
      </div>

      <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
        {notice.content}
      </article>
    </div>
  );
}
