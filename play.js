// This will play the game at http://minesweeperonline.com/
// 16 x 30 board

const triggerMouseEvent = (node, eventType, rightclick = false) => {
  const clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent(eventType, true, true)
  node.dispatchEvent(clickEvent)
}

const playSpot = (spot) => { // sport as string like '3_4'
  const button = document.getElementById(spot)
  triggerMouseEvent(button, 'mousedown')
  triggerMouseEvent(button, 'mouseup')
}

const markAsMine = (spot) => {
  getSpot(spot).classList.remove('blank')
  getSpot(spot).classList.add('bombflagged')
}

const readSpot = (spot) => {

}

const decrX = (spot) => incr('x', -1)
const incrX = (spot) => incr('x', 1)
const decrY = (spot) => incr('y', -1)
const incrY = (spot) => incr('y', 1)

const incr = (spot, xnum, ynum) => {
  let [x, y] = spot.split('_').map(x => parseInt(x, 10))
  x += xnum
  y += ynum
  return `${x}_${y}`
}

const spacesAllAround = (spot) => [].concat(incr(spot, -1, 0))
                                    .concat(incr(spot, -1, -1))
                                    .concat(incr(spot, 0, -1))
                                    .concat(incr(spot, 1, -1))
                                    .concat(incr(spot, 1, 0))
                                    .concat(incr(spot, 0, 1))
                                    .concat(incr(spot, -1, 1))
                                    .concat(incr(spot, 1, 1))

const blanksSpacesAround = (spot) => spacesAllAround(spot).filter(space => isBlank(space))
const flaggedSpacesAround = (spot) => spacesAllAround(spot).filter(space => isFlagged(space))

const isBombRevealed = (spot) => getSpot(spot).classList.contains('bombrevealed')
const isBombDeath = (spot) => getSpot(spot).classList.contains('bombdeath')
// const isBlank = (spot) => getSpot(spot).classList.contains('blank')
const isBlank = (spot) => getSpot(spot).classList.contains('blank')
const isBomb = (spot) => getSpot(spot).classList.contains('blank')
const isEmpty = (spot) => getSpot(spot).classList.contains('open0')
const isFlagged = (spot) => getSpot(spot).classList.contains('bombflagged')
const has0 = (spot) => getSpot(spot).classList.contains('open0')
const has1 = (spot) => getSpot(spot).classList.contains('open1')
const has2 = (spot) => getSpot(spot).classList.contains('open2')
const has3 = (spot) => getSpot(spot).classList.contains('open3')
const has4 = (spot) => getSpot(spot).classList.contains('open4')
const has5 = (spot) => getSpot(spot).classList.contains('open5')
const has6 = (spot) => getSpot(spot).classList.contains('open6')

const ones = () => Array.from(document.getElementsByClassName('square open1')).map(b => b.id)
const twos = () => Array.from(document.getElementsByClassName('square open2')).map(b => b.id)
const threes = () => Array.from(document.getElementsByClassName('square open3')).map(b => b.id)
const fours = () => Array.from(document.getElementsByClassName('square open4')).map(b => b.id)
const fives = () => Array.from(document.getElementsByClassName('square open5')).map(b => b.id)
const sixes = () => Array.from(document.getElementsByClassName('square open6')).map(b => b.id)
const blanks = () => Array.from(document.getElementsByClassName('square blank')).map(b => b.id)

const getSpot = (spot) => document.getElementById(spot)

const findCornerOnes = () => {
  // find all 1s with one blank next to them.   play that spot
  ones().forEach((one) => {
    const toMark = blanksSpacesAround(one)
    const flags = flaggedSpacesAround(one)
    if (toMark.length === 1 && flaggedSpacesAround(one).length === 0) {
      toMark.forEach(tm => markAsMine(tm))
    }
  })
}

// this function will find any numbers that are already satisfied (like a 1 already
// touching a flag) and then click the safe buttons
const findNumbersSatisfiedAndNeedClicking = () => {
  const doit = (numberRetFunc, number) => {
    numberRetFunc().forEach((spot) => {
      const blanks = blanksSpacesAround(spot)
      const flags = flaggedSpacesAround(spot)
      if (flags.length === number) {
        blanks.forEach(blank => playSpot(blank))
      }
    })
  }
  doit(ones, 1)
  doit(twos, 2)
  doit(threes, 3)
  doit(fours, 4)
  doit(fives, 5)
  doit(sixes, 6)
}

const findReady = () => {
  const doit = (numberRetFunc, number) => {
    numberRetFunc().forEach((spot) => {
      const howManyFlagsNeeded = number - flaggedSpacesAround(spot).length
      const blankSpacesNearby = blanksSpacesAround(spot)
      if (blankSpacesNearby === howManyFlagsNeeded) {
        playSpot(spot)
      }
    })
  }
  doit(ones, 1)
  doit(twos, 2)
  doit(threes, 3)
  doit(fours, 4)
  doit(fives, 5)
  doit(sixes, 6)
}

const findNumbersNeedingOneFlagHavingOneSpaceOpen = () => {

}

const findLoop = () => {
  for (let i = 0; i < 10; i++) {
    findCornerOnes()
    findNumbersSatisfiedAndNeedClicking()
  }
}

const advance = () => {
  findLoop()
  findReady()
}

