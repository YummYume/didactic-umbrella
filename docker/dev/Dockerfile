FROM oven/bun:debian

WORKDIR /home/bun/app

# Copy the Node.js binaries from the official Node.js Docker image (buster)
COPY --from=node:20-buster /usr/lib /usr/lib
COPY --from=node:20-buster /usr/local/share /usr/local/share
COPY --from=node:20-buster /usr/local/lib /usr/local/lib
COPY --from=node:20-buster /usr/local/include /usr/local/include
COPY --from=node:20-buster /usr/local/bin /usr/local/bin

# Switch to 'bun' user
USER bun

ENTRYPOINT [ "./scripts/bun.sh" ]
