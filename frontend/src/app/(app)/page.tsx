import { Button } from "@/src/components/ui/button";
import { Loader } from "../../components/ui/loader";
import { Input } from "@/src/components/ui/Input";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { Textarea } from "@/src/components/ui/Textarea";
import { Typography } from "@/src/components/ui/Typography";
import { Badge } from "@/src/components/ui/Badge";

import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Avatar } from "@/src/components/ui/Avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/Card";

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


          {/* 1. Com imagem funcional */}
          <Avatar
            src="https://github.com/shadcn.png"
            alt="Foto de Perfil"
            name="Shadcn"
          />

          {/* 2. Sem imagem (Fallback com Iniciais automáticas a partir do Nome) */}
          <Avatar name="Leonardo Vinicius" />

          {/* 3. Imagem com erro na URL (Fallback automático para as iniciais) */}
          <Avatar
            src="https://imagem-que-nao-existe.com/foto.png"
            name="Carlos Eduardo"
          />

          {/* 4. Sem imagem e sem nome (Fallback para o Ícone de Usuário) */}
          <Avatar />

          {/* 5. Variação de Tamanhos */}
          <Avatar size="sm" name="Ana Maria" />
          <Avatar size="md" name="Ana Maria" />
          <Avatar size="lg" name="Ana Maria" />
          <Avatar size="xl" name="Ana Maria" />

          <div className="p-8 max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Escolha como você deseja receber os alertas do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Conteúdo principal do seu card aqui.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}