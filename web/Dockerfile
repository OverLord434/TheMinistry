FROM node:20-alpine

WORKDIR /app

# Копируем только файлы зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем все остальные файлы (src, public и т.п.)
COPY . .

# Собираем build
RUN npm run build

# Устанавливаем serve
RUN npm install -g serve

# Открываем порт
EXPOSE 3000

# Запускаем
CMD ["serve", "-s", "dist", "-l", "3000"]