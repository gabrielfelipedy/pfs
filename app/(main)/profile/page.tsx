import { verifySession } from "@/lib/session";
import { getAuth } from "@/db/auth";
import { logout } from "@/app/(public)/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileForms from "@/components/profile/ProfileForms";
import ErrorLoading from "@/components/error/ErrorLoading";

export default async function ProfilePage() {
  const { username } = await verifySession();

  let dbData;
  try {
    dbData = await getAuth();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  const user = dbData[0];
  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
        new Date(user.created_at)
      )
    : null;

  return (
    <div>
      <h1 className="text-[2.2rem] md:text-[3rem] font-bold">Perfil</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display text-xl">Sua conta</CardTitle>
          <CardDescription>Informações da sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                role="img"
                aria-label={username}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-xl font-bold uppercase text-primary"
              >
                <span aria-hidden="true">{username.charAt(0)}</span>
              </span>
              <div>
                <p className="font-medium">{username}</p>
                {memberSince && (
                  <p className="text-sm text-muted-foreground">
                    Membro desde {memberSince}
                  </p>
                )}
              </div>
            </div>

            <form action={logout}>
              <Button type="submit" variant="outline">
                Sair da conta
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <ProfileForms currentUsername={username} />
    </div>
  );
}
