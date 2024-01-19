export function determinePreference(){
    if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
}

export function setDarkMode(){
    localStorage.theme = 'dark'
}

export function setLightMode(){
    localStorage.theme = 'light'
}

export function resetDarkMode(){
    localStorage.removeItem('theme')
}

export function isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}