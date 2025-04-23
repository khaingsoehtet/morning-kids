# Use the official PHP image with Apache server
FROM php:8.0-apache

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
