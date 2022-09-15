if (document.getElementById("current_year_plus_one")) {
    document.getElementById("current_year_plus_one").innerText = new Date().getFullYear()+1;
}

if (document.title == "Emploi de Rêve") {

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
