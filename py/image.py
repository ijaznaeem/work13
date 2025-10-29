import os
import requests
import zipfile

# List of image URLs
image_urls = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1606755962773-d324e5ece7b5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop"
]

# Create a folder for images
os.makedirs("menu_images", exist_ok=True)

# Download images
image_files = []
for idx, url in enumerate(image_urls, start=1):
    file_path = f"menu_images/image_{idx}.jpg"
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, "wb") as f:
            f.write(response.content)
        image_files.append(file_path)

# Create a ZIP file
zip_path = "menu_images.zip"
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for file in image_files:
        zipf.write(file, os.path.basename(file))

print(f"ZIP file created: {zip_path}")

