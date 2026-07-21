# Intentionally misconfigured Dockerfile — for scanner testing only.
# Do not use this as a real deployment Dockerfile.

# 1. Old, known-vulnerable base image
FROM node:24.18.0

# 2. Hardcoded secret baked into the image layer
ENV API_SECRET="sk_live_51H8xJ2kQwErTyUiOpAsDfGhJkLzXcVbNm"

WORKDIR /app

# 3. ADD instead of COPY for local files (unnecessary extraction/remote-fetch risk)
ADD . /app

RUN npm install

# 4. No non-root USER set — container runs as root by default
EXPOSE 3000

CMD ["npm", "start"]
