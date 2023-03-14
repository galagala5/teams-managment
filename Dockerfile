# sha256:113d173d7999428afd9bd5000273aa09ecb626a8622181ca9dbc4cf85d3261f5
FROM node:latest
# Create app directory
WORKDIR /app
RUN npm install -g npm@8.13.2

# RUN apt-get update && apt-get install curl gnupg -y \
#   && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#   && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#   && apt-get update \
#   && apt-get install google-chrome-stable -y --no-install-recommends \
#   && rm -rf /var/lib/apt/lists/*


COPY src/package*.json ./

RUN npm i

# RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./src/ ./

EXPOSE 3000

# CMD [ "node", "app.js" ]
CMD [ "npm","start" ]