"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NoticeDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "삭제에 실패했습니다.");
      }
      router.push("/admin/notices");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      style={{ padding: "6px 10px", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6 }}
    >
      {loading ? "삭제 중..." : "삭제"}
    </button>
  );
}
