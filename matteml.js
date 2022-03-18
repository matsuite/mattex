const nmml = (strings, ...keys) => {
	return strings.join("").replace(/\n/g, "\\n")	
};
const matml = String.raw;
const debug = true;
const d = {
	log: (a) => {if(debug) console.log(a)}
}
function parse(instr, ele, w=-1,h=-1) {
	if(w==-1) {
		w = document.getElementById(ele).width;
		d.log("width blank, setting width to canvas width")
	}
	if(h==-1) {
		h = document.getElementById(ele).height;
		d.log("height blank, setting width to canvas height")
	}
	var tok = instr.split("\n").filter(e =>  e);;
	var res = [`(async ()=>{m_package([media,mattexy,tex,example]);var img = new Image("${ele}", ${w}, ${h});setGCTX(img);`];
	var end = "})();";
	for(var i=0; i<tok.length; i++) {
		var t = tok[i];
		var parts = t.split(":::");
		var name = parts[0];
		var args = parts[1].split(",,,");
		switch(name) {
			case "mattex.delay":
				res.push(`await sleep(${args[0]})`);
				break;
			case "mattex.bg":
				res.push(`img.bg(new ColorDetails("${args[0]}", "${args[1]}"));`);
				break;
			case "mattex.clear":
				res.push(`img.clear();`)
				break;
			case "mattex.circle":
				res.push(`img.circle(${args[0]}, ${args[1]}, ${args[2]}, new ColorDetails("${args[3]}", "${args[4]}"), new Properties("${args[5]}"));`);
				break;
			case "mattex.rect":
				res.push(`img.rect(${args[0]},${args[1]},${args[2]},${args[3]}, new ColorDetails("${args[4]}", "${args[5]}"), new Properties("${args[6]}"));`)
				break;
			case "media.image":
				res.push(`img.image(${args[0]},${args[1]},${args[2]},${args[3]},"${args[4]}")`)
				break;
			case "mattex.tex":
				res.push(`img.tex(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]}, "${args[4]}")`)
			case "mattex.text":
				res.push(`img.text(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]}, "${args[4]}")`)
			case "mattex.s.tex":
				res.push(`img.s_tex(${args[0]}, ${args[1]}, ${args[2]}, "${args[3]}")`)
			case "mattex.s.text":
				res.push(`img.s_text(${args[0]}, ${args[1]}, ${args[2]}, "${args[3]}")`)
            case "mattex.click.sleep":
                res.push(`await click_sleep("${args[0]}");`);
        }
	}
	res.push(end);
	return res.join("\n");
}