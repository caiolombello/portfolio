import Link from "next/link";
import { getDictionary } from "../i18n";

export default async function NotFound({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto flex max-w-[50rem] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          404 - {dict.notFound.title}
        </h1>
        <p className="mt-4 text-muted-foreground sm:text-xl">
          {dict.notFound.description}
        </p>
        <Link
          href={`/${lang}`}
          className="mt-8 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {dict.notFound.back}
        </Link>
      </div>
    </div>
  );
}
