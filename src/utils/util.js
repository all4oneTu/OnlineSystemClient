export function timeFix () {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? 'Chào buổi sáng' : hour <= 11 ? 'Chào buổi sáng' : hour <= 13 ? 'Chào buổi chiều' : hour < 20 ? 'Chào buổi chiều' : 'Buổi tối vui vẻ'
}
export function welcome () {
  const arr = ['Nghỉ ngơi', 'Định ăn gì?', 'Làm ván DOTA không?', 'Mệt mỏi?']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}