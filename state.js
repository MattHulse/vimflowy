
const stateClosure = (initialState = {}, stateChanged = () => {}) => {
  let s = initialState 

  return {
    set: stateReducer => {
      s = Object.assign({}, s, stateReducer(s))
      stateChanged()
    },
    get: () => Object.assign({}, s)
  }
}

const Mode = {
  NORMAL: 'NORMAL',
  INSERT: 'INSERT',
  VISUAL: 'VISUAL',
  REPLACE: 'REPLACE',
  FIND: 'FIND',
  CHANGEINNER: 'CHANGE INNER',
  DELETEINNER: 'DELETE INNER'
}

const state = stateClosure({
    mode: Mode.NORMAL,
    anchorOffset: 0,
    debug: false
  }
)

window.toggleDebugging = () => state.set(s => ({
  debug: !s.debug
})) 

const debug = (...args) => state.get().debug && console.log(...args)

const modeClosure = (mainContainer, getState, setState) => {
  const indicatorElement = document.createElement('div')
  indicatorElement.setAttribute('style', 'position: fixed; z-index:9001; bottom:0; left: 0; background-color: grey; color: white; padding: .3em; font-family: sans-serif;')
  indicatorElement.innerHTML = 'NORMAL'
  document.querySelector('body').append(indicatorElement)

  let timerId = null
  const setMode = modeText => {
    clearTimeout(timerId)
    indicatorElement.innerHTML = modeText
  }

  return {
    flashMode: (temporaryMode, duration = 1000) => 
    {
      setMode(temporaryMode)
      timerId = setTimeout(() => { indicatorElement.innerHTML = getState().mode }, duration)
    },
    goToInsertMode: (cursorRight = false) => 
    {
      setState(s => ({mode: Mode.INSERT}))
      setMode(Mode.INSERT)
      document.getSelection().modify('extend', 'left', 'character')
      if (cursorRight) 
      {
        document.getSelection().modify('move', 'right', 'character')
      }
    },
    goToNormalMode: () => 
    {
      setState(s => ({mode: Mode.NORMAL}))
      setMode(Mode.NORMAL)
    },
    goToVisualMode: () => 
    {
      setState(s => ({mode: Mode.VISUAL}))
      setMode(Mode.VISUAL)
    },
    goToReplaceMode: () => 
    {
      setState(s => ({mode: Mode.REPLACE}))
      setMode(Mode.REPLACE)
    },
    goToFindMode: () => 
    {
      setState(s => ({mode: Mode.FIND}))
      setMode(Mode.FIND)
    },
    goToChangeInnerMode: () => 
    {
      setState(s => ({mode: Mode.CHANGEINNER}))
      setMode(Mode.CHANGEINNER)

      // copy over the buffer in case it gets closed 
      // (which we usually do when dealing with sequences)
      // @TODO: move this to actual 'ci' binding if chrome 
      // starts throwing errors...
      keyBufferTempCopy = keyBuffer;
    },
    goToDeleteInnerMode: () => 
    {
      setState(s => ({mode: Mode.DELETEINNER}))
      setMode(Mode.DELETEINNER)

      // copy over the buffer in case it gets closed 
      // (which we usually do when dealing with sequences)
      // @TODO: move this to actual 'di' binding if chrome 
      // starts throwing errors...
      keyBufferTempCopy = keyBuffer;
    }
  }
}
