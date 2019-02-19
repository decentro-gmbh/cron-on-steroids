####################################################################################
# node-ts-repo-template Dockerfile for local testing/ development
#
# BUILD: docker build --rm -f Dockerfile -t node-ts-repo-template:latest .
# RUN: docker run --rm -it --name node-ts-repo-template --entrypoint=/bin/bash -v $(pwd):/app -p "127.0.0.1:9126:9229" node-ts-repo-template:latest
#
####################################################################################

FROM node:10.14-stretch

# Set working directory
WORKDIR /app

# Mark container as development container by setting NODE_ENV to 'development'
ENV NODE_ENV='development'

# Add bin folder of node_modules to PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Add npm bash completion
RUN npm completion >> ~/.bashrc

# Keep container alive so that a dev can attach to it with a shell
ENTRYPOINT tail -f /dev/null
