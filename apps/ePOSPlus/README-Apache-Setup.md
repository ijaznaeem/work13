# ePOSPlus API Apache Configuration

This guide will help you configure Apache to serve the ePOSPlus APIs at `http://php74.localhost:8080/posplus`.

## Prerequisites

- Apache Web Server (2.4+)
- PHP 7.4
- Required Apache modules: `mod_rewrite`, `mod_alias`, `mod_php`

## Quick Setup

1. **Run the setup script:**
   ```bash
   cd /Volumes/Work/Work-Angular/Work13/apps/ePOSPlus
   ./setup-apache.sh
   ```

2. **Manual Configuration (if script fails):**

   a. Copy the virtual host configuration:
   ```bash
   sudo cp posplus-apache.conf /path/to/apache/sites-available/posplus.conf
   # Enable the site (Debian/Ubuntu):
   sudo a2ensite posplus
   ```

   b. Add to `/etc/hosts`:
   ```
   127.0.0.1    php74.localhost
   ```

   c. Enable required Apache modules:
   ```bash
   # Debian/Ubuntu:
   sudo a2enmod rewrite
   sudo a2enmod alias
   sudo a2enmod php7.4
   
   # Or for Homebrew Apache, edit httpd.conf to uncomment:
   # LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so
   # LoadModule alias_module lib/httpd/modules/mod_alias.so
   # LoadModule php7_module lib/httpd/modules/libphp7.so
   ```

3. **Restart Apache:**
   ```bash
   # Homebrew Apache:
   sudo brew services restart httpd
   
   # System Apache:
   sudo systemctl restart apache2
   
   # Or restart XAMPP/MAMP if using those
   ```

## Testing the Configuration

1. **Basic test:**
   Visit: `http://php74.localhost:8080/posplus`

2. **API test:**
   Visit: `http://php74.localhost:8080/posplus/test`

3. **PHP info:**
   Visit: `http://php74.localhost:8080/posplus/test/phpinfo`

## Directory Structure

```
/Volumes/Work/Work-Angular/Work13/apps/ePOSPlus/Apis/
├── index.php                 # CodeIgniter entry point
├── .htaccess                 # URL rewriting rules
├── web.config               # IIS configuration (not used)
├── application/             # CodeIgniter application
│   ├── config/
│   │   └── config.php       # Base URL configuration
│   ├── controllers/         # API controllers
│   ├── models/              # Data models
│   └── views/               # View templates
└── system/                  # CodeIgniter core (protected)
```

## Configuration Files Modified

1. **`application/config/config.php`:**
   - Set `$config['base_url'] = 'http://php74.localhost:8080/posplus/'`
   - Set `$config['index_page'] = ''` (remove index.php from URLs)

2. **`.htaccess`:**
   - Added `RewriteBase /posplus/`
   - Configured URL rewriting for CodeIgniter

3. **`posplus-apache.conf`:**
   - Virtual host configuration
   - Directory permissions
   - Alias configuration for `/posplus` → APIs folder
   - Security settings

## API Endpoints

Based on the controllers found, the following endpoints should be available:

- `/posplus/apis` - Main API controller
- `/posplus/auth` - Authentication
- `/posplus/orders` - Order management
- `/posplus/reports` - Reporting
- `/posplus/sms` - SMS functionality
- `/posplus/tasks` - Task management
- `/posplus/test` - Test endpoint (newly added)

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error:**
   - Check directory permissions
   - Verify Apache has read access to the files
   - Check `.htaccess` syntax

2. **500 Internal Server Error:**
   - Check Apache error logs: `/var/log/apache2/posplus_error.log`
   - Verify PHP is properly configured
   - Check CodeIgniter configuration

3. **404 Not Found for API endpoints:**
   - Verify `mod_rewrite` is enabled
   - Check `.htaccess` file exists and is readable
   - Verify `RewriteBase` is correctly set

4. **PHP not executing:**
   - Verify PHP 7.4 is installed and configured
   - Check PHP handler configuration in Apache
   - Verify `mod_php` or `php-fpm` is enabled

### Log Files:

- Apache Error Log: `/var/log/apache2/posplus_error.log`
- Apache Access Log: `/var/log/apache2/posplus_access.log`
- PHP Error Log: Check `php.ini` for log location

### Useful Commands:

```bash
# Check Apache configuration
sudo apache2ctl configtest

# View Apache error logs
sudo tail -f /var/log/apache2/posplus_error.log

# Check if modules are enabled
apache2ctl -M | grep rewrite
apache2ctl -M | grep php

# Test virtual host configuration
curl -I http://php74.localhost:8080/posplus
```

## Security Notes

- The `system/` and `application/` directories are protected from direct access
- Consider setting up SSL/HTTPS for production use
- Review and configure appropriate PHP security settings
- Implement proper authentication and authorization in your API controllers

## Development vs Production

This configuration is set up for development. For production:

1. Change `ENVIRONMENT` in `index.php` to `'production'`
2. Disable error reporting in production
3. Set up proper SSL certificates
4. Configure proper database credentials
5. Review and harden security settings
