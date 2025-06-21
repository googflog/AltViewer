# Alt & Meta viewer

### Chrome 機能拡張 Alt & Meta viewer ビューワのデータ

#### デバッグ

`gulp dev`

#### 公開版

`gulp prod`

#### zip ファイルの作成手順

1. manifest.json など拡張機能のファイルが入っているディレクトリに移動します。

```
cd prod
```

2. ディレクトリ内のファイルだけを zip 化します（ディレクトリごとではなく中身のみ！）。

```
zip -r ../extension.zip ./*
```
