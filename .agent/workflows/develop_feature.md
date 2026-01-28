---
description: Obsidian Level Up の新機能を開発する手順
---

1. 機能ごとのブランチを作成する `git checkout -b feature/[feature-name]`
2. 変更を実装する
// turbo
3. プラグインをビルドする `npm run build`
// turbo
4. テストを実行する `npm test`
// turbo
5. テスト用Vaultにデプロイする `.\sync-plugin.bat`
6. 必要に応じて手動検証を行う
7. 変更をコミットしてプッシュする
8. PRを作成し、マージする
