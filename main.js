const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");

getButton = document.querySelector("form button");
//INR as default from currency and JPY as default to currency
for (let i = 0; i < dropList.length; i++) {
    for(currency_code in country_code){
        let selected;
        if(i==0){
            selected = currency_code == "INR" ? "selected" : "";
        }
        else if(i==1){
            selected = currency_code == "JPY" ? "selected" : "";
        }
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);    
    }
    dropList[i].addEventListener("change", e =>{
        displayFlag(e.target);
    });
}

function displayFlag(element){
    for(code in country_code){
        if(code == element.value){ 
            let imgTag = element.parentElement.querySelector("img"); 
            imgTag.src = `https://flagsapi.com/${country_code[code]}/shiny/64.png` //country's pic api
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e=>{
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener('click', () =>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode; 
    displayFlag(fromCurrency); 
    displayFlag(toCurrency);  
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1"; //default input currency value as 1
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Fetching rate......";

    let api_url = `https://v6.exchangerate-api.com/v6/746379b7c8a059f9f8441651/latest/${fromCurrency.value}`;
    // fetching api response
    fetch(api_url).then(response => response.json()).then(result => {
        console.log(result);
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        //if user gives incorrect amount throws below error
        if(isNaN(totalExchangeRate)){
            exchangeRateTxt.innerText = "Provide Correct Amount..";
        }else{
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value} ` ;
        }
    }).catch(() => { 
        exchangeRateTxt.innerText = "Something went wrong. Try again later.."; //any error with api or internet
    });
}