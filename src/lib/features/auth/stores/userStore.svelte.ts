export const user = $state({ username: null as string | null });

const loggedIn = $derived(() => user.username !== null);
export function getLoggedIn() {
    return loggedIn;
}

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (username === 'admin' && password === 'password') {
        user.username = username;
        return { success: true };
    } else {
        user.username = null;
        return { success: false, error: 'Invalid credentials' };
    }
}

export function logout() {
    user.username = null;
}