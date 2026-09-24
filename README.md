# HyperAimLock

iOS app wrapper chạy web (WKWebView) với toàn bộ tính năng từ source HTML/JS/CSS.

## Build tự động qua GitHub Actions

Sau khi push lên GitHub, workflow sẽ tự động build và xuất file `HyperAimLock-unsigned.ipa`.

### Cách tải IPA sau khi build:
1. Vào tab **Actions** trên GitHub repo
2. Click vào workflow run mới nhất
3. Cuộn xuống **Artifacts** → Click **HyperAimLock-unsigned-ipa** để tải

### Cài đặt lên iPhone (dùng ESign / Sideloadly):
- Dùng **ESign** hoặc **Sideloadly** để ký và cài file IPA
- Bundle ID: `meowiosff`
