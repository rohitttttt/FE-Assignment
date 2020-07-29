var initialData = {};
var config = {
    checkField: [
        { name: 'sunny', checked: true }, { name: 'cloudy', checked: true }, { name: 'snowy', checked: true }
    ]
};

function load() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            createItems(data);
            initialData = data;
        }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/Lokenath/JSON_DATA/master/data.json", true);
    xhttp.send();
}

function sortChange(isAscending) {
    config
    const data = { ...initialData };
    data.cities = data.cities.sort((a, b) => isAscending ? (a.temperature - b.temperature) : (b.temperature - a.temperature));
    reloadData(data);
}

const reloadData = (data) => {
    const container = document.getElementById("contentArea");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    createItems(data);
}
function onModalClick(show) {
    const element = document.getElementById('itemModal');
    element.className = `modal ${show ? '' : 'hideModal'}`;
}

const onCheckChange = (control) => {
    const { checked, name } = control;
    const data = { ...initialData };
    config.checkField.find(a => a.name === name).checked = checked;
    const selectedItems = config.checkField.filter(a => a.checked).map(a => a.name);

    data.cities = data.cities.filter(a => selectedItems.indexOf(a.type.toLowerCase()) > -1);
    reloadData(data);
}

const onItemClick = (item) => {
    console.log(item);
    const { temperatureColor } = initialData.metadata;
    const mainDiv = createItem(item, temperatureColor, true);
    const container = document.getElementById("modalContent");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(mainDiv);
    onModalClick(true);
}
const createItems = (data) => {
    const container = document.getElementById("contentArea");
    const { temperatureColor } = data.metadata;
    data.cities.forEach((city) => {
        const mainDiv = createItem(city, temperatureColor);

        const secondMainDiv = document.createElement("div");
        secondMainDiv.classList.add("weatherItem");
        secondMainDiv.onclick = () => onItemClick({ ...city });
        secondMainDiv.appendChild(mainDiv);

        container.appendChild(secondMainDiv);
    });
}
const createItem = ({ temperature, type, name, description }, temperatureColor, isModalItem) => {
    const firstDiv = document.createElement("div");
    firstDiv.classList.add("cityClass");
    const firstNode = document.createTextNode(name);
    firstDiv.appendChild(firstNode);

    const secondDiv = document.createElement("div");
    const colorRec = temperatureColor.filter(({ range }) => temperature >= range[0] && temperature <= range[1])[0];
    secondDiv.classList.add(`tempClass`);
    secondDiv.classList.add(colorRec.color);

    const celciusSpan = document.createElement("span");
    celciusSpan.appendChild(document.createTextNode('c'));

    const secondNode = document.createTextNode(temperature);
    secondDiv.appendChild(secondNode);
    secondDiv.appendChild(celciusSpan);

    const thirdDiv = document.createElement("div");
    thirdDiv.classList.add("typeClass");
    const thirdNode = document.createTextNode(type);
    thirdDiv.appendChild(thirdNode);



    const mainDiv = document.createElement("div");
    mainDiv.classList.add("weatherItemContent");

    mainDiv.appendChild(firstDiv);
    mainDiv.appendChild(secondDiv);
    mainDiv.appendChild(thirdDiv);

    if (isModalItem) {
        const fourthDiv = document.createElement("div");
        fourthDiv.classList.add("descClass");
        const fourthNode = document.createTextNode(description);
        fourthDiv.appendChild(fourthNode);
        mainDiv.appendChild(fourthDiv);
    }
    return mainDiv;
}
