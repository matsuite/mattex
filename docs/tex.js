const texx = String.raw;

const LATEX_RED = "{\\color{Red}";
const LATEX_DARKRED = "{\\color{DarkRed}";
const LATEX_GREEN = "{\\color{Green}";
const LATEX_DARKGREEN = "{\\color{DarkGreen}";
const LATEX_BLUE = "{\\color{Blue}";
const LATEX_DARKBLUE = "{\\color{DarkBlue}";

const LATEX_YELLOW = "{\\color{Yellow}";
const LATEX_ORANGE = "{\\color{Orange}";
const LATEX_DARKORANGE = "{\\color{DarkOrange}";


const LATEX_E = "}";

var tex = {
	name: "TeX",
	version: "v1.0.0",
	requires: ["media"],
	optionalRequires: ["mattexy"],
	optFuncs: {
		s_tex(x,y, f, text, u=this.u) {
			this.s_image(x,y,f,"https://latex.codecogs.com/gif.latex?\\dpi{300}"+text,u);
		},
		s_text(x,y, f, text, u=this.u) {
			this.s_tex(x,y,f,"\\textup{"+text+"}",u);
		}
	},
	description: "Adds support for TeX to mattex.",
	funcs: {
		tex(x,y, w,h, text, u=this.u) {
			this.image(x,y,w,h,"https://latex.codecogs.com/gif.latex?\\dpi{300}"+text,u);
		},
		text(x,y,w,h,text, u=this.u) {
			this.tex(x,y,w,h,"\\textup{"+text+"}",u);
		}	
	}
};