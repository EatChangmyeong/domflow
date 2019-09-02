# Domflow: a wait-a-minute-why-on-earth-did-i-make-this DOM Structurer

Because it's hard to work with `document.createElement` and `.appendChild` every time but I don't want to go back to `.innerHTML`... I hope this to be a good excuse for Domflow.

## Example
```javascript
new Domflow()
	.et('h1', 'Hello, world!')
	.e('p')
		.et('span.class', 'This is a Domflow example.').t(' The quick brown fox jumps over the lazy dog.')
	.then('p')
		.e('img', {src: 'https://example.com/example.png'})
	.then('div')
		.et('button', {dataset: {foo: 'bar'}, on: {click: function() {alert('Hello, world!')}}}, 'Click me!')
	.append(document.body);
```

```html
<h1>Hello, world!</h1>
<p>
	<span class="class">This is a Domflow example.</span> The quick brown fox jumps over the lazy dog.
</p><p>
	<img src="https://example.com/example.png">
</p><div>
	<button data-foo="bar">Click me!</button> <!-- with an onclick event -->
</div>
```

## How to use
Start with `new Domflow()` and finish with `.append()` or `.insertBefore()`. The rest is done with extreme method chaining.

### `new Domflow()`
- Arguments<br>None.
- Returns<br>A newly created Domflow tree.

Creates a Domflow tree and returns its root.

### `.e(tagname[, attributes])`
- Arguments
	- `tagname`<br>The tagname of the element to create. You can also use `#id` and `.class` syntax.
	- `attributes` (optional)<br>An object containing all attributes to be applied to this element.
- Returns<br>The resulting element which can be chained, or the original element if the element is *empty*.

Creates an element and appends it to the original element. Note that the returned value is **NOT** a raw HTML element.

The `attributes` object is an object consisting of zero or more key-value pairs. Each key becomes an attribute name and its corresponding value becomes the value for that attribute.

If the `attributes` object contains a `dataset` key and its value is another object, its key-value pairs will be the element's `data-*` attributes.

If the `attributes` object contains a `style` key and its value is another object, its key-value pairs will be the element's inline CSS rules.

If the `attributes` object contains an `on` key and its value is another object, its key-value pairs will be the element's event handlers.

If the resulting element is one of the empty elements listed below, this method will return the original element:

- `<area>`
- `<base>`
- `<br>`
- `<col>`
- `<embed>`
- `<hr>`
- `<img>`
- `<input>`
- `<keygen>`
- `<link>`
- `<meta>`
- `<param>`
- `<source>`
- `<track>`
- `<wbr>`

### `.t(text)`
- Arguments
	- `text`<br>The text to be included.
- Returns<br>The original element.

Creates a text node and attaches it to the original element.

### `.up()`
- Arguments<br>None.
- Returns<br>The parent element.

Finishes working with the original element and ascends back to its parent. Note that you can reuse this element like demonstrated below:

```javascript
// This code results in <div><span>The quick brown fox</span> jumps over the lazy dog.</div><p></p>

var t = new Domflow().e('div');
t.et('span', 'The quick brown fox').then('p');
t.t(' jumps over the lazy dog.');
```

### `.br()`
- Arguments<br>None.

A shortcut of `.e('br')`.

### `.then(name[, attributes])`
- Arguments
	- `name`
	- `attributes` (optional)

A shortcut of `.up.e(name[, attributes])`. Not to be confused with promises.

### `.et(name[, attributes], text)`
- Arguments
	- `name`
	- `attributes` (optional)
	- `text`

A shortcut of `.e(name[, attributes]).t(text).up()`. Empty elements are not allowed to create this way.

### `.append(element)`
- Arguments
	- `element`<br>An HTML element to append the Domflow tree to.
- Returns<br>None.

Finishes the tree and appends it to the element as its last child. You can call this method anywhere in the Domflow tree.

### `.insertBefore(element, before)`
- Arguments
	- `element`
	- `before`
- Returns<br>None.

Finishes the tree and appends it to the element as before the `before` element.