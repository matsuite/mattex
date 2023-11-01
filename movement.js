const distance = (x1,y1,x2,y2) => Math.sqrt(((x2-x1)**2)-((y2-y1)**2));
var movement = {
	name: "movement",
	version: "v1.0.0",
	requires: [],
	optionalRequires: [],
	optFuncs: {},
	description: "Adds support for moving elements to mattex.",
	funcs: {
		async m_rect(x1,y1,x2,y2,w,h,colprop,prop, time, keyframeCount, drawBetween) {
            var mpix = Math.round((x2-x1)/keyframeCount); // Movement per iteration X-axis
            var mpiy = Math.round((y2-y1)/keyframeCount); // Movement per iteration Y-axis
            var delay = time/keyframeCount;
            for(var m=0; m<keyframeCount; m++) {
                drawBetween(m);
        		this.rect(x1+mpix*m,y1+mpiy*m,w,h, colprop, prop);
                await sleep(delay);
            }
		},
        async m_circle(x1,y1,x2,y2,r,colprop,prop, time, keyframeCount, drawBetween) {
            var mpix = Math.round((x2-x1)/keyframeCount); // Movement per iteration X-axis
            var mpiy = Math.round((y2-y1)/keyframeCount); // Movement per iteration Y-axis
            var delay = time/keyframeCount;
            for(var m=0; m<keyframeCount; m++) {
        		drawBetween(m);
                this.circle(x1+mpix*m,y1+mpiy*m,r, colprop, prop);
                await sleep(delay);
            }
		}
	}
};