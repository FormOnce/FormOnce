import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>FormOnce</title>
        <meta name="description" content="Not another form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark min-h-screen bg-background">
        <nav className="sticky top-0 flex items-center justify-between border px-12 py-4 text-foreground">
          <Link href="/">
            <span className="text-2xl font-extrabold text-[hsl(280,100%,70%)]">
              FormOnce
            </span>
          </Link>
          <Link href="/auth/signup">
            <span className="text-foreground">Sign in</span>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center bg-background">
          <div className="container flex flex-col items-center gap-16 px-4 py-16">
            <h1 className="text-center text-6xl font-extrabold leading-none tracking-tight text-foreground">
              Create your{" "}
              <span className="text-[hsl(280,100%,70%)]">FormOnce</span> and use
              it anywhere
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Create</h3>
                <div className="text-lg">
                  Create forms using our visual editor
                </div>
                <br />
                <div className="text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur voluptates placeat voluptatem, harum, minima,
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Share</h3>
                <div className="text-lg">Share with your users</div>
                <br />
                <div className="text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur voluptates placeat voluptatem, harum, minima,
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Embed</h3>
                <div className="text-lg">
                  Embed as a react component in your own code base
                </div>
                <br />
                <div className="text-lg">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur voluptates placeat voluptatem, harum, minima,
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
