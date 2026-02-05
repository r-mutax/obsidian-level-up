import { ItemView, WorkspaceLeaf, IconName, setIcon } from 'obsidian';
import { Chart, registerables } from 'chart.js';
import { LevelData } from './types';
import { BADGES } from './achievements';
import { getTitle, getNextTitle } from './titles';

Chart.register(...registerables);

export const VIEW_TYPE_DASHBOARD = 'level-up-dashboard';

export class DashboardView extends ItemView {
    data: LevelData;
    chart: Chart | null = null;
    resizeObserver: ResizeObserver;

    constructor(leaf: WorkspaceLeaf, data: LevelData) {
        super(leaf);
        this.data = data;
    }

    getViewType(): string {
        return VIEW_TYPE_DASHBOARD;
    }

    getDisplayText(): string {
        return 'Level Up Dashboard';
    }

    getIcon(): IconName {
        return 'bar-chart-2';
    }

    async onOpen() {
        this.render();

        // Auto-refresh when container resizes
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.render();
            }
        });

        // Use the parent content element for observing width changes
        this.resizeObserver.observe(this.containerEl);
    }

    refresh(newData?: LevelData) {
        if (newData) {
            this.data = newData;
        }
        this.render();
    }

    render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('level-up-dashboard');

        // 1. Profile Section
        const profileSection = container.createEl('div', { cls: 'dashboard-profile' });
        this.renderProfile(profileSection);

        // 2. Active Quests Section
        container.createEl('h3', { text: '📜 Active Quests' });
        const questsSection = container.createEl('div', { cls: 'dashboard-quests' });
        this.renderQuests(questsSection);

        // 3. Heatmap Section
        container.createEl('h3', { text: 'Activity Heatmap' });
        const heatmapSection = container.createEl('div', { cls: 'dashboard-heatmap' });
        this.renderHeatmap(heatmapSection);

        // 3. Charts Section
        container.createEl('h3', { text: 'XP Trend (Last 30 Days)' });
        const chartContainer = container.createEl('div', { cls: 'dashboard-chart' });
        this.renderChart(chartContainer);

        // 4. Achievements Section
        container.createEl('h3', { text: 'Achievements' });
        const achievementsSection = container.createEl('div', { cls: 'dashboard-achievements' });
        this.renderAchievements(achievementsSection);
    }

    renderQuests(el: HTMLElement) {
        if (!this.data.quests || this.data.quests.length === 0) {
            el.createEl('p', { text: 'No active quests. Check back tomorrow!', cls: 'no-quests' });
            return;
        }

        const list = el.createEl('div', { cls: 'quest-list' });

        for (const quest of this.data.quests) {
            // Only show daily quests for now, or all active ones
            const item = list.createEl('div', { cls: `quest-item ${quest.completed ? 'completed' : ''}` });

            const header = item.createEl('div', { cls: 'quest-header' });
            header.createEl('span', { cls: 'quest-desc', text: quest.description });
            if (quest.completed) {
                header.createEl('span', { cls: 'quest-badge', text: 'CLAIMED' });
            } else {
                header.createEl('span', { cls: 'quest-reward', text: `${quest.rewardXp} XP` });
            }

            // Progress
            if (!quest.completed) {
                const progressContainer = item.createEl('div', { cls: 'quest-progress' });
                const percent = Math.min(100, Math.floor((quest.progress / quest.target) * 100));
                progressContainer.createEl('div', { cls: 'quest-progress-bg' })
                    .createEl('div', {
                        cls: 'quest-progress-fill',
                        attr: { style: `width: ${percent}%` }
                    });
                progressContainer.createEl('small', { text: `${quest.progress} / ${quest.target}` });
            }
        }
    }

    renderProfile(el: HTMLElement) {
        const infoContainer = el.createEl('div', { cls: 'profile-info' });

        // Avatar & Title Section
        const currentTitle = getTitle(this.data.level);
        const nextTitle = getNextTitle(this.data.level);

        const header = infoContainer.createEl('div', { cls: 'profile-header' });
        const titleRow = header.createEl('div', { cls: 'profile-title-row' });
        titleRow.createEl('div', { cls: 'profile-avatar', text: currentTitle.avatar });
        const titleText = titleRow.createEl('div', { cls: 'profile-title-text' });
        titleText.createEl('h2', { text: `Level ${this.data.level}` });
        titleText.createEl('div', { cls: 'profile-rank', text: currentTitle.name });

        const statsRow = infoContainer.createEl('div', { cls: 'profile-stats-row' });
        statsRow.createEl('span', { text: `Total XP: ${this.data.totalXp}` });
        statsRow.createEl('span', { cls: 'separator', text: ' | ' });
        statsRow.createEl('span', { text: `Streak: ${this.data.streak} days` });

        // Progress Bar
        const progressContainer = infoContainer.createEl('div', { cls: 'progress-container' });
        const percent = Math.min(100, Math.floor((this.data.currentXp / this.data.nextLevelXp) * 100));
        progressContainer.createEl('div', { cls: 'progress-bar-bg' })
            .createEl('div', {
                cls: 'progress-bar-fill',
                attr: { style: `width: ${percent}%` }
            });

        let progressText = `${this.data.currentXp} / ${this.data.nextLevelXp} XP`;
        if (nextTitle) {
            progressText += ` (Next Rank: ${nextTitle.name} at Lv.${nextTitle.minLevel})`;
        }
        progressContainer.createEl('small', { text: progressText });
    }

    renderHeatmap(el: HTMLElement) {
        // Use contentEl width to ensure we get the container's available width
        // Subtract padding (approx 40px from styles)
        const availableWidth = this.contentEl.clientWidth - 40;
        const containerWidth = availableWidth > 0 ? availableWidth : 300;
        const itemSize = 14; // 12px width + 2px gap
        const cols = Math.floor(containerWidth / itemSize);
        const daysToRender = cols * 7;

        const grid = el.createEl('div', { cls: 'heatmap-grid' });
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 12px)`;
        grid.style.gridTemplateRows = 'repeat(7, 12px)';
        grid.style.gap = '2px';
        grid.style.justifyContent = 'end';
        grid.style.gridAutoFlow = 'column';

        const today = new Date();

        for (let i = daysToRender - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const xp = this.data.xpHistory?.[dateStr] || 0;

            let colorLevel = 0;
            if (xp > 0) colorLevel = 1;
            if (xp > 50) colorLevel = 2;
            if (xp > 100) colorLevel = 3;
            if (xp > 200) colorLevel = 4;

            grid.createEl('div', {
                cls: `heatmap-cell level-${colorLevel}`,
                title: `${dateStr}: ${xp} XP`
            });
        }
    }

    renderChart(el: HTMLElement) {
        const canvas = el.createEl('canvas');
        canvas.width = 400;
        canvas.height = 200;

        // Last 30 days data
        const labels = [];
        const dataPoints = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            labels.push(dateStr.slice(5)); // MM-DD
            dataPoints.push(this.data.xpHistory?.[dateStr] || 0);
        }

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(canvas as any, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily XP',
                    data: dataPoints,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false
            }
        });
    }

    renderAchievements(el: HTMLElement) {
        const grid = el.createEl('div', { cls: 'achievements-grid' });

        for (const badge of BADGES) {
            const isEarned = this.data.earnedBadges?.includes(badge.id);
            const card = grid.createEl('div', {
                cls: `achievement-card ${isEarned ? 'earned' : 'locked'} ${badge.tier}`,
                attr: { 'title': `${badge.name}\n${badge.description}\n(Bonus: ${badge.bonusXp} XP)` }
            });

            const iconContainer = card.createEl('div', { cls: 'achievement-icon' });
            setIcon(iconContainer, badge.icon);
        }
    }

    async onClose() {
        if (this.chart) {
            this.chart.destroy();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
