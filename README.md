# aug-attr-spliced.js
augmented-ui plugin: adds `data-augmented-ui` attribute to html elements automatically from CSS

# Setup

assumes you're using [augmented-ui](http://augmented-ui.com/) already

```
npm install aug-attr-spliced
```

```js
import "aug-attr-spliced"
```

or

```js
<script type="module">
  import "https://unpkg.com/aug-attr-spliced/aug-attr-spliced.js"
</script>
```

# Usage

Allows you to specify augmentations for an element (or several; whatever matches the selector) from the CSS itself with the `--augmented-ui` custom property:

```css
.logo-augmented-ui {
  --augmented-ui: tr-clip r-notch-y br-round bl-clip exe;
  --aug-border: 20px;
  --aug-border-bg: black;
  --aug-tr: 40px;
  --aug-bl: 60px;
  --aug-br: 30px;
  --aug-r-width: 20px;
  --aug-r-height: 200px;
}
.un-logo,
.logo-augmented-ui:hover {
  --augmented-ui: bl-clip r-notch-x exe;
  --aug-r-width: 60px;
}
.logo-augmented-ui {
  box-sizing:border-box;background:#ffd700;width:400px;height:400px;padding-top:120px;padding-left:40px;font-family:sans-serif;font-size:100px;font-weight:bold;text-align:left;
}
```

```html
<div class="logo-augmented-ui">
  &lt;aug&gt;
</div>
<button onclick="this.previousElementSibling.classList.add('un-logo')">update class</button>
```

On page load, the `.logo-augmented-ui` element will be updated automatically:
```js
el.setAttribute("data-augmented-ui", " tr-clip r-notch-y br-round bl-clip exe")
```

On hover of the element, aug-attr-spliced will automatically update the augmentations from the :hover rule:
```js
el.setAttribute("data-augmented-ui", " bl-clip r-notch-x exe")
```

And when you stop hovering (mouseleave), it will update again, setting the html el attribute accordingly.

When the button is clicked, the "un-logo" class name is added to the logo. This change is automatically detected and the attribute is again updated to the expected rule.

Mouseenter and mouseleave from that point will keep updating it, but the last rule applied is always `un-logo` so the cascaded result is no change.

##### tl;dr the --augmented-ui prop behaves like CSS and the element will equip the expected augs automatically without you having to touch the html or any javascript. Automatically applies to newly added elements too.

# data-attr-spliced-ignore

Add the attribute `data-attr-spliced-ignore` to parent containers of elements that you expect will change frequently to avoid heavy repeat cascading checks and application.
(unless you need css to update the augs within)

This is especially important to add to javascript animations because every change is observed and the cascade has to recalculate in case something changes the a rule with the `--augmented-ui` property.

# Important Notes

* Augmentations will not be applied if js is disabled and don't apply until the page has loaded (any augmented elements above the landing fold should be included in the html instead of the CSS if you don't want users to potentially see them unapplied)
* you cannot set these on pseudo elements, and only the `:hover` pseudo class is supported
* aug-attr-spliced does not apply weights to the rules, it only takes them in order (so #id rule before a .class rule does not override the #id rule like you may expect)
* does not currently watch for CSS added to the page or removed, this is the next TODO though
* this is a very early release and there are no tests yet; expect optimizations, a demo page, and tests soon
