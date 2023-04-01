const socketUrl = "wss://stream.binance.com:9443/ws/!ticker@arr";
const tableBody = document.getElementById("table-body");
const createRow = (symbol, price) => {
  const row = document.createElement("tr");
  const symbolCell = document.createElement("td");
  const priceCell = document.createElement("td");
  symbolCell.innerText = symbol.slice(0, -3);
  priceCell.innerText = formatMoney(price);
  row.appendChild(symbolCell);
  row.appendChild(priceCell);
  tableBody.appendChild(row);
  return { row, priceCell };
};

const updateRow = (priceCell, newPrice) => {
  if (newPrice > priceCell.innerText) {
    priceCell.style.color = "#2ecc71";
  } else if (newPrice < priceCell.innerText) {
    priceCell.style.color = "#e74c3c";
  } else {
    priceCell.style.color = "#ffffff";
  }
  priceCell.innerText = formatMoney(newPrice);
};

const handleTicker = (ticker) => {
  const { s: symbol, c: price } = ticker;
  if (symbol.endsWith("TRY")) {
    
    const cellId = symbol.toLowerCase();
    const row = document.getElementById(cellId);
    if (row) {
      updateRow(row.priceCell, price);
    } else {
      const { row, priceCell } = createRow(symbol, price);
      row.id = cellId;
      row.priceCell = priceCell;
    }
  }
};
let a=1;
const socket = new WebSocket(socketUrl);
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (a==1) {
  tableBody.innerHTML="";
    a=0;
  }

  data.forEach(handleTicker);
};



function formatMoney(amount) {
  const options = { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 10 
  };
  const numString = amount.toString();
  const decimalIndex = numString.indexOf('.');
  let mantissaDigits = options.maximumFractionDigits;
  
  if (decimalIndex !== -1) {
    const wholeDigits = decimalIndex;
    mantissaDigits = numString.length - 1 - wholeDigits;
  }
  
  options.minimumFractionDigits = Math.min(2, mantissaDigits);
  options.maximumFractionDigits = mantissaDigits;
  
  return parseFloat(amount).toLocaleString('en-US', options).replace("$", '');
}

const nameHeader = document.querySelector("#crypto-table th:first-child");
nameHeader.addEventListener("click", () => {
  sortTable(0);
});

function sortTable(columnName) {
  const table = document.getElementById("crypto-table");
  const rows = Array.from(table.getElementsByTagName("tr")).slice(1); // Tablonun ilk satırını başlık olarak kabul ediyoruz.

  const data = rows.map((row) => {
    const columns = Array.from(row.getElementsByTagName("td"));
    const rowData = {};
    columns.forEach((column, index) => {
      rowData[index] = column.innerText;
    });
    return rowData;
  });

  data.sort((a, b) => {
    if (a[columnName] < b[columnName]) {
      return -1;
    }
    if (a[columnName] > b[columnName]) {
      return 1;
    }
    return 0;
  });

  rows.forEach((row, index) => {
    const columns = Array.from(row.getElementsByTagName("td"));
    columns.forEach((column, columnIndex) => {
      column.innerText = data[index][columnIndex];
    });
  });
}


const searchInput = document.getElementById('search-input');
const table = document.getElementById('crypto-table');
const rows = table.getElementsByTagName('tr');

searchInput.addEventListener('keyup', () => {
  const filter = searchInput.value.toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    let shouldHide = true;

    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent.toLowerCase();

      if (cellText.indexOf(filter) > -1) {
        shouldHide = false;
        break;
      }
    }

    rows[i].style.display = shouldHide ? 'none' : '';
  }
});
