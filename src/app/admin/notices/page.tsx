import Link from "next/link";
import NoticeDeleteButton from "@/components/admin/notices/NoticeDeleteButton";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getNotices() {
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const base = `${proto}://${host}`;
  const cookie = h.get("cookie") || "";

  const res = await fetch(`${base}/api/notices?all=true&limit=100`, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) return { notices: [], pagination: { total: 0 } };
  return res.json();
}

export default async function AdminNoticesPage() {
  const data = await getNotices();
  const notices = data?.notices ?? [];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>공지사항 관리</h1>
        <Link href="/admin/notices/new" style={{ padding: "8px 12px", background: "#111827", color: "white", borderRadius: 8 }}>새 공지 등록</Link>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", textAlign: "left" }}>
              <th style={{ padding: 12 }}>중요</th>
              <th style={{ padding: 12 }}>제목</th>
              <th style={{ padding: 12 }}>공개</th>
              <th style={{ padding: 12 }}>조회수</th>
              <th style={{ padding: 12 }}>작성자</th>
              <th style={{ padding: 12 }}>작성일</th>
              <th style={{ padding: 12 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n: any) => (
              <tr key={n.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>{n.isImportant ? "✅" : ""}</td>
                <td style={{ padding: 12 }}>
                  <Link href={`/admin/notices/${n.id}`} style={{ color: "#1f2937" }}>
                    {n.title}
                  </Link>
                </td>
                <td style={{ padding: 12 }}>{n.isPublished ? "공개" : "비공개"}</td>
                <td style={{ padding: 12 }}>{n.viewCount}</td>
                <td style={{ padding: 12 }}>{n.author?.name ?? n.author?.email ?? "-"}</td>
                <td style={{ padding: 12 }}>{new Date(n.createdAt).toLocaleString()}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <Link href={`/admin/notices/${n.id}/edit`} style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6 }}>수정</Link>
                  <NoticeDeleteButton id={n.id} />
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
