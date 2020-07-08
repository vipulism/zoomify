/**
 * THis is a web component which is used to create zoom 
 *
 * @summary Image zoom on Hover Version 0.1
 * @author Vipul Sharma <vipul0809@gmail.com>
 * 
 * Created at     : 2020-03-03 15:33:08 
 * Last modified  : 2020-07-08 16:08:00
 */

class ZoomHover extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
        <template id='zoom-template'>
            <style>
                .zoom-img {
                          background-repeat: no-repeat;
                          margin:0;
                          display:flex;
                         }
                .zoom-img:hover img {
                        opacity: 0;
                        
                        display:none;
                    }

                    .cursor-zoom{
                        cursor: zoom-in;
                    }
                .tumb {
                        align-items: center;
                        justify-content: center;
                        padding:1px;
                }
                .tumb img {
                        max-width: 100%;
                        max-height: 100%;
                        display:block;
                        pointer-events:none;
                    }
             </style>
                
             <figure class="tumb zoom-img">
               <img src='' alt="not found" />
            </figure>
    </template>`;

        this.backgroundImage = "";
        this.backgroundPosition = "0% 0%";
        this.height = "400px";
        this.disabled = false;
        this.image = ''
    }

    static get observedAttributes() {
        return ["image", "disable", "zoomimg"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.connectedCallback();
    }

    connectedCallback() {
        const content = this.root
            .querySelector("#zoom-template")
            .content.cloneNode(true);
        const image = content.querySelector("img");
        const figure = content.querySelector("figure");

        this.hasAttribute("height")
            ? (figure.style.height = `${this.getAttribute("height")}px`)
            : (figure.style.height = this.height);


        this.hasAttribute("width")
            ? (figure.style.width = `${this.getAttribute("width")}px`)
            : (figure.style.width = this.width);

        if (this.hasAttribute("zoomimg")) {
            const imgUrl = encodeURI(decodeURI(this.getAttribute("image")));
            this.backgroundImage = `url(${encodeURI(imgUrl)})`;
        }
        if (this.hasAttribute("disabled")) {
            this.disabled = this.getAttribute("disabled") === 'true';
        }
        if (this.hasAttribute("image")) {
            const imgAttr = encodeURI(decodeURI(this.getAttribute("image")));

            this.image = imgAttr;
            image.src = encodeURI(imgAttr);
            const oldFigr = this.root.querySelector('figure');
            if (oldFigr) {
                this.root.removeChild(oldFigr);
            }
            this.root.appendChild(content);



        }

        if (this.backgroundImage && !this.disabled) {
            this.addListener(figure);
        } else if (this.disabled) {
            this.removeListener(figure);
        }


    }

    handleMouseMove(e) {
        const { left, top, width, height } = e.target.getBoundingClientRect();

        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        this.backgroundPosition = `${x}% ${y}%`;
        e.target.classList = e.target.classList + ' cursor-zoom';
        e.target.style.backgroundImage = this.backgroundImage;
        e.target.style.backgroundPosition = this.backgroundPosition;
        e.target.innerHTML = ''
    }

    handleMouseOut(e) {
        e.target.classList = 'zoom-img tumb';
        const img = document.createElement('img')
        img.src = encodeURI(this.image);
        e.target.appendChild(img)
        this.backgroundPosition = "0% 0%";
        e.target.style.backgroundImage = "";
        e.target.style.backgroundPosition = "0% 0%";
    }




    addListener(figure) {
        figure.addEventListener("mousemove", this.handleMouseMove.bind(this));
        figure.addEventListener("mouseout", this.handleMouseOut.bind(this));
    }

    removeListener(figure) {
        figure.removeEventListener('mousemove', this.handleMouseMove)
        figure.removeEventListener("mouseout", this.handleMouseOut);
    }
}

customElements.define("zoom-hover", ZoomHover);

module.exports = ZoomHover;
