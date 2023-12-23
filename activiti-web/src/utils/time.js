export function formatTime(time) {
  const hours = Math.floor(time / (3600 * 1000))
  const minutes = Math.floor((time % (3600 * 1000)) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
