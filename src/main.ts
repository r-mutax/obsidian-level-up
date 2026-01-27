import { Plugin } from 'obsidian';

export default class LevelUpPlugin extends Plugin {
    async onload() {
        console.log('Obsidian Level Up Plugin loaded');
    }

    async onunload() {
        console.log('Obsidian Level Up Plugin unloaded');
    }
}
