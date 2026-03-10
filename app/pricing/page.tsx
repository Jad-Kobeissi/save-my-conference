import { requireUser } from "@/lib/auth";

export default async function PricingPage() {
  await requireUser();

  return (
    <>
      <div className="page-head"><div><span className="eyebrow">Plans</span><h2>Free vs Premium</h2></div></div>
      <div className="grid two">
        <section className="paper plan-card">
          <h3>Free</h3>
          <p className="price">$0</p>
          <ul className="clean-list">
            <li>Conference saving</li>
            <li>Research library uploads</li>
            <li>3 quizzes</li>
            <li>2 crises</li>
            <li>2 debates</li>
            <li>3 speech analyses</li>
          </ul>
        </section>
        <section className="paper plan-card premium-border">
          <h3>Premium</h3>
          <p className="price">Admin-controlled</p>
          <ul className="clean-list">
            <li>Unlimited training tools</li>
            <li>Priority access</li>
            <li>Best for delegates who practice heavily</li>
            <li>Can be granted manually by admin for free</li>
          </ul>
        </section>
      </div>
    </>
  );
}
