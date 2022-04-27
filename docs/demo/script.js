m_package([media]);

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function mazegen(xm, ym) {
  var rand = Array(ym).fill("");
  for (var y = 0; y < ym; y++) {
    for (var x = 0; x < Math.ceil(xm / 5); x++) {
      if (y == 0 && x == 0) {
        rand[y] += "G";
      } else {
        rand[y] += Math.round(Math.random()) == 0 ? "G" : "E";
      }
      rand[y] += Math.random() < 0.05 ? "E" : "G";
      rand[y] += Math.random() < 0.05 ? "E" : "G";
      rand[y] += Math.random() < 0.05 ? "E" : "G";
      rand[y] += Math.random() < 0.025 ? "C" : "G";
    }
  }
  return rand.join("\n");
}
class OpenVS extends Presentation {
  constructor(img) {
    super(img);
    this.img = img;
    this.speed = this.img.u;
    //this.map = {"w":false,"a":false,"s:":false,"d":false};
    this.map = {};
    this.mapList = [];
    for (var i = 0; i < 500; i++) {
      this.mapList.push(mazegen(32, 8));
    }
    this.reset = true;
    this.lvl = 1;
    this.keystrokes = 0;
    //this.coins = 0;
    this.loaded = false;
  }
  async saveData() {
    localStorage.setItem("coin", this.coins);
    localStorage.setItem("lvl", this.lvl);
  }
  async loadData() {
    try {
      this.coins = isNaN(parseInt(localStorage.getItem("coin")))
        ? 0
        : parseInt(localStorage.getItem("coin"));
      this.lvl = isNaN(parseInt(localStorage.getItem("lvl")))
        ? 1
        : parseInt(localStorage.getItem("lvl"));
      this.keystrokes = 1e22;
      document.getElementById("pb").innerHTML = isNaN(
        parseInt(localStorage.getItem("keystrokes"))
      )
        ? 1e22
        : parseInt(localStorage.getItem("keystrokes"));
      document.getElementById("coinsval").innerHTML = this.coins;
      document.getElementById("lvlval").innerHTML = this.lvl;
    } catch (e) {
      alert("Failed to load data!", e);
      console.log(e);
    }
  }
  async levelUp() {
    this.coins += 2;
    this.lvl++;
    if (
      this.keystrokes <
      (isNaN(parseInt(localStorage.getItem("keystrokes")))
        ? 1e22
        : parseInt(localStorage.getItem("keystrokes")))
    ) {
      localStorage.setItem("keystrokes", this.keystrokes);
      document.getElementById("pb").innerHTML = this.keystrokes;
    }
    this.keystrokes = 0;
    document.getElementById("lvlval").innerHTML = this.lvl;
    this.doReset();
    this.saveData();
  }
  async doReset() {
    const that = this;
    that.playerPos = [0, 0];
    that.keystrokes = 0;
    that.gameMap = that.mapList[that.lvl];
    that.yxGameMap = that.gameMap.split("\n");
    document.getElementById("coinsval").innerHTML = this.coins;
  }
  async movement(evt) {
    var that = p;
    try {
      that.map[evt.key] = evt.type == "keydown";
      if ((that.map["w"] || that.map["ArrowUp"]) && that.playerPos[1] >= 1) {
        evt.preventDefault();
        that.playerPos[1] = that.playerPos[1] - that.speed / that.img.u;
        that.keystrokes++;
      }
      if (
        (that.map["s"] || that.map["ArrowDown"]) &&
        that.playerPos[1] + 2 <= that.yxGameMap.length
      ) {
        evt.preventDefault();
        that.playerPos[1] = that.playerPos[1] + that.speed / that.img.u;
        that.keystrokes++;
      }
      if (that.map["d"] || that.map["ArrowRight"]) {
        evt.preventDefault();
        if (that.playerPos[0] + 2 >= that.yxGameMap[0].length) {
          that.levelUp();
        }
        that.playerPos[0] = that.playerPos[0] + that.speed / that.img.u;
        that.keystrokes++;
      }
      if ((that.map["a"] || that.map["ArrowLeft"]) && that.playerPos[0] >= 1) {
        evt.preventDefault();
        that.playerPos[0] = that.playerPos[0] - that.speed / that.img.u;
        that.keystrokes++;
      }
    } catch (e) {
      console.log(e);
    }
    document.getElementById("curr").innerHTML = that.keystrokes;
    that.saveData();
  }
  async run() {
    if (!this.loaded) {
      this.loaded = true;
      this.loadData();
    }
    try {
      const that = this;
      try {
        document.addEventListener("keyup", this.movement);
      } catch (e) {
        console.log(e);
      }
      try {
        document.addEventListener("keydown", this.movement);
      } catch (e) {
        console.log(e);
      }
      this.playerPos = [0, 0];
      while (1) {
        this.sceneGame();
        await sleep(1 / 60);
        this.img.clear();
        if (that.reset) {
          that.reset = false;
          that.doReset();
        }
      }
      this.run();
    } catch (e) {
      console.log(e);
    }
  }
  async renderPlayer() {
    const img = this.img;
    setGCTX(img);
    img.rect(
      this.playerPos[0],
      this.playerPos[1],
      4 / 5,
      4 / 5,
      new ColorDetails("#ff0000", "#ff0000"),
      new Properties(0)
    );
  }
  async gameMapBg() {
    const that = this;
    try {
      const img = that.img;
      setGCTX(img);
      for (var y = 0; y < that.yxGameMap.length; y++) {
        for (var x = 0; x < that.yxGameMap[y].length; x++) {
          if (that.yxGameMap[y][x] == "G") {
            img.rect(
              x,
              y,
              1,
              1,
              new ColorDetails("#001100", "#00aa00"),
              new Properties(0.25)
            );
          } else if (that.yxGameMap[y][x] == "E") {
            img.rect(
              x,
              y,
              1,
              1,
              new ColorDetails("#110000", "#aa0000"),
              new Properties(0.25)
            );
          } else if (that.yxGameMap[y][x] == "C") {
            img.rect(
              x,
              y,
              1,
              1,
              new ColorDetails("#111100", "#aaaa00"),
              new Properties(0.25)
            );
          }
        }
      }
    } catch (e) {}
  }
  async checkSafety() {
    try {
      if (this.yxGameMap[this.playerPos[1]][this.playerPos[0]] == "E") {
        this.coins = this.coins == 0 ? 0 : this.coins - 1;
        this.reset = true;
      } else if (this.yxGameMap[this.playerPos[1]][this.playerPos[0]] == "C") {
        this.coins++;
        this.yxGameMap[this.playerPos[1]] = setCharAt(
          this.yxGameMap[this.playerPos[1]],
          this.playerPos[0],
          "G"
        );
        this.gameMap = this.yxGameMap.join("\n");

        document.getElementById("coinsval").innerHTML = this.coins;
        this.saveData();
      }
    } catch (e) {
      console.log(e);
    }
  }
  async sceneGame() {
    this.gameMapBg();
    this.renderPlayer();
    this.checkSafety();
  }
}
var p;
const run = async () => {
  p = new OpenVS(new Image("canv", 1920, 1080));
};
window.addEventListener("beforeunload", function (e) {
  p.saveData();
});
run();
