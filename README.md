# feinschliff.studio

> The website for [feinschliff.studio](https://feinschliff.studio).

## Technology Stack
The website is built using [SvelteKit](https://kit.svelte.dev/), a framework for building web applications. It uses 
[TailwindCSS](https://tailwindcss.com/) for styling and [TypeScript](https://www.typescriptlang.org/) for type safety.  
All content is managed on [Storyblok](https://www.storyblok.com/), a headless CMS. The site is hosted on 
[Cloudflare Pages](https://pages.cloudflare.com/).

## Set up the development environment

To set up the development environment, you need to install [Node.js](https://nodejs.org/en/), at least version 20.  
Then, install the dependencies:

```bash
npm install
```

To get auto-completion for the Storyblok client, you need to install the Storyblok CLI and log in to your account:

```bash
npm install -g storyblok
storyblok login
```

After that, you can pull component definitions from Storyblok, and generate TypeScript types for them:

```bash
npm run storyblok:pull
npm run storyblok:types
```

Lastly, set your configuration in the `.env` file:

```bash
cp .env.example .env

# then, edit the file
```

## Developing

Once you've set up Storyblok integration, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

The site is automatically deployed to Cloudflare Pages on every push to the `main` branch. A preview is created for 
every push to the `develop` branch, which is available at 
[preview.feinschliff.studio](https://preview.feinschliff.studio). This version is also used as the preview environment
for Storyblok, which is used by the content editors to preview their changes.
