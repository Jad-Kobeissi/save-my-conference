import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="center-wrap">
      <div className="auth-card paper narrow">
        <span className="eyebrow">Secure access</span>
        <h2>Welcome back</h2>
        <form method="post" action="/api/auth/login" className="stack-form">
          <label>Email<input type="email" name="email" required /></label>
          <label>Password<input type="password" name="password" required /></label>
          <button className="btn primary" type="submit">Log in</button>
        </form>
        <p className="subtle">Need an account? <Link href="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
