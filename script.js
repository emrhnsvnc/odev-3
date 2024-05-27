let images = ["pp1.jpeg", "pp2.jpeg", "pp3.jpeg", "pp4.jpeg", "pp5.jpeg"];
let descriptions = ["Eskişehir hatırası", "Burası yenimahalle gençlik merkezi", "Burası araba fuarı klasik arabalarla dolu", "Burasıda göksü parkı", "Bu da bir klasik araba fuarından kalma hatta 3.resimle aynı gün"];
let currentIndex = 0;

function changeImage() {
    let imgElement = document.querySelector('.gallery img');
    let descElement = document.querySelector('.gallery p');
    
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
    descElement.textContent = descriptions[currentIndex];
}

function prevImage() {
    let imgElement = document.querySelector('.gallery img');
    let descElement = document.querySelector('.gallery p');
    
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    imgElement.src = images[currentIndex];
    descElement.textContent = descriptions[currentIndex];
}

function randomImage() {
    let imgElement = document.querySelector('.gallery img');
    let descElement = document.querySelector('.gallery p');
    
    let randomIndex = Math.floor(Math.random() * images.length);
    currentIndex = randomIndex;
    imgElement.src = images[currentIndex];
    descElement.textContent = descriptions[currentIndex];
}

function firstImage() {
    let imgElement = document.querySelector('.gallery img');
    let descElement = document.querySelector('.gallery p');
    
    currentIndex = 0;
    imgElement.src = images[currentIndex];
    descElement.textContent = descriptions[currentIndex];
}

function nextImage() {
    let imgElement = document.querySelector('.gallery img');
    let descElement = document.querySelector('.gallery p');
    
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
    descElement.textContent = descriptions[currentIndex];
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.gallery').addEventListener('click', changeImage);
    document.querySelector('#prevButton').addEventListener('click', prevImage);
    document.querySelector('#randomButton').addEventListener('click', randomImage);
    document.querySelector('#firstButton').addEventListener('click', firstImage);
    document.querySelector('#nextButton').addEventListener('click', nextImage);
    
    // Alpha Vantage API'den veri çekme
    const apiKey = 'QKICCCH6YOSZLGP2'; // Sizin API anahtarınız
    const api = new AlphaVantageAPI(apiKey);
    const dataContainer = document.getElementById('data-container');
    
    const symbol = 'IBM'; // İstediğiniz sembolü buraya ekleyin
    api.fetchData(symbol).then(data => {
        if (data) {
            const timeSeries = data['Time Series (Daily)'];
            if (timeSeries) {
                for (let date in timeSeries) {
                    const dailyData = timeSeries[date];
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h3>${date}</h3>
                        <p>Açılış: ${dailyData['1. open']}</p>
                        <p>Kapanış: ${dailyData['4. close']}</p>
                        <p>En Yüksek: ${dailyData['2. high']}</p>
                        <p>En Düşük: ${dailyData['3. low']}</p>
                    `;
                    dataContainer.appendChild(div);
                }
            } else {
                dataContainer.innerHTML = '<p>Veri bulunamadı.</p>';
            }
        } else {
            dataContainer.innerHTML = '<p>Veri çekme hatası.</p>';
        }
    });
});

// Alpha Vantage API Sınıfı
class AlphaVantageAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.alphavantage.co/query';
    }

    async fetchData(symbol) {
        const url = `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}
