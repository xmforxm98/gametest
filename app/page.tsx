import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <main className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-10 shadow-xl">
        <h1 className="text-3xl font-semibold">Echoes of the City</h1>
        <p className="text-zinc-400">
          A deterministic, chat-style story engine. Outcomes shift only with your
          accumulated logs.
        </p>
        <Link
          href="/game"
          className="inline-flex w-fit items-center justify-center rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
        >
          Enter the Game
        </Link>
      </main>
    </div>
  );
}
