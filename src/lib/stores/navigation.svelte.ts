// src/lib/stores/navigation.svelte.ts
import { browser } from '$app/environment';

type NavigationItem = {
    id: string;
    label: string;
    icon: string;
    href: string;
    badge?: number;
    children?: NavigationItem[];
};

type Portfolio = {
    id: string;
    name: string;
    value: number;
    currency: string;
};

function createNavigationStore() {
    // Sidebar state
    let isOpen = $state(true);
    let isMobile = $state(false);

    // Active states
    let activeItem = $state('dashboard');
    let activePortfolio = $state<Portfolio | null>(null);

    // Search state
    let searchOpen = $state(false);
    let searchQuery = $state('');

    // Notifications
    let notifications = $state<Array<{ id: string; message: string; type: 'info' | 'warning' | 'error' }>>([]);
    let unreadCount = $derived(() => notifications.length);

    // Mock portfolios data
    let portfolios = $state<Portfolio[]>([
        { id: '1', name: 'Main Portfolio', value: 145692.45, currency: 'USD' },
        { id: '2', name: 'DeFi Trading', value: 52340.12, currency: 'USD' },
        { id: '3', name: 'Long Term Hold', value: 89450.78, currency: 'USD' }
    ]);

    // Navigation menu items
    const menuItems: NavigationItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'chart-bar',
            href: '/dashboard'
        },
        {
            id: 'portfolios',
            label: 'Portfolios',
            icon: 'briefcase',
            href: '/portfolios'
        },
        {
            id: 'transactions',
            label: 'Transactions',
            icon: 'credit-card',
            href: '/transactions'
        },
        {
            id: 'coins',
            label: 'Coins & Tokens',
            icon: 'currency-dollar',
            href: '/coins'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: 'chart-line',
            href: '/analytics'
        },
        {
            id: 'tax-reports',
            label: 'Tax Reports',
            icon: 'document-text',
            href: '/tax-reports'
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: 'tag',
            href: '/categories'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'cog',
            href: '/settings'
        },
        {
            id: 'tools',
            label: 'Tools',
            icon: 'wrench',
            href: '/tools'
        }
    ];

    // Initialize responsive behavior
    if (browser) {
        const checkMobile = () => {
            const newIsMobile = window.innerWidth < 1024; // lg breakpoint
            isMobile = newIsMobile;
            if (newIsMobile && isOpen) {
                isOpen = false;
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
    }

    // Methods
    const toggleSidebar = () => {
        isOpen = !isOpen;
    };

    const closeSidebar = () => {
        isOpen = false;
    };

    const openSidebar = () => {
        isOpen = true;
    };

    const setActiveItem = (itemId: string) => {
        activeItem = itemId;
    };

    const toggleSearch = () => {
        searchOpen = !searchOpen;
        if (searchOpen) {
            // Focus search input when opened
            setTimeout(() => {
                const searchInput = document.getElementById('global-search');
                searchInput?.focus();
            }, 100);
        } else {
            searchQuery = '';
        }
    };

    const setSearchQuery = (query: string) => {
        searchQuery = query;
    };

    const selectPortfolio = (portfolio: Portfolio | null) => {
        activePortfolio = portfolio;
    };

    const addNotification = (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
        const notification = {
            id: `notification-${Date.now()}`,
            message,
            type
        };
        notifications = [...notifications, notification];

        // Auto-remove after 5 seconds
        // setTimeout(() => {
        //     removeNotification(notification.id);
        // }, 5000);
    };

    const removeNotification = (id: string) => {
        notifications = notifications.filter(n => n.id !== id);
    };

    const clearAllNotifications = () => {
        notifications = [];
    };

    return {
        // State getters
        get isOpen() { return isOpen; },
        get isMobile() { return isMobile; },
        get activeItem() { return activeItem; },
        get activePortfolio() { return activePortfolio; },
        get searchOpen() { return searchOpen; },
        get searchQuery() { return searchQuery; },
        get notifications() { return notifications; },
        get unreadCount() { return unreadCount; },
        get portfolios() { return portfolios; },
        get menuItems() { return menuItems; },

        // Methods
        toggleSidebar,
        closeSidebar,
        openSidebar,
        setActiveItem,
        toggleSearch,
        setSearchQuery,
        selectPortfolio,
        addNotification,
        removeNotification,
        clearAllNotifications,

        // Internal method for responsive updates
        updateMobileState: (newIsMobile: boolean) => {
            isMobile = newIsMobile;
        }
    };
}

export const navigationStore = createNavigationStore();