// filp-card function
function flip() {
    document.getElementById("card").classList.toggle("card-flipped");
};

// retrieving data using ajax
function ajax_get(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
                createDonorsList(data);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Sorting data 
function compare(a, b) {
    const valueA = a.amount;
    const valueB = b.amount;

    if (valueA > valueB) return -1;
    if (valueA < valueB) return 1;
    return 0;
}

function createDonorsList(data) {
    // console.log(data);
    // console.log(data.sort(compare));

    const donorsData = data.sort(compare);

    const rowsData = [];
    const totalAmountNeeded = 25000;
    let totalAmountReceived = 0;
    let totalDonars = donorsData.length;
    let table = document.getElementById('donorTable');

    // add json data to the table rows.
    for (let i = 0; i < donorsData.length; i++) {

        // extract value for HTML header names count. 
        for (let row in donorsData[i]) {
            if (rowsData.indexOf(row) === -1) {
                rowsData.push(row);
            }
        }

        const tr = table.insertRow(-1);

        // to display top 10 donors 
        if (i < 10) {
            for (let j = 0; j < rowsData.length; j++) {
                let tabCell = tr.insertCell(-1);
                if (typeof (donorsData[i][rowsData[j]]) !== 'string') {
                    tabCell.innerHTML = currencyFormatter.format(donorsData[i][rowsData[j]]);
                } else {
                    tabCell.innerHTML = donorsData[i][rowsData[j]];
                }
            }
        }

        totalAmountReceived += donorsData[i].amount;
    }

    let percentageAmountValue = donataionReceivedInPercentage(totalAmountNeeded, totalAmountReceived);

    // to show the status
    if (percentageAmountValue < 1) { document.getElementById('donationStatus').innerText = `Active`; }
    if (percentageAmountValue >= 1) { document.getElementById('donationStatus').innerText = `Inactive`; }

    document.getElementById('totalPercentage').innerText = `${perecentageFormatter.format(percentageAmountValue)}`;
    document.getElementById('totalPercentage').style.fontWeight = `600`;
    document.getElementById('progressbar-width').style.width = `${perecentageFormatter.format(percentageAmountValue)}`;
    document.getElementById('totalDonors').innerText = `${totalDonars} Donors`;
    document.getElementById('totalDonors').style.fontWeight = `600`;
    document.getElementById('totalAmount').innerHTML = currencyFormatter.format(Math.round(totalAmountReceived)).bold();
    document.getElementById('totalAmountDonated').innerHTML = currencyFormatter.format(Math.round(totalAmountReceived)).bold() + " Donated";
}

function donataionReceivedInPercentage(totalNeeded, totalReceived) {
    return (totalReceived / totalNeeded);
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0
});

const perecentageFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent'
});

window.onload = function () {
    ajax_get('donors.json');
        // ajax_get('https://restcountries.eu/rest/v2/all');
}