import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Loader } from "../../components/ui/loader";
import { Input } from "@/src/components/ui/Input";
import { PasswordInput } from "@/src/components/ui/PasswordInput";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-10 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              MediaHub 🚀
            </h1>

            <p className="mt-3 text-muted">
              Organize, avalie e descubra filmes, séries, jogos e livros em um
              único lugar.
            </p>
          </div>

          <Loader size="lg" />

          <div className="w-full rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-muted">
              🚀 Frontend inicializado com sucesso.
            </p>
          </div>

          <Input
            label="E-mail"
            type="email"
            fullWidth="true"
            placeholder="usuario@email.com"
            helperText="Usaremos este e-mail para confirmação"
          />

          <PasswordInput
            label="Senha"
            placeholder="Digite sua senha"
          />

          <Button variant="outline">
            <Link href="/design-system">Entrar</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}