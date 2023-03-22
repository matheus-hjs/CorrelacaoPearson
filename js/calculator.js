"use strict";

const btnAdd = document.getElementById("btnAdd");
const btnRemove = document.getElementById("btnRemove");
const btnConfirm = document.getElementById("btnConfirm");
const sumTable = document.getElementById("sum-table");
const outputR = document.getElementById("outputR");
const outputT = document.getElementById("outputT");

//Add and Delete rows---------------------------------------
function addRow() {
    const form = document.querySelector(".container__form");
    const newInputs = document.createElement("div");
    newInputs.classList.add("container__form-inputs")
    newInputs.innerHTML = `<div>
                                <label for="x">X</label>
                                <input type="number" name="x" data-input data-x>
                            </div>
                            <div>
                                <label for="y">Y</label>
                                <input type="number" name="y" data-input data-y>
                            </div>`
    form.appendChild(newInputs);
}

function deleteRow() {
    const form = document.querySelector(".container__form");
    form.removeChild(form.lastChild);
}

//Validating inputs-----------------------------------------
function checkInputs() {
    const checkInputs = document.querySelectorAll("[data-input]");
    let isValid = false;
    for (const checkInput of checkInputs) {
        if (checkInput.value == '') {
            isValid = false;
            break;
        } else {
            isValid = true;
        }
    }
    return isValid;
}

//Value Getters--------------------------------------------------------
function getX() {
    const xValues = [];
    const xInputs = document.querySelectorAll("[data-x]");

    for (let i = 0; i < xInputs.length; i++) {
        xValues.push(xInputs[i].value);
        xValues[i].replace(/, /g, '.');
    }
    return xValues.map(Number);
}

function getY() {
    const yValues = [];
    const yInputs = document.querySelectorAll("[data-y]");
    for (let i = 0; i < yInputs.length; i++) {
        yValues.push(yInputs[i].value);
        yValues[i].replace(/, /g, '.');
    }
    return yValues.map(Number);
}

function getSum(modifier) {
    switch (modifier) {
        case "x":
            return getX().reduce((a, b) => a + b, 0);
        case "y":
            return getY().reduce((a, b) => a + b, 0);
        case "sqx":
            return getX().map((e) => e * e).reduce((a, b) => a + b, 0);
        case "sqy":
            return getY().map((e) => e * e).reduce((a, b) => a + b, 0);
        case "xy":
            return getX().map((e, index) => e * getY()[index]).reduce((a, b) => a + b, 0);
    }
}

function getR() {
    return calculateR(getX().length, getSum("x"),
        getSum("y"), getSum("sqx"), getSum("sqy"), getSum("xy"));
}

function getT() {
    return calculateT(getR(), getX().length);
}



function showSum() {
    sumTable.rows[0].cells[0].innerHTML = getSum("x").toFixed(2);
    sumTable.rows[0].cells[1].innerHTML = getSum("y").toFixed(2);
    sumTable.rows[0].cells[2].innerHTML = getSum("sqx").toFixed(2);
    sumTable.rows[0].cells[3].innerHTML = getSum("sqy").toFixed(2);
    sumTable.rows[0].cells[4].innerHTML = getSum("xy").toFixed(2);
}

//Calculating functions-------------------------------------------
function calculateR(n, sumX, sumY, sumSqX, sumSqY, sumXY) {
    const r = (sumXY - ((sumX * sumY) / n))
        / (Math.sqrt((sumSqX - ((sumX ** 2) / n)) * (sumSqY - ((sumY ** 2) / n))));
    return r.toFixed(2);
}

function calculateT(r, n) {
    const t = (r / Math.sqrt(1 - (r ** 2)))
        * Math.sqrt(n - 2);
    return t.toFixed(2);
}

//Defining 5% Alpha Table comparison value-----------------------------
const alphaTable = {
    tableLength: 27,
    degreeOfFreedom: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18,
        19, 21, 22, 24, 27, 29, 40, 60, 120, 121],
    alphaValues: [12.71, 4.30, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26,
        2.23, 2.20, 2.18, 2.16, 2.14, 2.13, 2.12, 2.11, 2.10,
        2.09, 2.08, 2.07, 2.06, 2.05, 2.04, 2.02, 2.00, 1.98, 1.96]
}

function alphaValue(n) {
    let i = alphaTable.tableLength + 1;
    let alpha = 0;
    do {
        i--;
    } while (n - 2 < alphaTable.degreeOfFreedom[i])
    alpha = alphaTable.alphaValues[i];
    return alpha;
}

//Defining Correlation and Significance--------------------------------
function checkCorrelation(r) {
    if (r > -0.3 && r < 0.3) {
        return "desprezível";
    } else if (r > 0) {
        if (r < 0.5) {
            return "positiva fraca";
        } else if (r < 0.7) {
            return "positiva moderada";
        } else {
            return "positiva forte";
        }
    } else if (r > -0.5) {
        return "negativa fraca";
    } else if (r > -0.7) {
        return "negativa moderada";
    } else {
        return "negativa forte";
    }
}

function checkSignificance(t) {
    return t > alphaValue(getX().length) ? "significativa" : "não significativa";
}

//Result function------------------------------------------------------
function runCorrelation() {
    if (checkInputs() == false) {
        alert("Todos os campos devem ser preenchidos!");
    } else {
        showSum();
        outputR.innerHTML = getR() + " - Correlação " + checkCorrelation(getR());
        outputT.innerHTML = getT() + " - Comparação com a tabela Alfa(5%): " +
        alphaValue(getX().length) + " - Correlação " + checkSignificance(getT());
    }
}

//Event listeners---------------------------------------------
btnAdd.addEventListener("click", addRow);
btnRemove.addEventListener("click", deleteRow);
btnConfirm.addEventListener("click", runCorrelation);


