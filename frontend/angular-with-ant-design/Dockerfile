FROM node:18

WORKDIR /app

COPY . .
 
RUN apt-get update && apt-get install -y git
 
RUN npm install -g @angular/cli@16

 
RUN npm install --verbose
 
RUN node --version && \
    npm --version && \
    ng version
 
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
