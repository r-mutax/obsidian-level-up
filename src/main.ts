import { Plugin, TFile, Editor, MarkdownView, Notice } from 'obsidian';
import { LevelData, DEFAULT_DATA, GamificationSettings, DEFAULT_SETTINGS } from './types';
import { addXp, updateStreak } from './gamification';

export default class LevelUpPlugin extends Plugin {
    data: LevelData;
    settings: GamificationSettings;

    async onload() {
        console.log('Obsidian Level Up Plugin loaded');

        await this.loadPluginData();

        // 3. ストリーク（ログインボーナス）チェック
        this.checkStreak();

        // 1. ノート作成イベント
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile) {
                    this.gainXp(this.settings.xpPerNote, `Note Created: ${file.name}`);
                }
            })
        );

        // 2. テキスト変更イベント (editor-change)
        // 頻繁に発火するため、本来はデバウンスが必要だが、まずは文字数ベースの簡易実装
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor, view: MarkdownView) => {
                // ここでは簡易的に「1変更アクション = 1文字分」として扱う
                // 本格的には変更差分を取る必要があるが、まずはアクションに対して付与
                this.gainXp(this.settings.xpPerChar, 'Typing...');
            })
        );
    }

    async onunload() {
        console.log('Obsidian Level Up Plugin unloaded');
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
            // Streak updated
            this.data = result.data;
            if (this.settings.debug) {
                console.log(`[LevelUp] Streak updated: ${this.data.streak} days`);
            }
            if (result.gainedXp > 0) {
                this.gainXp(result.gainedXp, 'Daily Streak Bonus');
            } else {
                this.savePluginData();
            }

            // Notify streak
            new Notice(`Daily Streak: ${this.data.streak} Days!`);
        } else {
            if (this.settings.debug) {
                console.log(`[LevelUp] Streak already checked for today: ${this.data.streak} days`);
            }
        }
    }
}

