export function generateWppNumber(number: string) {
  const regex = /\d+/g
  const validNumber = number.match(regex)?.join('')
  return `https://wa.me/${validNumber}`
}
