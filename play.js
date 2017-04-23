// This will play the game at http://minesweeperonline.com/
// 16 x 30 board

const triggerMouseEvent = (node, eventType) => {
  const clickEvent = document.createEvent ('MouseEvents')
  clickEvent.initEvent (eventType, true, true)
  node.dispatchEvent (clickEvent)
}

const playSpot = (spot) => { // sport as string like '3_4'
  const button = document.getElementById(spot)
  triggerMouseEvent (button, "mousedown")
  triggerMouseEvent (button, "mouseup")
}

const markAsMine = () => {

}

const readSpot = (spot) => {

}

const decrX = (spot) => incr('x', -1)
const incrX = (spot) => incr('x', 1)
const decrY = (spot) => incr('y', -1)
const incrY = (spot) => incr('y', 1)

const incr = (spot, xnum, ynum) => {
  let [x, y] = spot.split('_')
  x += xnum
  y += ynum
  return `${x}_${y}`
}

const spacesAllAround = (spot) => [].concat(incr (spot, -1,  0))
                                    .concat(incr (spot, -1, -1))
                                    .concat(incr (spot,  0, -1))
                                    .concat(incr (spot,  1, -1))
                                    .concat(incr (spot,  1,  0))
                                    .concat(incr (spot,  0,  1))
                                    .concat(incr (spot, -1,  1))
                                    .concat(incr (spot,  1,  1))

const isBombRevealed = (spot) => getSpot(spot).classList.includes('bombrevealed')
const isBombDeath = (spot) => getSpot(spot).classList.includes('bombdeath')
const isBlank = (spot) => getSpot(spot).classList.includes('blank')
const isBomb = (spot) => getSpot(spot).classList.includes('blank')
const has1 = (spot) => getSpot(spot).classList.includes('open1')
const has2 = (spot) => getSpot(spot).classList.includes('open2')
const has3 = (spot) => getSpot(spot).classList.includes('open3')
const has4 = (spot) => getSpot(spot).classList.includes('open4')
const has5 = (spot) => getSpot(spot).classList.includes('open5')
const has6 = (spot) => getSpot(spot).classList.includes('open6')

const ones = () => Array.from(document.getElementsByClassName('square open1')).map(b => b.id)
const twos = () => Array.from(document.getElementsByClassName('square open2')).map(b => b.id)
const threes = () => Array.from(document.getElementsByClassName('square open3')).map(b => b.id)
const blanks = () => Array.from(document.getElementsByClassName('square blank')).map(b => b.id)

const getSpot = (spot) => document.getElementById(spot)

const findCornerOnes = () => {
  // find all 1s with one blank next to them.   play that spot
  ones().forEach(one => {
    spacesAllAround(one).forEach(space => {
      if (isBlank(space)) {
        console.log(`Found a candidate blank one at ${space}!  gonna play it!`)
        playSpot(space)
      }
    })
  })
}

