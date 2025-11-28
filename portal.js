import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * ThemeContext + Provider
 */
const themes = {
    light: {
        id: "light",
        background: "#ffffff",
        surface: "#f4f4f6",
        color: "#111827",
        accent: "#2563eb",
    },
    dark: {
        id: "dark",
        background: "#0b1220",
        surface: "#0f1724",
        color: "#e6eef8",
        accent: "#60a5fa",
    },
};

export const ThemeContext = createContext({
    theme: themes.light,
    toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        try {
            return localStorage.getItem("portal-theme") || "light";
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("portal-theme", mode);
        } catch {}
    }, [mode]);

    const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

    const value = { theme: themes[mode], toggleTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Small UI components that consume ThemeContext
 */

function ToggleButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const style = {
        padding: "8px 12px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: theme.accent,
        color: "#fff",
        fontWeight: 600,
    };
    return (
        <button aria-label="Toggle theme" onClick={toggleTheme} style={style}>
            {theme.id === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
    );
}

function Header() {
    const { theme } = useContext(ThemeContext);
    return (
        <header
            style={{
                background: theme.surface,
                color: theme.color,
                padding: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 8,
                marginBottom: 16,
            }}
        >
            <h1 style={{ margin: 0, fontSize: 18 }}>KL Student Portal</h1>
            <ToggleButton />
        </header>
    );
}

function DashboardCard({ title, children }) {
    const { theme } = useContext(ThemeContext);
    return (
        <div
            style={{
                background: theme.surface,
                color: theme.color,
                padding: 12,
                borderRadius: 8,
                boxShadow:
                    theme.id === "light"
                        ? "0 1px 3px rgba(0,0,0,0.06)"
                        : "0 1px 8px rgba(0,0,0,0.6)",
                marginBottom: 12,
            }}
        >
            <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
            <div>{children}</div>
        </div>
    );
}

function Footer() {
    const { theme } = useContext(ThemeContext);
    return (
        <footer
            style={{
                marginTop: 24,
                color: theme.color,
                textAlign: "center",
                opacity: 0.8,
            }}
        >
            © KL Student Portal
        </footer>
    );
}

/**
 * App (wrap with ThemeProvider at the top level)
 */
export default function PortalApp() {
    return (
        <ThemeProvider>
            <InnerApp />
        </ThemeProvider>
    );
}

function InnerApp() {
    const { theme } = useContext(ThemeContext);

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: 24,
                background: theme.background,
                color: theme.color,
                transition: "background 200ms ease, color 200ms ease",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <Header />
                <main>
                    <DashboardCard title="Announcements">
                        <p style={{ margin: 0 }}>
                            Welcome to the KL Student Portal. Theme is applied globally via Context API.
                        </p>
                    </DashboardCard>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <DashboardCard title="Courses">
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                <li>Algorithms</li>
                                <li>Web Development</li>
                                <li>Operating Systems</li>
                            </ul>
                        </DashboardCard>

                        <DashboardCard title="Profile">
                            <p style={{ margin: 0 }}>Name: Student 001</p>
                            <p style={{ margin: "6px 0 0 0" }}>Year: 2</p>
                        </DashboardCard>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}