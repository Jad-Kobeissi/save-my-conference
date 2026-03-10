import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="center-wrap">
      <div className="auth-card paper narrow">
        <span className="eyebrow">Secure access</span>
        <h2>Create your account</h2>
        <form method="post" action="/api/auth/signup" className="stack-form">
          <label>Name<input name="name" required /></label>
          <label>Email<input type="email" name="email" required /></label>
          <label>Password<input type="password" name="password" required /></label>
          <button className="btn primary" type="submit">Sign up</button>
        </form>
        <p className="subtle">Already have an account? <Link href="/login">Log in</Link></p>
      </div>
    </div>
  );
}
