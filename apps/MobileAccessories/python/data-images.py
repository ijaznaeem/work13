from woocommerce import API
import csv
import requests
import os

# WooCommerce API credentials
wcapi = API(
    url="https://akmobilestore.com",
    consumer_key="ck_b113b984c30490ce929c4d0f8987df2fe1477a9b",
    consumer_secret="cs_8b6aea268a18d9271841ff8c99f80c92629a49f2",
    version="wc/v3",
    timeout=60
)

# Create output directory for images
os.makedirs("product_images", exist_ok=True)


# =====================
# Helper function for pagination
# =====================
def fetch_all(endpoint, per_page=100):
    """Fetch all records from WooCommerce endpoint with pagination."""
    all_data = []
    page = 1
    while True:
        try:
            response = wcapi.get(endpoint, params={"per_page": per_page, "page": page}).json()
        except Exception as e:
            print(f"❌ Error fetching {endpoint} page {page}: {e}")
            break

        # Stop if no more data or API error
        if not response or "data" in response:
            break

        all_data.extend(response)
        print(f"✅ Fetched {len(response)} records from {endpoint}, page {page}")
        page += 1

    return all_data


# =====================
# Fetch Categories
# =====================
categories = fetch_all("products/categories")

if categories:
    with open("categories.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["CategoryID", "CategoryName", "ParentID"])
        for cat in categories:
            writer.writerow([cat["id"], cat["name"], cat["parent"]])
    print(f"✅ Exported {len(categories)} categories to categories.csv")
else:
    print("⚠️ No categories fetched.")


# =====================
# Fetch Products
# =====================
products = fetch_all("products")

if products:
    with open("products.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["ProductID", "Name", "CategoryIDs", "Price", "LocalImageFile"])

        for product in products:
            product_id = product["id"]
            base_name = product["name"]

            # Collect category IDs
            category_ids = [str(cat["id"]) for cat in product["categories"]]
            category_str = ", ".join(category_ids)

            # Handle simple products
            if product["type"] != "variable":
                price = product["price"]

                # Image
                local_image_file = ""
                if product["images"]:
                    image_url = product["images"][0]["src"]
                    image_file = f"{product_id}_{os.path.basename(image_url.split('?')[0])}"
                    local_image_file = image_file
                    try:
                        img_data = requests.get(image_url, timeout=30).content
                        with open(os.path.join("product_images", image_file), "wb") as img_file:
                            img_file.write(img_data)
                    except Exception as e:
                        print(f"⚠️ Failed to download {image_url}: {e}")

                writer.writerow([product_id, base_name, category_str, price, local_image_file])

            # Handle variable products
            else:
                variations = fetch_all(f"products/{product_id}/variations")
                
                for variation in variations:
                    var_id = variation["id"]
                    var_name = base_name

                    # Append attributes
                    attr_parts = [attr["option"] for attr in variation["attributes"]]
                    if attr_parts:
                        var_name += " - " + " / ".join(attr_parts)

                    price = variation["price"]

                    # Image (variation image > product image)
                    local_image_file = ""
                    if variation.get("image"):
                        image_url = variation["image"]["src"]
                    elif product["images"]:
                        image_url = product["images"][0]["src"]
                    else:
                        image_url = ""

                    if image_url:
                        image_file = f"{var_id}_{os.path.basename(image_url.split('?')[0])}"
                        local_image_file = image_file
                        try:
                            img_data = requests.get(image_url, timeout=30).content
                            with open(os.path.join("product_images", image_file), "wb") as img_file:
                                img_file.write(img_data)
                        except Exception as e:
                            print(f"⚠️ Failed to download {image_url}: {e}")

                    writer.writerow([var_id, var_name, category_str, price, local_image_file])

    print(f"✅ Exported {len(products)} products (with variations) to products.csv")
else:
    print("⚠️ No products fetched.")

print("🎉 Export process complete! Categories, products, and images saved.")
