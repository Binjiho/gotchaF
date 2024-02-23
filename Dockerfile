FROM php:8.2-fpm
USER root
RUN apt-get update

COPY . /var/www/html

WORKDIR /var/www/html

# Install PHP dependencies
RUN composer install --ignore-platform-reqs -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["php", "artisan", "serve"]
