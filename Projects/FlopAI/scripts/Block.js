class Block {
  constructor (viewId, x_offset, y_offset, style) {
    this.x_offset = x_offset;
    this.y_offset = y_offset;
    this.viewId = viewId;
    this.style = style;
  }

  displayAsChildOf(parent) {
    let block = document.createElement("div");
    block.setAttribute("class", "block " + this.style);
    block.setAttribute("id", this.viewId);
    block.setAttribute("style", "left: "+(50*(this.x_offset)+"px"));
    block.setAttribute("style", block.getAttribute("style")+"; top: "+(50*(this.y_offset)+"px"));
    block.setAttribute("onclick", "mapManager.clickBlock(event)");
    block.setAttribute("oncontextmenu", "mapManager.specialBlock(event)");

    parent.appendChild(block);
  }
}
