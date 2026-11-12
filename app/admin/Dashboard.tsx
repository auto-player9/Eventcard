"use client";

import { useMemo, useState } from "react";

export type Item = {
  id: string;
  guests: { name: string; attending: boolean }[];
  message: string;
  invite: string | null;
  lang: string;
  createdAt: string;
};

export default function Dashboard({ initial, error }: { initial: Item[]; error: string | null }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  const stats = useMemo(() => {
    let yes = 0, no = 0, msgs = 0;
    for (const it of items) {
      for (const g of it.guests) g.attending ? yes++ : no++;
      if (it.message) msgs++;
    }
    return { replies: items.length, yes, no, msgs };
  }, [items]);

  const shown = items.filter((it) => {
    const text = (it.guests.map((g) => g.name).join(" ") + " " + it.message).toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (filter === "yes") return it.guests.some((g) => g.attending);
    if (filter === "no") return it.guests.some((g) => !g.attending);
    return true;
  });

  const remove = async (id: string) => {
    if (!confirm("حذف هذا الرد؟")) return;
    const res = await fetch(`/api/admin/rsvp/${id}`, { method: "DELETE" });
    if (res.ok) setItems((xs) => xs.filter((x) => x.id !== id));
    else alert("تعذّر الحذف");
  };

  const fmt = (s: string) =>
    new Date(s).toLocaleString("ar-LB", { dateStyle: "medium", timeStyle: "short", numberingSystem: "latn" });

  return (
    <div className="adm" dir="rtl">
      <div className="adm-wrap">
        <div className="adm-top">
          <h1>ردود الحضور<small>عمر و زينب – 12.09.2026</small></h1>
          <div style={{ display: "flex", gap: 8 }}>
            <a className="adm-btn" href="/api/admin/export">⬇ تصدير CSV</a>
            <form method="post" action="/api/admin/logout"><button className="adm-btn">خروج</button></form>
          </div>
        </div>

        {error && <div className="err-box" style={{ marginBottom: 16 }}>خطأ في الاتصال بقاعدة البيانات: {error}</div>}

        <div className="stats">
          <div className="stat gold"><b>{stats.replies}</b><span>عدد الردود</span></div>
          <div className="stat yes"><b>{stats.yes}</b><span>سيحضرون</span></div>
          <div className="stat no"><b>{stats.no}</b><span>معتذرون</span></div>
          <div className="stat"><b>{stats.msgs}</b><span>رسائل تهنئة</span></div>
        </div>

        <div className="panel-a">
          <div className="tools">
            <input placeholder="بحث بالاسم أو الرسالة..." value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
              <option value="all">الكل</option>
              <option value="yes">سيحضرون</option>
              <option value="no">معتذرون</option>
            </select>
          </div>
          {shown.length === 0 ? (
            <div className="empty">لا توجد ردود بعد</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>الضيوف</th><th>الرسالة</th><th>التاريخ</th><th></th></tr>
              </thead>
              <tbody>
                {shown.map((it) => (
                  <tr key={it.id}>
                    <td>
                      {it.guests.map((g, i) => (
                        <div key={i}>
                          {g.name} <span className={`tag ${g.attending ? "yes" : "no"}`}>{g.attending ? "✓ نعم" : "✕ كلا"}</span>
                        </div>
                      ))}
                    </td>
                    <td>{it.message || <span className="muted">—</span>}</td>
                    <td className="muted">{fmt(it.createdAt)}{it.invite && <div>رابط: {it.invite}</div>}</td>
                    <td><button className="adm-btn danger" onClick={() => remove(it.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
