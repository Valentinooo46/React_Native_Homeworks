# Create react native project

```
npx create-expo-app fifty-four
```

# Config tailwind (naitivewind)

```
npm install nativewind

npm install --save-dev tailwindcss

npx tailwindcss init
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

## Add nativewind-env.d.ts

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

## Add nginx Config /etc/nginx/sites-available/default
```
server {
server_name   p32-native.itstep.click *.p32-native.itstep.click;
client_max_body_size 250M;
location / {
        proxy_pass         http://localhost:4384;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

}


sudo systemctl restart nginx
```

