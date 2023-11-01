
var media = {
	name: "media",
	version: "v1.0.0",
	requires: [],
	optionalRequires: [],
	optFuncs: {},
	description: "Adds support for images to mattex.",
	funcs: {
		image(x,y, w,h, url, u=this.u) {
			var im = document.createElement("img");
			im.src=url;
			im.id="loadingimg";
			this.limg.appendChild(im);
			ctx.drawImage(im, x*u, y*u, w*u, h*u);
		},
	}
};