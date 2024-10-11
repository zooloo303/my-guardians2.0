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
- add a blocker of some sort to the app for first time users in order to get the manifest loaded
- add a progress bar for loading the manifest
- add a progress bar for loading the user data
