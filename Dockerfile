FROM php:8.2-fpm

RUN apt-get update && apt-get install php-xml &&apt-get install -y composer

COPY . /var/www/html

WORKDIR /var/www/html

# Install PHP dependencies
RUN composer install --ignore-platform-reqs --no-interaction --optimize-autoloader --no-dev --no-scripts
RUN composer update 2> >(grep -v "composer fund" | grep -v "looking for funding")

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["php", "artisan", "serve"]
