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

// ----------------

let btn_set_background = document.getElementById("set-background-red");
btn_set_background.addEventListener("click", set_background);


let tabId;
chrome.tabs.query({active: true, currentWindow: true}, 
    function(tabs) {
        var currTab = tabs[0];
    if (currTab) { tabId=currTab.id; }
})

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

// ----------------------

let btn_set_color_links = document.getElementById("set-color-links")
btn_set_color_links.addEventListener("click", set_color_links)

function set_color_links() {
    let color = document.getElementById("color").value;
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: modificaColorLinks,
        args:[color]
    })
}

function modificaColorLinks(color) {
    let links = document.querySelectorAll("a")
    links.forEach((a) => {
        a.style.color = color;
    })
}

// ----------------------

let btn_remove_image = document.getElementById("remove-images");
btn_remove_image.addEventListener("click", remove_images);

function remove_images() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fn_remove_images,
    })
}

function fn_remove_images() {
    let imgs = document.querySelectorAll("img")
    imgs.forEach((img) => {
        img.remove()
    })
}

// ----------------------

let btn_show_hidden_password = document.getElementById("show-hidden");

btn_show_hidden_password.addEventListener("click", show_hidden_password)

function show_hidden_password() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fn_show_hidden_password,
    })
}

function fn_show_hidden_password() {
    let inputs = document.querySelectorAll('input[type="password"], input[is_pass]')
    inputs.forEach((input) => {
        if (input.getAttribute('is_pass') === 'true') {
            input.setAttribute('is_pass', 'false');
            input.type = 'password';
        } else {
            input.setAttribute('is_pass', 'true');
            input.type = 'text';
        }
    })
}

// ----------------------
// AMAZON

let btn_show_alt_image = document.getElementById("show-alt-image")

btn_show_alt_image.addEventListener("click", show_alt_image)


function show_alt_image() {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: fn_show_alt_image,
    })
}

function fn_show_alt_image() {
    let images = document.querySelectorAll("img")
    images.forEach((img) => {
        if (!img.dataset.tooltipAdded) {
            img.addEventListener("mouseenter", () => {
                if (img.alt) {
                    let tooltip = document.createElement("div");
                    tooltip.style.position = "absolute";
                    tooltip.style.backgroundColor = "rgba(0,0,0,0.8)";
                    tooltip.style.color = "white";
                    tooltip.style.padding = "10px";
                    tooltip.style.borderRadius = "8px";
                    tooltip.style.zIndex = "9999";
                    tooltip.style.maxWidth = "200px";
                    tooltip.style.wordWrap = "break-word";
                    tooltip.style.textAlign = "center";
                    tooltip.style.transform = "translateX(-50%)";
                    tooltip.className = "image-tooltip";
                    
                    let displayText = img.alt.length > 100 
                        ? img.alt.substring(0, 100) + "..." 
                        : img.alt;
                    
                    tooltip.innerText = displayText;

                    const rect = img.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${window.scrollY + rect.top - 40}px`;

                    document.body.appendChild(tooltip);
                }
            });

            img.addEventListener("mouseleave", () => {
                const existingTooltip = document.querySelector(".image-tooltip");
                if (existingTooltip) {
                    existingTooltip.remove();
                }
            });

            img.dataset.tooltipAdded = "true";
        }
    });
}
