console.log(`scrap notion!`);


function scrapnow() {
  console.log(`started scrapping!!`);

  let ele = document.querySelector(".notion-table-view .notion-selectable");
  let rows = ele.getElementsByClassName('notion-table-view-row');

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    console.log('row',row)
    let data = []
    row.querySelectorAll(".notion-table-view-cell span, .notion-table-view-cell a")
      .forEach((c) => {
        if (c.include("REMOVE") > -1) {
          continue;
        }
        data.push(c.innerText);
      })
    data.filter(c => c !== '/')
  };

}

scrapnow()