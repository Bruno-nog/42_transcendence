interface FilmDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FilmDetailsPage({
  params,
}: FilmDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-container">
        <h1 className="text-3xl font-bold text-white">
          Detalhes do filme
        </h1>

        <p className="mt-4 text-muted">
          ID do filme: {id}
        </p>
      </div>
    </main>
  );
}