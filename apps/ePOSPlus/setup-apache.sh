#!/bin/bash

# Apache Configuration Setup Script for ePOSPlus APIs
# This script helps configure Apache to serve the APIs at http://php74.localhost:8080/posplus

echo "=== ePOSPlus Apache Configuration Setup ==="
echo ""

# Check if Apache is installed
if ! command -v httpd &> /dev/null && ! command -v apache2 &> /dev/null; then
    echo "❌ Apache is not installed or not in PATH"
    echo "Please install Apache first using:"
    echo "  brew install httpd (for Homebrew)"
    echo "  or use XAMPP, MAMP, or similar"
    exit 1
fi

echo "✅ Apache found"

# Get Apache configuration directory
if [ -d "/usr/local/etc/httpd" ]; then
    APACHE_DIR="/usr/local/etc/httpd"
elif [ -d "/etc/apache2" ]; then
    APACHE_DIR="/etc/apache2"
elif [ -d "/Applications/XAMPP/etc" ]; then
    APACHE_DIR="/Applications/XAMPP/etc"
elif [ -d "/Applications/MAMP/conf/apache" ]; then
    APACHE_DIR="/Applications/MAMP/conf/apache"
else
    echo "⚠️  Could not automatically detect Apache configuration directory"
    echo "Please manually copy the configuration file to your Apache sites directory"
    echo "Configuration file: $(pwd)/posplus-apache.conf"
    exit 1
fi

echo "📁 Apache config directory: $APACHE_DIR"

# Copy the virtual host configuration
VHOST_FILE="$APACHE_DIR/other/posplus.conf"
if [ -d "$APACHE_DIR/sites-available" ]; then
    VHOST_FILE="$APACHE_DIR/sites-available/posplus.conf"
elif [ -d "$APACHE_DIR/conf.d" ]; then
    VHOST_FILE="$APACHE_DIR/conf.d/posplus.conf"
fi

echo "📝 Creating virtual host configuration..."
sudo cp "$(dirname "$0")/posplus-apache.conf" "$VHOST_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Virtual host configuration copied to: $VHOST_FILE"
else
    echo "❌ Failed to copy virtual host configuration"
    echo "Please manually copy posplus-apache.conf to your Apache configuration directory"
    exit 1
fi

# Enable site if using Debian/Ubuntu style Apache
if [ -d "$APACHE_DIR/sites-available" ] && command -v a2ensite &> /dev/null; then
    echo "🔧 Enabling site..."
    sudo a2ensite posplus
    echo "✅ Site enabled"
fi

# Add entry to /etc/hosts if not exists
if ! grep -q "php74.localhost" /etc/hosts; then
    echo "🔧 Adding entry to /etc/hosts..."
    echo "127.0.0.1    php74.localhost" | sudo tee -a /etc/hosts
    echo "✅ Host entry added"
else
    echo "✅ Host entry already exists"
fi

echo ""
echo "=== Configuration Complete ==="
echo ""
echo "📋 Next Steps:"
echo "1. Ensure PHP 7.4 is installed and configured with Apache"
echo "2. Enable required Apache modules:"
echo "   - mod_rewrite"
echo "   - mod_alias"
echo "   - mod_php (or mod_php74)"
echo ""
echo "3. Restart Apache:"
echo "   sudo brew services restart httpd  # For Homebrew Apache"
echo "   sudo systemctl restart apache2   # For system Apache"
echo "   # Or restart XAMPP/MAMP if using those"
echo ""
echo "4. Test the configuration:"
echo "   http://php74.localhost:8080/posplus"
echo ""
echo "🔧 Troubleshooting:"
echo "- Check Apache error logs if issues occur"
echo "- Verify PHP 7.4 is properly configured"
echo "- Ensure port 8080 is available and not blocked"
echo ""
