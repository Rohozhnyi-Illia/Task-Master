export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState')
    if (!serializedState) return undefined
    return { auth: JSON.parse(serializedState) }
  } catch (e) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.auth)
    localStorage.setItem('authState', serializedState)
  } catch (e) {
    console.error('Error saving state', e)
  }
}
