import { ItemView, WorkspaceLeaf, IconName, setIcon } from 'obsidian';
import { Chart, registerables } from 'chart.js';
import { LevelData } from './types';

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
                // Avoid infinite loop if render changes size
                // Simple debounce or check if width changed significantly could be added
                // For now, straight re-render to support "dynamic expansion"
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

        // Layout: Use CSS Grid or Flexbox logic here via standard DOM
        // 1. Profile Section
        const profileSection = container.createEl('div', { cls: 'dashboard-profile' });
        this.renderProfile(profileSection);

        // 2. Heatmap Section
        container.createEl('h3', { text: 'Activity Heatmap' });
        const heatmapSection = container.createEl('div', { cls: 'dashboard-heatmap' });
        this.renderHeatmap(heatmapSection);

        // 3. Charts Section
        container.createEl('h3', { text: 'XP Trend (Last 30 Days)' });
        const chartContainer = container.createEl('div', { cls: 'dashboard-chart' });
        this.renderChart(chartContainer);
    }

    renderProfile(el: HTMLElement) {
        // Wrapper for Info (Level, Stats, Bar) and Avatar
        // Layout: [ Info (flex-grow) ] [ Avatar (fixed) ]
        // Info Layout:
        //  [ Level ]
        //  [ Stats Row (XP, Streak) ]
        //  [ Progress Bar ]

        const infoContainer = el.createEl('div', { cls: 'profile-info' });

        const header = infoContainer.createEl('div', { cls: 'profile-header' });
        header.createEl('h2', { text: `Level ${this.data.level}` });

        const statsRow = infoContainer.createEl('div', { cls: 'profile-stats-row' });
        statsRow.createEl('span', { text: `Total XP: ${this.data.totalXp}` });
        statsRow.createEl('span', { cls: 'separator', text: ' | ' }); // Visual separator that can be hidden via CSS if wrapped needed? Actually flex gap is better.
        statsRow.createEl('span', { text: `Streak: ${this.data.streak} days` });

        // Progress Bar
        const progressContainer = infoContainer.createEl('div', { cls: 'progress-container' });
        const percent = Math.min(100, Math.floor((this.data.currentXp / this.data.nextLevelXp) * 100));
        progressContainer.createEl('div', { cls: 'progress-bar-bg' })
            .createEl('div', {
                cls: 'progress-bar-fill',
                attr: { style: `width: ${percent}%` }
            });
        progressContainer.createEl('small', { text: `${this.data.currentXp} / ${this.data.nextLevelXp} XP` });
    }

    renderHeatmap(el: HTMLElement) {
        const containerWidth = el.innerWidth || el.clientWidth || 300; // Fallback width
        const itemSize = 14; // 12px width + 2px gap
        // Calculate how many items fit in the container width
        // We only want one row for simplicity as per "heatmap line" style request or multi-row?
        // Wait, typical heatmap is 7 days vertical.
        // Assuming user wants single horizontal line or standard grid?
        // User said "heatmap", usually means 7 rows x N cols.
        // Let's implement standard 7-row heatmap that fits width.

        const cols = Math.floor(containerWidth / itemSize);
        const daysToRender = cols * 7;

        // Re-create grid logic
        const grid = el.createEl('div', { cls: 'heatmap-grid' });
        // Override CSS to ensure grid layout
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 12px)`;
        grid.style.gridTemplateRows = 'repeat(7, 12px)';
        grid.style.gap = '2px';
        grid.style.justifyContent = 'end'; // Align to right

        const today = new Date();
        // Adjust start date to align columns correctly (so today is at the bottom right)
        // Today is:
        const currentDayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)

        // We render 'cols' columns. The last column contains 'today'.
        // To fill the grid from top-left to bottom-right (standard GitHub style),
        // we usually go column by column.

        // Actually, simpler approach for "fitting width":
        // Just render N boxes from Left to Right?
        // No, GitHub style is Vertical (Day of week) x Horizontal (Week).

        // Let's render (cols * 7) days, but we need to offset so "today" is the last cell?
        // Actually, usually "Today" is in the last column, at the correct DayOfWeek position.

        // Total cells to attempt to fill = cols * 7
        // But we want the last cell to be roughly "Today".

        // Logic:
        // 1. Determine End Date = Today
        // 2. Determine Start Date = Today - (cols * 7) + (adjustment for week alignment?)

        // Let's simplify: Just render rects for the last N days where N fits.
        // If users wants "Heatmap", they usually expect the grid.

        // Column-major order (standard contribution graph) is hard with simple div loop unless we use grid-auto-flow: column;
        grid.style.gridAutoFlow = 'column';

        for (let i = daysToRender - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            // If we want alignment such that the last column ends on "Today" (which might be Wednesday),
            // and we rely on grid-auto-flow: column, we might need padding cells at the start?
            // Unnecessary complexity for Phase 1. 
            // Let's just render the last 'daysToRender' days.
            // It will fill columns 1..N. The last cell will be at bottom-right only if count is perfect multiple of 7.

            // To make sure Today is at the correct position relative to the week:
            // GitHub graph: Rows are Mon, Tue, Wed...
            // "Today" is Wed. So it should be in the 3rd row of the last column.

            // Let's try to just render a simple stream of boxes for now, as aligning contribution graph perfectly requires more math.
            // Or better: Use CSS Grid with 7 rows, and let CSS handle the flow.

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
                animation: false // Disable animation for smoother updates
            }
        });
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
