FROM php:8.2-fpm
USER root
RUN apt-get update && apt-get install -y \
        git \
        unzip \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libzip-dev \
        zip \
        && docker-php-ext-configure gd --with-freetype --with-jpeg \
        && docker-php-ext-install gd pdo pdo_mysql zip

COPY . /var/www/html

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN set -eux

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies
RUN composer update --ignore-platform-reqs --prefer-dist --no-interaction --optimize-autoloader --no-dev --no-scripts
RUN composer dump-autoload

RUN chown -R www-data:www-data /var/www/html/storage
RUN chmod -R 755 /var/www/html/storage
RUN chown -R www-data:www-data storage bootstrap/cache

#/var/www/html/artisan serve --host=0.0.0.0 --port=80
#ENTRYPOINT : 이미지가 컨테이너화 되며 실행될 명령어 지정
#docker run -d --name spring_server -p 8000:8000 b68963563f42
#ENV HOST=localhost
#ENTRYPOINT ["php", "artisan", "serve","--host","localhost","--port","8000"]
#ENV HOST=0.0.0.0
#EXPOSE 8000
#ENTRYPOINT ["php", "artisan", "serve","--host","0.0.0.0","--port","8000"]
ENTRYPOINT ["php", "artisan", "serve"]
