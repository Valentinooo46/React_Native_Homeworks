# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

# Install Expo 54
```
npm install nativewind
npm install --save-dev tailwindcss
npm install tailwindcss
npx tailwindcss init
```

## tailwind.config.js
```
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#00D09E',
        'primary-light': '#F4FFF8',
        'primary-button-light': '#E5F9F0',
      },
      fontFamily: {
        'poppins-regular': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'spartan-regular': ['LeagueSpartan-Regular'],
        'spartan-light': ['LeagueSpartan-Light'],
        'spartan-semibold': ['LeagueSpartan-SemiBold'],
      },
    },
  },
  plugins: [],
}
```

## Add babel.config.js
```
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            // ВАЖЛИВО: цей плагін має бути останнім
            "react-native-reanimated/plugin",
        ],
    };
};
```


## Add metro.config.js
```
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
```

## Add global.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Add line app/_layout.tsx
```
import '../global.css';
```

## npm install babel-preset-expo --save-dev
```
npm install babel-preset-expo --save-dev
npx expo install --check
```


## Якщо не працює на сервері SirgnalR default nginx
```
server {
server_name   p32-native.itstep.click *.p32-native.itstep.click;
client_max_body_size 250M;
location / {
        proxy_pass         http://localhost:4384;
        proxy_http_version 1.1;
		
        # SignalR / WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # важливо для SignalR
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/p32-native.itstep.click/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/p32-native.itstep.click/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}


sudo systemctl restart nginx
```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
