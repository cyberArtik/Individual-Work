#include <emscripten.h>
#include <stdio.h>

#define MIN_PENSION 2778
#define MIN_SALARY 5000
#define DISABILITY_RATE_ABSENT 1.00
#define DISABILITY_RATE_SEVERE 0.75
#define DISABILITY_RATE_ACCENTUATED 0.70
#define DISABILITY_RATE_MEDIUM 0.50

typedef struct {
    char startDate[11];
    char endDate[11];
    float rate;
    float startSalary;
} ContributionPeriod;

typedef struct {
    char startDate[11];
    char endDate[11];
    int reasonCode; 
} NonContributoryPeriod;

EMSCRIPTEN_KEEPALIVE
float calculateSimplePension(float yearsWorked, float averageSalary) {
    const float coefficient = 1.35f / 100.0f; 
    return yearsWorked * averageSalary * coefficient;
}

EMSCRIPTEN_KEEPALIVE
float calculateExpandedPension(ContributionPeriod* contribPeriods, int numContrib, NonContributoryPeriod* nonContribPeriods, int numNonContrib, float minSalaryCountry, float averageSalaryCountry) {
    float totalContributoryMonths = 0;
    float totalContributions = 0;
    float totalNonContributoryMonths = 0;

    for (int i = 0; i < numContrib; i++) {
        float months = 12.0;
        totalContributoryMonths += months;
        totalContributions += contribPeriods[i].startSalary * (contribPeriods[i].rate / 100) * months;
    }

    for (int i = 0; i < numNonContrib; i++) {
        float months = 12.0;
        totalNonContributoryMonths += months;
    }

    float averageValorizedIncome = totalContributions / totalContributoryMonths;
    float pensionBase = (averageValorizedIncome * totalContributoryMonths + minSalaryCountry * totalNonContributoryMonths) / (totalContributoryMonths + totalNonContributoryMonths);
    
    return pensionBase;
}

EMSCRIPTEN_KEEPALIVE
double calculateDisabilityPension(int disabilityType, double averageValIncome) {
    double rate = 0.0;
    switch (disabilityType) {
        case 1:
            rate = DISABILITY_RATE_ABSENT;
            break;
        case 2:
            rate = DISABILITY_RATE_SEVERE;
            break;
        case 3:
            rate = DISABILITY_RATE_ACCENTUATED;
            break;
        case 4:
            rate = DISABILITY_RATE_MEDIUM;
            break;
        default:
            printf("Invalid disability type\n");
            return 0;
    }
    
    double disabilityPension = averageValIncome < MIN_PENSION ? MIN_SALARY * rate : averageValIncome;
    
    return disabilityPension;
}

// New function to calculate average monthly income from various sources
EMSCRIPTEN_KEEPALIVE
float calculateAverageMonthlyIncome(ContributionPeriod* periods, int count) {
    float totalIncome = 0.0;
    int totalMonths = 0;

    for (int i = 0; i < count; i++) {
        totalIncome += periods[i].startSalary * 12;  // Assuming salary remains constant over the year
        totalMonths += 12;  // Assume each period represents one year for simplicity
    }

    if (totalMonths > 0) {
        return totalIncome / totalMonths;
    } else {
        return 0.0;  // Prevent division by zero
    }
}

// Helper function to print contribution periods for debugging purposes
void printContributionPeriods(ContributionPeriod* periods, int count) {
    for (int i = 0; i < count; i++) {
        printf("Period %d: Start Date: %s, End Date: %s, Rate: %f, Start Salary: %f\n",
               i, periods[i].startDate, periods[i].endDate, periods[i].rate, periods[i].startSalary);
    }
}

// Additional function to simulate fetching data from a database or external source
void simulateDataFetch(ContributionPeriod* periods, int count) {
    // Normally you would fetch this data from a database, but here we simulate some data
    for (int i = 0; i < count; i++) {
        sprintf(periods[i].startDate, "2020-01-01");
        sprintf(periods[i].endDate, "2020-12-31");
        periods[i].rate = 1.35;
        periods[i].startSalary = 5000.00;  // Example fixed salary
    }
}

int main() {
    // Example usage of the enhanced code with more detailed simulation and output
    ContributionPeriod contribPeriods[5];
    simulateDataFetch(contribPeriods, 5);
    printContributionPeriods(contribPeriods, 5);
    float avgIncome = calculateAverageMonthlyIncome(contribPeriods, 5);
    printf("Average Monthly Income: %f\n", avgIncome);

    // Assume no non-contributory periods for simplicity in this example
    NonContributoryPeriod nonContribPeriods[1];  // Empty example
    float pension = calculateExpandedPension(contribPeriods, 5, nonContribPeriods, 0, MIN_SALARY, avgIncome);
    printf("Calculated Pension: %f\n", pension);

    return 0;
}
