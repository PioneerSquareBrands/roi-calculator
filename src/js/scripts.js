
document.addEventListener('DOMContentLoaded', function() {
  let waitTime = 300;
  let calculateTime = waitTime + 50;
  
  function sliderRange() {
    let inputElement = document.getElementById('amount');
    let unitsValueElement = document.querySelector('.amount-value');
    let breakRate = document.querySelector('#break-rate');

    inputElement.addEventListener('input', function() {
      unitsValueElement.textContent = inputElement.value;
      breakRate.value = inputElement.value/10;
      
      // Create an input event and dispatch it on the breakRate element
      const inputEvent = new Event('input', { bubbles: true });
      breakRate.dispatchEvent(inputEvent);
    });
  }
  function fakeInput() {
    // Fake inputs
    var inputContainers = document.querySelectorAll('.fake-input');

    // Loop through each input container
    inputContainers.forEach(function(container) {
      var input = container.querySelector('input');
      var fakeValue = container.querySelector('.fake-input__value');

      // Update the fake input value when the input changes
      input.addEventListener('input', function(e) {
        var newValue = e.target.value;
        fakeValue.textContent = newValue;
      });
    });
  }
  function bhCaseChange() {
    const radioButtons = document.querySelectorAll('input[name="brenthaven-case"]');
    let nameContainer = document.querySelector('.bh-case-name');

    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', event => {
        const price = event.target.value;
        const name = event.target.getAttribute('data-name');
        nameContainer.textContent = name;
      });
    }); 
  }
  function deviceDropdown() {
    var priceDropdown = document.getElementById('priceDropdown');
    var radioContainers = document.querySelectorAll('.radio-group');

    priceDropdown.addEventListener('change', function() {
      var selectedOption = priceDropdown.options[priceDropdown.selectedIndex];
      var selectedDevice = selectedOption.getAttribute('data-device');

      radioContainers.forEach(function(container) {
        var containerDevice = container.getAttribute('data-device');
        var radioButtons = container.querySelectorAll('.radio-option');

        if (containerDevice === selectedDevice) {
          container.style.display = 'block';
          radioButtons[0].click();
          //radioButtons[0].checked = true;
        } else {
          container.style.display = 'none';
        }
      });
    });

    // Trigger the change event initially to hide/show the appropriate radio buttons
    priceDropdown.dispatchEvent(new Event('change'));
  }
  function priceFormat(x) {

    return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function submit() {
    const button = document.querySelector('.calculate');

    button.addEventListener('click', function() {
      button.classList.add('calculate--process');
      button.textContent = 'Calculating...';

      setTimeout(function() {
        button.classList.remove('calculate--process');
        button.textContent = 'Calculate Savings';
      }, waitTime);
    });
  }

  function calculate() {
    let device = document.querySelector('#priceDropdown');
      let devicePrice = Number(device.value);
      let highTrade = Number(device.options[device.selectedIndex].getAttribute("data-hightrade"));
      let lowTrade = Number(device.options[device.selectedIndex].getAttribute("data-lowtrade"));
    let units = Number(document.querySelector('#amount').value);
    let bhCase = Number(document.querySelector('input[name="brenthaven-case"]:checked').value);
      let bhCaseName = document.querySelector('input[name="brenthaven-case"]:checked').getAttribute("data-name");
      
    let breakRate = Number(document.querySelector('#break-rate').value);
    let repairCost = Number(document.querySelector('#fix-cost').value);
    let itWage = Number(document.querySelector('#it-wage').value);
    let fixTime = Number(document.querySelector('#time-to-fix').value);
    let loanPrice = (breakRate*0.1)*devicePrice;

    let caseTotalCost = bhCase*units;
    let repairTotalCost = (itWage*fixTime*breakRate)+(repairCost*breakRate)+loanPrice;
    let timeLost = fixTime*breakRate;
    let lowestTradeIn = lowTrade*units;
    let highestTradeIn = highTrade*units;
    let tradeInSavings = (highTrade - lowTrade)*units;
    let roi = (repairTotalCost - caseTotalCost) + tradeInSavings;
    
    document.querySelector('.calculate').click();
    setTimeout(function() {
      document.querySelector('.results-comparison__case-total').textContent = '$' + priceFormat(caseTotalCost);
      document.querySelector('.results-comparison__repair-total').textContent = '$' + priceFormat(repairTotalCost);
      document.querySelector('.results-comparison__time-lost').textContent = timeLost + 'hrs';

      document.querySelector('.results-comparison__high-tradein').textContent = '$' + priceFormat(highestTradeIn);
      document.querySelector('.results-comparison__low-tradein').textContent = '$' + priceFormat(lowestTradeIn);

      document.querySelector('.results-total__value').textContent = priceFormat(roi);
    }, calculateTime);

    let test = (caseTotalCost.toFixed(2));

    /** Console Test **/
    console.log(`-----
Device: ${devicePrice}
Units: ${units}
Brenthaven Case: ${bhCase} (${bhCaseName})
Total Case Price: ${caseTotalCost}

Broken Units: ${breakRate}
Repair Cost: ${repairCost}
IT Wage: ${itWage}
Time to fix: ${fixTime}
Loan Price: ${loanPrice}
Total Cost Related to Device Repair: ${repairTotalCost}

High Trade in Value: ${highTrade}
Low Trade in Value: ${lowTrade}
Trade in Value Savings: ${tradeInSavings}

ROI: ${roi}
-----`);/** **/
  }
  function formUpdates() {
    var inputElements = document.querySelectorAll(".form-inputs input");

    inputElements.forEach(function(input) {
      input.addEventListener("change", function() {
        calculate();
      });
    });
  }
  
  formUpdates();
  submit();
  fakeInput();
  bhCaseChange();
  sliderRange();
  deviceDropdown();
});