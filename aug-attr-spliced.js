
const selectorAugsList = []
const recursiveRuleCrawl = cssRules => {
  const rulesLen = cssRules.length
  for (let r = 0; r < rulesLen; r++) {
    const rule = cssRules[r]
    if (rule.cssRules) {
      recursiveRuleCrawl(rule.cssRules)
    } else {
      const augs = rule.style.getPropertyValue("--augmented-ui")
      if (augs) {
        rule.selectorText.split(",").forEach(selector => {
          selectorAugsList.push({ selector: selector, selectorWithoutHover: selector.replace(/:hover/g, ""), augs, hover: selector.indexOf(":hover") > -1 })
        })
      }
    }
  }
}
Array.from(document.styleSheets).forEach(
  stylesheet => recursiveRuleCrawl(stylesheet.cssRules)
)

const checkSetAttr = (el, attr, val) => {
  const cur = el.getAttribute(attr)
  if (cur !== val) {
    console.log("UPDATING")
    el.setAttribute(attr, val)
    observer.takeRecords() // already updated, ignore these changes
  }
}

const updateDomAugsFromCSSForEventTarget = ev => {
  const el = ev.target
  el && selectorAugsList.forEach(selectorAugs => {
    if (el.matches(selectorAugs.selector)) {
      checkSetAttr(el, "data-augmented-ui", "js-attr-spliced " + selectorAugs.augs)
    }
  })
}

const checkEl = function (el) {
  const selectorAugs = this
  const existingAugs = el.getAttribute("data-augmented-ui") || el.getAttribute("augmented-ui")
  const existingSplicedProps = el.getAttribute("data-aug-attr-spliced") || ""

  // set up js "hover" events only once on this element
  if (selectorAugs.hover && existingSplicedProps.indexOf("hover-events") === -1) {
    checkSetAttr(el, "data-aug-attr-spliced", existingSplicedProps + " hover-events")
    el.addEventListener("mouseenter", updateDomAugsFromCSSForEventTarget)
    el.addEventListener("mouseleave", updateDomAugsFromCSSForEventTarget)
  }

  // don't override if it's set in the dom by something else
  if (existingAugs === null || existingAugs.indexOf("js-attr-spliced") >= 0) {
    if (!selectorAugs.hover || el.matches(selectorAugs.selector)) {
      checkSetAttr(el, "data-augmented-ui", "js-attr-spliced " + selectorAugs.augs)
    }
  }
}

const handleSelectorAugs = selectorAugs => {
  document.querySelectorAll(selectorAugs.selectorWithoutHover).forEach(checkEl, selectorAugs)
}

const updateDomAugsFromCSS = e => {
  selectorAugsList.forEach(handleSelectorAugs)
}

window.addEventListener("load", updateDomAugsFromCSS)
window.addEventListener("resize", updateDomAugsFromCSS)

var observer = new MutationObserver(mutations => {
  const mLen = mutations.length
  for (let m = 0; m < mLen; m++) {
    let el = mutations[m].target
    if (el && !el.closest("[data-attr-spliced-ignore]")) {
      updateDomAugsFromCSS(mutations)
      break
    }
  }
})

observer.observe(document, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
})
