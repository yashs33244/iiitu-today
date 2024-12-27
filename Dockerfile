# Build Stage
FROM node:20-alpine AS build_image

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# First, copy only the package files
COPY package.json pnpm-lock.yaml ./

# Remove any existing node_modules to prevent conflicts
RUN rm -rf node_modules

# Install dependencies including Chakra UI
RUN pnpm install --frozen-lockfile && \
    pnpm add @chakra-ui/theme @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Copy the source code and environment variables
COPY . .


# Set Next.js to production mode
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN pnpm run build

# Prune development dependencies
RUN pnpm prune --prod

# Production Stage
FROM node:20-alpine AS production_stage

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only necessary files from build stage
COPY --from=build_image /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build_image /app/node_modules ./node_modules
COPY --from=build_image /app/.next ./.next
COPY --from=build_image /app/public ./public

# Set environment to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose port 3000
EXPOSE 3000

# Start the app in production mode
CMD ["pnpm", "start"]