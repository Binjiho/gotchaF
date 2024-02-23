FROM php:8.2-fpm
USER root
RUN apt-get update

COPY . /var/www/html

WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN set -eux

# Install PHP dependencies
RUN composer install

RUN chown -R www-data:www-data /var/www/html/storage
RUN chmod -R 755 /var/www/html/storage
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["php", "artisan", "serve"]
