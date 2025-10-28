#!/bin/bash

# Apache Multi-App Configuration Script
# Automates the process of adding new PHP applications to the Apache setup

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APACHE_VHOSTS_CONF="/opt/homebrew/etc/httpd/extra/httpd-vhosts.conf"
WWW_ROOT="/opt/homebrew/var/www"
HOSTS_FILE="/etc/hosts"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "$1"
    echo "=================================================="
    echo -e "${NC}"
}

# Function to validate inputs
validate_inputs() {
    if [[ -z "$APP_NAME" ]]; then
        print_error "Application name is required"
        return 1
    fi

    if [[ -z "$APP_PATH" ]] || [[ ! -d "$APP_PATH" ]]; then
        print_error "Valid application path is required"
        return 1
    fi

    if [[ "$PHP_VERSION" != "7.4" ]] && [[ "$PHP_VERSION" != "8.4" ]]; then
        print_error "PHP version must be 7.4 or 8.4"
        return 1
    fi

    if [[ "$APP_TYPE" != "codeigniter" ]] && [[ "$APP_TYPE" != "laravel" ]] && [[ "$APP_TYPE" != "wordpress" ]] && [[ "$APP_TYPE" != "basic" ]]; then
        print_error "Application type must be: codeigniter, laravel, wordpress, or basic"
        return 1
    fi

    return 0
}

# Function to create symbolic link
create_symbolic_link() {
    local php_dir="php${PHP_VERSION//.}"
    local target_dir="$WWW_ROOT/$php_dir/$APP_NAME"

    print_info "Creating symbolic link..."

    # Create PHP version directory if it doesn't exist
    if [[ ! -d "$WWW_ROOT/$php_dir" ]]; then
        sudo mkdir -p "$WWW_ROOT/$php_dir"
        print_success "Created directory: $WWW_ROOT/$php_dir"
    fi

    # Remove existing link if it exists
    if [[ -L "$target_dir" ]] || [[ -e "$target_dir" ]]; then
        print_warning "Removing existing: $target_dir"
        sudo rm -rf "$target_dir"
    fi

    # Create symbolic link
    sudo ln -s "$APP_PATH" "$target_dir"

    if [[ $? -eq 0 ]]; then
        print_success "Symbolic link created: $target_dir -> $APP_PATH"
        return 0
    else
        print_error "Failed to create symbolic link"
        return 1
    fi
}

# Function to generate directory configuration
generate_directory_config() {
    local php_dir="php${PHP_VERSION//.}"
    local php_port

    if [[ "$PHP_VERSION" == "7.4" ]]; then
        php_port="9074"
    else
        php_port="9000"
    fi

    case "$APP_TYPE" in
        "codeigniter")
            cat << EOF

    # $APP_NAME - CodeIgniter Application
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME">
        AllowOverride All
        Require all granted
        Options +FollowSymLinks -Indexes
        DirectoryIndex index.php

        # Enable rewrite engine for CodeIgniter
        RewriteEngine On
        RewriteBase /$APP_NAME/

        # CodeIgniter specific rules
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond \$1 !^(index\.php|assets|install|update)
        RewriteRule ^(.*)\$ index.php/\$1 [NC,L,QSA]
    </Directory>

    # Security: Prevent access to system and application folders
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME/system">
        Require all denied
    </Directory>

    <Directory "$WWW_ROOT/$php_dir/$APP_NAME/application">
        Require all denied
    </Directory>

    # Allow access to application assets if they exist
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME/assets">
        AllowOverride None
        Require all granted
    </Directory>
EOF
            ;;
        "laravel")
            cat << EOF

    # $APP_NAME - Laravel Application
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME">
        AllowOverride All
        Require all granted
        Options +FollowSymLinks -Indexes
        DirectoryIndex index.php

        # Laravel specific rules
        RewriteEngine On
        RewriteBase /$APP_NAME/

        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)\$ index.php [L]
    </Directory>
EOF
            ;;
        "wordpress")
            cat << EOF

    # $APP_NAME - WordPress Application
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME">
        AllowOverride All
        Require all granted
        Options +FollowSymLinks -Indexes
        DirectoryIndex index.php

        # WordPress specific security
        <Files "wp-config.php">
            Require all denied
        </Files>
    </Directory>
EOF
            ;;
        "basic")
            cat << EOF

    # $APP_NAME - Basic PHP Application
    <Directory "$WWW_ROOT/$php_dir/$APP_NAME">
        AllowOverride All
        Require all granted
        Options +FollowSymLinks -Indexes
        DirectoryIndex index.php index.html
    </Directory>
EOF
            ;;
    esac
}

# Function to add virtual host configuration
add_virtual_host_config() {
    local php_dir="php${PHP_VERSION//.}"

    print_info "Adding virtual host configuration..."

    # Backup current configuration
    sudo cp "$APACHE_VHOSTS_CONF" "${APACHE_VHOSTS_CONF}.backup-$(date +%Y%m%d-%H%M%S)"
    print_success "Backup created: ${APACHE_VHOSTS_CONF}.backup-$(date +%Y%m%d-%H%M%S)"

    # Find the virtual host section for the PHP version
    local vhost_pattern
    if [[ "$PHP_VERSION" == "7.4" ]]; then
        vhost_pattern="ServerName php74.localhost"
    else
        vhost_pattern="ServerName php84.localhost"
    fi

    # Generate the directory configuration
    local dir_config
    dir_config=$(generate_directory_config)

    # Create a temporary file with the new configuration
    local temp_file=$(mktemp)
    local inside_vhost=false
    local config_added=false

    while IFS= read -r line; do
        echo "$line" >> "$temp_file"

        # Check if we're entering the correct virtual host
        if [[ "$line" == *"$vhost_pattern"* ]]; then
            inside_vhost=true
        fi

        # Check if we're exiting a virtual host
        if [[ "$line" == *"</VirtualHost>"* ]] && [[ "$inside_vhost" == true ]]; then
            if [[ "$config_added" == false ]]; then
                echo "$dir_config" >> "$temp_file"
                config_added=true
            fi
            inside_vhost=false
        fi
    done < "$APACHE_VHOSTS_CONF"

    # Replace the original file
    sudo cp "$temp_file" "$APACHE_VHOSTS_CONF"
    rm "$temp_file"

    if [[ "$config_added" == true ]]; then
        print_success "Virtual host configuration added"
        return 0
    else
        print_error "Failed to add virtual host configuration"
        return 1
    fi
}

# Function to configure application
configure_application() {
    local php_dir="php${PHP_VERSION//.}"
    local base_url="http://php${PHP_VERSION//.}.localhost:8080/$APP_NAME/"

    print_info "Configuring application..."

    case "$APP_TYPE" in
        "codeigniter")
            local config_file="$APP_PATH/application/config/config.php"
            local htaccess_file="$APP_PATH/.htaccess"

            if [[ -f "$config_file" ]]; then
                # Update base_url
                sudo sed -i.bak "s|\$config\['base_url'\] = .*|\$config['base_url'] = '$base_url';|" "$config_file"
                # Remove index.php
                sudo sed -i.bak "s|\$config\['index_page'\] = .*|\$config['index_page'] = '';|" "$config_file"
                print_success "Updated CodeIgniter config.php"
            fi

            if [[ -f "$htaccess_file" ]]; then
                # Update RewriteBase
                sudo sed -i.bak "s|RewriteBase .*|RewriteBase /$APP_NAME/|" "$htaccess_file"
                print_success "Updated .htaccess"
            fi
            ;;
        "laravel")
            local env_file="$APP_PATH/.env"

            if [[ -f "$env_file" ]]; then
                sudo sed -i.bak "s|APP_URL=.*|APP_URL=$base_url|" "$env_file"
                print_success "Updated Laravel .env file"
            fi
            ;;
    esac
}

# Function to test configuration and restart Apache
test_and_restart() {
    print_info "Testing Apache configuration..."

    if httpd -t > /dev/null 2>&1; then
        print_success "Apache configuration is valid"
    else
        print_error "Apache configuration has errors:"
        httpd -t
        return 1
    fi

    print_info "Restarting Apache..."
    if sudo brew services restart httpd > /dev/null 2>&1; then
        print_success "Apache restarted successfully"
    else
        print_error "Failed to restart Apache"
        return 1
    fi

    return 0
}

# Function to test application
test_application() {
    local php_dir="php${PHP_VERSION//.}"
    local test_url="http://php${PHP_VERSION//.}.localhost:8080/$APP_NAME/"

    print_info "Testing application accessibility..."

    # Wait a moment for Apache to fully restart
    sleep 2

    local response_code
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$test_url")

    if [[ "$response_code" == "200" ]] || [[ "$response_code" == "302" ]]; then
        print_success "Application is accessible at: $test_url"
        print_success "HTTP Response Code: $response_code"
    else
        print_warning "Application may have issues. HTTP Response Code: $response_code"
        print_info "URL: $test_url"
        print_info "Check Apache error logs if needed:"
        print_info "  tail -f /opt/homebrew/var/log/httpd/php${PHP_VERSION//.}_error.log"
    fi
}

# Function to display usage
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
  -n, --name NAME          Application name (required)
  -p, --path PATH          Path to application directory (required)
  -v, --php-version VER    PHP version: 7.4 or 8.4 (required)
  -t, --type TYPE          Application type: codeigniter, laravel, wordpress, basic (required)
  -h, --help               Show this help message

Examples:
  $0 -n myapp -p /path/to/myapp -v 7.4 -t codeigniter
  $0 --name myapp --path /path/to/myapp --php-version 8.4 --type laravel

Supported Application Types:
  - codeigniter: CodeIgniter 3.x framework
  - laravel:     Laravel framework
  - wordpress:   WordPress CMS
  - basic:       Basic PHP application

Target URLs:
  - PHP 7.4 apps: http://php74.localhost:8080/APP_NAME/
  - PHP 8.4 apps: http://php84.localhost:8080/APP_NAME/
EOF
}

# Main script
main() {
    print_header "Apache Multi-App Configuration Script"

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -n|--name)
                APP_NAME="$2"
                shift 2
                ;;
            -p|--path)
                APP_PATH="$2"
                shift 2
                ;;
            -v|--php-version)
                PHP_VERSION="$2"
                shift 2
                ;;
            -t|--type)
                APP_TYPE="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # Validate inputs
    if ! validate_inputs; then
        print_error "Invalid inputs provided"
        show_usage
        exit 1
    fi

    # Display configuration summary
    print_info "Configuration Summary:"
    echo "  Application Name: $APP_NAME"
    echo "  Application Path: $APP_PATH"
    echo "  PHP Version: $PHP_VERSION"
    echo "  Application Type: $APP_TYPE"
    echo "  Target URL: http://php${PHP_VERSION//.}.localhost:8080/$APP_NAME/"
    echo ""

    # Confirm before proceeding
    read -p "Proceed with configuration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Configuration cancelled"
        exit 0
    fi

    # Execute configuration steps
    if create_symbolic_link && \
       add_virtual_host_config && \
       configure_application && \
       test_and_restart; then

        print_success "Application configuration completed successfully!"
        echo ""
        test_application
        echo ""
        print_success "🎉 Your application is ready!"
        print_info "Access it at: http://php${PHP_VERSION//.}.localhost:8080/$APP_NAME/"
    else
        print_error "Configuration failed. Please check the errors above."
        exit 1
    fi
}

# Run main function
main "$@"
