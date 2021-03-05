const closest = (node, selector) => {
  let element = node
   while(element 
        && typeof element.matches !== 'undefined'
        && !element.matches(selector)) { 
    element = element.parentNode
  }

  return element
}

const offsetCalculator = state => (contentAbstraction, offset) => 
{
  const maxOffset = contentAbstraction.length - 1;
  const bound = o => 
  {
    let inBounds = o
    inBounds = Math.min(maxOffset, inBounds)
    inBounds = Math.max(0, inBounds)
    return inBounds
  }

  const currentOffset = state.get().anchorOffset;
  const effective = bound(offset(currentOffset))
  state.set(_ => ({anchorOffset: effective}))

  return effective
}

const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3
}

const getNodes = element => [...element.childNodes].reduce((accu, current) => 
{
  if(!accu)
    return;

  if (current.nodeType === NODE_TYPES.TEXT) {
    return [...accu, current]
  }

  if (current.nodeType === NODE_TYPES.ELEMENT) {
    return [...accu, ...getNodes(current)]
  }

  console.log(`I did not expect this nodetype: ${current.nodeType} in this element`, current)
}, [])

const getContentAbstraction = node => 
{
  const contentElement = closest(node, '.content')

  const nodes = getNodes(contentElement)

  if(!nodes)
    return;

  return {
    get length() { return nodes.reduce((accu, current) => accu + current.length, 0) },
    setCursorAt: function (offset) {
      for(let i = 0; i < nodes.length; ++i) {
        const node = nodes[i]

        if (offset <= node.length) {
          const range = document.createRange()
          range.setStart(node, offset)
          range.collapse(true)
          const selection = document.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          selection.modify('extend', 'right', 'character')
          contentElement.focus()
          return
        }

        offset -= node.length
      }
    }
  }
}

const projectAncestor = project => closest(project, `.project:not([projectid='${project.getAttribute('projectid')}'])`) 
/* const projectAncestor = project => typeof project.getAttribute !== 'undefined' 
                        ? closest(project, `.project:not([projectid='${project.getAttribute('projectid')}'])`) 
                        : project   */

const moveAboveFold = element => {
  const rect = element.getBoundingClientRect()
  const fold = window.innerHeight
  const scrollPosition = window.scrollY
  const beyondFold = rect.top >= fold || (rect.top < fold && rect.bottom > fold)
  const floatingHeaderHeight = 30
  const aboveViewport = rect.top < floatingHeaderHeight

  if (!beyondFold && !aboveViewport) {
    return
  }

  element.scrollIntoView()
  if (aboveViewport) {
    window.scrollBy(0, -floatingHeaderHeight)
  }
}

const setCursorAfterVerticalMove = (calculateOffset, cursorTargetProject) => 
{
  // @TODO: this should be removed once we refactor 
  // cursorMovement to use the workflowy API instead. 
  if(cursorTargetProject === null)
    return;

  const cursorTarget = cursorTargetProject.querySelector('.name>.content')

  // we reached the top of the search list?
  if(cursorTarget === null)
    return;

  if (!cursorTarget.childNodes.length) 
  {
    cursorTarget.append(' ')
  }

  const abstraction = getContentAbstraction(cursorTarget)
  const offset = calculateOffset(abstraction, o => o)
  abstraction.setCursorAt(offset)

  moveAboveFold(cursorTarget)
}

const moveCursorDown = startElement => 
{
  const project = projectAncestor(startElement)

  if (project.className.includes('selected')) 
    return project.querySelector('.project')

  if (project.className.includes('open')) 
  {
    const querySelectedProject = project.querySelector('.project');

      // need to guard against the case of a sibling with hidden items in it
    if(querySelectedProject)
    {
      return querySelectedProject;
    }

  }

  let cursorTargetProject = project

  // walk past SVGs 
  if (cursorTargetProject.nextElementSibling != null && typeof(cursorTargetProject.nextElementSibling.className) !== 'string')
  {
    cursorTargetProject = cursorTargetProject.nextElementSibling;
  }

  while(!(cursorTargetProject.nextElementSibling 
          && typeof cursorTargetProject.nextElementSibling.className.includes !== 'undefined'
          && cursorTargetProject.nextElementSibling.className.includes('project')
  )) 
  {
    const ancestor = projectAncestor(cursorTargetProject)

     if (ancestor.className
        //&& typeof ancestor.className.includes !== 'undefined'
        //&& ancestor.className.includes('mainTreeRoot')) 
        && ancestor.className.includes('selected')) 
    {
      return project
    } 
    
/*     if(cursorTargetProject.className == ancestor.className)
      return ancestor; */

    cursorTargetProject = ancestor
  }

  return cursorTargetProject.nextElementSibling
}

const moveCursorUp = t => 
{
  const project = projectAncestor(t) 
  let cursorTarget = null

  if (project.previousElementSibling)
  {
    cursorTarget = project.previousElementSibling

    /* Walk past SVGs.

      The HTML structure might look like this:

      project1
      project2            <--- We want to end up here
      SVG
      project3 (backlink) <--- We are here
      Project4 (backlink)

    */ 
    if (typeof(cursorTarget.className) !== 'string')
      cursorTarget = cursorTarget.previousElementSibling;

    if (cursorTarget.className.includes('open')) 
    {
      const textContainers = cursorTarget.querySelectorAll('.project')

      // need to guard against the case of a sibling with hidden items in it
      if(textContainers[textContainers.length - 1] !== undefined)
      {
        cursorTarget = textContainers[textContainers.length - 1]
      }

    }
  }

  if (!cursorTarget) 
    cursorTarget = projectAncestor(project) 

/*    return cursorTarget.className.includes('mainTreeRoot')
    ? project
    : cursorTarget  */

   if(!cursorTarget.className
    //|| typeof cursorTarget.className.includes === 'undefined'
    //|| cursorTarget.className.includes('mainTreeRoot')
    )
    {
      return project
    }
    else
    {
      return cursorTarget
    } 

}

const setCursorAt = (offset) => 
{

  if(isNaN(offset))
    return;

  const selection = document.getSelection()
  const {anchorOffset, baseNode} = selection
  let effectiveOffset = offset

  if (typeof offset === 'function') {
    effectiveOffset = offset(anchorOffset, baseNode)
  }

  let baseNodeLen = baseNode.length !== undefined ? baseNode.length - 1 : -1; 
  effectiveOffset = Math.min(effectiveOffset, baseNodeLen);
  effectiveOffset = Math.max(effectiveOffset, 0);

  state.set(_ => ({
    anchorOffset: effectiveOffset
  }))

  const range = document.createRange()
  range.setStart(baseNode, effectiveOffset)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  selection.modify('extend', 'right', 'character')
  baseNode.parentElement.focus()
}

const moveCursorTo = (target, calculateOffset, desiredOffset) => 
{
  if(isNaN(desiredOffset))
    return;

  const contentAbstraction = getContentAbstraction(target);
  const offset = calculateOffset(contentAbstraction, () => desiredOffset);
  contentAbstraction.setCursorAt(offset);
}

const moveCursorToStart = (target, calculateOffset) => {
  const contentAbstraction = getContentAbstraction(target)
  const offset = calculateOffset(contentAbstraction, () => 0)
  contentAbstraction.setCursorAt(0)
}

const moveCursorToEnd = (target, calculateOffset) => {
  const contentAbstraction = getContentAbstraction(target)
  const offset = calculateOffset(contentAbstraction, () => contentAbstraction.length - 1)
  contentAbstraction.setCursorAt(offset)
}

const moveCursorLeft = (target, calculateOffset) => {
  const contentAbstraction = getContentAbstraction(target)
  if(contentAbstraction)
  {
    const offset = calculateOffset(contentAbstraction, o => o - 1)
    contentAbstraction.setCursorAt(offset)
  }
}

const moveCursorRight = (target, calculateOffset) => {
  const contentAbstraction = getContentAbstraction(target)
  if(contentAbstraction)
  {
    const offset = calculateOffset(contentAbstraction, o => o + 1)
    contentAbstraction.setCursorAt(offset)
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    moveCursorLeft,
    moveCursorRight,
    moveCursorDown,
    moveCursorUp
  }
}
