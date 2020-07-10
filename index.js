/**
 * THis is a web component which is used to create zoom 
 *
 * @summary Image zoom on Hover Version 0.1
 * @author Vipul Sharma <vipul0809@gmail.com>
 * 
 * Created at     : 2020-03-03 15:33:08 
 * Last modified  : 2020-07-10 15:03:46
 */

class ZoomHover extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
        <template id='zoom-template'>
            <style>
            #zoom-template{
                position:relative;
            }
                .zoom-img {
                          background-repeat: no-repeat;
                          margin:0;
                          display:flex;
                         }
                .zoom-img:hover img {
                        /* opacity: 0; */
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
                        cursor: zoom-in;
                    }

                .zoomed{
                    left:100%;
                    top:0px;
                    position:absolute;
                    border:5px solid #ccc;
                    background-repeat: no-repeat;
                    background-color:#ccc;
                    display:none;
                }
                
             </style>
                  
             <figure class="tumb zoom-img">
               <img src='' alt="not found" />
            </figure>
            <div class="zoomed"></div>

    </template>`;

        this.backgroundImage = "";
        this.backgroundPosition = "0% 0%";
        this.height = "400px";
        this.width = "400px";
        this.disabled = false;
        this.image = ''
        this.zoomedImg = null;
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
        const figure = content.querySelector("figure.tumb");

        this.zoomedImg = content.querySelector(".zoomed");;

        if (this.hasAttribute("height")) {
            figure.style.maxHheight = `${this.getAttribute("height")}px`;
            this.zoomedImg.style.height = '500px'; //`${this.getAttribute("height")}px`;
            content.height = `$ {this.getAttribute("height")}px`;

        }

        if (this.hasAttribute("width")) {
            figure.style.maxWidth = `${this.getAttribute("width")}px`;
            this.zoomedImg.style.width = '500px'; // `${this.getAttribute("width")}px`;
            content.width = `${this.getAttribute("width")}px`;
        }



        if (this.hasAttribute("zoomimg")) {
            const imgUrl = encodeURI(decodeURI(this.getAttribute("zoomimg")));
            this.backgroundImage = `url(${imgUrl})`;
            this.disabled = imgUrl === 'null'; // this.getAttribute("disabled") === 'true';
        }
        // if (this.hasAttribute("disabled")) {
        // }
        if (this.hasAttribute("image")) {
            const imgAttr = encodeURI(decodeURI(this.getAttribute("image")));

            this.image = imgAttr;
            image.src = imgAttr;


            const oldFigr = this.root.querySelector('figure');
            const oldZoomedImg = this.root.querySelector('.zoomed');

            if (oldFigr) {
                this.root.removeChild(oldFigr);
            }
            if (oldZoomedImg) {
                this.root.removeChild(oldZoomedImg);
            }
            this.root.appendChild(content);
            this.zoomedImg = this.root.querySelector('.zoomed');
        }

        if (this.backgroundImage && !this.disabled) {
            this.addListener(image);
        } else if (this.disabled) {
            this.removeListener(image);
        }


    }

    handleMouseMove(e) {


        const { left, top, width, height } = e.target.getBoundingClientRect();

        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        this.backgroundPosition = `${x}% ${y}%`;
        // e.target.classList = e.target.classList + ' cursor-zoom';
        // e.target.style.backgroundImage = this.backgroundImage;
        // e.target.style.backgroundPosition = this.backgroundPosition;
        // e.target.innerHTML = '';
        //  const zoomed = document.createElement('div')
        //   this.zoomedImg = zoomed;



        this.zoomedImg.style.display = 'block';
        this.zoomedImg.style.backgroundImage = this.backgroundImage;
        this.zoomedImg.style.backgroundPosition = this.backgroundPosition;

    }

    handleMouseOut(e) {
        e.target.classList = 'zoom-img tumb';
        // const img = document.createElement('img')
        // img.src = encodeURI(this.image);
        // e.target.appendChild(img)
        this.backgroundPosition = "0% 0%";
        e.target.style.backgroundImage = "";
        e.target.style.backgroundPosition = "0% 0%";

        this.zoomedImg.style.display = 'none';
        this.zoomedImg.style.backgroundImage = "";
        this.zoomedImg.style.backgroundPosition = "0% 0%";


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
