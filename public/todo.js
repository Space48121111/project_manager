function helper(data, status, divId) {
  var node = document.getElementById(divId);
  let format = '';
  format += '<ul>';
  for (var i=0; i<data.length; i++) {
    if (data[i].status != status && data[i].status != undefined)
      continue;
    format += '<li>' + data[i].msg + '&nbsp;&nbsp;';
    if (status != 2)
    {
    format += '<button type="button" onclick=nextProcedure('+JSON.stringify(data[i]._id)+')>==>></button>';
    }
    format += '<br>' + data[i].time + '&nbsp;&nbsp;'
    + '<button type="button" onclick=del('+JSON.stringify(data[i]._id)+')>Del</button>';
    format += '</li>';
  }
  format += '</ul>';
  node.innerHTML = format;
}


let shouldUpdate = true;

// generate all lists
function generate() {
  fetch('/data')
    .then((response) => response.json())
    .then((data) => {
      helper(data, 0, 'todo');
      helper(data, 1, 'inprogress');
      helper(data, 2, 'done');

    })
};

generate();


// input to add todo
function addTodo() {
  var inp = document.getElementById('c-inp').value;
  if (inp.length > 0)
  {
    fetch('/add'+inp)
      // .then((data) => {
      //   console.log('Sent'+data);
      // });
    document.getElementById('c-inp').value = " ";
    shouldUpdate = true;
  }
}

function del(str) {
  fetch('/del'+str)
    // .then((data) => {
    //   console.log('Deleted '+data);
    // });
    shouldUpdate = true;

}

function nextProcedure(str) {
  fetch('/next'+str)
    // .then((data) => {
    //   console.log('NextProcedure '+data);
    // });
    shouldUpdate = true;

}

function frame() {
  if (shouldUpdate == true)
  {
    generate();
    shouldUpdate = false;
  }
}

setInterval(function(){
  frame()
}, 50);








// end
