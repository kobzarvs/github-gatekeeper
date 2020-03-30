OAuth GitHub Gatekeeper
=======================

## API

1. Exchage temporary code for a token

    ```
    GET /api/auth?code=<CODE>
    ```

## OAuth Steps

Also see the [documentation on Github](http://developer.github.com/v3/oauth/).

1. Redirect users to request GitHub access.

   ```
   GET https://github.com/login/oauth/authorize
   ```

2. GitHub redirects back to your site including a temporary code you need for the next step.

   You can grab it like so:

   ```js
   const params = new URLSearchParams(location.search)
   const code = params.get('code')
   ```

3. Request the actual token using your instance of Gatekeeper, which knows your `OAUTH_CLIENT_SECRET`.

   ```js
   const GITHUB_GATEKEEPER_URL = process.env.NODE_ENV === 'development'
     ? 'http://localhost:3000/api/auth'
     : 'https://gatekeeper.YOUNAME.now.sh/api/auth'

   const url = new URL(GITHUB_GATEKEEPER_URL)
   url.searchParams.set('code', code)
   try {
     const res = await fetch(url)
     if (res.ok) {
       const {token} = await res.json()
       console.log(token)
     }
   } catch (e) {
     // bad code
   }
   ```

## Setup your Gatekeeper

1. Clone it

    ```
    git clone git@github.com:kobzarvs/github-gatekeeper.git
    ```

2. Install Dependencies

    ```
    cd gatekeeper && yarn
    ```
   
3. Run local dev environment

    First of all you must create `.env` file:
    
    ```
    OAUTH_CLIENT_SECRET=<OAUTH_CLIENT_SECRET>
    OAUTH_CLIENT_ID=<OAUTH_CLIENT_ID>
    ```

    ```
    now dev
    ```

## Deploy on now.sh

1. Add secrets env variables

    ```
    now secrets add OAUTH_CLIENT_SECRET <OAUTH_CLIENT_SECRET> 
    now secrets add OAUTH_CLIENT_ID <OAUTH_CLIENT_ID>
    ``` 

2. Deploy service

    ```
    now
    ```
