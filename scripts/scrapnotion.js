function scrapnow() {

  let ecosystem = [];  // Array to hold the scraped objects

  // Select the table and its rows
  let ele = document.querySelector(".notion-table-view .notion-selectable");
  let rows = ele.getElementsByClassName('notion-table-view-row');

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let cells = row.querySelectorAll(".notion-table-view-cell");


    // Check if the first cell contains "REMOVE" and skip if true

    if (cells[0]?.innerText.includes("REMOVE")) {
      continue;  // Skip this row
    }
    // Extract text content based on tag
    let data = {
      name: cells[1]?.innerText || "",
      website: cells[2]?.querySelector("a") ? cells[2].querySelector("a").textContent.trim() : cells[2]?.innerText || "",
      link: cells[3]?.querySelector("a") ? cells[3].querySelector("a").getAttribute("href") : "",
      description: cells[4]?.innerText || "",
      type: cells[5]?.innerText || "",
    };

    // Filter out any incomplete data rows if needed
    if (data.name) {
      ecosystem.push(data);
    }
  };

  return ecosystem;
}

scrapnow();


// scrap from the coingecko for all the available exchanges for boba.

function scapExchanges() {
  console.log("Started Exchange scraping!");

  let scrapedData = []; // Array to hold the scraped objects

  // Select all rows in the table
  const rows = $0.querySelectorAll('tr.hover\\:tw-bg-gray-50');

  rows.forEach(row => {
    // Select the cells within the row
    const cells = row.querySelectorAll("td");

    // Extract the name from the second cell
    const name = cells[1]?.querySelector("a div")?.innerText.trim() || "";

    // Extract the link and pair name from the fourth cell
    const linkElement = cells[3]?.querySelector("a");
    const link = linkElement?.getAttribute("href") || "";
    const pairName = linkElement?.innerText.trim() || "";

    // Check if both name and link exist before adding to the data
    if (name && link && pairName) {
      scrapedData.push({name,link,pairName});
    }
  });

  console.log("Scraped Data:",scrapedData);
  return scrapedData;
}

scapExchanges();
