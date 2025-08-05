import qrcode

# ✅ 網站的基本網址（你剛剛部署成功的網址）
base_url = "https://yaoyaoproject-88907.web.app/?page=confirm&store="

# ✅ 分店清單（你可以自行新增）
stores = ["台北店", "高雄店", "淡水店", "台中店"]

# ✅ 產生每一間分店的 QRCode 圖檔
for store in stores:
    url = base_url + store
    img = qrcode.make(url)
    img.save(f"{store}_QRCode.png")

print("✅ 所有 QRCode 圖片已產生！")
