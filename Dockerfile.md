# Stage 1: Build Environment
FROM node:18-alpine as build
WORKDIR /app

# --- Generate Configuration Files ---

# 1. package.json
RUN echo '{ \
  "name": "consistency-app", \
  "version": "1.0.0", \
  "type": "module", \
  "scripts": { \
    "dev": "vite", \
    "build": "vite build", \
    "preview": "vite preview" \
  }, \
  "dependencies": { \
    "react": "^18.3.1", \
    "react-dom": "^18.3.1", \
    "lucide-react": "^0.344.0", \
    "date-fns": "^3.3.1", \
    "clsx": "^2.1.0", \
    "tailwind-merge": "^2.2.1" \
  }, \
  "devDependencies": { \
    "@types/react": "^18.2.66", \
    "@types/react-dom": "^18.2.22", \
    "@vitejs/plugin-react": "^4.2.1", \
    "autoprefixer": "^10.4.18", \
    "postcss": "^8.4.35", \
    "tailwindcss": "^3.4.1", \
    "typescript": "^5.2.2", \
    "vite": "^5.1.4" \
  } \
}' > package.json

# 2. vite.config.ts
RUN echo 'import { defineConfig } from "vite"; \
import react from "@vitejs/plugin-react"; \
\
export default defineConfig({ \
  plugins: [react()], \
  server: { \
    host: true, \
    port: 3000, \
  }, \
});' > vite.config.ts

# 3. tsconfig.json
RUN echo '{ \
  "compilerOptions": { \
    "target": "ES2020", \
    "useDefineForClassFields": true, \
    "lib": ["ES2020", "DOM", "DOM.Iterable"], \
    "module": "ESNext", \
    "skipLibCheck": true, \
    "moduleResolution": "bundler", \
    "allowImportingTsExtensions": true, \
    "resolveJsonModule": true, \
    "isolatedModules": true, \
    "noEmit": true, \
    "jsx": "react-jsx", \
    "strict": true, \
    "noUnusedLocals": false, \
    "noUnusedParameters": false, \
    "noFallthroughCasesInSwitch": true \
  }, \
  "include": ["."], \
  "references": [{ "path": "./tsconfig.node.json" }] \
}' > tsconfig.json

# 4. tsconfig.node.json
RUN echo '{ \
  "compilerOptions": { \
    "composite": true, \
    "skipLibCheck": true, \
    "module": "ESNext", \
    "moduleResolution": "bundler", \
    "allowSyntheticDefaultImports": true \
  }, \
  "include": ["vite.config.ts"] \
}' > tsconfig.node.json

# 5. postcss.config.js
RUN echo 'export default { \
  plugins: { \
    tailwindcss: {}, \
    autoprefixer: {}, \
  }, \
}' > postcss.config.js

# 6. tailwind.config.js
RUN echo '/** @type {import("tailwindcss").Config} */ \
export default { \
  content: [ \
    "./index.html", \
    "./**/*.{js,ts,jsx,tsx}", \
  ], \
  darkMode: "class", \
  theme: { \
    extend: { \
      colors: { \
        gray: { \
          750: "#2d3748", \
          850: "#1a202c", \
          950: "#0d1117", \
        } \
      } \
    }, \
  }, \
  plugins: [], \
}' > tailwind.config.js

# --- Install & Build ---

RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx Configuration for SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]