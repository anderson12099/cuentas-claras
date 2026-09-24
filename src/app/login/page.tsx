import { AuthCard } from "./auth-card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; notice?: string }>;
}) {
  const { mode, error, notice } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-16">
      <AuthCard
        initialMode={mode === "register" ? "register" : "login"}
        serverError={error ? decodeURIComponent(error) : undefined}
        notice={notice}
      />
    </div>
  );
}
