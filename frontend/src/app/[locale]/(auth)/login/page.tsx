"use client";

import { useState } from "react";

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
import { loginSchema } from "@/src/schemas/auth/login.schema";
import { Link } from "@/src/i18n/routing";
import axios from "axios";
import { LanguageSwitcher } from "@/src/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations("Authentication");
  const { mutateAsync, isPending } = useLogin();
  const router = useRouter();

  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);

    try {
      const response = await mutateAsync(data);

      if (response?.token) {
        localStorage.setItem("token", response.token);
        router.push("/");
        return;
      }

      setLoginError("Não foi possível realizar o login. Tente novamente.");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;

        if (status === 401 || status === 400) {
          setLoginError(t('ERROR_EMAIL_OR_PASSWORD'));
        } else if (status === 429) {
          setLoginError(t('ERROR_TOO_MANY'));
        } else if (!error.response) {
          setLoginError(t('ERROR_UNABLE_TO_CONNECT_TO_THE_SERVER'));
        } else if (typeof detail === "string") {
          setLoginError(detail);
        } else {
          setLoginError(t('ERROR_AN_ERROR_OCCURRED_WHILE_LOGGING_IN'));
        }
      } else {
        setLoginError(t('ERROR_AN_UNEXPECTED_ERROR_OCCURRED'));
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#2C3440] text-white px-10 py-2">
      <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div className="flex justify-between w-full">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <LanguageSwitcher />
        </div>

        <div className="mx-auto w-full max-w-md py-8">
          <Typography
            variant="h1"
            className="text-4xl font-black uppercase tracking-wider text-white"
          >
            {t('LOGIN')}
          </Typography>

          <Typography variant="body1" className="mt-2 text-gray-300">
            {t('WELCOME_BACK_PLEASE_ENTRE_YOUR_DETAILS')}
          </Typography>

          {loginError && (
            <div
              role="alert"
              className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {loginError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Input
                label={t('EMAIL')}
                type="email"
                placeholder={t('ENTER_YOUR_EMAIL')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email")}
                className="border-gray-600 bg-[#2d3748] text-white placeholder:text-gray-400 focus:border-emerald-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <PasswordInput
                label={t('PASSWORD')}
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
                {t('I_FORGOT_MY_PASSWORD')}
              </Link>
            </div>

            <Button
              type="submit"
              loading={isPending}
              fullWidth
              className="mt-2 bg-[#2ECC71] text-white hover:bg-[#27ae60] focus-visible:ring-[#2ECC71]"
            >
              {t('LOGIN')}
            </Button>

            <div className="mt-4 text-center">
              <Typography variant="body2" className="text-gray-300">
                {t('DOESNT_HAVE_AN_ACCOUNT')}{" "}
                <Link
                  href="/register"
                  className="font-medium text-white underline hover:text-emerald-400"
                >
                  {t('SIGN_UP')}
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