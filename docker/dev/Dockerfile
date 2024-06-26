FROM oven/bun:debian

WORKDIR /home/bun/app

COPY --from=node:20-buster /usr/lib /usr/lib
COPY --from=node:20-buster /usr/local/share /usr/local/share
COPY --from=node:20-buster /usr/local/lib /usr/local/lib
COPY --from=node:20-buster /usr/local/include /usr/local/include
COPY --from=node:20-buster /usr/local/bin /usr/local/bin

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN chmod +x ./scripts/bun.sh

RUN chown -R 1000:1000 /home/bun/app
RUN chmod -R 775 /home/bun/app

EXPOSE 5173
EXPOSE 4173

ENTRYPOINT [ "./scripts/bun.sh" ]
