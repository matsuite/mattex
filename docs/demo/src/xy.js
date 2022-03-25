var mattexy = {
	name: "mattexy",
	version: "v1.0.0",
	requires: ["media"],
	optionalRequires: [],
	optFuncs: {},
	description: "Adds support for scaling images via media.",
	funcs: {
		s_image(x,y,f, url, u=this.u) {
			var im = document.createElement("img");
			im.src=url;
			im.id="loadingimg";
			this.limg.appendChild(im);
			ctx.drawImage(im, x*u, y*u, f*u*im.width, f*u*im.height);
			im.id="";
		}
	}
};