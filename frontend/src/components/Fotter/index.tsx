import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 flex flex-col gap-5 py-6 text-center">
      <span className="text-2xl">🍿</span>
      <Link href="/privacy-policy">
        Privacy Policy
      </Link>

      <Link href="/terms-of-service">
        Terms of Service
      </Link>
    </footer>
  );
}