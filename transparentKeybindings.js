/*
	These keybindings do not call e.preventDefault() && e.stopPropagation()	implicitly.
	You'll have to decide when and were to do that in each binding.
*/

const transparentActionMap = 
{
	[Mode.NORMAL]: 
	{
	  'ctrl-k': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-:': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-;': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'alt-Enter': e => 
	  {
		if(e.shiftKey)
		{
			ZoomToMirroredItemsParent();
		}
		else
		{
			openFocusedItemURL();
		}
	  },
	  Enter: e => 
	  {
	    const focusedItem = WF.focusedItem();
	    if(e.shiftKey && focusedItem)
	    {
	      goToInsertMode();
	      return;
	    }

	    PrevEnterItem = WF.currentItem();
	    if(focusedItem)
	    {
	      // console.log("transparent Enter (NORMAL) valid focus");
	      e.preventDefault()
	      e.stopPropagation()
	      // WF.zoomIn(focusedItem);
	      WF.zoomTo(focusedItem);
	      WF.editItemName(focusedItem);
	    }
	    else
	    {
	      // WF.zoomIn(WF.currentItem());
	      WF.zoomTo(WF.currentItem());
	      WF.editItemName(WF.currentItem());
		}

	  },
	  Backspace: e => 
	  {
	    e.preventDefault()
		e.stopPropagation()

		// console.clear();
		// console.log(WF.focusedItem());
		// console.log(IsItemVirutalRoot(WF.focusedItem()));
		// return;

	    if(PrevEnterItem)
	    {
	      // console.log("trying to zoom in on prev item");
	      // console.log(PrevEnterItem);
	      // WF.zoomIn(PrevEnterItem);
	      WF.zoomTo(PrevEnterItem);
	    }
	  },
	  'ctrl-[': e => 
	  {
		SimulateEscapeNormalMode(e);
	  },
	  Esc: e => 
	  {
		// console.log("Pressing ESC from normal mode");
		HandleEscapeNormalMode(e);
	  },
	  Escape: e => 
	  {
		// console.log("Pressing Escape from normal mode");
		HandleEscapeNormalMode(e);
	  },
	  'g': e => 
	  {
	    const focusedItem = WF.focusedItem();
	    if(!focusedItem)
	      return;

	    const focusedItemParent = focusedItem.getParent();
	    if(!focusedItemParent)
	      return;

	    const currentOffset = state.get().anchorOffset

	    const bIsParentHomeRoot = WF.rootItem().equals(focusedItem.getParent()); 
	    if(bIsParentHomeRoot)
	    {
	      const visibleChildren = WF.currentItem().getVisibleChildren();
	      if (visibleChildren !== undefined && visibleChildren.length != 0) 
	      {
	        WF.editItemName(visibleChildren[0]);
	      }
	      else
	      {
	        WF.editItemName(focusedItemParent);
	      }
	    }
	    else
	    {
	      WF.editItemName(focusedItemParent);
	    }

	    event.preventDefault()
	    event.stopPropagation()

	    setCursorAt(currentOffset);
	  },
	  'G': e => 
	  {
		const focusedItem = WF.focusedItem();

		if(!focusedItem)
			return;

		const currentItem = WF.currentItem();
		const itemRoot = focusedItem.equals(currentItem) ? WF.currentItem() : focusedItem.getParent();
		goToListBottom(e, itemRoot);
	  },
	  'GG': e => 
	  {
		goToListBottom(e, WF.currentItem());
	  },
	  'gg': e => 
	  {
	    const currentOffset = state.get().anchorOffset
	    const bIsCurrentItemHomeRoot = WF.rootItem().equals(WF.currentItem()); 
	    if(bIsCurrentItemHomeRoot)
	    {
	      const visibleChildren = WF.currentItem().getVisibleChildren();
	      if (visibleChildren !== undefined && visibleChildren.length != 0) 
	      {
	        WF.editItemName(visibleChildren[0]);
	      }
	      else
	      {
	        WF.editItemName(WF.currentItem());
	      }
	    }
	    else
	    {
	      WF.editItemName(WF.currentItem());
	    }

	    event.preventDefault();
	    event.stopPropagation();

	    setCursorAt(currentOffset);
	  },
	  'ci': e => 
	  {
		e.preventDefault()
		e.stopPropagation()
	    goToInnerMode();
	  },
	  'di': e => 
	  {
		e.preventDefault()
		e.stopPropagation()
		goToInnerMode();
	  },
	  'da': e => 
	  {
		e.preventDefault()
		e.stopPropagation()
		goToAfterMode();
	  },
	  'dw': e => 
	  {
		deleteUntilWordEnd(true);
		e.preventDefault()
		e.stopPropagation()
	  },
	  'de': e => 
	  {
		deleteUntilWordEnd(false);
		e.preventDefault()
		e.stopPropagation()
	  },
	  'dn': e => 
	  {
		deleteNote(WF.focusedItem());
		e.preventDefault()
		e.stopPropagation()
	  },
	  'cw': e => 
	  {
		// we want to stay consistent with VIM behaviour...
		// VI changes cw to ce when you're on a non-blank char.
		// https://vimhelp.org/motion.txt.html#WORD
		var focusedItem = WF.focusedItem();
		if(focusedItem)
		{
  			const itemName = focusedItem.getName();
  			const currentOffset = calculateCursorOffset(false);
  			const underCursorChar = itemName.charAt(currentOffset); 
			if(underCursorChar != " ")
			{
				deleteUntilWordEnd(false);
			}
			else
			{
				deleteUntilWordEnd(true);
			}
		}

		e.preventDefault()
		e.stopPropagation()
		goToInsertMode();
	  },
	  'ce': e => 
	  {
		// @TODO: this one should consume the next word when initiated from a blank-space
		  deleteUntilWordEnd(false);
		e.preventDefault()
		e.stopPropagation()
		goToInsertMode();
	  },
	  'cn': e => 
	  {
		changeNote(WF.focusedItem());
		e.preventDefault()
		e.stopPropagation()
	  },
	  'd$': e => 
	  {
	    deleteUntilLineEnd();
		e.preventDefault()
		e.stopPropagation()
	  },
	  'alt-H': e => 
	  {
		if(WF.getSelection().length <= 0)
		{
			outdentFocusedItem(e);
		}
		else
		{
			enterVisualMode();
			outdentSelection(e);
			ExitVisualMode();
			event.preventDefault()
			event.stopPropagation()
		}
	  },
	  'alt-L': e => 
	  {
		if(WF.getSelection().length <= 0)
		{
			indentFocusedItem(e);
		}
		else
		{
			enterVisualMode();
			indentSelection(e);
			ExitVisualMode();
			event.preventDefault()
			event.stopPropagation()
		}
	  },
	  '<': e => 
	  {
		  if(WF.getSelection().length <= 0)
		  {
			  outdentFocusedItem(e);
		  }
		  else
		  {
			enterVisualMode();
			outdentSelection(e, true);
			ExitVisualMode();
			event.preventDefault();
			event.stopPropagation();
		  }
	  },
	  '>': e => 
	  {
		if(WF.getSelection().length <= 0)
		{
			indentFocusedItem(e);
		}
		else
		{
			enterVisualMode();
			indentSelection(e);
			ExitVisualMode();
			event.preventDefault();
			event.stopPropagation();
		}
	  },
	  Tab: e => 
	  {
	    if(e.shiftKey)
		{
			outdentSelection(e, false);
		}
	    else
		{
	    	indentSelection(e);
		}
	  },
	  'ctrl- ': e => 
	  {
	    toggleExpandAll(e);
	  },
	  'ctrl-i': e => 
	  {
		RotateSelectionPreMoveBuffer();
	  },
	  'ctrl-u': e => 
	  {
		RotateSelectionPreMoveBuffer();
	  },
	  'ctrl-b': e => 
	  {
		RotateSelectionPreMoveBuffer();
	  },
	  'ctrl-Enter': e => 
	  {
		  RotateSelectionPreMoveBuffer();
		  toggleCompletedOnSelection(e);
		  RotateSelectionPreMoveBuffer();
	  },
	  'ctrl-c': e => 
	  {
		WF.setSelection([WF.focusedItem()]);
		CopySelectionToClipboard(e);
	  },
	  'dd': e => 
	  {
	    yankSelectedItems(e.target);
		deleteSelectedItems(e.target);
	    event.preventDefault();
	    event.stopPropagation();
	  }
	},
	[Mode.VISUAL]: 
	{
	  'GG': e => 
	  {
		addSiblingsFromCurrentList(false);
		event.preventDefault();
		event.stopPropagation();
	  },
	  'gg': e => 
	  {
		addSiblingsFromCurrentList(true);
		event.preventDefault();
		event.stopPropagation();
	  },
	  'ctrl-u': e => 
	  {
		RotateSelectionPreMoveBuffer();
		goToNormalMode();
	  },
	  'ctrl-i': e => 
	  {
		RotateSelectionPreMoveBuffer();
		goToNormalMode();
	  },
	  'ctrl-b': e => 
	  {
		RotateSelectionPreMoveBuffer();
		goToNormalMode();
	  },
	  'ctrl-Enter': e => 
	  {
		  toggleCompletedOnSelection(e);
		  RotateSelectionPreMoveBuffer();
		  ExitVisualMode();
	  },
	  'ctrl- ': e => 
	  {
	    toggleExpandAll(e);
	  },
	  'alt-H': e => 
	  {
	    outdentSelection(e);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  'alt-L': e => 
	  {
	    indentSelection(e);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  '<': e => 
	  {
	    outdentSelection(e, true);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  '>': e => 
	  {
	    indentSelection(e);
	    event.preventDefault()
	    event.stopPropagation()
	    ExitVisualMode();
	  },
	  'ctrl-c': e => 
	  {
		CopySelectionToClipboard(e);
	  },
	  Tab: e => 
	  {
	    if(e.shiftKey)
		{
			outdentSelection(e, false);
		}
		else
		{
	    	indentSelection(e);
		}
	    ExitVisualMode();
	  },
	  'ctrl-k': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-:': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-;': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
	    ExitVisualMode();
	    focusPreJumpToItemMenu = WF.focusedItem();
	    goToInsertMode();
	  },
	  'ctrl-[': e => 
	  {
		SimulateEscapeVisualMode(e);
	  },
	  Esc: e => 
	  {
		// console.log("Pressing ESC from visual mode");
		HandleEscapeVisualMode(e);
	  },
	  Escape: e => 
	  {
		// console.log("Pressing Escape from visual mode");
		HandleEscapeVisualMode(e);
	  }
	},
	[Mode.INSERT]: 
	{
	  'ctrl-[': e => 
	  {
		SimulateEscapeInsertMode(e);
	  },
	  Esc: e =>
	  {
		// console.log("Pressing ESC from insert mode");
		HandleEscapeInsertMode(e);
	  },
	  Escape: e =>
	  {
		// console.log("Pressing Escape from insert mode");
		HandleEscapeInsertMode(e);
	  },
	  'Enter': e => 
	  {
	    // we are using the JumpToMenu to jump to the 
	    // item which we are already standing on.
	    // this means that "locationChanged" won't fire...
	    // so we'll handle it here for now.. 
	    if(!WF.focusedItem() && WF.currentItem())
	    {
	      if(focusPreJumpToItemMenu)
	      {
			//   console.log("applying focus pre jump to item menu");
	        WF.editItemName(focusPreJumpToItemMenu);
	        focusPreJumpToItemMenu = null;
	      }

	      if(!WF.focusedItem())
	        WF.editItemName(WF.currentItem());

	      goToNormalMode();
	      event.preventDefault();

	      requestAnimationFrame(fixFocus);
	    }
	  },
	  'jk': e => 
	  {
	    // guard against accidently pressing jk while in the menu 
		const focusedItem = WF.focusedItem();
		if(!focusedItem)
			return;

		// needed when dealing with html tags
		var extraLength = 0;
		const nodes = getNodes(focusedItem.getElement());
		for(let i = 0; i < nodes.length; ++i) 
		{
			if(!window.getSelection().containsNode(nodes[i]))
				extraLength += nodes[i].length;
			else
				// only count length up to the focused node
				break;
		}

	    goToNormalMode();

		const cursorOffsetForJ = document.getSelection().getRangeAt(0).startOffset-1; 
      	setCursorAt(cursorOffsetForJ);

		// save offset before deleting
	    const targetOffset = state.get().anchorOffset + extraLength;
		
	    // remove j from under the cursor
	    WF.insertText("");

		// move cursor to the correct offset
  		moveCursorTo(e.target, offsetCalculator(state), targetOffset);

	    // prevent k from being typed out.
	    event.preventDefault();
	  },
	  'ctrl-k': e => 
	  {
		const focusedItem = WF.focusedItem();
		if(focusedItem)
			focusPreJumpToItemMenu = focusedItem;

	    goToInsertMode();
	  },
	  'ctrl-:': e => 
	  {
		const focusedItem = WF.focusedItem();
		if(focusedItem)
			focusPreJumpToItemMenu = focusedItem;

	    goToInsertMode();
	  },
	  'ctrl-;': e => 
	  {
		const focusedItem = WF.focusedItem();
		if(focusedItem)
			focusPreJumpToItemMenu = focusedItem;

	    goToInsertMode();
	  },
	  'ctrl-Dead': e => 
	  {
		const focusedItem = WF.focusedItem();
		if(focusedItem)
			focusPreJumpToItemMenu = focusedItem;

	    goToInsertMode();
	  }
	}
}
