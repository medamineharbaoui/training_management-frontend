FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove optional dependencies and fix peer deps
RUN npm install --omit=optional --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli @angular-devkit/build-angular

# Copy all app files
COPY . .

# Expose port for Angular dev server
EXPOSE 4200

# Start Angular
CMD ["ng", "serve", "--poll=2000", "--no-hmr", "--host", "0.0.0.0"]
