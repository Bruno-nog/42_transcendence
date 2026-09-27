"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/Input";
import { registerSchema, RegisterFormData } from "@/src/schemas/auth/register.schema";
import { useRegister } from "@/src/hooks/useRegister";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { Typography } from "@/src/components/ui/Typography";

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await mutateAsync(data);

      toast.success("Conta criada com sucesso!");

      router.push("/login");
    } catch {
      toast.error("Não foi possível criar a conta.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#2C3440] text-white px-10 py-2">
      <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md py-8">
          <Typography
            variant="h1"
            className="text-4xl font-black uppercase tracking-wider text-white"
          >
            CADASTRO
          </Typography>

          <Typography variant="body1" className="mt-2 text-gray-300">
            Crie sua conta no MediaHub para começar
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Input
                label="Usuário"
                placeholder="Digite seu usuário"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                {...register("username")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register("password")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              loading={isPending}
              fullWidth
              className="mt-2 bg-[#2ECC71] text-white hover:bg-[#27ae60] focus-visible:ring-[#2ECC71]"
            >
              Criar conta
            </Button>

            <div className="mt-4 text-center">
              <Typography variant="body2" className="text-gray-300">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-white underline hover:text-emerald-400"
                >
                  Entrar
                </Link>
              </Typography>
            </div>
          </form>
        </div>

        <div className="hidden sm:block" />
      </div>

      <div className="hidden flex-1 flex-col items-center justify-center border-l border-white/10 bg-[#2C3440] p-12 lg:flex">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/login_img.png"
            alt="MediaHub Cinema Illustration"
            className="max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
}