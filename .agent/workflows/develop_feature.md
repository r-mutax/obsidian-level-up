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
3. プラグインをビルドする `npm run build`
// turbo
4. テストを実行する `npm test`
// turbo
5. テスト用Vaultにデプロイする `.\sync-plugin.bat`
6. 手動検証を行う（必要な場合）
// turbo
7. 変更をコミットしてプッシュする
    - `git add .`
    - `git commit -m "feat: [feature description]"`
    - `git push -u origin feature/[feature-name]`
// turbo
8. PRを作成する
    - `gh pr create ...`
9. ユーザーにPRの確認を依頼する（マージはユーザーが行う）
