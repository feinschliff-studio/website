class a extends HTMLElement{constructor(){super(),this.doRender()}async doRender(){const e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=await this.styles(),e.appendChild(t),await this.render(e)}connectedCallback(){}disconnectedCallback(){}static getTagName(){return this.name}static register(e){e.define(this.getTagName(),this)}}export{a as C};
//# sourceMappingURL=CustomElement.43dab8c6.js.map
