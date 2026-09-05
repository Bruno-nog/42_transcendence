import { Button } from "@/src/components/ui/button";
import { Loader } from "../../components/ui/loader";
import { Input } from "@/src/components/ui/Input";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { Textarea } from "@/src/components/ui/Textarea";
import { Typography } from "@/src/components/ui/Typography";
import { Badge } from "@/src/components/ui/Badge";

import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

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
            Entrar
          </Button>

          <Textarea
            label="Observações"
            placeholder="Escreva suas observações aqui..."
          />

          <Typography variant="h1">
            Dashboard Principal
          </Typography>

          {/* Padrão */}
          <Badge>Padrão</Badge>

          {/* Secundário */}
          <Badge variant="secondary">Secundário</Badge>

          {/* Outline */}
          <Badge variant="outline">Contorno</Badge>

          {/* Sucesso com ícone */}
          <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Ativo
          </Badge>

          {/* Alerta/Aviso */}
          <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" />}>
            Pendente
          </Badge>

          {/* Erro */}
          <Badge variant="error" icon={<AlertCircle className="w-3.5 h-3.5" />}>
            Inativo
          </Badge>

          {/* Tamanhos */}
          <Badge size="sm">Pequeno</Badge>
          <Badge size="md">Médio</Badge>
          <Badge size="lg">Grande</Badge>
        </div>
      </section>
    </main>
  );
}