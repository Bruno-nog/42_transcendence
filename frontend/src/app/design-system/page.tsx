"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Mail, Search } from "lucide-react";

import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/src/components/ui/Modal";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { Textarea } from "@/src/components/ui/Textarea";
import { Typography } from "@/src/components/ui/Typography";
import { Button } from "@/src/components/ui/button";

export default function ComponentShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Container centralizado para evitar esticar em telas grandes */}
      <div className="max-w-6xl mx-auto space-y-10 grap-5">

        {/* Header da Página */}
        <header className="border-b border-gray-200 pb-6">
          <Typography variant="h1" className="text-gray-900">
            Design System - Componentes UI
          </Typography>
          <Typography variant="body1" className="mt-2 text-gray-600">
            Catálogo visual de componentes padronizados com Tailwind CSS e CVA.
          </Typography>
        </header>

        {/* 1. TYPOGRAPHY */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            1. Typography
          </Typography>
          <Card className="p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <Typography variant="h1" className="text-gray-900">
                Heading 1 - Título Principal
              </Typography>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <Typography variant="h2" className="text-gray-900">
                Heading 2 - Seção Principal
              </Typography>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <Typography variant="h3" className="text-gray-900">
                Heading 3 - Subseção
              </Typography>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <Typography variant="h4" className="text-gray-900">
                Heading 4 - Título de Card
              </Typography>
            </div>
            <div>
              <Typography variant="body1">
                Body 1 - Texto principal longo para parágrafos e informações detalhadas na aplicação.
              </Typography>
            </div>
            <div>
              <Typography variant="body2">
                Body 2 - Texto secundário levemente menor.
              </Typography>
            </div>
            <div>
              <Typography variant="caption">
                Caption - Legenda ou timestamp
              </Typography>
            </div>
          </Card>
        </section>

        {/* 2. BUTTONS */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            2. Buttons
          </Typography>
          <Card className="p-6 space-y-6">
            <div className="space-y-3">
              <Typography variant="label" className="block text-gray-700">
                Variantes
              </Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <Typography variant="label" className="block text-gray-700">
                Tamanhos e Estados
              </Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button loading>Carregando</Button>
                <Button disabled>Desabilitado</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. INPUTS & TEXTAREA */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            3. Form Controls (Input, Password & Textarea)
          </Typography>
          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome"
              helperText="Seu nome como consta no documento"
            />

            <Input
              label="E-mail com Erro"
              placeholder="usuario@dominio.com"
              error
              helperText="Formato de e-mail inválido"
            />

            <PasswordInput
              label="Senha"
              placeholder="••••••••"
              helperText="Mínimo de 8 caracteres"
            />

            <Input
              label="Campo Desabilitado"
              disabled
              defaultValue="Valor fixo não editável"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Observações"
                placeholder="Digite aqui os detalhes adicionais..."
                helperText="Máximo de 500 caracteres"
              />
            </div>
          </Card>
        </section>

        {/* 4. BADGES */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            4. Badges
          </Typography>
          <Card className="p-6 space-y-6">
            <div className="space-y-3">
              <Typography variant="label" className="block text-gray-700">
                Variantes
              </Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Concluído
                </Badge>
                <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" />}>
                  Pendente
                </Badge>
                <Badge variant="error" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                  Cancelado
                </Badge>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <Typography variant="label" className="block text-gray-700">
                Tamanhos
              </Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge size="sm">Pequeno (sm)</Badge>
                <Badge size="md">Médio (md)</Badge>
                <Badge size="lg">Grande (lg)</Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* 5. AVATARS */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            5. Avatars
          </Typography>
          <Card className="p-6 flex flex-wrap gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://github.com/shadcn.png"
                name="Shadcn"
                size="lg"
              />
              <Typography variant="caption">Com Imagem</Typography>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar name="Leonardo Vinicius" size="lg" />
              <Typography variant="caption">Iniciais (Nome)</Typography>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar
                src="https://link-invalido.com/foto.jpg"
                name="Carlos Eduardo"
                size="lg"
              />
              <Typography variant="caption">Fallback de Erro</Typography>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg" />
              <Typography variant="caption">Sem Dados (Ícone)</Typography>
            </div>

            <div className="flex gap-3 items-center border-l border-gray-200 pl-6">
              <Avatar size="sm" name="Ana Maria" />
              <Avatar size="md" name="Ana Maria" />
              <Avatar size="lg" name="Ana Maria" />
              <Avatar size="xl" name="Ana Maria" />
            </div>
          </Card>
        </section>

        {/* 6. CARDS & MODAL */}
        <section className="space-y-4">
          <Typography variant="h2" className="text-gray-900">
            6. Card & Modal
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Exemplo de Card</CardTitle>
                <CardDescription>
                  Card estruturado com Header, Content e Footer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Typography variant="body2">
                  Este card utiliza subcomponentes modulares para flexibilidade total de layout.
                </Typography>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
                <Button variant="outline" size="sm">
                  Recusar
                </Button>
                <Button size="sm">Aceitar</Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Teste do Modal</CardTitle>
                <CardDescription>
                  Clique no botão para disparar o componente de diálogo.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                <Button onClick={() => setIsModalOpen(true)}>
                  Abrir Modal de Exemplo
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* MODAL COMPONENT */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent size="md">
            <ModalHeader>
              <ModalTitle>Confirmação de Ação</ModalTitle>
              <ModalDescription>
                Você está prestes a executar uma ação importante no sistema.
              </ModalDescription>
            </ModalHeader>

            <div className="py-4">
              <Typography variant="body1">
                Deseja salvar as alterações feitas até agora?
              </Typography>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirmar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>
    </div>
  );
}