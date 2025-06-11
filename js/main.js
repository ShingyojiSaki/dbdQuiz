
const intoroConfigs = {
    "Easy": {
      id: 1,
      point: 10,
    },
    "Normal": {
      id: 21,
      point: 20,
    },
    "Hard": {
      id: 31,
      point: 40,
    },
    "BerryHard": {
      id: 41,
      point: 50,
    },
};
const quizConfigs = {
    "Normal": {
      id: 51,
      point: 10,
    },
    "Hard": {
      id: 61,
      point: 50,
    },
};
const containsConfigs = {
    "Normal": {
      id: 71,
      point: 10,
    },
};

window.onload = function(){

    createElem();

    const btn = document.querySelector('#btn1');
    btn.addEventListener('click', function() {
        const blob = new Blob(['こんにちは'], { "type" : "text/plain" });

        btn.href = window.URL.createObjectURL(blob);   
    })  
};

function createElem(){
    createTable('#introData',intoroConfigs,7);
    createTable('#quizData',quizConfigs,7);
    createTable('#containsData',containsConfigs,3);

}

/**
 * テーブルデータを作成
 */
function createTable(parentId,config,roop){
    const parentDivElem = document.querySelector(parentId);
    const tableElem = document.createElement('table');
    tableElem.setAttribute('border','1');
    const thElem = document.createElement('tr');
    thElem.innerHTML = `
                <td></td>
                <th>名前A</th>
                <th>名前B</th>
                <th>名前C</th>
                <th>名前D</th>
                <th>名前E</th>
                <th>名前F</th>
          `;
    tableElem.appendChild(thElem);

    for (const key in config) {
        const trElem = document.createElement('tr');

        let nameTd = `
                    <th>${key}</th>
              `;

        let id = config[key].id;
        for(let i=1;i<roop;i++){
            nameTd += `
                    <td>
                        <div class="p-qty js-qty">
                            <div class="__arrow __up js-qty_up"></div>
                            <div class="__arrow __down js-qty_down"></div>
                            <input id="${id}" type="number" class="p-qty__input js-qty_target" value="0">
                        </div>
                        <span id="point${id}" point="${config[key].point}">0pt</span>
                    </td>
            `;
            id++;
        }
        trElem.innerHTML = nameTd;
        tableElem.appendChild(trElem);
    }
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
      pointElem.textContent = `${input[i].value * point}pt`;
    }
  }
 
},false);