import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Analytics Login",
  robots: { index: false, follow: false },
};

export default async function AnalyticsLoginPage() {
  // If already authenticated, redirect to dashboard
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (authToken && verifyAuthToken(authToken)) {
    redirect("/analytics");
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-center">Analytics</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Enter your analytics secret to access the dashboard.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
