/**
 * ============================================================================
 * Electronics Calculator - Pure Vanilla JavaScript Logic
 * 
 * Features:
 *  1. Ohm's Law Calculator (Voltage, Current, Resistance)
 *  2. Power Calculator (P = V * I)
 *  3. Resistor Color Code Calculator (4-Band with visual SVG feedback)
 *  4. Quick Navigation smooth scrolling
 * ============================================================================
 */

// Wait for the DOM content to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================================
     HELPER UTILITIES
     ========================================================================== */

  /**
   * Helper: Formats a float number nicely, avoiding long decimals like 12.0000000002
   * @param {number} value - The number to format
   * @param {number} decimals - Maximum decimal places (default: 3)
   * @returns {string} Clean numeric string
   */
  function formatNumber(value, decimals = 3) {
    if (isNaN(value)) return "0";
    // Round to specified decimal places and convert back to float to drop trailing zeros
    const rounded = parseFloat(value.toFixed(decimals));
    // Return localized string for nice comma grouping on large numbers
    return rounded.toLocaleString("en-US", { maximumFractionDigits: decimals });
  }

  /**
   * Helper: Shows an error message in an alert box
   * @param {HTMLElement} element - The alert box container
   * @param {string} message - The message to display
   */
  function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = "flex";
  }

  /**
   * Helper: Hides an error alert box
   * @param {HTMLElement} element - The alert box container
   */
  function hideError(element) {
    if (!element) return;
    element.textContent = "";
    element.style.display = "none";
  }


  /* ==========================================================================
     1. OHM'S LAW CALCULATOR
     ========================================================================== */

  // DOM Elements for Ohm's Law
  const ohmsTargetRadios = document.querySelectorAll('input[name="ohms-target"]');
  const ohmsLabel1 = document.getElementById("ohms-label-1");
  const ohmsInput1 = document.getElementById("ohms-input-1");
  const ohmsUnit1 = document.getElementById("ohms-unit-1");
  const ohmsHint1 = document.getElementById("ohms-hint-1");

  const ohmsLabel2 = document.getElementById("ohms-label-2");
  const ohmsInput2 = document.getElementById("ohms-input-2");
  const ohmsUnit2 = document.getElementById("ohms-unit-2");
  const ohmsHint2 = document.getElementById("ohms-hint-2");

  const ohmsErrorBox = document.getElementById("ohms-error");
  const btnCalcOhms = document.getElementById("btn-calc-ohms");
  const btnResetOhms = document.getElementById("btn-reset-ohms");

  const ohmsResultVal = document.getElementById("ohms-result-val");
  const ohmsResultUnit = document.getElementById("ohms-result-unit");
  const ohmsResultStep = document.getElementById("ohms-result-step");

  /**
   * Updates the Ohm's Law input fields based on the selected calculation mode:
   * - Voltage: asks for Current (I) and Resistance (R)
   * - Current: asks for Voltage (V) and Resistance (R)
   * - Resistance: asks for Voltage (V) and Current (I)
   */
  function updateOhmsLawMode() {
    const selectedMode = document.querySelector('input[name="ohms-target"]:checked').value;
    
    // Clear any previous error and reset result
    hideError(ohmsErrorBox);
    ohmsResultVal.textContent = "--";

    if (selectedMode === "voltage") {
      // Solve for Voltage (V = I * R)
      ohmsLabel1.textContent = "Current (I):";
      ohmsInput1.placeholder = "e.g. 0.5";
      ohmsUnit1.textContent = "A";
      ohmsHint1.textContent = "Current in Amperes";

      ohmsLabel2.textContent = "Resistance (R):";
      ohmsInput2.placeholder = "e.g. 24";
      ohmsUnit2.textContent = "Ω";
      ohmsHint2.textContent = "Resistance in Ohms";

      ohmsResultUnit.textContent = "V";
      ohmsResultStep.textContent = "Formula: V = I × R";
    } else if (selectedMode === "current") {
      // Solve for Current (I = V / R)
      ohmsLabel1.textContent = "Voltage (V):";
      ohmsInput1.placeholder = "e.g. 12";
      ohmsUnit1.textContent = "V";
      ohmsHint1.textContent = "Potential difference in Volts";

      ohmsLabel2.textContent = "Resistance (R):";
      ohmsInput2.placeholder = "e.g. 24";
      ohmsUnit2.textContent = "Ω";
      ohmsHint2.textContent = "Resistance in Ohms";

      ohmsResultUnit.textContent = "A";
      ohmsResultStep.textContent = "Formula: I = V / R";
    } else if (selectedMode === "resistance") {
      // Solve for Resistance (R = V / I)
      ohmsLabel1.textContent = "Voltage (V):";
      ohmsInput1.placeholder = "e.g. 12";
      ohmsUnit1.textContent = "V";
      ohmsHint1.textContent = "Potential difference in Volts";

      ohmsLabel2.textContent = "Current (I):";
      ohmsInput2.placeholder = "e.g. 0.5";
      ohmsUnit2.textContent = "A";
      ohmsHint2.textContent = "Current in Amperes";

      ohmsResultUnit.textContent = "Ω";
      ohmsResultStep.textContent = "Formula: R = V / I";
    }
  }

  /**
   * Validates inputs and calculates Ohm's Law based on current mode
   */
  function calculateOhmsLaw() {
    hideError(ohmsErrorBox);

    const mode = document.querySelector('input[name="ohms-target"]:checked').value;
    const rawVal1 = ohmsInput1.value.trim();
    const rawVal2 = ohmsInput2.value.trim();

    // 1. Validation: Check if fields are empty
    if (rawVal1 === "" || rawVal2 === "") {
      showError(ohmsErrorBox, "⚠️ Please enter both values before calculating.");
      return;
    }

    const val1 = parseFloat(rawVal1);
    const val2 = parseFloat(rawVal2);

    // 2. Validation: Check if valid numbers
    if (isNaN(val1) || isNaN(val2)) {
      showError(ohmsErrorBox, "⚠️ Please enter valid numeric values.");
      return;
    }

    // 3. Perform calculation based on mode
    let result = 0;
    let unit = "";
    let stepDescription = "";

    if (mode === "voltage") {
      // V = I * R (val1 = I, val2 = R)
      result = val1 * val2;
      unit = "V";
      stepDescription = `V = I × R = ${formatNumber(val1)} A × ${formatNumber(val2)} Ω = ${formatNumber(result)} V`;
    } else if (mode === "current") {
      // I = V / R (val1 = V, val2 = R)
      // Check for division by zero
      if (val2 === 0) {
        showError(ohmsErrorBox, "⚠️ Resistance cannot be zero (Division by zero / Short circuit).");
        return;
      }
      result = val1 / val2;
      unit = "A";
      stepDescription = `I = V / R = ${formatNumber(val1)} V / ${formatNumber(val2)} Ω = ${formatNumber(result)} A`;
    } else if (mode === "resistance") {
      // R = V / I (val1 = V, val2 = I)
      // Check for division by zero
      if (val2 === 0) {
        showError(ohmsErrorBox, "⚠️ Current cannot be zero (Division by zero / Open circuit).");
        return;
      }
      result = val1 / val2;
      unit = "Ω";
      stepDescription = `R = V / I = ${formatNumber(val1)} V / ${formatNumber(val2)} A = ${formatNumber(result)} Ω`;
    }

    // Display the result
    ohmsResultVal.textContent = formatNumber(result);
    ohmsResultUnit.textContent = unit;
    ohmsResultStep.textContent = stepDescription;
  }

  /**
   * Resets the Ohm's Law calculator fields
   */
  function resetOhmsLaw() {
    ohmsInput1.value = "";
    ohmsInput2.value = "";
    hideError(ohmsErrorBox);
    ohmsResultVal.textContent = "--";
    updateOhmsLawMode();
  }

  // Event Listeners for Ohm's Law
  ohmsTargetRadios.forEach(radio => {
    radio.addEventListener("change", updateOhmsLawMode);
  });
  btnCalcOhms.addEventListener("click", calculateOhmsLaw);
  btnResetOhms.addEventListener("click", resetOhmsLaw);

  // Trigger calculation on Enter key inside Ohm's inputs
  [ohmsInput1, ohmsInput2].forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") calculateOhmsLaw();
    });
  });


  /* ==========================================================================
     2. POWER CALCULATOR (P = V * I)
     ========================================================================== */

  // DOM Elements for Power
  const powerVoltageInput = document.getElementById("power-voltage");
  const powerCurrentInput = document.getElementById("power-current");
  const powerErrorBox = document.getElementById("power-error");
  const btnCalcPower = document.getElementById("btn-calc-power");
  const btnResetPower = document.getElementById("btn-reset-power");

  const powerResultVal = document.getElementById("power-result-val");
  const powerResultUnit = document.getElementById("power-result-unit");
  const powerResultStep = document.getElementById("power-result-step");

  /**
   * Calculates electrical power using P = V * I
   */
  function calculatePower() {
    hideError(powerErrorBox);

    const rawVoltage = powerVoltageInput.value.trim();
    const rawCurrent = powerCurrentInput.value.trim();

    // 1. Validation: Check if fields are empty
    if (rawVoltage === "" || rawCurrent === "") {
      showError(powerErrorBox, "⚠️ Please enter both Voltage (V) and Current (I).");
      return;
    }

    const voltage = parseFloat(rawVoltage);
    const current = parseFloat(rawCurrent);

    // 2. Validation: Check if valid numbers
    if (isNaN(voltage) || isNaN(current)) {
      showError(powerErrorBox, "⚠️ Please enter valid numeric values.");
      return;
    }

    // 3. Calculate Power: P = V * I
    const power = voltage * current;

    // Display output in Watts
    powerResultVal.textContent = formatNumber(power);
    powerResultUnit.textContent = "W";
    
    // Provide formula breakdown with additional milliWatt or kiloWatt context if useful
    let extraContext = "";
    if (Math.abs(power) >= 1000) {
      extraContext = ` (${formatNumber(power / 1000)} kW)`;
    } else if (Math.abs(power) < 1 && power !== 0) {
      extraContext = ` (${formatNumber(power * 1000)} mW)`;
    }

    powerResultStep.textContent = `P = V × I = ${formatNumber(voltage)} V × ${formatNumber(current)} A = ${formatNumber(power)} W${extraContext}`;
  }

  /**
   * Resets the Power calculator fields
   */
  function resetPower() {
    powerVoltageInput.value = "";
    powerCurrentInput.value = "";
    hideError(powerErrorBox);
    powerResultVal.textContent = "--";
    powerResultUnit.textContent = "W";
    powerResultStep.textContent = "Enter Voltage & Current, then click Calculate Power.";
  }

  // Event Listeners for Power
  btnCalcPower.addEventListener("click", calculatePower);
  btnResetPower.addEventListener("click", resetPower);

  // Trigger calculation on Enter key inside Power inputs
  [powerVoltageInput, powerCurrentInput].forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") calculatePower();
    });
  });


  /* ==========================================================================
     3. RESISTOR COLOR CODE CALCULATOR (4-BAND)
     ========================================================================== */

  // DOM Elements for Resistor Color Code
  const band1Select = document.getElementById("band1-select");
  const band2Select = document.getElementById("band2-select");
  const band3Select = document.getElementById("band3-select");
  const band4Select = document.getElementById("band4-select");

  const swatch1 = document.getElementById("swatch-1");
  const swatch2 = document.getElementById("swatch-2");
  const swatch3 = document.getElementById("swatch-3");
  const swatch4 = document.getElementById("swatch-4");

  const svgBand1 = document.getElementById("svg-band-1");
  const svgBand2 = document.getElementById("svg-band-2");
  const svgBand3 = document.getElementById("svg-band-3");
  const svgBand4 = document.getElementById("svg-band-4");

  const btnCalcResistor = document.getElementById("btn-calc-resistor");
  const btnResetResistor = document.getElementById("btn-reset-resistor");

  const resistorResultVal = document.getElementById("resistor-result-val");
  const resistorResultTol = document.getElementById("resistor-result-tol");
  const resistorRawVal = document.getElementById("resistor-raw-val");
  const resistorRangeVal = document.getElementById("resistor-range-val");
  const resistorColorsSummary = document.getElementById("resistor-colors-summary");

  /**
   * Formats a raw resistance in Ohms (Ω) into standard engineering notation (Ω, kΩ, MΩ, GΩ)
   * @param {number} ohms - Resistance in Ohms
   * @returns {string} Formatted resistance string (e.g., "4.7 kΩ", "220 Ω", "1 MΩ")
   */
  function formatResistance(ohms) {
    if (ohms >= 1e9) {
      return formatNumber(ohms / 1e9) + " GΩ";
    } else if (ohms >= 1e6) {
      return formatNumber(ohms / 1e6) + " MΩ";
    } else if (ohms >= 1e3) {
      return formatNumber(ohms / 1e3) + " kΩ";
    } else {
      return formatNumber(ohms) + " Ω";
    }
  }

  /**
   * Updates the visual resistor graphic and swatch previews
   */
  function updateResistorVisuals() {
    // Get currently selected option's data-color attribute for each band
    const color1 = band1Select.options[band1Select.selectedIndex].getAttribute("data-color");
    const color2 = band2Select.options[band2Select.selectedIndex].getAttribute("data-color");
    const color3 = band3Select.options[band3Select.selectedIndex].getAttribute("data-color");
    const color4 = band4Select.options[band4Select.selectedIndex].getAttribute("data-color");

    // Update round swatch previews
    if (swatch1) swatch1.style.backgroundColor = color1;
    if (swatch2) swatch2.style.backgroundColor = color2;
    if (swatch3) swatch3.style.backgroundColor = color3;
    if (swatch4) swatch4.style.backgroundColor = color4;

    // Update SVG stripes on the resistor body graphic
    if (svgBand1) svgBand1.setAttribute("fill", color1);
    if (svgBand2) svgBand2.setAttribute("fill", color2);
    if (svgBand3) svgBand3.setAttribute("fill", color3);
    if (svgBand4) svgBand4.setAttribute("fill", color4);
  }

  /**
   * Calculates the nominal resistance and tolerance range from the 4 color bands
   */
  function calculateResistorCode() {
    updateResistorVisuals();

    // 1. Extract values from dropdown selections
    const digit1 = parseInt(band1Select.value, 10);
    const digit2 = parseInt(band2Select.value, 10);
    const multiplier = parseFloat(band3Select.value);
    const tolerance = parseFloat(band4Select.value);

    // 2. 4-Band Formula: Resistance = ((Digit 1 * 10) + Digit 2) * Multiplier
    const baseValue = (digit1 * 10) + digit2;
    const nominalOhms = baseValue * multiplier;

    // 3. Tolerance limits: Range = nominal ± tolerance%
    const toleranceMargin = nominalOhms * (tolerance / 100);
    const minOhms = Math.max(0, nominalOhms - toleranceMargin);
    const maxOhms = nominalOhms + toleranceMargin;

    // 4. Extract color names for summary
    const name1 = band1Select.options[band1Select.selectedIndex].text.split(" ")[0];
    const name2 = band2Select.options[band2Select.selectedIndex].text.split(" ")[0];
    const name3 = band3Select.options[band3Select.selectedIndex].text.split(" ")[0];
    const name4 = band4Select.options[band4Select.selectedIndex].text.split(" ")[0];

    // 5. Update readout elements
    resistorResultVal.textContent = formatResistance(nominalOhms);
    resistorResultTol.textContent = `± ${tolerance}%`;
    resistorRawVal.textContent = `${formatNumber(nominalOhms)} Ω`;
    resistorRangeVal.textContent = `${formatResistance(minOhms)} – ${formatResistance(maxOhms)}`;
    resistorColorsSummary.textContent = `${name1} • ${name2} • ${name3} • ${name4}`;
  }

  /**
   * Resets the resistor color code calculator to a common standard: 4.7 kΩ ± 5% (Yellow, Violet, Red, Gold)
   */
  function resetResistorCode() {
    band1Select.value = "4"; // Yellow
    band2Select.value = "7"; // Violet
    band3Select.value = "100"; // Red (x100)
    band4Select.value = "5"; // Gold (+/- 5%)
    calculateResistorCode();
  }

  // Event Listeners for Resistor dropdowns (auto-updates instantly on selection change!)
  [band1Select, band2Select, band3Select, band4Select].forEach(select => {
    select.addEventListener("change", calculateResistorCode);
  });

  btnCalcResistor.addEventListener("click", calculateResistorCode);
  btnResetResistor.addEventListener("click", resetResistorCode);


  /* ==========================================================================
     4. QUICK NAVIGATION & SMOOTH SCROLL
     ========================================================================== */
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to the target card
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

        // Update active class on nav buttons
        navButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });


  /* ==========================================================================
     INITIALIZATION ON PAGE LOAD
     ========================================================================== */
  // Initialize Ohm's law labels & state
  updateOhmsLawMode();

  // Initialize Resistor color code display & graphic
  calculateResistorCode();

});
