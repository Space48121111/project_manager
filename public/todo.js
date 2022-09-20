let updating = true;
let d = false;
let next = false;
let list = [];

function update(data, status, divId) {
  let node = document.getElementById(divId);
  let str = '';
  str += '<ul>';

	/*
  // stringify for db: buttons need to be created in js file
  if (divId == 'todo')
  {
	  if (next)
	  {
		 str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text" name="next_text" onclick="nextProcedure()">Done</button>'
	  }
	  else
	  {
		 str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text" name="next_text" onclick="nextProcedure()">Next</button>'
	  }

		if (d)
		{
			str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text" name="del_text" onclick="delText()">Done</button>'
		}
		else
		{
			str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text" name="del_text" onclick="delText()">Del</button>'
		}
  }
  else if (divId == 'inprogress')
  {
    str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="next" type="button" id="next_text" name="next_text" onclick="nextProcedure()">Next</button>'
  }
  else if (divId == 'done')
  {
    str += '&nbsp;&nbsp;&nbsp;&nbsp;<button class="del" type="button" id="del_text_db" name="del_text" onclick="delText()">Del</button>'
  }
  */

  // Object.values(data).forEach(val => console.log(val));
  for (let i=0; i<data.length; i++)
  {
    let stat = data[i].status
    let inp = data[i].inp
    //console.log('data inp'+inp)
    //console.log('data stat'+stat)


    if (stat != undefined && stat != status)
      continue

    str += '<li>' + data[i].inp + '&nbsp;&nbsp;';
    str += '<br>' + data[i].time + '&nbsp;&nbsp;';

    // append buttons
    if (d == true)
    {
      str += '&nbsp;<button id="del" type="button" onclick=del_i('+i+')>-</button>'
    }
    if (next == true)
    {
      str += '&nbsp;<button id="next" type="button" onclick=nextProcedure_i('+i+')>-></button>'
    }

   }

  str += '</ul>';
  node.innerHTML = str;
}

function load() {
  let storage = localStorage.getItem('list');
  //console.log(' Full storage '+storage);

  if (storage != null)
  {
    list = JSON.parse(storage);

    update(list, 0, 'todo');
    update(list, 1, 'inprogress');
    update(list, 2, 'done');
  }


}

load();


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
      status: 0,
    }

    list.push(ls);
    localStorage.setItem('list', JSON.stringify(list));
    console.log('Inserted to local'+inp)

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

function updateButtons()
{
	let d_text = document.getElementById('del_text');
	if (d)
    {
      d_text.innerHTML = "Done"
    }
    else
    {
      d_text.innerHTML = "Del"
    }

	let n_text = document.getElementById('next_text');
	if (next)
    {
      n_text.innerHTML = "Done"
    }
    else
    {
      n_text.innerHTML = "Next"
    }
}

function delText() {
    d = !d;
	next = false;
    updateButtons();
    updating = true;

}

function del_i(i) {
  list.splice(i, 1)
  console.log('Deleted from local' +i)
  localStorage.setItem('list', JSON.stringify(list));
  updating = true;
}



function nextProcedure() {
    next = !next;
	d = false;
    updateButtons();
    updating = true;
}


function nextProcedure_i(i) {
  list[i].status++;
  console.log('Updated to local of '+i + '/' + list.length)
  localStorage.setItem('list', JSON.stringify(list));

  updating = true;
}


function frame() {
  if (updating == true)
  {
    load();
    updating = false;

  }
}

setInterval(function(){
  frame()
}, 50);








// end
