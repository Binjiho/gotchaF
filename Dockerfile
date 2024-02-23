FROM php:8.2-fpm

RUN apt-get update && apt-get install php-xml &&apt-get install -y composer

COPY . /var/www/html

WORKDIR /var/www/html

# Install PHP dependencies
RUN composer update --ignore-platform-reqs

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["php", "artisan", "serve"]
