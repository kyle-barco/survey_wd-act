# Use a lightweight Node.js image
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the Prisma schema and generate the Prisma Client
COPY prisma ./prisma/
RUN pnpm exec prisma generate

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (assuming 3333 based on your earlier logs)
EXPOSE 3333

# Command to run your app
# (Adjust "start" if your package.json script is named differently, e.g., "dev")
CMD ["pnpm", "start"]