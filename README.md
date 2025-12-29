<!-- This file is intentionally left minimal to allow index.html to be served by GitHub Pages -->

## デプロイ方法

このサイトはGitHub Pagesでホスティングされています。

### GitHub Pagesでのデプロイ手順

1. **GitHubリポジトリを作成**
   - GitHubにログイン
   - 新しいリポジトリを作成（例: `kiban-website`）
   - リポジトリを公開（Public）に設定

2. **ファイルをアップロード**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/kiban-website.git
   git push -u origin main
   ```

3. **GitHub Pagesを有効化**
   - リポジトリの「Settings」タブを開く
   - 左メニューから「Pages」を選択
   - 「Source」で「Deploy from a branch」を選択
   - 「Branch」で「main」を選択し、「/ (root)」を選択
   - 「Save」をクリック

4. **サイトにアクセス**
   - 数分後、`https://your-username.github.io/kiban-website/` でアクセス可能になります

## ファイル構成

- `index.html` - メインHTMLファイル
- `styles.css` - スタイルシート
- `script.js` - JavaScriptファイル
- `icon/` - アイコン画像
- `temperate/` - テンプレートアセット

## カスタムドメイン設定（オプション）

カスタムドメインを使用する場合：

1. リポジトリの「Settings」>「Pages」でカスタムドメインを設定
2. DNS設定でCNAMEレコードを追加

