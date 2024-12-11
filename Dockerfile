FROM node:lts-bookworm-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY index.js /app
COPY webshop.db /app
EXPOSE 3000
CMD ["node","index.js"]