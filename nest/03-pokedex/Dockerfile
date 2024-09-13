
### DEPENDENCIES ###

# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci # Clean install. It bypasses a package’s package.json to install modules from a package’s lockfile. This ensures reproducible builds—you are getting exactly what you expect on every install.

######

### BUILDER ###

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

######

### RUNNER ###

# Production image, copy all the files and run next
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --omit=dev # Same as npm install --only=prod

COPY --from=builder /app/dist ./dist

## OPTIONAL ##

# Copy dir & content. (Last param is always destination path).
RUN mkdir -p ./pokedex

COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# Set permissions to run app. It is good practice not to use the root user.
RUN adduser --disabled-password pokeuser
RUN chown -R pokeuser:pokeuser ./pokedex
USER pokeuser

# Expose container port
# EXPOSE 3000

####

# By CMD commands are executed once the container has been initialised.
# CMD [ "node", "dist/main" ]
CMD [ "npm", "run", "start:prod" ]

######