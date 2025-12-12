export const asset = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  // Asegurarse de que path no empiece con /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Asegurarse de que base termine con /
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
};