import { AuthCard } from "./auth-card";
import { BrandPanel } from "./brand-panel";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; notice?: string }>;
}) {
  const { mode, error, notice } = await searchParams;

  return (
    <div className="flex flex-1">
      <BrandPanel className="hidden md:flex md:w-[42%] lg:w-1/2" />
      <div className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-16">
        <AuthCard
          initialMode={mode === "register" ? "register" : "login"}
          serverError={error ? decodeURIComponent(error) : undefined}
          notice={notice}
        />
      </div>
    </div>
  );
}
