"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type NoticeFormValues = {
  title: string;
  content: string;
  isImportant: boolean;
  isPublished: boolean;
};

export default function NoticeForm({
  initial,
  mode = "create",
}: {
  initial?: Partial<NoticeFormValues>;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [isImportant, setIsImportant] = useState(initial?.isImportant ?? false);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/notices" + (mode === "edit" && (initial as any)?.id ? "/" + (initial as any).id : ""), {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, isImportant, isPublished }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "요청이 실패했습니다.");
      }

      router.push("/admin/notices");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>제목</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="공지 제목을 입력하세요"
          required
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>내용</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="공지 내용을 입력하세요"
          rows={10}
          required
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
      </label>

      <div style={{ display: "flex", gap: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
          />
          중요 공지
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          공개 여부
        </label>
      </div>

      {error && (
        <div style={{ color: "#c0392b" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 14px",
            background: "#111827",
            color: "white",
            borderRadius: 8,
          }}
        >
          {submitting ? "저장 중..." : mode === "edit" ? "수정 저장" : "등록"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8 }}
        >
          취소
        </button>
      </div>
    </form>
  );
}
