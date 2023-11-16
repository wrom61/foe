const wplatyGraczy = document.getElementById('typeNumber1');
const limitPoziomu = document.getElementById('typeNumber2');
const innyGracz = document.getElementById('typeNumber3');
const nagroda = document.getElementById('typeNumber4');
const zyskStrata = document.getElementById('zysk-strata');
const zyskStrataLabel = document.getElementById('zysk-strata-label');
const wynik = document.getElementById('wynik');
const wynikLabel = document.getElementById('wynik-label');
const arkaButton = document.getElementById('arkaButton');
const clearButton = document.getElementById('clear');
const comment = document.getElementById('comment');
let blad = false;

let poziomArki = localStorage.getItem('arka');
let tt = "";
if (poziomArki === null) {
  poziomArki = 0;
  tt = 0;
  localStorage.setItem('arka', 0);
} else {
  poziomArki = poziomArki.replace(/,/g, '.');
  tt = poziomArki.replace(/\./g, ',');
}

let btext = "";
let bwynik = "";

arkaButton.childNodes[0].textContent = "PREMIA ARKI: " + tt + "%"
wplatyGraczy.focus();

wplatyGraczy.addEventListener("blur", proba);
limitPoziomu.addEventListener("blur", proba);
innyGracz.addEventListener("blur", proba);
nagroda.addEventListener("blur", proba);
wplatyGraczy.addEventListener("change", proba);
limitPoziomu.addEventListener("change", proba);
innyGracz.addEventListener("change", proba);
nagroda.addEventListener("change", proba);

function proba() {
  nagroda.disabled = false;  
  
  let a = parseInt(wplatyGraczy.value)
  let b = parseInt(limitPoziomu.value)
  let c = parseInt(innyGracz.value)
  let d = parseInt(nagroda.value)
  
  infoNumber();

  if((a+Math.floor((b-a)/2+c/2))>=b) {
    
    btext = 'NIEMOŻLIWE'
    bwynik = b-(a+Math.floor((b-a)/2+c/2))
        
    wynik.textContent = btext;
    zyskStrata.textContent = bwynik;
    
    zyskStrata.style.display = 'none';
    zyskStrataLabel.style.display = 'none'
    wynik.style.display = 'block';
    wynikLabel.style.display = 'block';

    wynik.classList.remove('bg-success')
    wynik.classList.add('bg-danger')
    zyskStrata.classList.remove('text-white')
    zyskStrata.classList.add('text-danger')   
    
    nagroda.disabled = true;
    comments(a, b, c);
    return
  }
  
  let com = comments(a, b, c);
  if (com === true) return;

  if(a == 0 || isNaN(a) || b == 0 || isNaN(b) || d == 0 || isNaN(d)) {      
    zyskStrata.style.display = 'none';
    zyskStrataLabel.style.display = 'none';
    wynik.style.display = 'none';
    wynikLabel.style.display = 'none';
  } else {
    zyskStrata.style.display = 'block';
    zyskStrataLabel.style.display = 'block'
    wynik.style.display = 'block';
    wynikLabel.style.display = 'block';

    if (isNaN(c) === true) c = 0;
    const result = tos(a, b, c, d);
    
    if(result.slice(0, 3) != 'NIE') {
      wynik.classList.remove('bg-danger')
      wynik.classList.add('bg-success')
      zyskStrata.classList.remove('text-danger')
      zyskStrata.classList.add('text-white')
      zyskStrataLabel.textContent = "ZYSK"
    } else {
      wynik.classList.remove('bg-success')
      wynik.classList.add('bg-danger')
      zyskStrata.classList.remove('text-white')
      zyskStrata.classList.add('text-danger')
      zyskStrataLabel.textContent = "STRATA"
    }
  }  
}

function tos(a, b, c, d) {
  let pArki = poziomArki/100+1
  
  if((a+Math.floor((b-a)/2+c/2))>=b) {
    btext = 'NIEMOŻLIWE'
    bwynik = b-(a+Math.ceil((b-a)/2+c/2))
  } else if (Math.round(d*(pArki))-Math.ceil((b-a)/2+c/2)<=0) {
    btext = 'NIEOPŁACALNE';
    bwynik = '( ' + (Math.round(d*pArki) - Math.ceil((b-a)/2+c/2) - Math.round(d*pArki)) + ' / ' + 
    (Math.round(d*pArki) - Math.ceil((b-a)/2+c/2)) + ' )'
  } else {
    btext = 'WRZUĆ: ' + Math.ceil((b-a)/2+c/2);
    bwynik = Math.round(d*pArki)-Math.ceil((b-a)/2+c/2)
  }   
  wynik.textContent = btext;
  zyskStrata.textContent = bwynik;
  return btext;
}

arkaButton.addEventListener('click', () => {
poziomArki = localStorage.getItem('arka');
tt = poziomArki.replace(/\./g, ',')
let arkaLevel = prompt("Podaj premię Arki (np. 90 czy 93,1), nie dodając symbolu %!", tt)
let arkaLevel1 = tt

if(arkaLevel != null) {
  arkaLevel = arkaLevel.replace(/,/g, '.')
  if (arkaLevel.includes("-")) {
    alert("Nie można wprowadzić ujemnej wartości premii  arki!")
    return
  } else if (arkaLevel.includes("%")) {
    arkaLevel = arkaLevel.replace('%', '');
  } else if (arkaLevel > 110) {
    alert(`Arka nie może mieć premii ${arkaLevel}!`)
    return
  } else if (isNaN(arkaLevel)) {
    alert(`"${arkaLevel}" nie jest prawidłową wartością premii arki!`)
    return
  }
  
  tt = arkaLevel.replace(/\./g, ',')
  localStorage.setItem('arka', arkaLevel);
  poziomArki = arkaLevel;
  
  arkaButton.childNodes[0].textContent = "PREMIA ARKI: " + tt + "%"
    
  if(arkaLevel1 != tt) proba();
  } else {
  arkaButton.childNodes[0].textContent = "PREMIA ARKI: " + arkaLevel1 + "%"
  }
})

clearButton.addEventListener('click', () => {
  wplatyGraczy.value = '';
  limitPoziomu.value = '';
  innyGracz.value = '';
  nagroda.value = '';
  proba();
  wplatyGraczy.focus();
})

function comments(a, b, c) {  
  if(a > b) {    
    comment.textContent = "Łączne wpłaty graczy nie mogą być większe niż limit poziomu perły!"
    bladFunction()
  } else if ( c > a) {   
    comment.textContent = "Łączne wpłaty graczy nie mogą być mniejsze niż wpłata jednego gracza!"
    bladFunction()
  } else if (c > b) {   
    comment.textContent = "Limit poziomu perły nie może być mniejszy niż wpłata jednego gracza!"
    bladFunction()
  } else {
    comment.textContent = ""
    blad = false;
  }
  return blad;
}

function bladFunction() {
  wynik.textContent = "BŁĘDNE DANE!"
  blad = true;
  wynik.style.display = 'block';
  wynik.style.display = 'block'
  zyskStrata.style.display = 'none';
  zyskStrataLabel.style.display = 'none'
  wynik.classList.remove('bg-success')
  wynik.classList.add('bg-danger')
  zyskStrata.classList.remove('text-white')
  zyskStrata.classList.add('text-danger')
}

function infoNumber() {
  if (wplatyGraczy.value.includes('.') || wplatyGraczy.value.includes(',')) {
    wplatyGraczy.value = parseInt(wplatyGraczy.value);
    alert(`Wpłaty graczy nie mogą zawierać miejsc po przecinku!
Miejsca po przecinku zostaną obcięte!`)
  } else if (limitPoziomu.value.includes('.') || limitPoziomu.value.includes(',')) {
    limitPoziomu.value = parseInt(limitPoziomu.value);
    alert(`Limit poziomu perły nie może zawierać miejsc po przecinku!
Miejsca po przecinku zostaną obcięte!`)
} else if (innyGracz.value.includes('.') || innyGracz.value.includes(',')) {
  innyGracz.value = parseInt(innyGracz.value);
  alert(`Wpłaty innego gracza nie mogą zawierać miejsc po przecinku!
Miejsca po przecinku zostaną obcięte!`)
} else if (nagroda.value.includes('.') || nagroda.value.includes(',')) {
  nagroda.value = parseInt(nagroda.value);
  alert(`Nagroda perły nie może zawierać miejsc po przecinku!
Miejsca po przecinku zostaną obcięte!`)
}}
