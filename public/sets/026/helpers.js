export const getWidth = () => {
  return Math.min(window.innerWidth, window.innerHeight)
}

export const formatNumber = n => n && n.toLocaleString('en-US') || 'zero'
