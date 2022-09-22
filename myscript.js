Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const cumulateArray = arr => {
    let res = [];
    res[0] = arr[0];
    for (let i in arr) {
        if (i > 0) {
            res.push(arr[i] + res[i - 1]);
        }
    }
    return res;
};

html_page_titles = {
    "job": "Emploi de Rêve",
    "plan": "Planning",
    "watch": "Veille"
}

if (document.getElementById("current_year_plus_one")) {
    document.getElementById("current_year_plus_one").innerText = new Date().getFullYear()+1;
}

if (document.title == html_page_titles["job"]) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3d57bf02d7mshcffce366e733cedp106891jsnf5e6e01cb2f1',
            'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com'
        }
    };

    fetch('https://exchangerate-api.p.rapidapi.com/rapid/latest/EUR', options)
        .then(response => response.json())
        .then((data) => {
            rate_euro_pln = data.rates['PLN']
            console.log("1 euro = ", rate_euro_pln, "złotych. source=https://exchangerate-api.p.rapidapi.com/rapid/latest/EUR")
            fetch('https://www.insee.fr/fr/statistiques/1375188')
            .then(res => res.text())
            .then(html => {
                var parser = new DOMParser()
                var doc = parser.parseFromString(html, 'text/html')
                console.log("hourly wage in France, brutto: ", Number(doc.getElementsByTagName("td")[0].innerText.replace(',', '.')), "euros. Source=https://www.insee.fr/fr/statistiques/1375188")
                var wage = Math.round(Number(doc.getElementsByTagName("td")[0].innerText.replace(',', '.'))*151.67*rate_euro_pln)
                document.getElementById("realistic_wage").innerText = wage;
            })
            .catch(err => {
                console.log(err)
                document.getElementById("cannot_fetch").innerText = "contactez-nous"
            }
                )
            })
        .catch(err => {
            console.error(err)
            document.getElementById("cannot_fetch").innerText = "contactez-nous"
        });
    }

if (document.title == html_page_titles["plan"]) {

    // duration of the formation is 6 months, 180 days
    training_length = 180
    const labs = [
        'Découvrir le travail développeur web',
        'Transformer un CV en une page web',
        'Animer une page web avec CSS',
        'Optimiser une page Web',
        'Construire une application Web',
        'Construire une API sécurisée',
        'Construire un réseau social d\'entreprise'
    ];
    const bg_colors = [
        '#FF5733',
        '#E3FF33',
        '#33FF33',
        '#33F9FF',
        '#3349FF',
        '#B233FF',
        '#FF33B5'
    ];
    const theor_durations = [6, 20, 25, 9, 25, 14, 14];
    tds_needed_days = document.getElementsByClassName("days_needed");
    for (i of tds_needed_days) {
        i.innerText = theor_durations[[...tds_needed_days].indexOf(i)]
    };
    sum_days = document.getElementsByClassName("sum_days_needed");
    for (i of sum_days) {
        i.innerText = (theor_durations.reduce((a,b) => a+ b, 0)).toString();
        i.style.color = "rgba(100,0,256,1)";
        i.style.fontWeight = "bold";
    }
    let progression = cumulateArray(theor_durations);
    let progression_plus_we = progression.map(item => item > 5? (item+(Math.floor(item/5)*2)): item);
    let real_durations = progression_plus_we.map(item => (item%7)==0 ? item-2 : item);

    // building the chart
    canvas = document.getElementById("canvas-wrapper");
    canvas.style.height = '70vh';
    canvas.style.width = '80vw';

    const ctx = document.getElementById('daily-chart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labs,
            datasets: [{
                label: 'Estimation du temps nécessaire',
                data: theor_durations,
                backgroundColor: bg_colors,
                hoverOffset: 75
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend:{
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        color: 'white'
                    },

                    padding: 10
                },
                title: {
                    display: true,
                    position: 'top',
                    text: 'REPARTITION DU TEMPS SELON LES MODULES',
                    font: {
                        size: 18
                    },
                    color: 'white',
                    padding: {
                        bottom: 25
                    }
                }
            }
        }
    });

    if (window.innerWidth > 701) {
        myChart.options.plugins.legend.position = 'right';
        myChart.options.plugins.legend.align = 'center';
    };

    var next_monday = new Date();
    var next_monday_base =  (next_monday.getDate() + (((1 + 7 - next_monday.getDay()) % 7) || 7));
    var next_monday_num = (next_monday.getDate() + (((1 + 7 - next_monday.getDay()) % 7) || 7)).toString();
    var next_monday_month = (next_monday.getMonth()+1).toString();
    var next_monday_year = (next_monday.getFullYear()).toString();
    var next_monday_string = ([next_monday_year, next_monday_month, next_monday_num].reverse()).join("/");
    var next_mon = document.getElementById("next_monday");
    next_mon.innerText = next_monday_string;

    today_string = new Date().toLocaleDateString("fr-FR");
    today = document.getElementById('today');
    today.innerText = today_string;
    valid_monday = [next_monday_year, next_monday_month, next_monday_num].join("-");
    n = new Date(valid_monday);
    var ends = [];

    // important: week starts on sunday
    const week_days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

    // problem: if training ends on friday, ends displayed as on saturday
    // solution: reduce all durations by one day
    adjusted_real_durations = real_durations.map(item => item-1)

    for (i of adjusted_real_durations) {
        ends.push(week_days[(n.addDays(i)).getDay()] + " " + (n.addDays(i)).toLocaleDateString("fr-FR"))
    };

    end_dates = document.getElementsByClassName('end-date');
    for (i of end_dates) {
        i.innerText = ends[[...end_dates].indexOf(i)]
    };

    theorical_end = document.getElementById('theorical-end');
    theorical_end_obj = n.addDays(training_length-1);
    theorical_end.innerText = theorical_end_obj.toLocaleDateString("fr-FR");
    theorical_end.style.color = "red";
    theorical_end.style.fontWeight = "bold";

    evaluated_end = document.getElementById('evaluated-end');
    evaluated_end_obj = n.addDays(progression_plus_we.slice(-1)[0]-1);
    evaluated_end.innerText = evaluated_end_obj.toLocaleDateString("fr-FR");
    evaluated_end.style.color = "rgba(0, 256, 0, 1)";
    evaluated_end.style.fontWeight = "bold";

    reliquat = document.getElementById('diff_theorical_needed');
    reliquat_amount = 180 - progression_plus_we.slice(-1);
    reliquat.innerText = reliquat_amount;
    reliquat.style.color = "rgba(0,256,0,1)";
    reliquat.style.fontWeight = "bold";

}
