# Use Node.js Alpine for a lightweight build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Disable Next.js Telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the Next.js application
RUN yarn build

# Create a new minimal image for production
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Expose Next.js port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Start the Next.js server
CMD ["yarn", "start"]
