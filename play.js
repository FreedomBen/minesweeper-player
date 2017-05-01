// This will play the game at http://minesweeperonline.com/
// 16 x 30 board

const WIDTH = 30
const HEIGHT = 16

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
const spotToXY = (spot) => spot.split('_')

const incr = (spot, xnum, ynum) => {
  let [y, x] = spotToXY(spot).map(xy => parseInt(xy, 10))
  y += ynum
  x += xnum
  return `${y}_${x}`
}

const validX = (x) => x >= 0 && x <= WIDTH
const validY = (y) => y >= 0 && y <= HEIGHT

const validSpot = (spot) => {
  const [y, x] = spotToXY(spot)
  return validX(x) && validY(y)
}

const spacesAllAround = (spot) => {
  if (!validSpot(spot)) {
    return []
  }
  const retval = [].concat(incr(spot, -1, 0))
                   .concat(incr(spot, -1, -1))
                   .concat(incr(spot, 0, -1))
                   .concat(incr(spot, 1, -1))
                   .concat(incr(spot, 1, 0))
                   .concat(incr(spot, 0, 1))
                   .concat(incr(spot, -1, 1))
                   .concat(incr(spot, 1, 1))
                   .filter(s => validSpot(s))
  return retval
}

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
 
// const getSpot = (spot) => document.getElementById(spot)
const getSpot = (spot) =>  {
  const retval = document.getElementById(spot)
  if (!retval) {
    console.log('spot turned up undefined!: ', spot)
    return { classList: [] }
  }
  return retval
}

// this function will look at spaces where the only remaining
// square that is blank must be a mine
const markDefinites = () => {
  console.log('Marking definites')
  const md = (numberRetFunc, number) => {
    console.log('md for number: ', number)
    numberRetFunc().forEach((spot) => {
      const toMark = blanksSpacesAround(spot)
      const flags = flaggedSpacesAround(spot)
      console.log('spot: ', spot)
      console.log('toMark: ', toMark)
      console.log('flags: ', flags)
      if (toMark.length === 1 && flaggedSpacesAround(spot).length === (number - 1)) {
        console.log('Marking all as mine')
        toMark.forEach(tm => markAsMine(tm))
      }
    })
  }
  md(ones, 1)
  md(twos, 2)
  md(threes, 3)
  md(fours, 4)
  md(fives, 5)
  md(sixes, 6)
}

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
  const fnsanc = (numberRetFunc, number) => {
    numberRetFunc().forEach((spot) => {
      const blanks = blanksSpacesAround(spot)
      const flags = flaggedSpacesAround(spot)
      if (flags.length === number) {
        blanks.forEach(blank => playSpot(blank))
      }
    })
  }
  fnsanc(ones, 1)
  fnsanc(twos, 2)
  fnsanc(threes, 3)
  fnsanc(fours, 4)
  fnsanc(fives, 5)
  fnsanc(sixes, 6)
}

const findReady = () => {
  const fr = (numberRetFunc, number) => {
    console.log('Doing it for: ', number)
    numberRetFunc().forEach((spot) => {
      const howManyFlagsNeeded = number - flaggedSpacesAround(spot).length
      const blankSpacesNearby = blanksSpacesAround(spot)
      console.log('How many flags needed for ' , spot)
      console.log('howManyFlagsNeeded: ', howManyFlagsNeeded)
      console.log('blankSpacesNearby: ', blankSpacesNearby)
      if (blankSpacesNearby === howManyFlagsNeeded) {
        playSpot(spot)
      }
    })
  }
  fr(ones, 1)
  fr(twos, 2)
  fr(threes, 3)
  fr(fours, 4)
  fr(fives, 5)
  fr(sixes, 6)
}

const findNumbersNeedingOneFlagHavingOneSpaceOpen = () => {

}

const findLoop = () => {
  for (let i = 0; i < 10; i++) {
    markDefinites()
  }
  for (let i = 0; i < 10; i++) {
    findNumbersSatisfiedAndNeedClicking()
  }
}

const advance = () => {
  findLoop()
  findReady()
}

