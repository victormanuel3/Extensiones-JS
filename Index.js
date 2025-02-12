const facebookBtn = document.getElementById('facebook-btn');
const amazonBtn = document.getElementById('amazon-btn');
const facebookOptions = document.getElementById('facebook-options');
const amazonOptions = document.getElementById('amazon-options');

facebookBtn.addEventListener('click', () => {
    facebookBtn.classList.add('active');
    amazonBtn.classList.remove('active');
    facebookOptions.classList.add('active');
    amazonOptions.classList.remove('active');
});

amazonBtn.addEventListener('click', () => {
    amazonBtn.classList.add('active');
    facebookBtn.classList.remove('active');
    amazonOptions.classList.add('active');
    facebookOptions.classList.remove('active');
});

let tabId;
chrome.tabs.query({active: true, currentWindow: true}, 
    function(tabs) {
        var currTab = tabs[0];
        if (currTab) { tabId = currTab.id; }
});

// Botones de Facebook
let btn_set_background = document.getElementById("set-background-red");
btn_set_background.addEventListener("click", set_background);

function set_background() {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: modificaColorFons,
        args:["red"]
    });
}

function modificaColorFons(color){
    document.body.style.backgroundColor = color;
}

let btn_set_color_links = document.getElementById("set-color-links");
btn_set_color_links.addEventListener("click", set_color_links);

function set_color_links() {
    let color = document.getElementById("color").value;
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: modificaColorLinks,
        args:[color]
    });
}

function modificaColorLinks(color) {
    let links = document.querySelectorAll("a");
    links.forEach((a) => {
        a.style.color = color;
    });
}

let btn_remove_image = document.getElementById("remove-images");
btn_remove_image.addEventListener("click", remove_images);

function remove_images() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fn_remove_images,
    });
}

function fn_remove_images() {
    let imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
        img.remove();
    });
}

let btn_show_hidden_password = document.getElementById("show-hidden");
btn_show_hidden_password.addEventListener("click", show_hidden_password);

function show_hidden_password() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fn_show_hidden_password,
    });
}

function fn_show_hidden_password() {
    let inputs = document.querySelectorAll('input[type="password"], input[is_pass]');
    inputs.forEach((input) => {
        if (input.getAttribute('is_pass') === 'true') {
            input.setAttribute('is_pass', 'false');
            input.type = 'password';
        } else {
            input.setAttribute('is_pass', 'true');
            input.type = 'text';
        }
    });
}

// Funcionalidad del Sticky Menu
let btn_enable_sticky = document.getElementById("show-alt-image");
btn_enable_sticky.addEventListener("click", createStickyMenu);

function createStickyMenu() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
            // Eliminar menú existente si hay alguno
            const existingMenu = document.getElementById('sticky-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            // Crear el sticky menu
            const stickyMenu = document.createElement('div');
            stickyMenu.id = 'sticky-menu';
            stickyMenu.style.cssText = `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background-color: #ffffff;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
            `;

            const showAltButton = document.createElement('button');
            showAltButton.textContent = 'Mostrar ALT';
            showAltButton.style.cssText = `
                display: block;
                margin-bottom: 10px;
                padding: 8px 16px;
                background-color: #4267B2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            showAltButton.addEventListener('click', function() {
                const images = document.querySelectorAll("img");
                images.forEach((img) => {
                    if (!img.dataset.tooltipAdded) {
                        img.addEventListener("mouseenter", () => {
                            if (img.alt) {
                                const tooltip = document.createElement("div");
                                tooltip.style.cssText = `
                                    position: fixed;
                                    background-color: rgba(0,0,0,0.8);
                                    color: white;
                                    padding: 10px;
                                    border-radius: 8px;
                                    z-index: 9999;
                                    max-width: 200px;
                                    word-wrap: break-word;
                                    text-align: center;
                                    pointer-events: none;
                                    transform: translate(-50%, -100%);
                                `;
                                tooltip.className = "image-tooltip";
                                tooltip.innerText = img.alt;
                                
                                const rect = img.getBoundingClientRect();
                                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                                tooltip.style.top = `${rect.top - 10}px`;
            
                                document.body.appendChild(tooltip);
                            }
                        });
            
                        img.addEventListener("mouseleave", () => {
                            const tooltips = document.querySelectorAll(".image-tooltip");
                            tooltips.forEach(tooltip => tooltip.remove());
                        });
            
                        img.dataset.tooltipAdded = "true";
                    }
                });
            });
            
            const findLowestPriceButton = document.createElement('button');
            findLowestPriceButton.textContent = 'Precio más bajo';
            findLowestPriceButton.style.cssText = showAltButton.style.cssText;
            findLowestPriceButton.addEventListener('click', function() {
                const priceElements = document.querySelectorAll('span._cDEzb_p13n-sc-price_3mJ9Z');
                let lowestPrice = Infinity;
                let lowestPriceElement = null;

                priceElements.forEach(element => {
                    const priceText = element.textContent.replace('€', '').replace(',', '.').trim();
                    const price = parseFloat(priceText);
                    
                    if (price < lowestPrice) {
                        lowestPrice = price;
                        lowestPriceElement = element;
                    }
                });

                if (lowestPriceElement) {
                    // Resetear estilos previos
                    document.querySelectorAll('.lowest-price-highlight').forEach(el => {
                        el.classList.remove('lowest-price-highlight');
                    });

                    const productContainer = lowestPriceElement.closest('[data-asin]') || lowestPriceElement.parentElement;
                    
                    // Aplicar estilos al contenedor
                    productContainer.classList.add('lowest-price-highlight');
                    productContainer.style.cssText = `
                        border: 3px solid #ff9900 !important;
                        background-color: #fff3e0 !important;
                        padding: 10px !important;
                        transition: all 0.3s ease;
                    `;

                    // Scroll al elemento
                    productContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            stickyMenu.appendChild(showAltButton);
            stickyMenu.appendChild(findLowestPriceButton);
            document.body.appendChild(stickyMenu);
        }
    });
}