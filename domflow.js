var Domflow;

(function() {
'use strict';

var empty = 'area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(',');

var Dfe = function(root, name, attributes) {
	var classes = [];
	name.split(/(?=[\.#])/g).forEach((function(x, i) {
		if(i) {
			if(x[0] == '#') {
				if(this.raw.id)
					throw new SyntaxError('id must be unique');
				if(x.length == 1)
					throw new SyntaxError('missing id after # symbol');
				this.raw.id = x.slice(1);
			} else {
				if(x.length == 1)
					throw new SyntaxError('missing class name after . symbol');
				classes.push(x.slice(1));
			}
		} else {
			if(/[\.#]/.test(x[0]))
				throw new SyntaxError('name must start with tag name');
			this.raw = document.createElement(this.tagName = x.toLowerCase());
		}
	}).bind(this));
	if(classes.length)
		this.raw.className = classes.join(' ');
	for(var i in attributes)
		if(typeof attributes[i] === 'object')
			switch(i) {
				case 'dataset':
				case 'style':
					for(var j in attributes[i])
						this.raw[i][j] = attributes[i][j];
				break;
				case 'on':
					for(var j in attributes[i])
						this.raw.addEventListener(j, attributes[i][j]);
				break;
				default:
					this.raw.setAttribute(i, attributes[i]);
			}
		else
			this.raw.setAttribute(i, attributes[i]);
	this.parent = null;
	this.root = root;
};
Dfe.prototype.br = function() {
	return this.e('br');
};
Dfe.prototype.e = function(name, attributes) {
	var e = new Dfe(this.root, name, attributes);
	e.parent = this;
	this.raw.appendChild(e.raw);
	return empty.indexOf(e.tagName) == -1 ? e : this;
};
Dfe.prototype.t = function(text) {
	var t = document.createTextNode(text);
	this.raw.appendChild(t);
	return this;
};
Dfe.prototype.et = function(name, two, three) {
	if(empty.indexOf(name) == -1)
		throw new SyntaxError('nonempty element expected');
	return (typeof two === 'string' ? this.e(name).t(two) : this.e(name, two).t(three)).up();
};
Dfe.prototype.up = function() {
	return this.parent;
};
Dfe.prototype.then = function(name, attributes) {
	return this.up().e(name, attributes);
};
Dfe.prototype.append = function(element) {
	element.appendChild(this.root.raw);
};
Dfe.prototype.insertBefore = function(element, before) {
	element.insertBefore(this.root.raw, before);
};

Domflow = function() {
	this.raw = document.createDocumentFragment();
	this.root = this;
};
Domflow.prototype = Object.create(Dfe.prototype);

})();