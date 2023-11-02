m_package([]); // This one doesn't need any packages
class Example extends Presentation { // Extend the Presentation class for an easier way to run the program
	constructor(img) {
		super(img);
	}
	async run() {
        this.scene_A(); // Run the main scene (scene_A)
	}
    async scene_A() {
        var img = this.img; // Set the this.img (Image) to a local variable
        setGCTX(img); // Set the global context to the local one
        img.rect(1,1,5,5,new ColorDetails("#0000ff", "#000000"), new Properties(0.1)); // rectangle at x:1,y:1, with a width and height of 5, a border of blue, filled with black, and a stroke width of 0.1 units
    }
}
var p; // Debugging purposes for if something is NaN or an error
const run = async() => { // async runner for async purposes
	p = new Example(new Image("canv", 2000, 2000)); // Instantiate a new Image from the canvas id and then instantiate the class above with the Image.
}
run(); // Run it!