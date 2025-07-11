export const theme = $state({ value: 'light' as 'light' | 'dark' });

const isDark = $derived(() => theme.value === 'dark');
export function getIsDark() {
    return isDark;
}

export function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme.value === 'dark');
        document.documentElement.classList.toggle('light', theme.value === 'light');
    }
}

export function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme;
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme.value === 'dark');
        document.documentElement.classList.toggle('light', theme.value === 'light');
    }
}