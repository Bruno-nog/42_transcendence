"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/Input";
import { Typography } from "@/src/components/ui/Typography";
import { PasswordInput } from "@/src/components/ui/PasswordInput";
import { useLogin } from "@/src/hooks/useLogin";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um e-mail válido"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await mutateAsync(data);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        router.push("/");
      }

    } catch (error) {
      console.error("Erro ao realizar login:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#2C3440] text-white px-10 py-2">
      <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <Link
            href="/"
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
            LOGIN
          </Typography>

          <Typography variant="body1" className="mt-2 text-gray-300">
            Bem vindo de volta! Por favor insira seus dados
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Input
                label="Email"
                type="email"
                placeholder="Digite seu email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <PasswordInput
                label="Senha"
                placeholder="••••••••••••"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register("password")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex justify-start">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-300 underline hover:text-white"
              >
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              loading={isPending}
              fullWidth
              className="mt-2 bg-[#2ECC71] text-white hover:bg-[#27ae60] focus-visible:ring-[#2ECC71]"
            >
              Logar
            </Button>

            <div className="mt-4 text-center">
              <Typography variant="body2" className="text-gray-300">
                não tem conta?{" "}
                <Link
                  href="/register"
                  className="font-medium text-white underline hover:text-emerald-400"
                >
                  Inscrever-se
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