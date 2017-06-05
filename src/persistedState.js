export function getPersistedState(){
  return localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};
}

