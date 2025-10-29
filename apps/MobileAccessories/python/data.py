from woocommerce import API
import csv

# WooCommerce API credentials
wcapi = API(
    url="https://akmobilestore.com",
    consumer_key="ck_b113b984c30490ce929c4d0f8987df2fe1477a9b",
    consumer_secret="cs_8b6aea268a18d9271841ff8c99f80c92629a49f2",
    version="wc/v3",
    timeout=60
)


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

        if not response or "data" in response:  # no more results OR API error
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
        writer.writerow(["ProductID", "Name", "CategoryID", "Price", "ImageURL"])

        for product in products:
            product_id = product["id"]
            base_name = product["name"]

            # Take only first category ID (if exists)
            category_id = str(product["categories"][0]["id"]) if product["categories"] else ""

            # Handle simple products
            if product["type"] != "variable":
                price = product["price"]

                # Online image URL
                image_url = product["images"][0]["src"] if product["images"] else ""

                writer.writerow([product_id, base_name, category_id, price, image_url])

            # Handle variable products
            else:
                variations = fetch_all(f"products/{product_id}/variations")

                for variation in variations:
                    var_id = variation["id"]
                    var_name = base_name

                    # Append attributes (size, color, etc.)
                    attr_parts = [attr["option"] for attr in variation["attributes"]]
                    if attr_parts:
                        var_name += " - " + " / ".join(attr_parts)

                    price = variation["price"]

                    # Online image URL (variation first, fallback to parent)
                    if variation.get("image"):
                        image_url = variation["image"]["src"]
                    elif product["images"]:
                        image_url = product["images"][0]["src"]
                    else:
                        image_url = ""

                    writer.writerow([var_id, var_name, category_id, price, image_url])

    print(f"✅ Exported {len(products)} products (with variations) to products.csv")
else:
    print("⚠️ No products fetched.")

print("🎉 Export complete! Categories and products saved (with first category only).")
