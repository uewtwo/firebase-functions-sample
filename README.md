# MiMi API 開発ガイド

## 前提条件
- Node.js v18
- Java Runtime Environment (Firebase Emulator用)
- npm

## プロジェクトのセットアップ
1. Javaのインストール (未インストールの場合)
    ```
    # macOSの場合
    $ brew install openjdk@17
    # シンボリックリンクの作成
    $ sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

    # インストールの確認
    $ java -version
    ```

1. Firebase Toolsのインストール
    ```
    $ curl -sL https://firebase.tools | bash
    $ firebase login # エミュレータ動かすだけならどこにログインしても良い、はず...
    ```

1. プロジェクトのインストール
    ```
    $ git clone git@github.com:uewtwo/firebase-functions-sample.git
    $ cd firebase-functions-sample/functions

    # 依存関係のインストール
    $ npm install
    ```

1. 環境変数の設定
    ```
    $ cp .env.sample .env
    ```

## 開発
### デプロイ
WIP

### エミュレータの起動
```
$ npm run serve
```

`http://127.0.0.1:5001/demo-mimi-api/us-central1/hello` にブラウザでアクセスしてHello, World!が表示されたら成功  
期待されるレスポンス：
```
{
  "message": "Hello, World!"
}
```

### プロジェクト構造
```
functions/
├── src/
│   ├── configs/          # 設定周り
│   ├── functions/        # Functionsの実体
│   ├── handlers/         # 共通ハンドラー
│   ├── libs/             # 共通ライブラリ
│   ├── types/            # 共通型定義
│   ├── utils/            # 共通処理
│   └── index.ts          # エントリーポイント
├── lib/                  # outDir
├── openapi.json          # OpenAPI仕様書
├── package.json
├── tsconfig.json
└── .env
```

### 開発手順
WIP

## トラブルシューティング
### エミュレータが起動しない場合
1. Javaが正しくインストールされているか確認
    ```
    $ java -version
    $ which java
    ```

1. 必要なポートが使用可能か確認
    - 4000: エミュレータUI
    - 5001: Functions
    - 9099: Auth
    - 8080: Firestore

### モジュールが見つからないエラーが出る場合
1. ビルド出力を確認
    ```
    npm run build
    ```

1. libディレクトリの内容を確認
    ```
    ls -R lib/
    ```

1. 必要に応じてlibディレクトリを削除して再ビルド
    ```
    rm -rf lib/
    npm run build
    ```

### その他
- Firebase Emulatorのログはfirebase-debug.logを確認
- Functions固有のログはfunctions-debug.logを確認
- OpenAPI仕様書の生成は `npm run generate-openapi` で実行