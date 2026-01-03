export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  oauth: {
    googleClientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID,
    githubClientId: import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID,
  },
} as const
