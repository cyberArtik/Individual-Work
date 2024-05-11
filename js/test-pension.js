
// simple 
function calculateSimplePension(yearsWorked, averageSalary) {
    const coefficient = 1.35 / 100; 
    return yearsWorked * averageSalary * coefficient;

}


// Expanded
function calculateExpandedPension(contributionPeriods, nonContributoryPeriods, minSalaryCountry, averageSalaryCountry) {
    let totalContributoryMonths = 0;
    let totalNonContributoryMonths = 0;
    let totalContributions = 0;
    
    contributionPeriods.forEach(period => {
        const months = monthsBetweenDates(period.startDate, period.endDate);
        totalContributoryMonths += months;
        totalContributions += period.startSalary * (period.rate / 100) * months;
    });

    nonContributoryPeriods.forEach(period => {
        const months = monthsBetweenDates(period.startDate, period.endDate);
        totalNonContributoryMonths += months;
    });

    const averageValorizedIncome = totalContributions / totalContributoryMonths;
    const pensionBase = (averageValorizedIncome * totalContributoryMonths + minSalaryCountry * totalNonContributoryMonths) / (totalContributoryMonths + totalNonContributoryMonths);

    return pensionBase;
}

function getContributionPeriods() {
    const contributionStages = document.querySelectorAll('.contribution-stage');
    let periods = [];
    contributionStages.forEach(stage => {
        let startDate = stage.querySelector('input[name="startDate"]').value;
        let endDate = stage.querySelector('input[name="endDate"]').value;
        let rate = parseFloat(stage.querySelector('input[name="rate"]').value);
        let startSalary = parseFloat(stage.querySelector('input[name="startSalary"]').value);
        periods.push({ startDate, endDate, rate, startSalary });
    });
    return periods;
}

function getNonContributoryPeriods() {
    const nonContributionStages = document.querySelectorAll('.non-contribution-stage');
    let periods = [];
    nonContributionStages.forEach(stage => {
        let startDate = stage.querySelector('input[name="startDate"]').value;
        let endDate = stage.querySelector('input[name="endDate"]').value;
        let reason = stage.querySelector('select.non-contributory-reason').value;
        periods.push({ startDate, endDate, reason });
    });
    return periods;
}

// Event listener for the calculate-pension-btn
document.getElementById('calculate-pension-btn').addEventListener('click', function() {
    let pensionAmount =0 ;
    let activeTab = document.querySelector('.tablinks.active').textContent.trim();
    let messageDisplay = document.getElementById('contribution-message');
    messageDisplay.textContent = ''; // incepem din nou

    let yearsWorked = parseFloat(document.getElementById('years-worked').value);
    const fullPensionYears = 34; 

    const minSalary = 5000; 
    const minPension = 2778;

    const disabilityRates = {
        '1': 1,   
        '2': 0.75, 
        '3': 0.70, 
        '4': 0.50 
    };

    let disabilityPensionType = document.querySelector('input[name="type"]:checked').value;
    let disabilityAdjustmentRate = disabilityRates[disabilityPensionType];



    if (yearsWorked < 15) {
        document.getElementById('contribution-message').textContent = `You have worked only ${yearsWorked} years, which is less than the minimum required 15 years. No standard pension can be calculated.`;
    } else {
        
        if (activeTab === 'Simple Mode') {
            let yearsWorked = parseFloat(document.getElementById('years-worked').value);
            let averageSalary = parseFloat(document.getElementById('square-input').value);
            disabilityType = document.querySelector('input[name="type"]:checked').value;
            pensionAmount = calculateSimplePension(yearsWorked, averageSalary);

        } else if (activeTab === 'Expanded Mode') {
            let contribPeriods = getContributionPeriods();
        let nonContribPeriods = getNonContributoryPeriods();
        let minSalaryCountry = parseFloat(document.getElementById('s-min').value);
        let averageSalaryCountry = parseFloat(document.getElementById('s-med').value);
        pensionAmount = calculateExpandedPension(contribPeriods, nonContribPeriods, minSalaryCountry, averageSalaryCountry);
        }
    }

    if (disabilityPensionType !== '1') {  
        pensionAmount = minSalary * disabilityRates[disabilityPensionType];
        document.getElementById('contribution-message').textContent = `Tipului de dizabilitate ${disabilityType}, pensia dumneavoastră este ajustată la ${pensionAmount.toFixed(2)} lei`;
    } else {
        document.getElementById('contribution-message').textContent = `Pensia dumneavoastră calculată (fără considerații de dizabilitate) este de ${pensionAmount.toFixed(2)} lei.`;
    }



    // Determinam daca pensia completa sau incompleta
    let pensionStatus, yearsRemaining;
    if (yearsWorked >= fullPensionYears) {
        pensionStatus = "complete";
        yearsRemaining = 0;
    } else {
        pensionStatus = "incomplete";
        yearsRemaining = fullPensionYears - yearsWorked;
    }

    // plasam pensia pe display
    document.getElementById('total-price').textContent = pensionAmount.toFixed(2);
    // document.getElementById('total-price2').textContent = yearsRemaining;
    if (pensionStatus === "incomplete") {
        document.querySelector('.calc-pension').textContent = `Pensia dvs este incompletă: mai aveți ${yearsRemaining} ani până la pensie completă.`;
    } else {
        document.querySelector('.calc-pension').textContent = "Pensia dvs este completă.";
    }

    console.log(`Pensia calculata: ${pensionAmount} lei. Pensia status: ${pensionStatus}.`);
});
