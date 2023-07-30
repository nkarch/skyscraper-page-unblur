const imgCells = document.querySelectorAll("td[style*='background-image']");
const isSingleBuildingPage = window.location.href.includes("buildingID");
const SCALE = "150%";
const REGEX = /\"(.*?)\"/; // Find between double quotes

function updateImgElement(parentElement, newUrl) {
    const img = parentElement.querySelector("img");

    img.src = newUrl;
    img.style.transformOrigin = "bottom center";
    img.style.transition = "transform .25s";

    parentElement.style.position = "relative";

    img.addEventListener("mouseover", () => {
        parentElement.style.backgroundImage = "";
        img.style.transform = `scale(${SCALE})`;
    });

    img.addEventListener("mouseout", () => {
        img.style.transform = "scale(1)";
    });
}

function replaceCellBackgroundImg(element, newUrl) {
    element.style.backgroundImage = `url(${newUrl})`;
}

async function getNewUrl(bgImg) {
    const oldImgUrl = bgImg.match(REGEX)[1];
    const clearImageUrl = oldImgUrl.replace("blurred/", "");

    try {
        const response = await fetch(clearImageUrl);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.url;
    } catch (err) {
        console.error("Error:", err);
        return false;
    }
}

imgCells.forEach(async (cell) => {
    const newUrl = await getNewUrl(cell.style.backgroundImage);

    if (newUrl) {
        if (isSingleBuildingPage) {
            replaceCellBackgroundImg(cell, newUrl);
            cell.querySelector('a[href*="/members/login/"')?.remove();
        } else {
            cell.style.position = "relative";
            updateImgElement(cell, newUrl);
        }
    }
});
