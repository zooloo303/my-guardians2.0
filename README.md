# for info on how create-a-d2app-with-svelte-> https://github.com/zooloo303/s5d2

## Setup the project

clone this repo and run `npm install` to install the dependencies.

```bash
# to install the dependencies.
npm install
```
# create a self-signed SSL certificate for the https dev server, it's easy, google it!
# place the .pem files in the folder ABOVE root (default setting) or configure in vite.config.ts

# create a .env file in the root and add the following:
BUNGIE_API_KEY=""
BUNGIE_CLIENT_ID=""
BUNGIE_CLIENT_SECRET=""

## Developing
# start the server and open the app in a new browser tab
```bash
npm run dev -- --open
```

## Todos:
- item hover-card
- build a search panel to filter items
