import qrcode
import urllib.parse

base_url = "https://yaoyao-customer.web.app/?page=menu&store="


stores = ["台北店", "測試店", "淡水店", "芝山店"]

for store in stores:
    encoded_store = urllib.parse.quote(store)
    url = base_url + encoded_store
    img = qrcode.make(url)
    img.save(f"{store}_QRCode.png")

print("✅ 所有 QRCode 圖片已產生！")
