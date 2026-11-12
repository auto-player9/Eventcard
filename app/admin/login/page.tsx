import "../admin.css";

export const metadata = { title: "Admin – Login", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="login" dir="rtl">
      <form method="post" action="/api/admin/login">
        <h1>لوحة التحكم</h1>
        <label>اسم المستخدم<input name="username" autoComplete="username" required defaultValue="admin" /></label>
        <label>كلمة المرور<input name="password" type="password" autoComplete="current-password" required autoFocus /></label>
        {error && <div className="e">اسم المستخدم أو كلمة المرور غير صحيحة</div>}
        <button type="submit">دخول</button>
      </form>
    </div>
  );
}
