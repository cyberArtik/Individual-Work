// LUCRU CU INPUTURI


const squareInput = document.querySelector('#square-input');
const squareRange = document.querySelector('#square-range');

// range + range

squareRange.addEventListener('input', () => {
    console.log("input!!!");
    squareInput.value = squareRange.value;

});
squareInput.addEventListener('input', ()=> {
    squareRange.value = squareInput.value;
});



// tablinks SIMPLE || EXPANDED

function openMode(evt, modeName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(modeName).style.display = "block";
    evt.currentTarget.className += " active";
}




// Simple mode default la incarcarea web
function createPeriod(periodNumber) {
    var contributionStage = document.createElement('div');
    contributionStage.className = 'contribution-stage';
    contributionStage.innerHTML = `
        <h3>Period #${periodNumber}</h3>
        <div class="input-group">
            <input type="date" name="startDate" placeholder="Start Date (mm/dd/yyyy)" class="date-input" />
            <input type="date" name="endDate" placeholder="End Date (mm/dd/yyyy)" class="date-input" />
            <input type="number" name="rate" placeholder="Rate %" class="number-input" />
            <input type="number" name="startSalary" placeholder="Start Salary" class="number-input" />
        </div>
    `;
    return contributionStage;
}

// Functie adaugam perioada noua
function addNewPeriod() {
    var periodsContainer = document.getElementById('periods-container');
    var periodNumber = periodsContainer.getElementsByClassName('contribution-stage').length + 1;
    var newPeriod = createPeriod(periodNumber);
    periodsContainer.appendChild(newPeriod);
}

document.getElementById('add-period-btn').addEventListener('click', addNewPeriod); // button pentru adaugare 
addNewPeriod(); // facem o perioada by default!!!!!!!!!!!


// Deleting Con and NonCon period
document.getElementById('delete-period-btn').addEventListener('click', deleteLastPeriod);
        function deleteLastPeriod() {
            var periodsContainer = document.getElementById('periods-container');
            var periods = periodsContainer.getElementsByClassName('contribution-stage');
            if(periods.length > 0) {
                // Remove the last period element
                periodsContainer.removeChild(periods[periods.length - 1]);
            } else {
                alert("No more periods to delete.");
            }
        }
        
        // Functie creem perioada NonContributiva Noua
        function createNonContributoryPeriod(periodNumber) {
            var nonContributionStage = document.createElement('div');
            nonContributionStage.className = 'non-contribution-stage';
            nonContributionStage.innerHTML = `
                <h3>Non-Contributory Period #${periodNumber}</h3>
                <div class="input-group">
                    <input type="date" name="startDate" class="date-input" />
                    <input type="date" name="endDate" class="date-input" />
                    <select class="non-contributory-reason">
                        <option value="military">Fulfillment of military service within the term or with a reduced term</option>
                        <option value="military_contract">Performance of military service by contract</option>
                        <option value="child_care">Care of a child up to the age of 3</option>
                        <option value="temporary_incapacity">Insured and benefited from compensation for temporary incapacity for work</option>
                        <option value="severe_disability_care">Care of a child with a severe disability</option>
                        <option value="judge_prosecutor">Non-contributory activity in the position of judge and prosecutor</option>
                     </select>
                </div>
            `;
            return nonContributionStage;
        }

        // Functie adaugam perioada NonContributiva Noua
        function addNewNonContributoryPeriod() {
            var periodsContainer = document.getElementById('periods-container');
            var periodNumber = periodsContainer.getElementsByClassName('non-contribution-stage').length + 
                            periodsContainer.getElementsByClassName('contribution-stage').length + 1;
            var newPeriod = createNonContributoryPeriod(periodNumber);
            periodsContainer.appendChild(newPeriod);
        }

document.getElementById('add-noncontrib-period-btn').addEventListener('click', addNewNonContributoryPeriod);
function deleteLastPeriod() {
    var periodsContainer = document.getElementById('periods-container');
    var allPeriods = periodsContainer.children;
    if(allPeriods.length > 0) {
        periodsContainer.removeChild(allPeriods[allPeriods.length - 1]);
    } else {
        alert("No more periods to delete.");
    }
}


function setGender(gender) {
    const genderInput = document.getElementById('gender');
    genderInput.value = gender === 'Male' ? '1' : '2';
    console.log("gender type is: ", genderInput.value);
}

    // logging the input 
    document.getElementById('calculate-pension-btn').addEventListener('click', function() {
        var data = {};
        var activeTab = document.querySelector('.tablinks.active').textContent.trim();
        var inputs = document.querySelectorAll('#form input');
        
        // Ziua nasterii + gender
        data['birthDay'] = document.getElementById('birth-day').value;
        data['birthMonth'] = document.getElementById('birth-month').value;
        data['birthYear'] = document.getElementById('birth-year').value;
        data['gender'] = document.getElementById('gender').value;

        if (activeTab === 'Simple Mode') {
            data['yearsWorked'] = document.getElementById('years-worked').value;
            data['averageSalary'] = document.getElementById('square-input').value;
        } else if (activeTab === 'Expanded Mode') {
            data['contributionPeriods'] = Array.from(document.querySelectorAll('.contribution-stage')).map(period => {
                let startDateStr = period.querySelector('.date-input[name="startDate"]').value;
                let endDateStr = period.querySelector('.date-input[name="endDate"]').value;
                
                let startDate = startDateStr ? new Date(startDateStr) : null;
                let endDate = endDateStr ? new Date(endDateStr) : null;
                return {
                    startDate: startDate ? startDate.toISOString().substring(0, 10) : '',
                    endDate: endDate ? endDate.toISOString().substring(0, 10) : '',
                    rate: period.querySelector('.number-input[name="rate"]').value,
                    startSalary: period.querySelector('.number-input[name="startSalary"]').value
                };
            });

            data['nonContributoryPeriods'] = Array.from(document.querySelectorAll('.non-contribution-stage')).map(period => {
                let startDateInput = period.querySelector('.date-input[name="startDate"]');
                let endDateInput = period.querySelector('.date-input[name="endDate"]');
                let reasonSelect = period.querySelector('.non-contributory-reason');
            
                return {
                    startDate: startDateInput ? startDateInput.value : '',
                    endDate: endDateInput ? endDateInput.value : '',
                    reason: reasonSelect ? reasonSelect.value : ''
                };
            });

            // colectam salariu minim si salariu mediu pe an
            data['minSalaryCountry'] = document.getElementById('s-min').value;
            data['averageSalaryCountry'] = document.getElementById('s-med').value;
        }
        var disabilityPensionType = document.querySelector('input[name="type"]:checked').value;
        data['disabilityPensionType'] = disabilityPensionType;

        switch (disabilityPensionType) {
            case '1': 
                break;
            case '2': 
                break;
            case '3': 
                break;
            case '4': 
                break;
            default:
                break;
        }

        console.log(data);
    });


// limitam numar de digits zz ll aaaa
function limitInputLength(inputElement, maxLength) {
    inputElement.addEventListener('input', function() {
        if (this.value.length > maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
        // Toggle the input-full class based on content length
        if (this.value.length == maxLength) {
            this.classList.add('input-full-dby');
        } else {
            this.classList.remove('input-full-dby');
        }
    });
}

// aplicam limita
limitInputLength(document.getElementById('birth-day'), 2);
limitInputLength(document.getElementById('birth-month'), 2);
limitInputLength(document.getElementById('birth-year'), 4);

// Logam data de gender
function setGender(gender) {
    const maleButton = document.querySelector('.input-male');
    const femaleButton = document.querySelector('.input-female');
    const genderInput = document.getElementById('gender');
    
    genderInput.value = gender === 'Male' ? '1' : '2'; // 1 - male 2 - female
    if(gender === 'Male') {
        maleButton.classList.add('button-active');
        femaleButton.classList.remove('button-active');
    } else {
        maleButton.classList.remove('button-active');
        femaleButton.classList.add('button-active');
    }
}


// Parse date si calculam numarul de luni intre
function monthsBetweenDates(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

