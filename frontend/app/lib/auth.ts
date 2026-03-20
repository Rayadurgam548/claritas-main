export const setToken = (token: string, user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('claritas_token', token);
    localStorage.setItem('claritas_user', JSON.stringify(user));
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('claritas_token');
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('claritas_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};
