let updating = true;
let d = false;
let next = false;

function update_db(data, status, divId) {
  let node = document.getElementById(divId);
  let str = '';
  str += '<ul>';

  if (divId == 'todo')
  {
    if (next)
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text_db" name="next_text" onclick="nextProcedure_db()">Next</button>'

    }
    else 
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text_db" name="next_text" onclick="nextProcedure_db()">Done</button>'

    }
    if (d)
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text_db" name="del_text" onclick="delText_db()">Del</button>'

    }
    else
    {
     str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text_db" name="del_text" onclick="delText_db()">Done</button>'

    }

  }
  else if (divId == 'inprogress')
  {
    if (next)
    {
       str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text_db" name="next_text" onclick="nextProcedure_db()">Next</button>'

    }
    else
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text_db" name="next_text" onclick="nextProcedure_db()">Done</button>'

    }
  }
  else if (divId == 'done')
  {
    if (d)
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text_db" name="del_text" onclick="delText_db()">Del</button>'

    }
    else
    {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text_db" name="del_text" onclick="delText_db()">Done</button>'

    }
  }

  // Object.values(data).forEach(val => console.log(val));
  for (let i=0; i<data.length; i++) {
    let stat = data[i].status
    let id_db = data[i]._id

    let js = JSON.stringify(id_db)
    // console.log(js)

    if (stat != undefined && stat != status)
      continue

    str += '<li>' + data[i].msg + '&nbsp;&nbsp;';
    str += '<br>' + data[i].time + '&nbsp;&nbsp;'

    // append buttons

    if (d == true)
    {
      str += '&nbsp;<button id="del" type="button" onclick=del_i_db('+js+')>-</button>'

    }
    if (next == true)
    {
      str += '&nbsp;<button id="next" type="button" onclick=nextProcedure_i_db('+js+')>-></button>'
    }

   }

  str += '</ul>';
  node.innerHTML = str;
}

// generate all lists directly from db
function generate() {
  fetch('/data')
    .then((response) => response.json())
    .then((data) => {
      update_db(data, 0, 'todo');
      update_db(data, 1, 'inprogress');
      update_db(data, 2, 'done');

    })
};

generate();

// input to add todo
function addTodo() {
  let inp = document.getElementById('c-inp').value;
  let id = 1;

  if (inp.length > 0)
  {
    let ls =
    {
      inp: inp,
      time: new Date(),
      id: id++,
      status: 0,
    }

    list.push(ls);
    localStorage.setItem('list', JSON.stringify(list));
    console.log('Full list' + list)

    fetch('/add'+inp)
      .then((inp) => {
        console.log('Sent '+inp);
      });
    document.getElementById('c-inp').value = " ";
    updating = true;
  }

}

document.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    addTodo();
  }
}, false);


function delText_db() {
    d = !d;
    let d_text = document.getElementById('del_text_db');
    if (d)
    {
      d_text.innerHTML = "Done"
    }
    else
    {
      d_text.innerHTML = "Del"
    }
    updating = true;

}


function del_i_db(data) {
    console.log('To be deleted '+ data)
    fetch('/del'+data)
    .then((data) => {
       console.log('DB Deleted '+data);
    });

    updating = true;

}


function nextProcedure_db() {
    next = !next;
    let n_text = document.getElementById('next_text_db');
    if (next)
    {
      n_text.innerHTML = "Done"
    }
    else
    {
      n_text.innerHTML = "Next"
    }

    updating = true;
}


function nextProcedure_i_db(data) {
  console.log('To be updated '+ data)
    fetch('/next'+data)
    .then((data) => {
      console.log('DB NextProcedure '+data);
    });


    updating = true;

}

function frame() {
  if (updating == true)
  {
    generate();
    updating = false;

  }
}

setInterval(function(){
  frame()
}, 50);








// end
