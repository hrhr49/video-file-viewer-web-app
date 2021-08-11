# video-file-viewer-web-app
video file browser web app

## 準備

`.env` ファイルをリポジトリのルートディレクトリ内に作る。
以下に例を記載する。
それぞれの変数は、ユーザー側で適当に設定する。

```
# mp4ファイルをおいているディレクトリ
SERVE_DIR=/home/hrhr49/Videos/

# ファイルをサーブするhttp-serverが使うポート番号
FILE_SERVER_PORT=8125

# ブラウザでアクセスするときのポート番号
FRONTEND_PORT=8931
```

## 実行

```
yarn start
```

## 注意

サーブするディレクトリ内に、
サムネイル画像や、ファイル一覧の情報をまとめたJSONファイルが
たくさん作成されてしまうので注意。
