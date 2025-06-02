# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Set build arguments for environment variables
ARG NEXT_PUBLIC_BACKEND_URL
# Use the build arguments to set environment variables
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Stage 2: Production Image
FROM node:22-alpine
WORKDIR /app

# Copy package.json and package-lock.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies (this will create a fresh node_modules)
RUN npm install --only=production --frozen-lockfile

# Copy the build output
COPY --from=builder /app/.next ./.next
# If you have static assets in a public folder, copy them as well
# COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "start"]