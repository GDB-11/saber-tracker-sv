// src/lib/stores/user.svelte.ts
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// Types
export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface LoginResponse {
    success: boolean;
    status: number;
    message?: string;
    user?: User;
    token?: string;
}

export interface ApiError {
    status: number;
    message: string;
}

// Mock users database
const MOCK_USERS: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        createdAt: '2024-01-15T00:00:00Z'
    }
];

// localStorage keys
const STORAGE_KEYS = {
    USER: 'user',
    AUTH_TOKEN: 'auth_token',
    REMEMBERED_CREDENTIALS: 'remembered_credentials'
} as const;

// Initialize user state from localStorage if available
function initializeUser(): User | null {
    if (!browser) return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

// Reactive user state
export const user = $state<{ current: User | null; token: string | null }>({
    current: initializeUser(),
    token: browser ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null
});

// Derived state for logged in status
const isLoggedIn = $derived(() => user.current !== null && user.token !== null);

// Get current user (for use in components)
export function getCurrentUser(): User | null {
    return user.current;
}

// Get logged in status (for use in components)
export function getLoggedIn(): boolean {
    return isLoggedIn();
}

// Remember me functionality
export function saveRememberedCredentials(usernameOrEmail: string): void {
    if (!browser) return;
    
    try {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_CREDENTIALS, usernameOrEmail);
    } catch (error) {
        console.warn('Failed to save remembered credentials:', error);
    }
}

export function getRememberedCredentials(): string | null {
    if (!browser) return null;
    
    try {
        return localStorage.getItem(STORAGE_KEYS.REMEMBERED_CREDENTIALS);
    } catch {
        return null;
    }
}

export function clearRememberedCredentials(): void {
    if (!browser) return;
    
    try {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_CREDENTIALS);
    } catch (error) {
        console.warn('Failed to clear remembered credentials:', error);
    }
}

// Mock API call to simulate login
async function mockLoginAPI(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Simulate different scenarios based on input

    // Simulate server error (5% chance)
    if (Math.random() < 0.05) {
        return {
            success: false,
            status: 500,
            message: 'Internal server error. Please try again later.'
        };
    }

    // Check for empty fields
    if (!usernameOrEmail.trim() || !password.trim()) {
        return {
            success: false,
            status: 400,
            message: 'Username/email and password are required.'
        };
    }

    // Find user by username or email
    const foundUser = MOCK_USERS.find(u =>
        u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );

    // User not found
    if (!foundUser) {
        return {
            success: false,
            status: 404,
            message: 'No account found with this username or email.'
        };
    }

    // Check password (for demo purposes, password is same as username)
    const correctPassword = foundUser.username === 'admin' ? 'password' : foundUser.username;

    if (password !== correctPassword) {
        return {
            success: false,
            status: 401,
            message: 'Incorrect password. Please try again.'
        };
    }

    // Successful login
    const mockToken = `mock_token_${foundUser.id}_${Date.now()}`;

    return {
        success: true,
        status: 200,
        message: 'Login successful!',
        user: foundUser,
        token: mockToken
    };
}

// Login function
export async function login(
    usernameOrEmail: string, 
    password: string, 
    rememberMe: boolean = false
): Promise<LoginResponse> {
    try {
        const response = await mockLoginAPI(usernameOrEmail, password);

        if (response.success && response.user && response.token) {
            // Update reactive state
            user.current = response.user;
            user.token = response.token;

            // Persist to localStorage
            if (browser) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
            }

            // Handle remember me functionality
            if (rememberMe) {
                saveRememberedCredentials(usernameOrEmail.trim());
            } else {
                clearRememberedCredentials();
            }

            // Redirect to dashboard after successful login
            await goto('/dashboard', { replaceState: true });
        }

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            status: 500,
            message: 'An unexpected error occurred. Please try again.'
        };
    }
}

// Logout function
export function logout(): void {
    // Clear reactive state
    user.current = null;
    user.token = null;

    // Clear localStorage (but keep remembered credentials if they exist)
    if (browser) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        // Note: We don't clear remembered credentials here
        // They should persist until user unchecks "remember me" or clears browser data
    }

    // Redirect to login page
    goto('/login', { replaceState: true });
}

// Check if user has specific role
export function hasRole(role: 'user' | 'admin'): boolean {
    return user.current?.role === role;
}

// Password reset mock API (for future implementation)
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
        return {
            success: false,
            message: 'No account found with this email address.'
        };
    }

    return {
        success: true,
        message: 'Password reset instructions have been sent to your email.'
    };
}

// Initialize auth state on app load
export function initializeAuth(): void {
    if (!browser) return;

    // Validate stored token (in real app, this would make an API call)
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            user.current = parsedUser;
            user.token = storedToken;
        } catch {
            // Clear invalid data
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
    }
}