---
description: How to develop a new feature for Obsidian Level Up
---

1. Create a new branch for the feature `git checkout -b feature/[feature-name]`
2. Implement your changes
// turbo
3. Build the plugin `npm run build`
// turbo
4. Run tests `npm test`
// turbo
5. Deploy to test vault `.\sync-plugin.bat`
6. Verify manually if needed
7. Commit and Push changes
8. Create PR and Merge
