import { Plugin, TFile, Editor, MarkdownView, Notice, PluginSettingTab, App, Setting } from 'obsidian';
import { LevelData, DEFAULT_DATA, GamificationSettings, DEFAULT_SETTINGS } from './types';
import { addXp, updateStreak } from './gamification';

export default class LevelUpPlugin extends Plugin {
    data: LevelData;
    settings: GamificationSettings;
    statusBarItem: HTMLElement;
    linkCounts: Map<string, number> = new Map();
    // Reading Time
    lastUserActionTime: number = Date.now();
    readingTimer: number;

    async onload() {
        console.log('Obsidian Level Up Plugin loaded');

        await this.loadPluginData();

        // 1. UI初期化
        this.statusBarItem = this.addStatusBarItem();
        this.updateStatusBar();
        this.addSettingTab(new LevelUpSettingTab(this.app, this));

        // 2. ストリークチェック
        this.checkStreak();

        // 3. Phase 0: リンク監視
        this.app.workspace.onLayoutReady(() => {
            this.initializeLinkCounts();
        });

        this.registerEvent(
            this.app.metadataCache.on('changed', (file) => {
                this.checkLinkGrowth(file);
            })
        );

        // 4. Phase 0: 閲覧時間
        this.registerDomEvent(document, 'mousemove', () => { this.lastUserActionTime = Date.now(); });
        this.registerDomEvent(document, 'keydown', () => { this.lastUserActionTime = Date.now(); });

        this.readingTimer = window.setInterval(() => {
            this.checkReadingTime();
        }, 60 * 1000);
        this.registerInterval(this.readingTimer);

        // 5. 基本イベント (作成、編集)
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile) {
                    if (this.isExcluded(file.path)) return; // 除外判定
                    this.gainXp(this.settings.xpPerNote, `Note Created: ${file.name}`);
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor, view: MarkdownView) => {
                if (view.file && this.isExcluded(view.file.path)) return; // 除外判定
                this.gainXp(this.settings.xpPerChar, 'Typing...');
            })
        );
    }

    async onunload() {
        console.log('Obsidian Level Up Plugin unloaded');
        window.clearInterval(this.readingTimer);
    }

    async loadPluginData() {
        const loaded = await this.loadData();
        this.data = Object.assign({}, DEFAULT_DATA, loaded?.data);
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded?.settings);
    }

    async savePluginData() {
        await this.saveData({
            data: this.data,
            settings: this.settings
        });
        this.updateStatusBar();
    }

    updateStatusBar() {
        if (this.statusBarItem) {
            this.statusBarItem.setText(`Lv.${this.data.level} | XP: ${this.data.currentXp}/${this.data.nextLevelXp}`);
        }
    }

    initializeLinkCounts() {
        this.app.vault.getMarkdownFiles().forEach(file => {
            if (this.isExcluded(file.path)) return; // 除外判定
            const cache = this.app.metadataCache.getFileCache(file);
            const count = cache?.links?.length || 0;
            this.linkCounts.set(file.path, count);
        });
    }

    checkLinkGrowth(file: TFile) {
        if (!(file instanceof TFile)) return;
        if (this.isExcluded(file.path)) return; // 除外判定

        const cache = this.app.metadataCache.getFileCache(file);
        const newCount = cache?.links?.length || 0;
        const oldCount = this.linkCounts.get(file.path) || 0;

        if (newCount > oldCount) {
            const diff = newCount - oldCount;
            const xp = diff * this.settings.xpPerLink;
            this.gainXp(xp, `Link Added: +${diff}`);
        }
        this.linkCounts.set(file.path, newCount);
    }

    checkReadingTime() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;
        if (this.isExcluded(activeFile.path)) return; // 除外判定

        const now = Date.now();
        const timeDiff = now - this.lastUserActionTime;

        if (timeDiff < 90 * 1000) {
            this.gainXp(this.settings.xpPerMinuteReading, 'Reading Time (1 min)');
        }
    }

    gainXp(amount: number, reason: string) {
        const result = addXp(this.data, amount);
        this.data = result.data;

        if (this.settings.debug) {
            console.log(`[LevelUp] Gained ${amount} XP (${reason}). Total: ${this.data.currentXp}/${this.data.nextLevelXp}`);
        }

        if (result.leveledUp) {
            new Notice(`Level Up! You are now Level ${this.data.level}!`);
        }

        this.savePluginData();
    }

    checkStreak() {
        const today = new Date().toISOString().split('T')[0];
        const result = updateStreak(this.data, today);

        if (result.streakChanged) {
            this.data = result.data;
            if (result.gainedXp > 0) {
                this.gainXp(result.gainedXp, 'Daily Streak Bonus');
            } else {
                this.savePluginData();
            }
            new Notice(`Daily Streak: ${this.data.streak} Days!`);
        }
    }

    // Phase 1: 除外判定ロジック
    isExcluded(filePath: string): boolean {
        if (!this.settings.excludedFolders) return false;

        const excludedList = this.settings.excludedFolders
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const excluded of excludedList) {
            if (filePath.startsWith(excluded)) {
                if (this.settings.debug) console.log(`[LevelUp] Excluded: ${filePath}`);
                return true;
            }
        }
        return false;
    }
}

class LevelUpSettingTab extends PluginSettingTab {
    plugin: LevelUpPlugin;

    constructor(app: App, plugin: LevelUpPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Level Up Settings' });

        new Setting(containerEl)
            .setName('XP per Character')
            .setDesc('How much XP you get for writing one character.')
            .addText(text => text
                .setPlaceholder('1')
                .setValue(String(this.plugin.settings.xpPerChar))
                .onChange(async (value) => {
                    this.plugin.settings.xpPerChar = Number(value);
                    await this.plugin.savePluginData();
                }));

        new Setting(containerEl)
            .setName('Excluded Folders')
            .setDesc('Enter one folder path per line. Notes starting with these paths will not award XP.')
            .addTextArea(text => text
                .setPlaceholder('Templates\nArchive')
                .setValue(this.plugin.settings.excludedFolders)
                .onChange(async (value) => {
                    this.plugin.settings.excludedFolders = value;
                    await this.plugin.savePluginData();
                }));

        new Setting(containerEl)
            .setName('Debug Mode')
            .setDesc('Enable debug logs in console.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.debug)
                .onChange(async (value) => {
                    this.plugin.settings.debug = value;
                    await this.plugin.savePluginData();
                }));
    }
}
