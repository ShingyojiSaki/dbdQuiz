
const intoroConfigs = {
    'Easy': {
      id: 1,
      point: 10,
    },
    'Normal': {
      id: 21,
      point: 20,
    },
    'Hard': {
      id: 31,
      point: 40,
    },
    'BerryHard': {
      id: 41,
      point: 50,
    },
};
const quizConfigs = {
    'Normal': {
      id: 51,
      point: 10,
    },
    'Hard': {
      id: 61,
      point: 50,
    },
};
const containsConfigs = {
    'Normal': {
      id: 71,
      point: 10,
    },
};
const totalConfigs = {
    'Total': {
      id: 81,
      point: 0,
    },
};
const memberConfigs = {
    kuromo: 'くろも',
    death: 'DEATH',
    runaway: 'runaway',
    sato: 'さとう',
    halps: 'ハルピス',
    yuria: 'ゆりあ',
};
const teamConfigs = {
    teamA: 'TeamA',
    teamB: 'TeamB',
};

window.onload = function(){

    createElem();

    // const btn = document.querySelector('#btn1');
    // btn.addEventListener('click', function() {
    //     const blob = new Blob(['こんにちは'], { 'type' : 'text/plain' });

    //     btn.href = window.URL.createObjectURL(blob);   
    // })  
};

function createElem(){
    createTable('#introData',memberConfigs,intoroConfigs,6);
    createTable('#quizData',memberConfigs,quizConfigs,6);
    createTable('#containsData',teamConfigs,containsConfigs,2);
    createTable('#totalData',memberConfigs,totalConfigs,6);

}

/**
 * テーブルデータを作成
 */
function createTable(parentId,thConfig,config,roop){
    const parentDivElem = document.querySelector(parentId);

    //table要素作成
    const tableElem = document.createElement('table');
    tableElem.setAttribute('border','1');
    const thElem = document.createElement('tr');
    let th = `
                <td></td>
          `;
    const keys = Object.keys(thConfig)
    // keys.forEach((key) =>
    let index = 1; 
    for(const key of keys){
      if(index % 2 == 1){
        //奇数=teamA
        th += `<th style='background-color: aliceblue;'>${thConfig[key]}</th>`;
      }else {
        //遇数=teamB
        th += `<th style='background-color: linen;'>${thConfig[key]}</th>`;
      }
      index++;
    }
    thElem.innerHTML = th;
    tableElem.appendChild(thElem);

    if(parentId !== '#totalData'){
      for (const key in config) {
          const trElem = document.createElement('tr');

          let td = `
                      <th>${key}</th>
                `;

          let id = config[key].id;
          for(let i=1;i<=roop;i++){
              td += `
                      <td>
                          <div class='p-qty js-qty'>
                              <div class='__arrow __up js-qty_up'></div>
                              <div class='__arrow __down js-qty_down'></div>
                              <input id='${id}' type='number' class='p-qty__input js-qty_target' parentid='${parentId}' value='0'>
                          </div>
                          <span id='point${id}' class='point${i}' point='${config[key].point}'>0</span>pt
                      </td>
              `;
              id++;
          }
          trElem.innerHTML = td;
          tableElem.appendChild(trElem);
      }
    }

    const trElem = document.createElement('tr');
    
    let td = `
                <th>合計</th>
          `;
    
    for(let i=1;i<=roop;i++){
      if(parentId !== '#totalData') {
        td += `
                <td>
                  <div class='total'><span id='totalpoint${i}' parentid='${parentId}'>0</span>pt</div>
                </td>
              `;
      } else {
        td += `
                <td>
                  <div class='total'><span id='alltotalpoint${i}'>0</span>pt</div>
                </td>
              `;
      }
    }
    trElem.innerHTML = td;
    tableElem.appendChild(trElem);

    parentDivElem.appendChild(tableElem);
}

//vanilla jsで親要素探索する用の関数
function getParents(el, parentSelector /* optional */) {
    if (parentSelector === undefined) {
        return false;
    }
 
    var p = el.parentNode;
     
    while (!p.classList.contains(parentSelector)) {
        var o = p;
        p = o.parentNode;
    }
    return p;
}
 
document.addEventListener('click',function(e){
  e = e || window.event;
  var target = e.target || e.srcElement,
      text = target.textContent || target.innerText;
 
  var val = 0;
 
  //クリックしたDOMが.js-qty_upだったら
  if(target.classList.contains('js-qty_up')){
    val = 1;
  } else if(target.classList.contains('js-qty_down')) {
    val = -1;
  } else {
    return false;
  }
  var parent = getParents(target,'js-qty');//親の.js-qtyを取得して
  var input = parent.querySelectorAll('.js-qty_target');//親の.js-qtyの子の.js-qty_targetを取得して
  //Nodelistを回す
  for (let i = 0; i < input.length; i++) {
    if(input[i].classList.contains('js-qty_target')){
      //.js-qty_target持ってるDOMに対して
      var num = parseInt(input[i].value);
      num = isNaN(num) ? 1 : num;
      input[i].value = num + val < 0 ? 0 : num + val;

      //ポイント小計を更新
      const pointElem = document.querySelector(`#point${input[i].id}`);
      const point = pointElem.getAttribute('point');
      pointElem.textContent = `${input[i].value * point}`;

      //ポイント合計を更新
      const parentElem = document.querySelector(`${input[i].getAttribute('parentid')}`);
      const totalElem = parentElem.querySelector(`#total${pointElem.getAttribute('class')}`);
      const pointElems = parentElem.querySelectorAll(`.${pointElem.getAttribute('class')}`);

      let total = 0;
      for (const ele of pointElems) {
        total += parseInt(ele.textContent);
      }
      totalElem.textContent = total;

      //全体集計を更新
      const allTotalTableElem = document.querySelector(`#totalData`);
      const containsDataElem = document.querySelector(`#containsData`);
      for(let index = 1; index <=6; index++){
        //各テーブルの小計を取得
        const tableTotalElems = document.querySelectorAll(`#totalpoint${index}`);
        let allTotal = 0;
        for (const ele of tableTotalElems) {
          //チーム戦以外の合計値を取得
          if(ele.getAttribute('parentid') !== '#containsData') allTotal += parseInt(ele.textContent);
        }
        const memberTotal = allTotalTableElem.querySelector(`#alltotalpoint${index}`);
        //チーム戦分のポイントを足しこむ
        if(index % 2 == 1){
          //奇数=teamA
          const team = containsDataElem.querySelector('#totalpoint1');
            allTotal += parseInt(team.textContent);
        }else{
          //遇数=teamB
          const team = containsDataElem.querySelector('#totalpoint2');
          allTotal += parseInt(team.textContent);
        }
        memberTotal.textContent = allTotal;
      }
    }
  }
 
},false);