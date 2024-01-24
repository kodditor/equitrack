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


export function getProfileStocks(): any[]{
    let ls = localStorage.getItem('ps');
    if (ls == null) return []

    return JSON.parse(ls)
}

export function existsInProfile(callSign: string): boolean {
    let existing = getProfileStocks()
    return existing.includes(callSign)
}

export function addStock(callSign: string){
    let existing = getProfileStocks();
    existing.push(callSign) 
    localStorage.setItem('ps',JSON.stringify(existing))
}

export function removeStock(callSign: string){
    let existing = getProfileStocks();
    let newArr = existing.filter((stock) => {return stock != callSign} ) 
    localStorage.setItem('ps',JSON.stringify(newArr))
}