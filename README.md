<a href="https://formonce.in" alt="FormOnce">
<!--   <img alt="FormOnce cover image" src="https://formonce.in/cover.png"> -->
  <p align="center">
  <img height="200" alt="FormOnce cover image" src="https://avatars.githubusercontent.com/u/166426138?s=400&u=4c9d80dad1e54603edcb11b1f9f0aff62095db75&v=4">
  </p>
</a>


<h1 align="center">FormOnce</h1>
<p align="center">
  Universal open source form builder
</p>
<p align="center">
  <a href="https://formonce.in"><strong>Learn more »</strong></a>
</p>

<p align="center">
  <a href="https://github.com/formonce/formonce/stargazers">
    <img src="https://img.shields.io/github/stars/formonce/formonce??style=flat&label=formonce&logo=Github&color=2dd4bf&logoColor=fff" alt="Github" />
  </a>
  
  <a href="https://x.com/form_once">
    <img src="https://img.shields.io/twitter/follow/formonce?style=flat&label=FormOnce&logo=twitter&color=0bf&logoColor=0bf" alt="Twitter" />
  </a>
  
  <a href="https://github.com/formonce/formonce/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/formonce/formonce?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

> [!IMPORTANT]  
> Why another form builder? Well, there are a lot of form builders out there, and yet none of them provides a one-stop solution for all kinds of forms/surveys. FormOnce aims to solve this by providing a universal form builder, i.e., a single platform that gives you the ability to collect any kind of information, whether it's CSAT, registrations, polls & voting, incident reports, bookings, testimonials or just plain old lead generation.

<h3 id="toc">Table of contents</h3>

- <a href="#stack">Tech stack</a>
- <a href="#contributions">Contibutions</a>
- <a href="#gettingStarted">Getting started</a>

<h3 id="stack">📟 Tech Stack</h3>

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [@shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/)

---

<h2 id="contributions">😎 Contributions</h2>

- Show us support by giving us a ⭐️
- We are looking for contributors to help us in this journey.
- Every contribution you make is recognized and deeply appreciated.
- Please follow this [Contribution guideline](https://github.com/formonce/formonce/blob/main/CONTRIBUTING.md) to get started.
- Questions? Start a new [Q&A](https://github.com/FormOnce/FormOnce/discussions/new?category=q-a) in discussions or shoot us a [DM](https://x.com/form_once).

<h3 id="gettingStarted">🏁 Getting started</h3>

<h3 id="setup">Setup development environment</h3>

- <a href="#gitpod">Development environment on Gitpod</a>
- <a href="#with-docker">Development environment with Docker</a>
- <a href="#without-docker">Development environment without Docker</a>

<h4 id="gitpod">Development environment on Gitpod</h4>

- Click the button below to open this project in Gitpod.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/new/#https://github.com/formonce/formonce)

---

<h4 id="with-docker">Development environment with Docker</h4>

- Coming soon.
---

<h4 id="without-docker">Development environment without Docker</h4>

> This has been tested on Mac OS. If you face any issues on Linux/Windows/WSL please create an [issue](https://github.com/FormOnce/FormOnce/issues/new)

- [Fork the repository](https://github.com/formonce/formonce/fork)

- Clone the repository

  ```bash
  git clone https://github.com/<your-github-username>/FormOnce.git
  ```

- Copy `.env.example` to `.env`

  ```bash
  cp .env.example .env
  ```

- Install latest version of node and pnpm
- Create a new postgres `database` using [NEON](https://neon.tech/)
- Update `DATABASE_URL` in `.env`
- Install dependencies

  ```bash
  pnpm install
  ```

- Migrate database

  ```bash
  pnpx prisma migrate dev
  ```

- Start development server

  ```bash
  pnpm dev
  ```

<h4 id="changes">Implement your changes</h4>

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc...

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

<h4 id="pr">Open a pull request</h4>

> When you're done

Make a commit and push your code to your github fork and make a pull-request.

Thanks for your contributions ❤️

---

<h2 id="contributors">💌 Contributors</h2>
<a href="https://github.com/formonce/formonce/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=formonce/formonce" alt="A table of avatars from the project's contributors" />
  </p>
</a>

---
