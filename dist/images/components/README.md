# 組件示例圖片說明

這個目錄用於存放各種電力組件的示例圖片。

## 圖片規格建議

- **尺寸**: 64x64 像素或更大（建議使用 SVG 格式以保證縮放質量）
- **格式**: PNG（透明背景）、SVG、JPG
- **命名**: 使用組件 ID 作為文件名，例如 `power.png`、`transformer.svg`

## 組件圖片文件列表

請將以下組件的示例圖片放置在此目錄：

### 電源類組件
- `power.png` - 市電圖標
- `diesel-generator.png` - 柴油發電機圖標
- `solar.png` - 光伏圖標
- `wind.png` - 風機圖標
- `ups.png` - UPS 圖標

### 變換類組件
- `transformer.png` - 變壓器圖標

### 傳輸類組件
- `busbar.png` - 母線圖標
- `line.png` - 線路圖標
- `connection-line.png` - 連接線路圖標

### 控制類組件
- `switch.png` - 開關圖標
- `atse.png` - ATSE 圖標
- `sts.png` - STS 圖標

### 儲能類組件
- `storage.png` - 儲能圖標

### 補償類組件
- `reactive-compensator.png` - 無功補償器圖標

### 負載類組件
- `load.png` - 負荷圖標

## 使用方法

1. 將圖片文件放置在 `public/images/components/` 目錄
2. 在 `src/config/components.js` 中更新對應組件的 `image` 屬性
3. 例如: `image: '/images/components/power.png'`

## 臨時使用網絡圖片

在準備好實際圖片之前，也可以使用網絡圖片 URL：

```javascript
{
  id: 'power',
  name: '市電',
  type: 'power',
  icon: '🔌',
  image: 'https://example.com/power-icon.png',
  // ...
}
```

## 注意事項

1. 使用 `public` 目錄中的圖片時，路徑應以 `/` 開頭
2. 圖片應該有清晰的輪廓，便於在小尺寸下識別
3. 建議使用透明背景的 PNG 或 SVG 格式
4. 如果圖片加載失敗，系統會自動回退到顯示圖標（emoji）

