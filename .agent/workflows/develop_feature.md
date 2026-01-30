---
description: Obsidian Level Up の新機能を開発する手順
---

1. **詳細仕様の策定（Discussion）**
   - 対象のIssueについて、詳細な実装仕様や設計方針をユーザーと議論する。
   - 決定事項をまとめる。

2. **Issueへの仕様反映**
   - 議論の結果をIssueのコメントとして投稿する。
// turbo
   - `gh issue comment [Issue番号] --body "### Detailed Specification\n\n[Summary of discussion]"`

3. 機能ごとのブランチを作成する `git checkout -b feature/[feature-name]`
4. 変更を実装する
// turbo
5. プラグインをビルドする `npm run build`
// turbo
6. テストを実行する `npm test`
// turbo
7. テスト用Vaultにデプロイする `.\sync-plugin.bat`
8. 手動検証を行う（必要な場合）
// turbo
9. 変更をコミットしてプッシュする
    - `git add .`
    - `git commit -m "feat: [feature description]"`
    - `git push -u origin feature/[feature-name]`
// turbo
10. PRを作成する
    - `gh pr create ...`
11. ユーザーにPRの確認を依頼する（マージはユーザーが行う）
