# Use the official PHP image with Apache server
FROM php:8.0-apache

#RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev && \
 #   docker-php-ext-configure gd --with-freetype --with-jpeg && \
 #   docker-php-ext-install gd

# Install PDO MySQL driver
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite (needed for clean URLs)
RUN a2enmod rewrite

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy the project files into the container
COPY . /var/www/html/

# Set file permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 (default Apache port)
EXPOSE 80

# Command to run Apache in the foreground
CMD ["apache2-foreground"]
