import qrcode

url = "https://yaoyao-customer.web.app"
img = qrcode.make(url)
img.save("線上點餐_QRCode.png")

print("✅ 線上點餐 QRCode 已產生！")
