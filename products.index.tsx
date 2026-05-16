import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/account/")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="glass-card rounded-2xl p-6">
      <h1 className="font-display text-2xl font-bold mb-4">Profile</h1>
      <dl className="space-y-2 text-sm">
        <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{user?.email}</dd></div>
        <div><dt className="text-muted-foreground">User ID</dt><dd className="font-mono text-xs">{user?.id}</dd></div>
      </dl>
    </div>
  );
}
