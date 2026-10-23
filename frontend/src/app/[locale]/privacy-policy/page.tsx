export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">
          Privacy Policy
        </h1>

        <p className="mt-4 text-muted">
          Last updated: September 2026
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Introduction
          </h2>

          <p className="text-muted leading-7">
            MediaHub is a platform that allows users to discover,
            track and review movies, series, games and books.
            This Privacy Policy explains what information we collect,
            how we use it and how we protect it.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Information We Collect
          </h2>

          <p className="text-muted leading-7">
            When you create an account, we may collect information
            such as your username, email address and password.
          </p>

          <p className="text-muted leading-7">
            Passwords are not stored in plain text. They are processed
            using password hashing before being stored.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            How We Use Your Information
          </h2>

          <p className="text-muted leading-7">
            Your information is used to create and manage your account,
            authenticate you and provide the features available on
            MediaHub.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Cookies and Local Storage
          </h2>

          <p className="text-muted leading-7">
            MediaHub may use browser local storage to maintain your
            authentication session. Authentication tokens stored in
            the browser are used to identify authenticated requests
            to the application.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Third-Party Services
          </h2>

          <p className="text-muted leading-7">
            MediaHub may use third-party services to provide media
            information and other application functionality.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Data Security
          </h2>

          <p className="text-muted leading-7">
            We take reasonable measures to protect user information
            against unauthorized access, alteration or disclosure.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Changes to This Privacy Policy
          </h2>

          <p className="text-muted leading-7">
            This Privacy Policy may be updated as MediaHub evolves.
            Any changes will be reflected on this page.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            Contact
          </h2>

          <p className="text-muted leading-7">
            If you have questions about this Privacy Policy,
            please contact the MediaHub team.
          </p>
        </section>
      </div>
    </main>
  );
}