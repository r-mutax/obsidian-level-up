@echo off
set DEST="C:\temp\obsidian-level-up\.obsidian\plugins\obsidian-level-up"

if not exist %DEST% mkdir %DEST%

copy /Y main.js %DEST%\main.js
copy /Y manifest.json %DEST%\manifest.json
copy /Y styles.css %DEST%\styles.css

echo Plugin synced to %DEST%
