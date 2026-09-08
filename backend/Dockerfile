# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci


# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm prune --omit=dev


# ---- run ----
FROM node:20-alpine AS run
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
