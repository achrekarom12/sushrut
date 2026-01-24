# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on (Fastify usually defaults to 3000, but often configured via env)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
